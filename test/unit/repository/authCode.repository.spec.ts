import { Test, TestingModule } from '@nestjs/testing';
import { AuthCodeRepository } from '../../../src/auth/repository/authCode.repository';
import { DataSource } from 'typeorm';

describe('AuthCodeRepository', () => {
  let authCodeRepository: AuthCodeRepository;

  const mockDataSource = {
    createEntityManager: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthCodeRepository,
        {
          provide: DataSource,
          useValue: mockDataSource, // 모킹된 레파지토리 사용
        },
      ],
    }).compile();

    authCodeRepository = module.get<AuthCodeRepository>(AuthCodeRepository);
  });

  it('should be defined', async () => {
    expect(authCodeRepository).toBeDefined();
  });
});
