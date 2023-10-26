import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { Post } from 'src/entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from '../dto/create.post.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<void> {
    const createPost = this.postRepository.create(createPostDto);
    await this.postRepository.save(createPost);
  }

  async find(option: FindOneOptions<Post>) {
    return await this.postRepository.find(option);
  }

  async findOne(option: FindOneOptions<Post>) {
    return await this.postRepository.findOne(option);
  }

  async findPosts(hashtag: string) {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.hashtag');
  }
}
