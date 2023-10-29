import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
} from '@nestjs/common';
import { HttpStatusCode } from 'src/enum/httpStatusCode.enum';
import { PostType } from 'src/enum/postType.enum';
import { ErrorMessage } from 'src/error/error.enum';

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
