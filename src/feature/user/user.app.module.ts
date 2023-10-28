import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { User } from '../../entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserLib } from './user.lib';

@Module({
  imports: [
    ConfigModule.forRoot(), // TODO: configuration 파일 형식으로 정리 필요해보임
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' }, // 24시간
    }),
  ],
  providers: [UserService, UserRepository, UserLib],
  controllers: [UserController],
  exports: [UserLib],
})
export class UserModule {}
