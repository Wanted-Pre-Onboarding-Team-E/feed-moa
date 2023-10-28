import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../feature/user/user.module';
import { AuthService } from './auth.service';
import { AuthCodeRepository } from './repository/authCode.repository';
import { AuthCode } from '../entity/authCode.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([AuthCode])],
  providers: [AuthService, AuthCodeRepository],
})
export class AuthModule {}
