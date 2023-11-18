import { MigrationInterface, QueryRunner } from 'typeorm';
import { Post } from '../../entity/post.entity';
import { CreatePostDto } from '../../feature/post/dto/createPost.dto';
import { PostType } from '../../enum/postType.enum';
import { CreateHashtagsDto } from '../../feature/post/dto/createHashtags.dto';
import { Hashtag } from '../../entity/hashtag.entity';

const posts: CreatePostDto[] = [
  {
    type: PostType.THREADS,
    title: '요즘 풋살이 재밌던데',
    content: '야외 풋살장에서 뛰면 공기도 좋고 운동도 되고 일석이조야',
  },
  {
    type: PostType.FACEBOOK,
    title: '톰이',
    content: '야옹',
  },
  {
    type: PostType.THREADS,
    title: '안녕하세요.',
    content: '처음 쓰는 글이에요.',
  },
  {
    type: PostType.INSTAGRAM,
    title: '감성카페',
    content: '사진',
  },
  {
    type: PostType.TWITTER,
    title: '이런 영화 어때요',
    content:
      'SF 장르의 영화를 좋아하신다면, 몇 가지 추천 작품을 소개해드릴게요!',
  },
];

const hashtags: CreateHashtagsDto[] = [
  {
    post: {
      id: 1,
    },
    hashtag: '퇴근후',
  },
  {
    post: {
      id: 1,
    },
    hashtag: '풋살',
  },
  {
    post: {
      id: 2,
    },
    hashtag: '고양이',
  },
  {
    post: {
      id: 2,
    },
    hashtag: '톰이',
  },
  {
    post: {
      id: 2,
    },
    hashtag: '반려동물',
  },
  {
    post: {
      id: 3,
    },
    hashtag: '최초',
  },
  {
    post: {
      id: 3,
    },
    hashtag: '스레드',
  },
  {
    post: {
      id: 4,
    },
    hashtag: '카페',
  },
  {
    post: {
      id: 4,
    },
    hashtag: '감성카페',
  },
  {
    post: {
      id: 4,
    },
    hashtag: '커피',
  },
  {
    post: {
      id: 5,
    },
    hashtag: '영화',
  },
  {
    post: {
      id: 5,
    },
    hashtag: 'SF영화',
  },
];

export class Wanted1697116207926 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const postQueryRunner = queryRunner.manager.connection.createQueryRunner();
    const hashtagQueryRunner =
      queryRunner.manager.connection.createQueryRunner();

    try {
      await postQueryRunner.connect();
      await hashtagQueryRunner.connect();

      await postQueryRunner.startTransaction();
      const insertedPosts = await postQueryRunner.manager.save(Post, posts);
      await postQueryRunner.commitTransaction();

      await hashtagQueryRunner.startTransaction();
      hashtags.map((hashtag) => {
        hashtag.post.id += Number(insertedPosts[0].id - 1);
        return hashtag;
      });
      await hashtagQueryRunner.manager.save(Hashtag, hashtags);
      await hashtagQueryRunner.commitTransaction();
    } catch (error) {
      await postQueryRunner.rollbackTransaction();
      await hashtagQueryRunner.rollbackTransaction();
      throw error;
    } finally {
      await postQueryRunner.release();
      await hashtagQueryRunner.release();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      posts.map((seed) =>
        queryRunner.manager.delete(Post, { type: seed.type }),
      ),
      hashtags.map((seed) =>
        queryRunner.manager.delete(Hashtag, { hashtag: seed.hashtag }),
      ),
    ]);
  }
}
