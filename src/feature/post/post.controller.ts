import {
  Controller,
  Get,
  HttpException,
  NotFoundException,
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
import { ErrorType } from '../../enum/errorType.enum';
import { PostTypeValidationPipe } from '../pipe/postTypeValidation.pipe';
import { SuccessType } from '../../enum/successType.enum';
import { JwtAuthGuard } from '../auth/guard/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller({
  path: '/posts',
})
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  async getPosts(
    @Query(ValidationPipe) queryPostsDto: QueryPostsDto,
    @Req() req,
  ) {
    if (!queryPostsDto.hashtag) {
      queryPostsDto.hashtag = req.user.username;
    }
    return {
      message: SuccessType.POSTS_GET,
      data: await this.postService.getPosts(queryPostsDto),
    };
  }

  @Get('/:id')
  async getPostAndAddViewCountById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.getPostWithHashtagById(id);
    if (!post) {
      throw new HttpException(ErrorType.POST_NOT_FOUND, 404);
    }

    return {
      message: SuccessType.POST_GET,
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
      throw new NotFoundException(ErrorType.POST_NOT_FOUND);
    }

    await this.postService.updatePostShareCountById(id, type, post);

    return {
      message: SuccessType.POST_SHARE_PATCH,
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
    await this.postService.incrementPostLikeCount(id, type);
    return {
      message: SuccessType.POST_LIKE_PATCH,
      data: {
        id: id,
        type: type,
      },
    };
  }
}
