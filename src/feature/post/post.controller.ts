import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  Query,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { Post } from 'src/entity/post.entity';
import { PostService } from './post.service';
import { ApiResult } from '../custom/apiResult';
import { ErrorMessage } from 'src/error/error.enum';
import { HttpStatusCode } from 'src/enum/httpStatusCode.enum';
import { PostType } from 'src/enum/postType.enum';
import { PostTypeValidationPipe } from '../pipe/postTypeValidation.pipe';
import { JwtAuthGuard } from '../../auth/guard/jwtAuth.guard';
import { QueryPostsDto } from './dto/queryPost.dto';

@UseGuards(JwtAuthGuard)
@Controller({
  path: '/posts',
})
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/:id')
  async getPostAndAddViewCountById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResult<Post>> {
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
  ): Promise<ApiResult<void>> {
    const post = await this.postService.getPostWithHashtagById(id, type);
    if (!post) {
      throw new HttpException(
        ErrorMessage.postNotFound,
        HttpStatusCode.notFound,
      );
    }

    await this.postService.updatePostShareCountById(id, type, post);

    return {
      success: true,
    };
  }

  @Patch(':postId/like/:type')
  async incrementPostLikeCount(
    @Param('type') type: PostType,
    @Param('postId') postId: number,
  ) {
    return await this.postService.incrementPostLikeCount(type, postId);
  }
  @Get()
  async getPosts(
    @Query(ValidationPipe) queryPostsDto: QueryPostsDto,
    @Req() req,
  ) {
    if (!queryPostsDto.hashtag) {
      queryPostsDto.hashtag = req.user.username;
    }
    return await this.postService.getPosts(queryPostsDto);
  }
}
