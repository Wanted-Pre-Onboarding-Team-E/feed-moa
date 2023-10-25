import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
