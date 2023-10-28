import { Controller, Get, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { QueryPostsDto } from './dto/queryPost.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getDetailPost(@Query() queryPostsDto: QueryPostsDto) {
    return await this.postService.getDetailPost(queryPostsDto);
  }
}
