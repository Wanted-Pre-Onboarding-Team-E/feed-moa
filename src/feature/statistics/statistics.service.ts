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

  async getStatistics(query) {
    console.log('hashtag:', query.hashtag);
    console.log('value:', query.value);
    console.log('type:', query.type);

    if (query.type === 'date') {
      const startDate = new Date(query.start);
      const endDate = new Date(query.end);
      const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
      if (endDate.getTime() - startDate.getTime() > thirtyDaysInMilliseconds) {
        throw new UnprocessableEntityException(
          '최대 조회 가능한 날짜는 30일입니다.',
        );
      }
    }

    if (query.type === 'hour') {
      const startHour = new Date(query.start);
      const endHour = new Date(query.end);
      const oneWeekInMilliseconds = 168 * 60 * 60 * 1000;

      if (startHour.getTime() - endHour.getTime() > oneWeekInMilliseconds) {
        throw new UnprocessableEntityException(
          '최대 조회 가능한 시간은 일주일(168시간)입니다.',
        );
      }
    }

    if (query.value === 'count') {
      const result = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.hashtags', 'hashtag')
        .select('DATE(post.created_at)', 'date')
        .addSelect('COUNT(post.id)', 'count')
        .where('hashtag.hashtag = :hashtag', { hashtag: query.hashtag })
        .andWhere('post.created_at BETWEEN :startDate AND :endDate', {
          startDate: query.start,
          endDate: query.end,
        })
        .groupBy('DATE(post.created_at)')
        .getRawMany();

      if (result.length === 0) {
        return 0;
      }

      return result;
    }

    if (query.value === 'view_count') {
      const result = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.hashtags', 'hashtag')
        .select('DATE(post.created_at)', 'date')
        .addSelect('SUM(post.view_count)', 'sum')
        .where('hashtag.hashtag = :hashtag', { hashtag: query.hashtag })
        .andWhere('post.created_at BETWEEN :startDate AND :endDate', {
          startDate: query.start,
          endDate: query.end,
        })
        .groupBy('DATE(post.created_at)')
        .getRawMany();

      if (result.length === 0) {
        return 0;
      }

      return result;
    }

    if (query.value === 'like_count') {
      const result = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.hashtags', 'hashtag')
        .select('DATE(post.created_at)', 'date')
        .addSelect('SUM(post.like_count)', 'sum')
        .where('hashtag.hashtag = :hashtag', { hashtag: query.hashtag })
        .andWhere('post.created_at BETWEEN :startDate AND :endDate', {
          startDate: query.start,
          endDate: query.end,
        })
        .groupBy('DATE(post.created_at)')
        .getRawMany();

      if (result.length === 0) {
        return 0;
      }

      return result;
    }

    if (query.value === 'share_count') {
      const result = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.hashtags', 'hashtag')
        .select('DATE(post.created_at)', 'date')
        .addSelect('SUM(post.share_count)', 'sum')
        .where('hashtag.hashtag = :hashtag', { hashtag: query.hashtag })
        .andWhere('post.created_at BETWEEN :startDate AND :endDate', {
          startDate: query.start,
          endDate: query.end,
        })
        .groupBy('DATE(post.created_at)')
        .getRawMany();

      if (result.length === 0) {
        return 0;
      }

      return result;
    }
  }
}
