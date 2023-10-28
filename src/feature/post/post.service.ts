import { HttpException, Injectable } from '@nestjs/common';
import { Post } from 'src/entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostType } from 'src/enum/postType.enum';
import { PostShareDto } from './dto/post.dto';
import { ExternalResponse } from '../util/externalSnsResponse';
import { ErrorMessage } from 'src/error/error.enum';
import { HttpStatusCode } from 'src/enum/httpStatusCode';

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

  async updatePostShareCountById(
    postShareDto: PostShareDto,
    post: Post,
  ): Promise<{ status: number; post: Post }> {
    const externalSnsUrl = (type: PostType) => {
      switch (type) {
        case PostType.INSTAGRAM:
          return `https://www.instagram.com/share/${postShareDto.id}`;
        case PostType.FACEBOOK:
          return `https://www.facebook.com/share/${postShareDto.id}`;
        case PostType.TWITTER:
          return `https://www.twitter.com/share/${postShareDto.id}`;
        case PostType.THREADS:
          return `https://www.threads.net/share/${postShareDto.id}`;
      }
    };

    const responseResult = ExternalResponse.responseResult(
      externalSnsUrl(postShareDto.type),
    );
    if (responseResult != HttpStatusCode.ok) {
      throw new HttpException(
        ErrorMessage.externalSnsFailResponse,
        HttpStatusCode.internalServerError,
      );
    }

    const addShareCountByPost = await this.postRepository.save({
      ...post,
      shareCount: post.shareCount + 1,
    });

    return {
      status: HttpStatusCode.ok,
      post: addShareCountByPost,
    };
  }
}
