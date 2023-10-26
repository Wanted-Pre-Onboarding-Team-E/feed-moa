import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../../entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      // TODO: 환경변수로 분리
      secret: 'team_e',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
