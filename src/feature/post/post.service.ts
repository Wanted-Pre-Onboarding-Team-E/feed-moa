import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Post } from 'src/entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostType } from 'src/enum/postType.enum';
import { StatisticsDTO } from '../statistics/dto/statistics.dto';
import { StatisticsValueType } from '../../enum/statisticsValueType.enum';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class PostService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  getPostWithHasgtagById(id: number, type?: PostType): Promise<Post> {
    const query = this.postRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.hashtags', 'hashtags')
      .where('posts.id = :id', { id });

    if (type) {
      query.andWhere('posts.type = :type', { type });
    }
    return query.getOne();
  }

  async getPostAndAddViewCountById(post: Post): Promise<Post> {
    const addViewCountByPost = await this.postRepository.save({
      ...post,
      viewCount: post.viewCount + 1,
    });
    return addViewCountByPost;
  }

  async updatePostShareCountById(
    id: number,
    type: PostType,
    post: Post,
  ): Promise<void> {
    const getSnsUrl = (type: PostType) => {
      switch (type) {
        case PostType.INSTAGRAM:
          return `https://www.instagram.com/share/${id}`;
        case PostType.FACEBOOK:
          return `https://www.facebook.com/share/${id}`;
        case PostType.TWITTER:
          return `https://www.twitter.com/share/${id}`;
        case PostType.THREADS:
          return `https://www.threads.net/share/${id}`;
      }
    };

    await firstValueFrom(
      this.httpService.get<Post[]>(getSnsUrl(type)).pipe(
        catchError(async (error: AxiosError) => {
          /*
          NOTE: 가상의 URL이기 때문에 반드시 에러가 발생합니다. 
                따라서 이 요청이 status 200 성공 응답을 받았다고 
                가정하고 catchError 내부에 작성합니다.
          */
          await this.postRepository.save({
            ...post,
            shareCount: post.shareCount + 1,
          });
          console.log('error : ', error);
        }),
      ),
    );
  }

  setDefaultValue(statisticsDTO: StatisticsDTO) {
    if (!statisticsDTO.hashtag) {
      statisticsDTO.hashtag = '태그';
    }

    if (!statisticsDTO.value) {
      statisticsDTO.value = StatisticsValueType.COUNT;
    }

    if (!statisticsDTO.end) {
      statisticsDTO.end = new Date().toISOString();
    }

    if (statisticsDTO.type === 'date' && !statisticsDTO.start) {
      const thirtyDaysAgo = new Date(statisticsDTO.end);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
      statisticsDTO.start = thirtyDaysAgo.toISOString();
    }

    if (statisticsDTO.type === 'hour' && !statisticsDTO.start) {
      const oneWeekAgo = new Date(statisticsDTO.end);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 5);
      oneWeekAgo.setHours(oneWeekAgo.getHours() - 23);
      oneWeekAgo.setMinutes(oneWeekAgo.getMinutes() - 59);
      statisticsDTO.start = oneWeekAgo.toISOString();
    }
  }

  async getStatisticsByDate(statisticsDTO: StatisticsDTO) {
    this.setDefaultValue(statisticsDTO);

    const startDate = new Date(statisticsDTO.start);
    const endDate = new Date(statisticsDTO.end);

    const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    if (endDate.getTime() - startDate.getTime() > thirtyDaysInMilliseconds) {
      throw new UnprocessableEntityException(
        '최대 조회 가능한 날짜는 30일입니다.',
      );
    }

    let selectValue;

    if (statisticsDTO.value === 'count') {
      selectValue = 'COUNT(post.id)';
    } else if (statisticsDTO.value === 'view_count') {
      selectValue = 'SUM(post.view_count)';
    } else if (statisticsDTO.value === 'like_count') {
      selectValue = 'SUM(post.like_count)';
    } else if (statisticsDTO.value === 'share_count') {
      selectValue = 'SUM(post.share_count)';
    }

    const result = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.hashtags', 'hashtag')
      .select('DATE(post.created_at)', 'date')
      .addSelect(selectValue, 'sum')
      .where('hashtag.hashtag = :hashtag', { hashtag: statisticsDTO.hashtag })
      .andWhere(
        'DATE(post.created_at) BETWEEN :startDate AND DATE_ADD(:endDate, INTERVAL 1 DAY)',
        {
          startDate: statisticsDTO.start,
          endDate: statisticsDTO.end,
        },
      )
      .groupBy('DATE(post.created_at)')
      .getRawMany();

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

  async getStatisticsByHour(statisticsDTO: StatisticsDTO) {
    this.setDefaultValue(statisticsDTO);

    const startDateTime = new Date(statisticsDTO.start);
    const endDateTime = new Date(statisticsDTO.end);
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;

    if (
      endDateTime.getTime() - startDateTime.getTime() >
      oneWeekInMilliseconds
    ) {
      throw new UnprocessableEntityException(
        '최대 조회 가능한 시간은 일주일(168시간)입니다.',
      );
    }

    let selectValue;

    if (statisticsDTO.value === 'count') {
      selectValue = 'COUNT(post.id)';
    } else if (statisticsDTO.value === 'view_count') {
      selectValue = 'SUM(post.view_count)';
    } else if (statisticsDTO.value === 'like_count') {
      selectValue = 'SUM(post.like_count)';
    } else if (statisticsDTO.value === 'share_count') {
      selectValue = 'SUM(post.share_count)';
    }

    const result = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.hashtags', 'hashtag')
      .select(
        'CONCAT(DATE_FORMAT(post.created_at, "%Y-%m-%d %H"), ":00")',
        'date',
      )
      .addSelect(selectValue, 'sum')
      .where('hashtag.hashtag = :hashtag', { hashtag: statisticsDTO.hashtag })
      .andWhere(
        'DATE(post.created_at) BETWEEN :startDate AND DATE_ADD(:endDate, INTERVAL 1 HOUR)',
        {
          startDate: statisticsDTO.start,
          endDate: statisticsDTO.end,
        },
      )
      .groupBy('date')
      .getRawMany();

    const dateTimeMap = {};

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