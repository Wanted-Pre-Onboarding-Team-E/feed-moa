import { Injectable } from '@nestjs/common';
import { Post } from 'src/entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostType } from 'src/enum/postType.enum';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class PostService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  getPostWithHasgtagById(id: number, type?: PostType): Promise<Post> {
    const query = this.postRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.hashtags', 'hashtags')
      .where('posts.id = :id', { id });

    if (type) {
      query.andWhere('posts.type = :type', { type });
    }
    return query.getOne();
  }

  async getPostAndAddViewCountById(post: Post): Promise<Post> {
    const addViewCountByPost = await this.postRepository.save({
      ...post,
      viewCount: post.viewCount + 1,
    });
    return addViewCountByPost;
  }

  async updatePostShareCountById(
    id: number,
    type: PostType,
    post: Post,
  ): Promise<void> {
    const getSnsUrl = (type: PostType) => {
      switch (type) {
        case PostType.INSTAGRAM:
          return `https://www.instagram.com/share/${id}`;
        case PostType.FACEBOOK:
          return `https://www.facebook.com/share/${id}`;
        case PostType.TWITTER:
          return `https://www.twitter.com/share/${id}`;
        case PostType.THREADS:
          return `https://www.threads.net/share/${id}`;
      }
    };

    await firstValueFrom(
      this.httpService.get<Post[]>(getSnsUrl(type)).pipe(
        catchError(async (error: AxiosError) => {
          /*
          NOTE: 가상의 URL이기 때문에 반드시 에러가 발생합니다. 
                따라서 이 요청이 status 200 성공 응답을 받았다고 
                가정하고 catchError 내부에 작성합니다.
          */
          await this.postRepository.save({
            ...post,
            shareCount: post.shareCount + 1,
          });
          console.log('error : ', error);
        }),
      ),
    );
  }
}
