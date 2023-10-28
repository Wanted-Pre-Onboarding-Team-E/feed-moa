import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../../src/feature/user/repository/user.repository';
import { DataSource } from 'typeorm';
import { User } from '../../../src/entity/user.entity';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  const mockDataSource = {
    createEntityManager: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DataSource,
          useValue: mockDataSource, // 모킹된 레파지토리 사용
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', async () => {
    expect(userRepository).toBeDefined();
  });

  test('findOneByUsername()', async () => {
    const testUser02 = new User();

    testUser02.id = 1;
    testUser02.username = 'test01';
    testUser02.email = 'creator98@naver.com';
    testUser02.password = 'helloWorld123@';
    testUser02.isActive = false;
    testUser02.createdAt = new Date();
    testUser02.updatedAt = new Date();

    const findOneSpy = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(testUser02);

    const found = await userRepository.findOneByUsername(testUser02.username);

    expect(findOneSpy).toHaveBeenCalled();
    expect(found).toEqual(testUser02);
  });
});
