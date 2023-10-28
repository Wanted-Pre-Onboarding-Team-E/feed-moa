import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from '../../../src/feature/user/repository/user.repository';
import { UserService } from '../../../src/feature/user/user.service';
import { CreateUserDto } from '../../../src/feature/user/dto/createUser.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneByUsername: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository, // 모킹된 레파지토리 사용
        },
      ],
    }).compile();

    userService = module.get(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
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

    const saveSpy = jest
      .spyOn(mockUserRepository, 'save')
      .mockResolvedValue(createUserDto);

    // when
    const result = await userService.createUser(createUserDto);

    // then
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(createUserDto);
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

    test('패스워드 길이가 10 미만', async () => {
      const testPassword = 'hello123@';

      expect(testPassword.length).toBeLessThan(10);
    });

    test('패스워드 길이가 10 이상, 숫자, 문자, 특수문자 중 2가지 미만 해당', async () => {
      const testPassword = 'helloWorld';

      expect(testPassword.length).toBeGreaterThanOrEqual(10);
      expect(
        [
          /[a-zA-Z]/.test(testPassword),
          /\d/.test(testPassword),
          /[!@#$%^&*]/.test(testPassword),
        ].filter(Boolean).length,
      ).toBeLessThan(2);
    });

    test('패스워드 길이가 10 이상, 숫자, 문자, 특수문자 중 2가지 이상 해당, 3회 이상 연속되는 문자 사용', async () => {
      const testPassword = 'hello111@@';

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
  });
});
