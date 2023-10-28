import { Controller, Param, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { PostType } from 'src/enum/postType.enum';
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post(':type/like/:postId')
  async incrementPostLikeCount(
    @Param('type') type: PostType,
    @Param('postId') postId: number,
  ) {
    return await this.postService.incrementPostLikeCount(type, postId);
  }
}
