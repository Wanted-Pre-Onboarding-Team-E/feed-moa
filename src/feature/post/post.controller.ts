import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { Post } from 'src/entity/post.entity';
import { PostService } from './post.service';
import { ApiResult } from '../custom/apiResult';
import { ErrorMessage } from 'src/error/error.enum';
import { PostShareDto } from './dto/post.dto';
import { HttpStatusCode } from 'src/enum/httpStatusCode';

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
      throw new HttpException(
        ErrorMessage.postNotFound,
        HttpStatusCode.notFound,
      );
    }

    return {
      success: true,
      data: await this.postService.getPostAndAddViewCountById(post),
    };
  }

  @Patch('/share')
  async updatePostShareCountById(
    @Query() postShareDto: PostShareDto,
  ): Promise<ApiResult<{ status: number; post: Post }>> {
    const post = await this.postService.getPostWithHasgtagById(postShareDto.id);
    if (!post) {
      throw new HttpException(
        ErrorMessage.postNotFound,
        HttpStatusCode.notFound,
      );
    }

    return {
      success: true,
      data: await this.postService.updatePostShareCountById(postShareDto, post),
    };
  }
}
