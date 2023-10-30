import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../../entity/user.entity';
import { AuthCode } from '../../entity/authCode.entity';
import { UserLib } from './user.lib';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuthCode])],
  providers: [UserLib],
  exports: [UserLib],
})
export class UserModule {}
