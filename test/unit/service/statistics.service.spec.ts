import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from '../../../src/feature/statistics/statistics.service';
import { PostLib } from '../../../src/feature/post/post.lib';
import { StatisticsDTO } from '../../../src/feature/statistics/dto/statistics.dto';
import { StatisticsValueType } from '../../../src/enum/statisticsValueType.enum';

describe('StatisticsService', () => {
  let statisticsService: StatisticsService;
  let postLib: PostLib;

  const mockPostLib = {
    getStatisticsByDate: jest.fn(),
    getStatisticsByHour: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: PostLib,
          useValue: mockPostLib,
        },
      ],
    }).compile();

    statisticsService = module.get<StatisticsService>(StatisticsService);
    postLib = module.get<PostLib>(PostLib);
  });

  it('should be defined', () => {
    expect(statisticsService).toBeDefined();
  });

  describe('getStatisticsByDate', () => {
    it('should call postLib.getStatisticsByDate with default values when not provided', async () => {
      const statisticsDTO: StatisticsDTO = {
        type: 'date',
      };

      const setDefaultValueSpy = jest.spyOn(
        statisticsService,
        'setDefaultValue',
      );
      const getStatisticsByDateSpy = jest.spyOn(postLib, 'getStatisticsByDate');

      await statisticsService.getStatisticsByDate(statisticsDTO);

      expect(setDefaultValueSpy).toHaveBeenCalledWith(statisticsDTO);
      expect(getStatisticsByDateSpy).toHaveBeenCalledWith(statisticsDTO);
    });

    it('should call postLib.getStatisticsByDate with provided values', async () => {
      const statisticsDTO: StatisticsDTO = {
        hashtag: 'tag',
        value: StatisticsValueType.COUNT,
        type: 'date',
        start: '2023-01-01',
        end: '2023-01-31',
      };

      const setDefaultValueSpy = jest.spyOn(
        statisticsService,
        'setDefaultValue',
      );
      const getStatisticsByDateSpy = jest.spyOn(postLib, 'getStatisticsByDate');

      await statisticsService.getStatisticsByDate(statisticsDTO);

      expect(setDefaultValueSpy).toHaveBeenCalledWith(statisticsDTO);
      expect(getStatisticsByDateSpy).toHaveBeenCalledWith(statisticsDTO);
    });
  });

  describe('getStatisticsByHour', () => {
    it('should call postLib.getStatisticsByHour with default values when not provided', async () => {
      const statisticsDTO: StatisticsDTO = {
        type: 'hour',
      };

      const setDefaultValueSpy = jest.spyOn(
        statisticsService,
        'setDefaultValue',
      );
      const getStatisticsByHourSpy = jest.spyOn(postLib, 'getStatisticsByHour');

      await statisticsService.getStatisticsByHour(statisticsDTO);

      expect(setDefaultValueSpy).toHaveBeenCalledWith(statisticsDTO);
      expect(getStatisticsByHourSpy).toHaveBeenCalledWith(statisticsDTO);
    });

    it('should call postLib.getStatisticsByHour with provided values', async () => {
      const statisticsDTO: StatisticsDTO = {
        hashtag: 'tag',
        value: StatisticsValueType.COUNT,
        type: 'hour',
        start: '2023-01-01T00:00:00Z',
        end: '2023-01-01T23:59:59Z',
      };

      const setDefaultValueSpy = jest.spyOn(
        statisticsService,
        'setDefaultValue',
      );
      const getStatisticsByHourSpy = jest.spyOn(postLib, 'getStatisticsByHour');

      await statisticsService.getStatisticsByHour(statisticsDTO);

      expect(setDefaultValueSpy).toHaveBeenCalledWith(statisticsDTO);
      expect(getStatisticsByHourSpy).toHaveBeenCalledWith(statisticsDTO);
    });
  });
});
