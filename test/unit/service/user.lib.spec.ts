import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from '../../../src/feature/user/repository/user.repository';
import { UnauthorizedException } from '@nestjs/common';
import { UserLib } from '../../../src/feature/user/user.lib';
import { LoginDto } from '../../../src/auth/dto/login.dto';

describe('UserLib', () => {
  let userLib: UserLib;

  const mockUserRepository = {
    findByUsername: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserLib,
        {
          provide: UserRepository,
          useValue: mockUserRepository, // 모킹된 레파지토리 사용
        },
      ],
    }).compile();

    userLib = module.get<UserLib>(UserLib);
  });

  it('should be defined', () => {
    expect(userLib).toBeDefined();
  });

  describe('verifyUser()', () => {
    let findByUsernameSpy;

    afterEach(() => {
      // 다음 테스트에 영향을 주지 않기 위해 spy 모킹 해제
      findByUsernameSpy.mockRestore();
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

      findByUsernameSpy = jest
        .spyOn(mockUserRepository, 'findByUsername')
        .mockResolvedValue(mockUser);

      userLib.comparePassword = jest.fn().mockResolvedValue(true);

      // when
      const user = await userLib.verifyUser(testLoginDto);

      // then
      expect(findByUsernameSpy).toHaveBeenCalledWith(testLoginDto.username);
      expect(findByUsernameSpy).toHaveBeenCalledTimes(1);
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

      findByUsernameSpy = jest
        .spyOn(mockUserRepository, 'findByUsername')
        .mockResolvedValue(mockUser);

      userLib.comparePassword = jest.fn().mockResolvedValue(true);

      try {
        // when
        await userLib.verifyUser(testLoginDto);
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('존재하지 않는 아이디입니다.');
        expect(findByUsernameSpy).toHaveBeenCalledWith(testLoginDto.username);
        expect(findByUsernameSpy).toHaveBeenCalledTimes(1);
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

      findByUsernameSpy = jest
        .spyOn(mockUserRepository, 'findByUsername')
        .mockResolvedValue(mockUser);

      userLib.comparePassword = jest.fn().mockResolvedValue(false);

      try {
        // when
        await userLib.verifyUser(testLoginDto);
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('비밀번호가 일치하지 않습니다.');
        expect(findByUsernameSpy).toHaveBeenCalledWith(testLoginDto.username);
        expect(findByUsernameSpy).toHaveBeenCalledTimes(1);
      }
    });
  });
});
