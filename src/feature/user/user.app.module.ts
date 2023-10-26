import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../../entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserLib } from './user.lib';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      // TODO: 환경변수로 분리
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }, // 7일
    }),
  ],
  providers: [UserService, UserRepository, UserLib],
  controllers: [UserController],
  exports: [UserLib],
})
export class UserModule {}
