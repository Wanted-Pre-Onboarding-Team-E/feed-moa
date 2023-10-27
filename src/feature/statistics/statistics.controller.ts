import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsDTO } from './dto/statistics.dto';

@Controller('posts/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  getStatistics(@Query() query: StatisticsDTO) {
    if (!query.start) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // 6일 빼기
      oneWeekAgo.setHours(oneWeekAgo.getHours() - 23); // 23시간 빼기
      oneWeekAgo.setMinutes(oneWeekAgo.getMinutes() - 59);
      query.start = oneWeekAgo.toISOString();
    }

    if (!query.end) {
      query.end = new Date().toISOString();
    }

    if (!query.hashtag) {
      query.hashtag = '태그';
    }

    if (!query.value) {
      query.value = 'count';
    }
    if (query.type === 'date') {
      return this.statisticsService.getStatisticsByDate(query);
    }
    if (query.type === 'hour') {
      return this.statisticsService.getStatisticsByHour(query);
    }
  }
}
