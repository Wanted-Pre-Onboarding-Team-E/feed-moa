import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { PostRepository } from './repository/post.repository';
import { GetPostsDto } from './dto/getPost.dto';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async create(cretePostDto: CreatePostDto) {
    await this.postRepository.create(cretePostDto);
  }

  async findBy(getPostDto: GetPostsDto) {
    return await this.postRepository.findBy(getPostDto);
  }
}
