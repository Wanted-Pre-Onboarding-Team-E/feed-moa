import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '../../../src/feature/user/user.service';
import { UserController } from '../../../src/feature/user/user.controller';
import { CreateUserDto } from '../../../src/feature/user/dto/createUser.dto';
import { AuthCodeRepository } from '../../../src/auth/repository/authCode.repository';
import { UserRepository } from '../../../src/feature/user/repository/user.repository';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    checkUserExists: jest.fn(),
    checkPasswordValidate: jest.fn(),
    createUser: jest.fn(),
  };

  const mockUserRepository = {};

  const mockAuthCodeRepository = {};

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserController,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: AuthCodeRepository,
          useValue: mockAuthCodeRepository,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  test('signUser()', async () => {
    const testSignUpRequestDto: CreateUserDto = {
      email: 'creator98@naver.com',
      username: 'test0123',
      password: 'helloWorld123@',
    };

    const checkUserExistsSpy = jest
      .spyOn(mockUserService, 'checkUserExists')
      .mockResolvedValue(null);

    const checkPasswordValidateSpy = jest
      .spyOn(mockUserService, 'checkPasswordValidate')
      .mockResolvedValue(testSignUpRequestDto.password);

    const createUserSpy = jest
      .spyOn(mockUserService, 'createUser')
      .mockResolvedValue(testSignUpRequestDto);

    await userController.signUpUser(testSignUpRequestDto);

    expect(checkUserExistsSpy).toHaveBeenCalledTimes(1);
    expect(checkPasswordValidateSpy).toHaveBeenCalledTimes(1);
    expect(createUserSpy).toHaveBeenCalledWith(testSignUpRequestDto);
  });
});
