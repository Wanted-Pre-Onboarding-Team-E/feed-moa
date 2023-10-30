import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './feature/user/user.module';
import { PostModule } from './feature/post/post.module';
import { StatisticsModule } from './feature/statistics/statistics.module';
import { AuthModule } from './feature/auth/auth.module';

import { User } from './entity/user.entity';
import { Post } from './entity/post.entity';
import { AuthCode } from './entity/authCode.entity';
import { Hashtag } from './entity/hashtag.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Post, Hashtag, AuthCode],
      synchronize: false, // 개발환경(DB 만들고 false로 변경하기)
      logging: true,
      keepConnectionAlive: true,
    }),
    PostModule,
    UserModule,
    StatisticsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
