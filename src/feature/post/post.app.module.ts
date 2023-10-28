import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './repository/post.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entity/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService, PostRepository],
  controllers: [PostController],
})
export class PostModule {}
