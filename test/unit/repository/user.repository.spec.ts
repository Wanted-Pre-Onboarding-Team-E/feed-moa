import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '../../../src/entity/user.entity';
import { UserRepository } from '../../../src/feature/user/repository/user.repository';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  const mockRepository = {
    findOneBy: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository, // 모킹된 레파지토리 사용
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', async () => {
    expect(userRepository).toBeDefined();
  });

  test('findByUsername() : User 객체를 반환한다.', async () => {
    // given
    const testUsername = 'test';
    const mockUser = {
      id: 1,
      username: testUsername,
      password: '1234',
      email: 'test@naver.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const findOneBySpy = jest
      .spyOn(mockRepository, 'findOneBy')
      .mockResolvedValue(mockUser);

    // when
    const found = await userRepository.findByUsername(testUsername);

    // then
    expect(findOneBySpy).toHaveBeenCalledWith({ username: testUsername });
    expect(found).toEqual(mockUser);
  });
});
