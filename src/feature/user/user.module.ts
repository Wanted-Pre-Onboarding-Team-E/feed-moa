import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { User } from '../../entity/user.entity';
import { AuthCode } from '../../entity/authCode.entity';

import { UserRepository } from './repository/user.repository';
import { AuthCodeRepository } from '../../auth/repository/authCode.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuthCode])],
  providers: [UserService, UserRepository, AuthCodeRepository],
  controllers: [UserController],
})
export class UserModule {}
