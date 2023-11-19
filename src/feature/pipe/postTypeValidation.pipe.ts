import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { PostType } from '../../enum/postType.enum';
import { ErrorType } from '../../enum/errorType.enum';

@Injectable()
export class PostTypeValidationPipe implements PipeTransform {
  transform(type: PostType, metadata: ArgumentMetadata) {
    const isValidPostType = [
      PostType.INSTAGRAM,
      PostType.FACEBOOK,
      PostType.TWITTER,
      PostType.THREADS,
    ].includes(type);

    if (!isValidPostType) {
      throw new NotFoundException(ErrorType.SNS_TYPE_NOT_FOUND);
    }

    return type;
  }
}
