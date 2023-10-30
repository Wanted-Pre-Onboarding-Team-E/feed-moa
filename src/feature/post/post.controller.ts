import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { QueryPostsDto } from './dto/queryPost.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getPosts(@Query(ValidationPipe) queryPostsDto: QueryPostsDto) {
    return await this.postService.getPosts(queryPostsDto);
  }
}
