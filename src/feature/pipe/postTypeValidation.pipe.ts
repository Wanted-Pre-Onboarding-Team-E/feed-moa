import {
  ArgumentMetadata,
  HttpException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { HttpStatusCode } from '../../enum/httpStatusCode.enum';
import { PostType } from '../../enum/postType.enum';
import { ErrorMessage } from '../../error/error.enum';

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
      throw new HttpException(
        ErrorMessage.typeNotFound,
        HttpStatusCode.notFound,
      );
    }

    return type;
  }
}
