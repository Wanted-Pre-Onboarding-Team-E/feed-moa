import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../../entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserLib } from './user.lib';

import { User } from '../../entity/user.entity';
import { AuthCode } from '../../entity/authCode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuthCode])],
  providers: [UserService, UserLib],
  controllers: [UserController],
  exports: [UserLib],
})
export class UserModule {}
