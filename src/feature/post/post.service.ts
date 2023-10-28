import { Injectable } from '@nestjs/common';
import { PostRepository } from './repository/post.repository';
import { PostType } from 'src/enum/postType.enum';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async incrementPostLikeCount(type: PostType, postId: number) {
    await this.postRepository.incrementPostLikeCount(type, postId);
  }
}
