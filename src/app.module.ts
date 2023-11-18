import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './feature/user/user.module';
import { PostModule } from './feature/post/post.module';
import { StatisticsModule } from './feature/statistics/statistics.module';
import { AuthModule } from './feature/auth/auth.module';

import { User } from './entity/user.entity';
import { Post } from './entity/post.entity';
import { Hashtag } from './entity/hashtag.entity';
import { AuthCode } from './entity/authCode.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: 'localhost',
          port: parseInt(configService.get<string>('DB_PORT')),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [User, Post, Hashtag, AuthCode],
          synchronize: false,
          logging: configService.get<string>('NODE_ENV') === 'local',
        };
      },
    }),
    PostModule,
    UserModule,
    StatisticsModule,
    AuthModule,
  ],
})
export class AppModule {}
