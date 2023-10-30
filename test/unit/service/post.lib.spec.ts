import { Test, TestingModule } from '@nestjs/testing';
import { PostLib } from '../../../src/feature/post/post.lib';
import { PostService } from '../../../src/feature/post/post.service';
import { StatisticsDTO } from '../../../src/feature/statistics/dto/statistics.dto';
import { StatisticsValueType } from '../../../src/enum/statisticsValueType.enum';

describe('PostLib', () => {
  let postLib: PostLib;
  let postService: PostService;

  const mockPostService = {
    getStatisticsByDate: jest.fn(),
    getStatisticsByHour: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostLib,
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    postLib = module.get<PostLib>(PostLib);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(postLib).toBeDefined();
  });

  describe('getStatisticsByDate', () => {
    it('should call postService.getStatisticsByDate with provided values', async () => {
      const statisticsDTO: StatisticsDTO = {
        hashtag: 'tag',
        value: StatisticsValueType.COUNT,
        type: 'date',
        start: '2023-01-01',
        end: '2023-01-31',
      };

      const getStatisticsByDateSpy = jest.spyOn(
        postService,
        'getStatisticsByDate',
      );

      await postLib.getStatisticsByDate(statisticsDTO);

      expect(getStatisticsByDateSpy).toHaveBeenCalledWith(statisticsDTO);
    });
  });

  describe('getStatisticsByHour', () => {
    it('should call postService.getStatisticsByHour with provided values', async () => {
      const statisticsDTO: StatisticsDTO = {
        hashtag: 'tag',
        value: StatisticsValueType.COUNT,
        type: 'hour',
        start: '2023-01-01T00:00:00Z',
        end: '2023-01-01T23:59:59Z',
      };

      const getStatisticsByHourSpy = jest.spyOn(
        postService,
        'getStatisticsByHour',
      );

      await postLib.getStatisticsByHour(statisticsDTO);

      expect(getStatisticsByHourSpy).toHaveBeenCalledWith(statisticsDTO);
    });
  });
});
