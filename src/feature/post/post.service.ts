import { HttpService } from '@nestjs/axios';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AxiosError } from 'axios';
import { Repository } from 'typeorm';
import { catchError, firstValueFrom } from 'rxjs';

import { QueryPostsDto } from './dto/queryPost.dto';
import { Post } from '../../entity/post.entity';
import { PostType } from '../../enum/postType.enum';
import { StatisticsDTO } from '../statistics/dto/statistics.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private readonly httpService: HttpService,
  ) {}

  async incrementPostLikeCount(type: PostType, postId: number) {
    const snsEndpoint = this.getSNSEndpoints(type, postId);

    // const response =
    await firstValueFrom(this.httpService.get(snsEndpoint));
    try {
      //NOTE: 현재 EndPoint 값은 확정적으로 실패이므로, 차후에 성공이 가능할 시 if문을 살려서 카운트 증가
      // if (response.status === 200) {

      await this.updateLikeCount(type, postId);
      // }
    } catch (err) {
      //NOTE: 추가적으로 팀원들간 에러핸들링 방식 종합될 시 추가
    }
  }

  async getPosts(queryPostsDto: QueryPostsDto): Promise<Post[]> {
    const query = this.postRepository.createQueryBuilder('post');

    //TODO: 유저 정보추가 되었을 경우 else 추가하여 미입력 시 디폴트 값 본인계정 조회
    if (queryPostsDto.hashtag) {
      query.innerJoin('post.hashtags', 'hashtags');
      query.where('hashtags.hashtag = :hashtag', {
        hashtag: queryPostsDto.hashtag,
      });
    }

    if (queryPostsDto.type) {
      query.andWhere('post.type = :type', { type: queryPostsDto.type });
    }

    if (queryPostsDto.searchBy && queryPostsDto.search) {
      if (queryPostsDto.searchBy === 'title') {
        query.andWhere('post.title LIKE :search', {
          search: `%${queryPostsDto.search}%`,
        });
      } else if (queryPostsDto.searchBy === 'content') {
        query.andWhere('post.content LIKE :search', {
          search: `%${queryPostsDto.search}%`,
        });
      } else if (queryPostsDto.searchBy === 'title,content') {
        query.andWhere(
          '(post.title LIKE :search OR post.content LIKE :search)',
          { search: `%${queryPostsDto.search}%` },
        );
      }
    }

    if (queryPostsDto.orderBy) {
      if (queryPostsDto.order === 'ASC') {
        query.orderBy(`post.${queryPostsDto.orderBy}`, 'ASC');
      } else if (queryPostsDto.order === 'DESC') {
        query.orderBy(`post.${queryPostsDto.orderBy}`, 'DESC');
      }
    } else {
      query.orderBy('post.createdAt', 'DESC');
    }

    const page = queryPostsDto.page || 0;
    const pageCount = queryPostsDto.pageCount || 10;
    query.skip(page * pageCount).take(pageCount);
    const posts = await query.getMany();
    return posts;
  }

  getPostWithHashtagById(id: number, type?: PostType): Promise<Post> {
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

  async getStatisticsByDate(statisticsDTO: StatisticsDTO) {
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
      const hour = time.split(':')[0];
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

  private async updateLikeCount(type: PostType, postId: number) {
    await this.postRepository
      .createQueryBuilder()
      .update(Post)
      .where({ id: postId, type })
      .set({ likeCount: () => 'likeCount + 1' })
      .execute();
  }

  private getSNSEndpoints(type: PostType, postId: number) {
    switch (type) {
      case PostType.FACEBOOK:
        return `https://www.facebook.com/likes/${postId}`;
      case PostType.TWITTER:
        return `https://www.twitter.com/likes/${postId}`;
      case PostType.INSTAGRAM:
        return `https://www.instagram.com/likes/${postId}`;
      case PostType.THREADS:
        return `https://www.threads.net/likes/${postId}`;
      default:
        throw new Error('타입이 존재하지 않습니다.');
    }
  }
}
