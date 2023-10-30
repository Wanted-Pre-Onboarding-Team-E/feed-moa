import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from '../../../src/feature/statistics/statistics.controller';
import { StatisticsService } from '../../../src/feature/statistics/statistics.service';
import { StatisticsDTO } from '../../../src/feature/statistics/dto/statistics.dto';

describe('StatisticsController', () => {
  let statisticsController: StatisticsController;
  let statisticsService: StatisticsService;

  const mockStatisticsService = {
    getStatisticsByDate: jest.fn(),
    getStatisticsByHour: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        {
          provide: StatisticsService,
          useValue: mockStatisticsService,
        },
      ],
    }).compile();

    statisticsService = module.get<StatisticsService>(StatisticsService);
    statisticsController =
      module.get<StatisticsController>(StatisticsController);
  });

  it('should be defined', () => {
    expect(statisticsController).toBeDefined();
  });

  describe('getStatistics', () => {
    const req = {
      id: 'exampleId',
      username: 'exampleUsername',
      email: 'exampleEmail',
    };

    it('should return statistics by date when type is "date" and hashtag is provided', () => {
      const statisticsDTO: StatisticsDTO = {
        hashtag: 'test',
        type: 'date',
        start: '2021-01-01',
        end: '2021-01-31',
      };

      const expectedResult = {
        '2023-09-02': 0,
        '2023-09-03': 0,
        '2023-09-04': 0,
      };

      const getStatisticsByDateSpy = jest
        .spyOn(statisticsService, 'getStatisticsByDate')
        .mockResolvedValue(expectedResult);

      const result = statisticsController.getStatistics(statisticsDTO, req);

      expect(getStatisticsByDateSpy).toHaveBeenCalledWith(statisticsDTO);
      expect(result).resolves.toEqual(expectedResult);
    });

    it('should return statistics by hour when type is "hour" and hashtag is provided', () => {
      const statisticsDTO: StatisticsDTO = {
        hashtag: 'test',
        type: 'hour',
        start: '2021-01-01T00:00:00Z',
        end: '2021-01-01T23:59:59Z',
      };

      const expectedResult = {
        '2023-10-25': {
          '1': 0,
          '2': 0,
          '3': 0,
        },
      };

      const getStatisticsByHourSpy = jest
        .spyOn(statisticsService, 'getStatisticsByHour')
        .mockResolvedValue(expectedResult);

      const result = statisticsController.getStatistics(statisticsDTO, req);

      expect(getStatisticsByHourSpy).toHaveBeenCalledWith(statisticsDTO);
      expect(result).resolves.toEqual(expectedResult);
    });
  });
});
