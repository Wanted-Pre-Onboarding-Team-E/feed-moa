import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../../../src/feature/post/post.controller';
import { PostType } from '../../../src/enum/postType.enum';
import { PostService } from '../../../src/feature/post/post.service';
import { QueryPostsDto } from '../../../src/feature/post/dto/queryPost.dto';

describe('PostController', () => {
  let postController: PostController;
  const mockPostService = {
    incrementPostLikeCount: jest.fn(),
    QueryPostsDto: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PostController,
        {
          provide: PostService,
          useValue: mockPostService, // 모킹된 서비스 사용
        },
      ],
    }).compile();

    postController = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(postController).toBeDefined();
  });

  it('Patch incrementPostLikeCount Controller', async () => {
    const type: PostType = PostType.FACEBOOK;
    const postId: number = 1;

    mockPostService.incrementPostLikeCount(type, postId);

    expect(mockPostService.incrementPostLikeCount).toHaveBeenCalledWith(
      type,
      postId,
    );
  });

  it('Get getPosts', async () => {
    const mockRequest = { user: { id: 1 } };
    const testpostType: PostType = PostType.FACEBOOK;
    const testqueryPostsDto: QueryPostsDto = {
      hashtag: 'facebook',
      type: testpostType,
      search: '톰이',
    };
    jest.spyOn(postController, 'getPosts').mockResolvedValue([]);

    const result = await postController.getPosts(
      testqueryPostsDto,
      mockRequest,
    );

    expect(result).toBeTruthy();
  });
});
