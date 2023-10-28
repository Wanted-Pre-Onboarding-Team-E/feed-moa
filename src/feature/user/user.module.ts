import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { AuthCodeRepository } from '../../auth/repository/authCode.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, AuthService, UserRepository, AuthCodeRepository],
  controllers: [UserController],
})
export class UserModule {}
