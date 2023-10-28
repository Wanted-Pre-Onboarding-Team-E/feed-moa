import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPost.dto';
import { GetPostsDto } from './dto/getPost.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    await this.postService.create(createPostDto);
  }

  @Get()
  async findBy(@Query() getPostDto: GetPostsDto) {
    return await this.postService.findBy(getPostDto);
  }
}
