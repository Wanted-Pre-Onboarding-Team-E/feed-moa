import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from '../../../src/feature/user/repository/user.repository';
import { UserService } from '../../../src/feature/user/user.service';
import { UnauthorizedException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;

  const mockUserRepository = {
    findByUsername: jest.fn(),
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

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('verifyUser()', () => {
    let findByUsernameSpy;

    afterEach(() => {
      // 다음 테스트에 영향을 주지 않기 위해 spy 모킹 해제
      findByUsernameSpy.mockRestore();
    });

    test('사용자 정보가 일치하면 User 객체를 반환한다.', async () => {
      // given
      const testUsername = 'test';
      const testPassword = '1234';

      const mockUser = {
        id: 1,
        username: testUsername,
        password: testPassword,
        email: 'test@naver.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      findByUsernameSpy = jest
        .spyOn(mockUserRepository, 'findByUsername')
        .mockResolvedValue(mockUser);

      // when
      const user = await userService.verifyUser(testUsername, testPassword);

      // then
      expect(findByUsernameSpy).toHaveBeenCalledWith(testUsername);
      expect(findByUsernameSpy).toHaveBeenCalledTimes(1);
      expect(user).toEqual(mockUser);
    });

    test('사용자 아이디가 존재하지 않으면 에러가 발생한다.', async () => {
      // given
      const testUsername = 'id_does_not_exist';
      const testPassword = '1234';

      const mockUser = {
        id: 1,
        username: 'test',
        password: testPassword,
        email: 'test@naver.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      findByUsernameSpy = jest
        .spyOn(mockUserRepository, 'findByUsername')
        .mockResolvedValue(mockUser);

      try {
        // when
        await userService.verifyUser(testUsername, testPassword);
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(findByUsernameSpy).toHaveBeenCalledWith(testUsername);
        expect(findByUsernameSpy).toHaveBeenCalledTimes(1);
      }
    });

    test('사용자 비밀번호가 일치하지 않으면 에러가 발생한다.', async () => {
      // given
      const testUsername = 'test';
      const testPassword = 'wrong_password';

      const mockUser = {
        id: 1,
        username: testUsername,
        password: '1234',
        email: 'test@naver.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      findByUsernameSpy = jest
        .spyOn(mockUserRepository, 'findByUsername')
        .mockResolvedValue(mockUser);

      try {
        // when
        await userService.verifyUser(testUsername, testPassword);
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(findByUsernameSpy).toHaveBeenCalledWith(testUsername);
        expect(findByUsernameSpy).toHaveBeenCalledTimes(1);
      }
    });
  });
});
