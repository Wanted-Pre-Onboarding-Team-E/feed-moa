import { Test, TestingModule } from '@nestjs/testing';
import { PostType } from 'src/enum/postType.enum';
import { ApiResult } from 'src/feature/custom/apiResult';
import { PostController } from 'src/feature/post/post.controller';
import { PostService } from 'src/feature/post/post.service';

describe('PostController', () => {
  let postController: PostController;

  const mockPostService = {
    getPostAndAddViewCountById: jest.fn(),
    updatePostShareCountById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostController,
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    postController = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(postController).toBeDefined();
  });

  it('getPostAndAddViewCountById()', () => {
    const PostObject = {
      id: 2,
      type: 'instagram',
      title: '여행은 하와이로',
      content: '휴양지로 여행가고 싶을땐 하와이!',
      viewCount: 1,
      likeCount: 0,
      shareCount: 0,
      createdAt: '2023-10-29T02:25:42.000Z',
      updatedAt: '2023-10-30T13:40:58.000Z',
      hashtags: [],
    };

    const getPostAndAddViewCountById = jest
      .spyOn(mockPostService, 'getPostAndAddViewCountById')
      .mockResolvedValue(PostObject);

    const response = postController.getPostAndAddViewCountById(1);

    expect(getPostAndAddViewCountById).toHaveBeenCalledWith(PostObject);
    expect(response).toEqual(PostObject);
  });

  it('updatePostShareCountById()', () => {
    const expectedApiResponse: ApiResult<void> = { success: true };
    const updatePostShareCountById = jest
      .spyOn(mockPostService, 'updatePostShareCountById')
      .mockResolvedValue(true);

    const response = postController.updatePostShareCountById(
      1,
      PostType.INSTAGRAM,
    );

    expect(updatePostShareCountById).toEqual(expectedApiResponse);
    expect(response).toEqual(expectedApiResponse);
  });
});
