import { Injectable } from '@nestjs/common';
import { QueryPostsDto } from './dto/queryPost.dto';
import { Post } from 'src/entity/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async getDetailPost(queryPostsDto: QueryPostsDto): Promise<Post[]> {
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
    const page_count = queryPostsDto.pageCount || 10;
    query.skip(page * page_count).take(page_count);
    const posts = await query.getMany();
    return posts;
  }
}
