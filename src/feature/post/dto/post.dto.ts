import { IsEnum } from 'class-validator';
import { PostType } from 'src/enum/postType.enum';

export class PostShareDto {
  @IsEnum(PostType)
  type!: PostType;
}
