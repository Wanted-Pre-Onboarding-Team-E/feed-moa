import { Post } from 'src/entity/post.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostService } from 'src/feature/post/post.service';
import { Repository } from 'typeorm';
enum PostType {
  INSTAGRAM = 'instagram',
}

class MockRepository {
  queryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockReturnThis(),
    save: jest.fn(),
  };

  createQueryBuilder() {
    return this.queryBuilder;
  }
}

describe('PostService', () => {
  let postService: PostService;
  let postRepository: Repository<Post>;

  beforeEach(async () => {
    // 가짜 모듈 생성
    const module = await Test.createTestingModule({
      providers: [
        PostService,
        // 실제 디비가 아닌 목업 디비로 연결해서 사용하기 위함
        {
          provide: getRepositoryToken(Post),
          useValue: MockRepository,
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('getPostWithHashtagById()', () => {
    const PostObject = {
      id: 2,
      type: PostType.INSTAGRAM,
      title: '여행은 하와이로',
      content: '휴양지로 여행가고 싶을땐 하와이!',
      viewCount: 1,
      likeCount: 0,
      shareCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      hashtags: [],
    };

    const response = postService.getPostWithHashtagById(1, PostType.INSTAGRAM);
    expect(PostObject).toEqual(response);
  });

  it('getPostAndAddViewCountById()', () => {
    const PostObject = {
      id: 2,
      type: PostType.INSTAGRAM,
      title: '여행은 하와이로',
      content: '휴양지로 여행가고 싶을땐 하와이!',
      viewCount: 1,
      likeCount: 0,
      shareCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      hashtags: [],
    };

    const response = postService.getPostAndAddViewCountById(PostObject);
    expect(PostObject).toEqual(response);
  });
});
