import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '../../../src/entity/user.entity';
import { UserLib } from '../../../src/feature/user/user.lib';

describe('UserLib', () => {
  let userLib: UserLib;

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserLib,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository, // 모킹된 레파지토리 사용
        },
      ],
    }).compile();

    userLib = module.get<UserLib>(UserLib);
  });

  it('should be defined', async () => {
    expect(userLib).toBeDefined();
  });

  test('getUserById() : id가 일치하는 User 객체를 반환한다.', async () => {
    // given
    const testUserId = 1;
    const mockUser = {
      id: testUserId,
      username: 'test',
      password: '1234',
      email: 'test@naver.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const findOneBySpy = jest
      .spyOn(mockUserRepository, 'findOneBy')
      .mockResolvedValue(mockUser);

    // when
    const user = await userLib.getUserById(testUserId);

    // then
    expect(findOneBySpy).toHaveBeenCalledWith({ id: testUserId });
    expect(user).toEqual(mockUser);
  });
});
