import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create.post.dto';
import { PostRepository } from './repository/post.repository';
import { GetPostsDto } from './dto/get.post.dto';
import { Like } from 'typeorm';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async create(cretePostDto: CreatePostDto): Promise<void> {
    await this.postRepository.create(cretePostDto);
  }

  async findBy(getPostDto: GetPostsDto, page: number, page_count: number) {
    const { hashtag, type, order_by, search, search_by } = getPostDto;

    const findPosts = await this.postRepository.findPosts(hashtag);
    return findPosts;
  }
}
