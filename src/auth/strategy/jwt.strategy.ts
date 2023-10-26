import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UserLib } from '../../feature/user/user.lib';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userLib: UserLib) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { id: number; username: string }) {
    const user = this.userLib.getById(payload.id);

    if (!user) {
      throw new UnauthorizedException('사용자가 존재하지 않습니다.');
    }
    return user; // NOTE: req.user에 User 객체를 붙임
  }
}
