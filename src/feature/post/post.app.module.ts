import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../entity/post.entity';
import { PostLib } from './post.lib';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService, PostLib],
  controllers: [PostController],
  exports: [PostLib],
})
export class PostModule {}
