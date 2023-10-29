import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../../entity/user.entity';
import { AuthCode } from '../../entity/authCode.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserLib } from './user.lib';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuthCode])],
  providers: [UserService, UserLib],
  controllers: [UserController],
  exports: [UserLib],
})
export class UserModule {}
