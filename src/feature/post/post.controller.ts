import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Post } from 'src/entity/post.entity';
import { PostService } from './post.service';
import { ApiResult } from '../custom/apiResult';
import { ErrorMessage } from 'src/error/error.enum';

@Controller({
  path: '/posts',
})
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/:id')
  async getPostAndAddViewCountById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResult<Post>> {
    const post = await this.postService.getPostWithHasgtagById(id);
    if (!post) {
      return {
        success: false,
        message: ErrorMessage.postNotFound,
      };
    }

    return {
      success: true,
      data: await this.postService.getPostAndAddViewCountById(post),
    };
  }
}
