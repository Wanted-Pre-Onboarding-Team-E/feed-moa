import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '../../../src/feature/user/user.service';
import { CreateUserDto } from '../../../src/feature/user/dto/createUser.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthCode } from '../../../src/entity/authCode.entity';
import { User } from '../../../src/entity/user.entity';

describe('UserService', () => {
  let userService: UserService;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockAuthCodeRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(AuthCode),
          useValue: mockAuthCodeRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
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

      expect(await userService.checkUserExists(username));
    });

    test('이미 존재하는 계정', async () => {
      const username = 'existingUser';
      const existingUser = {
        username,
        email: 'existing@example.com',
        password: 'hashedPassword',
      };
      mockUserRepository.findOne.mockResolvedValue(existingUser);

      try {
        await userService.checkUserExists(username);
        fail('Expected ConflictException but got no exception');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('existingUser은 이미 존재하는 계정입니다.');
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
        await userService.checkPasswordValidate(password, confirmPassword);
        fail('Expected ConflictException but got no exception');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
        );
      }
    });
  });
});
