import { PostType } from 'src/enum/postType.enum';

export class CreatePostDto {
  type: PostType;
  title: string;
  content: string;
}
