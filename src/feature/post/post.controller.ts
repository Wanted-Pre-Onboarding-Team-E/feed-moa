import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { PostService } from './post.service';
import { QueryPostsDto } from './dto/queryPost.dto';
import { PostType } from '../../enum/postType.enum';
import { ErrorMessage } from '../../error/error.enum';
import { HttpStatusCode } from '../../enum/httpStatusCode.enum';
import { PostTypeValidationPipe } from '../pipe/postTypeValidation.pipe';
import { JwtAuthGuard } from '../auth/guard/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller({
  path: '/posts',
})
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/:id')
  async getPostAndAddViewCountById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.getPostWithHashtagById(id);
    if (!post) {
      throw new HttpException(ErrorMessage.postNotFound, 404);
    }

    return {
      success: true,
      data: await this.postService.getPostAndAddViewCountById(post),
    };
  }

  @Patch('/:id/share/:type')
  async updatePostShareCountById(
    @Param('id', ParseIntPipe) id: number,
    @Param('type', PostTypeValidationPipe) type: PostType,
  ) {
    const post = await this.postService.getPostWithHashtagById(id, type);
    if (!post) {
      throw new HttpException(
        ErrorMessage.postNotFound,
        HttpStatusCode.notFound,
      );
    }

    await this.postService.updatePostShareCountById(id, type, post);

    return {
      message: '게시물 공유에 성공하였습니다.',
      data: {
        id: id,
        type: type,
      },
    };
  }

  @Patch('/:id/like/:type')
  async incrementPostLikeCount(
    @Param('id') id: number,
    @Param('type') type: PostType,
  ) {
    await this.postService.incrementPostLikeCount(type, id);
    return {
      message: '게시물 좋아요에 성공하였습니다.',
      data: {
        id: id,
        type: type,
      },
    };
  }

  @Get('/')
  async getPosts(
    @Query(ValidationPipe) queryPostsDto: QueryPostsDto,
    @Req() req,
  ) {
    if (!queryPostsDto.hashtag) {
      queryPostsDto.hashtag = req.user.username;
    }
    return {
      message: '게시물 목록 조회에 성공하였습니다.',
      data: await this.postService.getPosts(queryPostsDto),
    };
  }
}
