import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '../../../src/feature/user/user.service';
import { UserController } from '../../../src/feature/user/user.controller';
import { CreateUserDto } from '../../../src/feature/user/dto/createUser.dto';
import { AuthCodeRepository } from '../../../src/auth/repository/authCode.repository';
import { UserRepository } from '../../../src/feature/user/repository/user.repository';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '../../../src/auth/auth.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let authService: AuthService;

  const mockUserService = {
    checkPasswordValidate: jest.fn(),
    createUser: jest.fn(),
  };

  const mockAuthService = {
    createAuthCode: jest.fn(),
  };

  const mockUserRepository = {
    findOneByUsername: jest.fn(),
  };

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
          provide: AuthService,
          useValue: mockAuthService,
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
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('signUser() Success', () => {
    it('사용자 회원가입 API', async () => {
      const testSignUpRequestDto: CreateUserDto = {
        email: 'creator98@naver.com',
        username: 'test0123',
        password: 'helloWorld123@',
      };

      const checkUserExistsSpy = jest
        .spyOn(mockUserRepository, 'findOneByUsername')
        .mockResolvedValue(null);

      const checkPasswordValidateSpy = jest
        .spyOn(mockUserService, 'checkPasswordValidate')
        .mockResolvedValue(testSignUpRequestDto.password);

      const createUserSpy = jest
        .spyOn(mockUserService, 'createUser')
        .mockResolvedValue(testSignUpRequestDto);

      const createAuthCodeSpy = jest
        .spyOn(mockAuthService, 'createAuthCode')
        .mockResolvedValue(testSignUpRequestDto.email);

      await userController.signUpUser(testSignUpRequestDto);

      expect(checkUserExistsSpy).toHaveBeenCalledTimes(1);
      expect(checkPasswordValidateSpy).toHaveBeenCalledTimes(1);
      expect(createAuthCodeSpy).toHaveBeenCalledTimes(1);
      expect(createUserSpy).toHaveBeenCalledWith(testSignUpRequestDto);
    });

    it('signUser() throw BadRequestException if username already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'SecurePassword123',
      };

      mockUserRepository.findOneByUsername.mockResolvedValue(
        createUserDto.username,
      );

      try {
        await userController.signUpUser(createUserDto);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('testuser은 이미 존재하는 계정입니다.');
      }

      expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith(
        createUserDto.username,
      );
    });

    it('signUser() throw BadRequestException if password is invalid', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'invalid',
      };

      mockUserRepository.findOneByUsername.mockResolvedValue(null);
      mockUserService.checkPasswordValidate.mockResolvedValue(false);

      try {
        await userController.signUpUser(createUserDto);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('적절하지 않은 패스워드 입니다.');
      }

      expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith(
        createUserDto.username,
      );
      expect(mockUserService.checkPasswordValidate).toHaveBeenCalledWith(
        createUserDto.password,
      );
    });
  });
});
