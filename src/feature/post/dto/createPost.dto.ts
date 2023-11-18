import { IsString } from 'class-validator';
import { PostType } from '../../../enum/postType.enum';

export class CreatePostDto {
  @IsString()
  type!: PostType;

  @IsString()
  title!: string;

  @IsString()
  content!: string;
}
