import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorType } from '../../../enum/errorType.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException(ErrorType.AUTH_INVALID_TOKEN);
    }
    return user;
  }
}
