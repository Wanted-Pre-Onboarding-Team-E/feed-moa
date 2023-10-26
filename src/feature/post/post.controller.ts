import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create.post.dto';
import { GetPostsDto } from './dto/get.post.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<void> {
    await this.postService.create(createPostDto);
  }

  @Get()
  async findBy(
    @Query() getPostDto: GetPostsDto,
    @Query() page: number,
    @Query() page_count: number,
  ) {
    return await this.postService.findBy(getPostDto, page, page_count);
  }
}
