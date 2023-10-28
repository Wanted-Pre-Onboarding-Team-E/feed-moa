import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../entity/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
