import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { User } from '../../entity/user.entity';
import { AuthCode } from '../../entity/authCode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuthCode])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
