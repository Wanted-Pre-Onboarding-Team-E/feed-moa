import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { LoginDto } from '../../../src/feature/auth/dto/login.dto';
import { AuthService } from '../../../src/feature/auth/auth.service';
import { User } from '../../../src/entity/user.entity';
import { CreateUserDto } from '../../../src/feature/auth/dto/createUser.dto';
import { AuthCode } from '../../../src/entity/authCode.entity';
import { DataSource } from 'typeorm';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockAuthCodeRepository = {
    save: jest.fn(),
  };

  const mockDataSource = {};

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(AuthCode),
          useValue: mockAuthCodeRepository,
        },
        {
          provide: DataSource, // DataSource의 프로바이더를 설정
          useValue: mockDataSource, // mockDataSource 변수를 사용
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  test('createUser()', async () => {
    const createUserDto: CreateUserDto = {
      username: 'test01',
      email: 'creator98@naver.com',
      password: 'helloWorld123@',
      confirmPassword: 'helloWorld123@',
    };
    const mockAuthCode = {
      username: 'creator98',
      code: '123456',
    };

    const saveAuthCodeSpy = jest
      .spyOn(mockAuthCodeRepository, 'save')
      .mockResolvedValue(mockAuthCode);
    const saveUserSpy = jest
      .spyOn(mockUserRepository, 'save')
      .mockResolvedValue(createUserDto);

    const authCodeResult = await mockAuthCodeRepository.save(mockAuthCode);

    const userResult = await mockUserRepository.save(
      mockUserRepository.create(createUserDto),
    );

    expect(saveAuthCodeSpy).toHaveBeenCalledTimes(1);
    expect(authCodeResult).toEqual(mockAuthCode);

    expect(saveUserSpy).toHaveBeenCalledTimes(1);
    expect(userResult).toEqual(createUserDto);
  });

  describe('checkUserExists()', () => {
    test('가입할 수 있는 계정', async () => {
      const username = 'existingUser';
      mockUserRepository.findOne.mockResolvedValue(null);

      expect(await authService.checkUserExists(username));
    });

    test('이미 존재하는 사용자', async () => {
      const username = 'existingUser';
      const existingUser = {
        username,
        email: 'existing@example.com',
        password: 'hashedPassword',
      };
      mockUserRepository.findOne.mockResolvedValue(existingUser);

      try {
        await authService.checkUserExists(username);
        fail('Expected ConflictException but got no exception');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          'existingUser은 이미 존재하는 사용자입니다.',
        );
      }
    });
  });

  describe('checkPasswordValidate()', () => {
    test('유효한 패스워드', async () => {
      const testPassword = 'helloWorld123@';

      expect(testPassword.length).toBeGreaterThanOrEqual(10);
      expect(
        [
          /[a-zA-Z]/.test(testPassword),
          /\d/.test(testPassword),
          /[!@#$%^&*]/.test(testPassword),
        ].filter(Boolean).length,
      ).toBeGreaterThanOrEqual(2);
      expect(!/(\w)\1\1/.test(testPassword));
    });

    test('숫자, 문자, 특수문자 중 2가지 미만 사용', async () => {
      const testPassword = 'helloWorld';

      try {
        const passwordTypeCountValid =
          [
            /[a-zA-Z]/.test(testPassword),
            /\d/.test(testPassword),
            /[!@#$%^&*]/.test(testPassword),
          ].filter(Boolean).length > 2;
        expect(passwordTypeCountValid).toBeFalsy();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          '비밀번호는 숫자, 문자, 특수문자 중 2가지 이상을 포함해야하 합니다.',
        );
      }
    });

    test('3회 이상 연속되는 문자 사용', async () => {
      const testPassword = 'hello111@@';

      try {
        const passwordTypeCountValid = !/(\w)\1\1/.test(testPassword);
        expect(passwordTypeCountValid).toBeFalsy();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          '비밀번호는 3회 이상 연속되는 문자 사용은 불가능합니다.',
        );
      }
    });

    test('비밀번호와 비밀번호 확인이 일치하지 않음', async () => {
      const password = 'myPassword@@';
      const confirmPassword = 'wrongPassword@@';

      try {
        await authService.checkPasswordValidate(password, confirmPassword);
        fail('Expected ConflictException but got no exception');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
        );
      }
    });
  });

  describe('verifyUser()', () => {
    let findOneBySpy;

    afterEach(() => {
      findOneBySpy.mockRestore();
    });

    test('사용자 정보가 일치하면 User 객체를 반환한다.', async () => {
      // given
      const testLoginDto = {
        username: 'test',
        password: '1234',
      } as LoginDto;

      const mockUser = {
        id: 1,
        username: testLoginDto.username,
        password: 'encrypted_password',
        email: 'test@naver.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      findOneBySpy = jest
        .spyOn(mockUserRepository, 'findOneBy')
        .mockResolvedValue(mockUser);

      authService.comparePassword = jest.fn().mockResolvedValue(true);

      // when
      const user = await authService.verifyUser(testLoginDto);

      // then
      expect(findOneBySpy).toHaveBeenCalledWith({
        username: testLoginDto.username,
      });
      expect(findOneBySpy).toHaveBeenCalledTimes(1);
      expect(user).toEqual(mockUser);
    });

    test('사용자 아이디가 존재하지 않으면 에러가 발생한다.', async () => {
      // given
      const testLoginDto = {
        username: 'id_does_not_exist',
        password: '1234',
      } as LoginDto;

      const mockUser = {
        id: 1,
        username: 'test',
        password: 'encrypted_password',
        email: 'test@naver.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      findOneBySpy = jest
        .spyOn(mockUserRepository, 'findOneBy')
        .mockResolvedValue(mockUser);

      authService.comparePassword = jest.fn().mockResolvedValue(true);

      try {
        // when
        await authService.verifyUser(testLoginDto);
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('존재하지 않는 아이디입니다.');
        expect(findOneBySpy).toHaveBeenCalledWith({
          username: testLoginDto.username,
        });
        expect(findOneBySpy).toHaveBeenCalledTimes(1);
      }
    });

    test('사용자 비밀번호가 일치하지 않으면 에러가 발생한다.', async () => {
      // given
      const testLoginDto = {
        username: 'test',
        password: 'wrong_password',
      } as LoginDto;

      const mockUser = {
        id: 1,
        username: testLoginDto.username,
        password: 'encrypted_password',
        email: 'test@naver.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      findOneBySpy = jest
        .spyOn(mockUserRepository, 'findOneBy')
        .mockResolvedValue(mockUser);

      authService.comparePassword = jest.fn().mockResolvedValue(false);

      try {
        // when
        await authService.verifyUser(testLoginDto);
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('비밀번호가 일치하지 않습니다.');
        expect(findOneBySpy).toHaveBeenCalledWith({
          username: testLoginDto.username,
        });
        expect(findOneBySpy).toHaveBeenCalledTimes(1);
      }
    });
  });
});
