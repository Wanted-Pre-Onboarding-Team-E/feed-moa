import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

import { UserLib } from '../feature/user/user.lib';
import { UserRepository } from '../feature/user/repository/user.repository';
import { User } from '../entity/user.entity';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User])],
  providers: [AuthService, JwtStrategy, UserLib, UserRepository],
})
export class AuthModule {}
