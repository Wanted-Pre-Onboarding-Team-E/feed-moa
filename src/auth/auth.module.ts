import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

import { UserModule } from '../feature/user/user.app.module';

@Module({
  imports: [PassportModule, UserModule],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
