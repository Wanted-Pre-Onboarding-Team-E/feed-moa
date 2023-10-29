import { Controller, Param, Patch } from '@nestjs/common';
import { PostService } from './post.service';
import { PostType } from 'src/enum/postType.enum';
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Patch(':postId/like/:type')
  async incrementPostLikeCount(
    @Param('type') type: PostType,
    @Param('postId') postId: number,
  ) {
    return await this.postService.incrementPostLikeCount(type, postId);
  }
}
