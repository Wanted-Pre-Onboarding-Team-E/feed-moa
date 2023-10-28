import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from '../../../src/feature/user/repository/user.repository';
import { UserService } from '../../../src/feature/user/user.service';
import { CreateUserDto } from '../../../src/feature/user/dto/createUser.dto';
import { AuthCodeRepository } from '../../../src/auth/repository/authCode.repository';
import { ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let authCodeRepository: AuthCodeRepository;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneByUsername: jest.fn(),
  };

  const mockAuthCodeRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository, // 모킹된 레파지토리 사용
        },
        {
          provide: AuthCodeRepository,
          useValue: mockAuthCodeRepository,
        },
      ],
    }).compile();

    userService = module.get(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    authCodeRepository = module.get<AuthCodeRepository>(AuthCodeRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  test('createUser()', async () => {
    const createUserDto: CreateUserDto = {
      username: 'test01',
      email: 'creator98@naver.com',
      password: 'helloWorld123@',
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

    const authCodeResult = await authCodeRepository.save(mockAuthCode);

    const userResult = await userRepository.save(
      userRepository.create(createUserDto),
    );

    expect(saveAuthCodeSpy).toHaveBeenCalledTimes(1);
    expect(authCodeResult).toEqual(mockAuthCode);

    expect(saveUserSpy).toHaveBeenCalledTimes(1);
    expect(userResult).toEqual(createUserDto);
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
        expect(error).toBeInstanceOf(ConflictException);
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
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          '비밀번호는 3회 이상 연속되는 문자 사용은 불가능합니다.',
        );
      }
    });
  });
});
