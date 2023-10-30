import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from '../../entity/post.entity';
import { PostLib } from './post.lib';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [PostService, PostLib],
  controllers: [PostController],
  exports: [PostLib],
})
export class PostModule {}
