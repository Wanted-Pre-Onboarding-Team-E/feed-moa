import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Post } from 'src/entity/post.entity';
import { PostType } from 'src/enum/postType.enum';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private httpService: HttpService,
  ) {}

  async incrementPostLikeCount(type: PostType, postId: number) {
    const snsEndpoint = this.getSNSEndpoints(type, postId);

    const response = await firstValueFrom(this.httpService.get(snsEndpoint));
    try {
      //NOTE: 현재 EndPoint 값은 확정적으로 실패이므로, 차후에 성공이 가능할 시 if문을 살려서 카운트 증가
      // if (response.status === 200) {

      await this.updateLikeCount(type, postId);
      // }
    } catch (err) {
      //NOTE: 추가적으로 팀원들간 에러핸들링 방식 종합될 시 추가
    }
  }

  private async updateLikeCount(type: PostType, postId: number) {
    await this.postRepository
      .createQueryBuilder()
      .update(Post)
      .where({ id: postId, type })
      .set({ likeCount: () => 'likeCount + 1' })
      .execute();
  }

  private getSNSEndpoints(type: PostType, postId: number) {
    switch (type) {
      case PostType.FACEBOOK:
        return `https://www.facebook.com/likes/${postId}`;
      case PostType.TWITTER:
        return `https://www.twitter.com/likes/${postId}`;
      case PostType.INSTAGRAM:
        return `https://www.instagram.com/likes/${postId}`;
      case PostType.THREADS:
        return `https://www.threads.net/likes/${postId}`;
      default:
        throw new Error('타입이 존재하지 않습니다.');
    }
  }
}
