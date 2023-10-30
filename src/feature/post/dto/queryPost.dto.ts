import { IsNumber, IsString, IsOptional } from 'class-validator';
import { PostType } from 'src/enum/postType.enum';

export class QueryPostsDto {
  @IsString()
  @IsOptional()
  hashtag?: string;

  @IsString()
  @IsOptional()
  type?: PostType;

  @IsString()
  @IsOptional()
  orderBy?: string;

  @IsString()
  @IsOptional()
  order?: string;

  @IsString()
  @IsOptional()
  searchBy?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  pageCount?: number;

  @IsNumber()
  @IsOptional()
  page?: number;
}
