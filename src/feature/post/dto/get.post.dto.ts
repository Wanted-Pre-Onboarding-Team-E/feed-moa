import { PostType } from 'src/enum/postType.enum';

export class GetPostsDto {
  hashtag: string;
  type: PostType;
  order_by: string;
  search_by: string;
  search: string;
  page_count: number;
  page: number;
}
