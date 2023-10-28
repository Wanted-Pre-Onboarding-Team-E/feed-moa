import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from 'src/entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostType } from 'src/enum/postType.enum';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async incrementPostLikeCount(type: PostType, postId: number) {
    await this.postRepository
      .createQueryBuilder()
      .update(Post)
      .where({ id: postId, type })
      .set({ likeCount: () => 'likeCount + 1' })
      .execute();
  }
}
