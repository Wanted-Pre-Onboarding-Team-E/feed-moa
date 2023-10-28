import { Injectable } from '@nestjs/common';
import { PostRepository } from './repository/post.repository';
import { QueryPostsDto } from './dto/queryPost.dto';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async getDetailPost(queryPostsDto: QueryPostsDto) {
    return await this.postRepository.getDetailPost(queryPostsDto);
  }
}
