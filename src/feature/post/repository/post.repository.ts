import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { Post } from 'src/entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from '../dto/createPost.dto';
import { GetPostsDto } from '../dto/getPost.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const createPost = this.postRepository.create(createPostDto);
    await this.postRepository.save(createPost);
  }

  // async find(option: FindOneOptions<Post>) {
  //   return await this.postRepository.find(option);
  // }

  // async findOne(option: FindOneOptions<Post>) {
  //   return await this.postRepository.findOne(option);
  // }

  async findBy(getPostDto: GetPostsDto): Promise<Post[]> {
    const query = await this.postRepository.createQueryBuilder('post');
    //TODO: 유저 정보추가 되었을 경우 else 추가하여 미입력 시 디폴트 값 본인계정 조회
    if (getPostDto.hashtag) {
      query.innerJoin('post.hashtags', 'hashtags');
      query.where('hashtags.hashtag = :hashtag', {
        hashtag: getPostDto.hashtag,
      });
    }

    if (getPostDto.type) {
      query.andWhere('post.type = :type', { type: getPostDto.type });
    }

    if (getPostDto.search_by && getPostDto.search) {
      if (getPostDto.search_by === 'title') {
        query.andWhere('post.title LIKE :search', {
          search: `%${getPostDto.search}%`,
        });
      } else if (getPostDto.search_by === 'content') {
        query.andWhere('post.content LIKE :search', {
          search: `%${getPostDto.search}%`,
        });
      } else if (getPostDto.search_by === 'title,content') {
        query.andWhere(
          '(post.title LIKE :search OR post.content LIKE :search)',
          { search: `%${getPostDto.search}%` },
        );
      }
    }

    if (getPostDto.order_by) {
      if (getPostDto.order === 'ASC') {
        query.orderBy(`post.${getPostDto.order_by}`, 'ASC');
      } else if (getPostDto.order === 'DESC') {
        query.orderBy(`post.${getPostDto.order_by}`, 'DESC');
      }
    } else {
      query.orderBy('post.createdAt', 'DESC');
    }

    const page = getPostDto.page || 0;
    const page_count = getPostDto.page_count || 10;
    query.skip(page * page_count).take(page_count);
    const posts = await query.getMany();
    return posts;
  }
}
