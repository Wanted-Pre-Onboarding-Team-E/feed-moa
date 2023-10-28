import { Test, TestingModule } from '@nestjs/testing';
import { AuthCodeRepository } from '../../../src/auth/repository/authCode.repository';
import { AuthService } from '../../../src/auth/auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let authCodeRepository: AuthCodeRepository;

  const mockAuthCodeRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthCodeRepository,
          useValue: mockAuthCodeRepository,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    authCodeRepository = module.get<AuthCodeRepository>(AuthCodeRepository);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(authCodeRepository).toBeDefined();
  });

  test('createAuthCode()', async () => {
    const mockAuthCode = {
      email: 'creator98@naver.com',
      code: '123456',
    };

    const saveSpy = jest
      .spyOn(mockAuthCodeRepository, 'save')
      .mockResolvedValue(mockAuthCode);

    const result = await authService.createAuthCode(mockAuthCode.email);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockAuthCode);
  });
});
