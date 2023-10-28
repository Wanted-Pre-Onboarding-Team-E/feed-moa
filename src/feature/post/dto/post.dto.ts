import { IsEnum, IsNumber } from 'class-validator';
import { PostType } from 'src/enum/postType.enum';

export class PostShareDto {
  @IsNumber()
  id!: number;

  @IsEnum(PostType)
  type!: PostType;
}
