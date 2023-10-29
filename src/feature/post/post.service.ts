import { Injectable } from '@nestjs/common';
import { Post } from 'src/entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  getPostWithHasgtagById(id: number): Promise<Post> {
    return this.postRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.hashtags', 'hashtags')
      .where('posts.id = :id', { id })
      .getOne();
  }

  async getPostAndAddViewCountById(post: Post): Promise<Post> {
    const addViewCountByPost = await this.postRepository.save({
      ...post,
      viewCount: post.viewCount + 1,
    });
    return addViewCountByPost;
  }
}
