import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './feature/user/user.app.module';
import { PostModule } from './feature/post/post.app.module';
import { User } from './entity/user.entity';
import { Post } from './entity/post.entity';
import { Hashtag } from './entity/hashtag.entity';
import { StatisticsModule } from './feature/statistics/statistics.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Post, Hashtag],
      synchronize: true, // 개발환경(DB 만들고 false로 변경하기)
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
