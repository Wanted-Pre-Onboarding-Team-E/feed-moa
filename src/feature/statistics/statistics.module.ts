import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../entity/post.entity';
import { Hashtag } from '../../entity/hashtag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Hashtag])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
