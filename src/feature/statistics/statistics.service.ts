import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  Injectable,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Post } from '../../entity/post.entity';
import { Hashtag } from '../../entity/hashtag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Hashtag) private hashtagRepository: Repository<Hashtag>,
  ) {}

  async getStatisticsByDate(query) {
    const startDate = new Date(query.start);
    const endDate = new Date(query.end);
    const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    if (endDate.getTime() - startDate.getTime() > thirtyDaysInMilliseconds) {
      throw new UnprocessableEntityException(
        '최대 조회 가능한 날짜는 30일입니다.',
      );
    }

    if (query.type === 'hour') {
      const startHour = new Date(query.start);
      const endHour = new Date(query.end);
      const oneWeekInMilliseconds = 168 * 60 * 60 * 1000;

      if (endHour.getTime() - startHour.getTime() > oneWeekInMilliseconds) {
        throw new UnprocessableEntityException(
          '최대 조회 가능한 시간은 일주일(168시간)입니다.',
        );
      }
    }

    let result;

    if (query.value === 'count') {
      result = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.hashtags', 'hashtag')
        .select('DATE(post.created_at)', 'date')
        .addSelect('COUNT(post.id)', 'sum')
        .where('hashtag.hashtag = :hashtag', { hashtag: query.hashtag })
        .andWhere(
          'DATE(post.created_at) BETWEEN :startDate AND DATE_ADD(:endDate, INTERVAL 1 DAY)',
          {
            startDate: query.start,
            endDate: query.end,
          },
        )
        .groupBy('DATE(post.created_at)')
        .getRawMany();
    }

    if (query.value === 'view_count') {
      result = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.hashtags', 'hashtag')
        .select('DATE(post.created_at)', 'date')
        .addSelect('SUM(post.view_count)', 'sum')
        .where('hashtag.hashtag = :hashtag', { hashtag: query.hashtag })
        .andWhere(
          'DATE(post.created_at) BETWEEN :startDate AND DATE_ADD(:endDate, INTERVAL 1 DAY)',
          {
            startDate: query.start,
            endDate: query.end,
          },
        )
        .groupBy('DATE(post.created_at)')
        .getRawMany();
    }

    if (query.value === 'like_count') {
      result = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.hashtags', 'hashtag')
        .select('DATE(post.created_at)', 'date')
        .addSelect('SUM(post.like_count)', 'sum')
        .where('hashtag.hashtag = :hashtag', { hashtag: query.hashtag })
        .andWhere(
          'DATE(post.created_at) BETWEEN :startDate AND DATE_ADD(:endDate, INTERVAL 1 DAY)',
          {
            startDate: query.start,
            endDate: query.end,
          },
        )
        .groupBy('DATE(post.created_at)')
        .getRawMany();
    }

    if (query.value === 'share_count') {
      result = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.hashtags', 'hashtag')
        .select('DATE(post.created_at)', 'date')
        .addSelect('SUM(post.share_count)', 'sum')
        .where('hashtag.hashtag = :hashtag', { hashtag: query.hashtag })
        .andWhere(
          'DATE(post.created_at) BETWEEN :startDate AND DATE_ADD(:endDate, INTERVAL 1 DAY)',
          {
            startDate: query.start,
            endDate: query.end,
          },
        )
        .groupBy('DATE(post.created_at)')
        .getRawMany();
    }
    const dateMap = {};
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().slice(0, 10);
      dateMap[formattedDate] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    result.forEach((result) => {
      const formattedDate = new Date(result.date);
      formattedDate.setDate(formattedDate.getDate() + 1);
      const dateString = formattedDate.toISOString().slice(0, 10);
      dateMap[dateString] = parseInt(result.sum);
    });

    return dateMap;
  }

  async getStatisticsByHour(query) {
    const startHour = new Date(query.start);
    const endHour = new Date(query.end);
    const oneWeekInMilliseconds = 168 * 60 * 60 * 1000;

    if (endHour.getTime() - startHour.getTime() > oneWeekInMilliseconds) {
      throw new UnprocessableEntityException(
        '최대 조회 가능한 시간은 일주일(168시간)입니다.',
      );
    }

    let result;

    if (query.value === 'count') {
      result = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.hashtags', 'hashtag')
        .select(
          'CONCAT(DATE_FORMAT(post.created_at, "%Y-%m-%d %H"), ":00")',
          'date',
        )
        .addSelect('COUNT(post.id)', 'sum')
        .where('hashtag.hashtag = :hashtag', { hashtag: query.hashtag })
        .andWhere(
          'DATE(post.created_at) BETWEEN :startDate AND DATE_ADD(:endDate, INTERVAL 1 HOUR)',
          {
            startDate: query.start,
            endDate: query.end,
          },
        )
        .groupBy('date')
        .getRawMany();
    }

    if (query.value === 'view_count') {
      result = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.hashtags', 'hashtag')
        .select(
          'CONCAT(DATE_FORMAT(post.created_at, "%Y-%m-%d %H"), ":00")',
          'date',
        )
        .addSelect('SUM(post.view_count)', 'sum')
        .where('hashtag.hashtag = :hashtag', { hashtag: query.hashtag })
        .andWhere(
          'DATE(post.created_at) BETWEEN :startDate AND DATE_ADD(:endDate, INTERVAL 1 HOUR)',
          {
            startDate: query.start,
            endDate: query.end,
          },
        )
        .groupBy('date')
        .getRawMany();
    }

    if (query.value === 'like_count') {
      result = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.hashtags', 'hashtag')
        .select(
          'CONCAT(DATE_FORMAT(post.created_at, "%Y-%m-%d %H"), ":00")',
          'date',
        )
        .addSelect('SUM(post.like_count)', 'sum')
        .where('hashtag.hashtag = :hashtag', { hashtag: query.hashtag })
        .andWhere(
          'DATE(post.created_at) BETWEEN :startDate AND DATE_ADD(:endDate, INTERVAL 1 HOUR)',
          {
            startDate: query.start,
            endDate: query.end,
          },
        )
        .groupBy('date')
        .getRawMany();
    }

    if (query.value === 'share_count') {
      result = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.hashtags', 'hashtag')
        .select(
          'CONCAT(DATE_FORMAT(post.created_at, "%Y-%m-%d %H"), ":00")',
          'date',
        )
        .addSelect('SUM(post.share_count)', 'sum')
        .where('hashtag.hashtag = :hashtag', { hashtag: query.hashtag })
        .andWhere(
          'DATE(post.created_at) BETWEEN :startDate AND DATE_ADD(:endDate, INTERVAL 1 HOUR)',
          {
            startDate: query.start,
            endDate: query.end,
          },
        )
        .groupBy('date')
        .getRawMany();
    }

    const dateTimeMap = {};
    const startDateTime = new Date(query.start);
    const endDateTime = new Date(query.end);
    const currentDateTime = new Date(startDateTime);

    while (currentDateTime <= endDateTime) {
      const formattedDateTime = currentDateTime.toISOString().slice(0, 16);
      dateTimeMap[formattedDateTime] = 0;
      currentDateTime.setHours(currentDateTime.getHours() + 1);
    }

    result.forEach((result) => {
      const formattedDateTime = new Date(result.date);
      formattedDateTime.setUTCHours(formattedDateTime.getUTCHours() + 9);
      const dateTimeString = formattedDateTime.toISOString().slice(0, 16);
      dateTimeMap[dateTimeString] = parseInt(result.sum);
    });

    const formattedResults = {};

    for (const [key, value] of Object.entries(dateTimeMap)) {
      const [date, time] = key.split('T');
      const [hour, _] = time.split(':');
      if (!formattedResults[date]) {
        formattedResults[date] = {};
      }
      formattedResults[date][parseInt(hour)] = value;
    }

    const sortedFormattedResults = {};

    Object.keys(formattedResults)
      .sort()
      .forEach((date) => {
        sortedFormattedResults[date] = formattedResults[date];
      });

    return formattedResults;
  }
}
