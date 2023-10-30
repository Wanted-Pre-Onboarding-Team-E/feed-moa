import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { AuthController } from '../../../src/feature/auth/auth.controller';
import { AuthService } from '../../../src/feature/auth/auth.service';
import { CreateUserDto } from '../../../src/feature/auth/dto/createUser.dto';
import { LoginDto } from '../../../src/feature/auth/dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    verifyUser: jest.fn(),
    checkUserExists: jest.fn(),
    checkPasswordValidate: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: AuthService,
          useValue: mockAuthService, // 모킹된 서비스 사용
        },
        {
          provide: JwtService,
          useValue: mockJwtService, // 모킹된 서비스 사용
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  test('signUser()', async () => {
    const testSignUpRequestDto: CreateUserDto = {
      email: 'creator98@naver.com',
      username: 'test0123',
      password: 'helloWorld123@',
      confirmPassword: 'helloWorld123@',
    };

    const checkUserExistsSpy = jest
      .spyOn(mockAuthService, 'checkUserExists')
      .mockResolvedValue(null);

    const checkPasswordValidateSpy = jest
      .spyOn(mockAuthService, 'checkPasswordValidate')
      .mockResolvedValue(testSignUpRequestDto.password);

    const createUserSpy = jest
      .spyOn(mockAuthService, 'createUser')
      .mockResolvedValue(testSignUpRequestDto);

    await authController.signUpUser(testSignUpRequestDto);

    expect(checkUserExistsSpy).toHaveBeenCalledTimes(1);
    expect(checkPasswordValidateSpy).toHaveBeenCalledTimes(1);
    expect(createUserSpy).toHaveBeenCalledWith(testSignUpRequestDto);
  });

  test('사용자 정보가 일치하면 User 객체를 반환한다.', async () => {
    // given
    const testLoginRequestDto: LoginDto = {
      username: 'test',
      password: '1234',
    };

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const mockUser = {
      id: 1,
      username: testLoginRequestDto.username,
      password: testLoginRequestDto.password,
      email: 'test@naver.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockJwtToken = 'this_is_jwt_token';

    const verifyUserSpy = jest
      .spyOn(mockAuthService, 'verifyUser')
      .mockResolvedValue(mockUser);

    const signAsyncSpy = jest
      .spyOn(mockJwtService, 'signAsync')
      .mockResolvedValue(mockJwtToken);

    // when
    const response = await authController.userLogin(
      testLoginRequestDto,
      mockResponse,
    );

    // then
    expect(verifyUserSpy).toHaveBeenCalledTimes(1);
    expect(signAsyncSpy).toHaveBeenCalledTimes(1);

    expect(response.cookie).toHaveBeenCalled();
    expect(response.json).toHaveBeenCalled();
  });
});
