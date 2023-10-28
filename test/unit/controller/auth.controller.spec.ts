import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { UserLib } from '../../../src/feature/user/user.lib';
import { LoginDto } from '../../../src/auth/dto/login.dto';
import { AuthController } from '../../../src/auth/auth.controller';

describe('AuthController', () => {
  let authController: AuthController;

  const mockUserService = {
    verifyUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: UserLib,
          useValue: mockUserService, // 모킹된 서비스 사용
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
      .spyOn(mockUserService, 'verifyUser')
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
