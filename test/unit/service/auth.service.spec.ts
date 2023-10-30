import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { LoginDto } from '../../../src/auth/dto/login.dto';
import { AuthService } from '../../../src/auth/auth.service';
import { User } from '../../../src/entity/user.entity';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository, // 모킹된 레파지토리 사용
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('verifyUser()', () => {
    let findOneBySpy;

    afterEach(() => {
      // 다음 테스트에 영향을 주지 않기 위해 spy 모킹 해제
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
