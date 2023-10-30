import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../../../src/feature/post/post.service';
import { UnprocessableEntityException } from '@nestjs/common';
import { StatisticsDTO } from '../../../src/feature/statistics/dto/statistics.dto';
import { StatisticsValueType } from '../../../src/enum/statisticsValueType.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../../../src/entity/post.entity';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';

class MockRepository {
  queryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockReturnValue([]),
  };

  createQueryBuilder() {
    return this.queryBuilder;
  }
}

class MockHttpService {}

describe('PostService', () => {
  let postService: PostService;
  let postRepository: Repository<Post>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useClass: MockRepository,
        },
        {
          provide: HttpService,
          useClass: MockHttpService,
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepository = module.get<Repository<any>>(getRepositoryToken(Post));
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  describe('getStatisticsByDate', () => {
    it('should return statistics by date for valid date range', async () => {
      const statisticsDTO: StatisticsDTO = {
        type: 'date',
        hashtag: 'exampleHashtag',
        value: StatisticsValueType.COUNT,
        start: '2023-09-02',
        end: '2023-09-04',
      };

      const result = await postService.getStatisticsByDate(statisticsDTO);

      const expectedResult = {
        '2023-09-02': 0,
        '2023-09-03': 0,
        '2023-09-04': 0,
      };

      expect(result).toEqual(expectedResult);
    });

    it('should throw UnprocessableEntityException for date range exceeding 30 days', async () => {
      const statisticsDTO: StatisticsDTO = {
        type: 'date',
        hashtag: 'exampleHashtag',
        value: StatisticsValueType.COUNT,
        start: '2023-01-01',
        end: '2023-02-01',
      };

      await expect(
        postService.getStatisticsByDate(statisticsDTO),
      ).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('getStatisticsByHour', () => {
    it('should return statistics by hour for valid time range', async () => {
      const statisticsDTO: StatisticsDTO = {
        type: 'hour',
        hashtag: 'exampleHashtag',
        value: StatisticsValueType.COUNT,
        start: '2023-10-25T01:00:00Z',
        end: '2023-10-25T03:59:59Z',
      };

      const result = await postService.getStatisticsByHour(statisticsDTO);

      const expectedResult = {
        '2023-10-25': {
          '1': 0,
          '2': 0,
          '3': 0,
        },
      };

      expect(result).toEqual(expectedResult);
    });

    it('should throw UnprocessableEntityException for time range exceeding 1 week', async () => {
      const statisticsDTO: StatisticsDTO = {
        type: 'hour',
        hashtag: 'exampleHashtag',
        value: StatisticsValueType.COUNT,
        start: '2023-01-01T00:00:00Z',
        end: '2023-01-09T00:00:00Z',
      };

      await expect(
        postService.getStatisticsByHour(statisticsDTO),
      ).rejects.toThrow(UnprocessableEntityException);
    });
  });
});
