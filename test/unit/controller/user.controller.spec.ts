import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../../../src/feature/user/user.service';
import { UserController } from '../../../src/feature/user/user.controller';
import { LoginRequestDto } from '../../../src/feature/user/dto/loginRequest.dto';

describe('UserController', () => {
  let userController: UserController;

  const mockUserService = {
    verifyUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserController,
        {
          provide: UserService,
          useValue: mockUserService, // 모킹된 서비스 사용
        },
        {
          provide: JwtService,
          useValue: mockJwtService, // 모킹된 서비스 사용
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  test('사용자 정보가 일치하면 User 객체를 반환한다.', async () => {
    // given
    const testLoginRequestDto: LoginRequestDto = {
      username: 'test',
      password: '1234',
    };

    const mockResponse = {
      cookie: jest.fn(),
      send: jest.fn(),
    };

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
    await userController.userLogin(testLoginRequestDto, mockResponse);

    // then
    expect(verifyUserSpy).toHaveBeenCalledTimes(1);
    expect(signAsyncSpy).toHaveBeenCalledTimes(1);
  });
});
