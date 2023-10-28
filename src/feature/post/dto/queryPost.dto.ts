import { IsNumber, IsString } from 'class-validator';
import { PostType } from 'src/enum/postType.enum';

export class QueryPostsDto {
  @IsString()
  hashtag: string;

  @IsString()
  type: PostType;

  @IsString()
  orderBy: string;

  @IsString()
  order: string;

  @IsString()
  searchBy: string;

  @IsString()
  search: string;

  @IsNumber()
  pageCount: number;

  @IsNumber()
  page: number;
}
