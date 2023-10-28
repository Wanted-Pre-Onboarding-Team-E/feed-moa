import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsDTO } from './dto/statistics.dto';
import { StatisticsValueType } from '../../enum/statisticsValueType.enum';

@Controller('posts/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  getStatistics(@Query() statsParams: StatisticsDTO) {
    if (!statsParams.start) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // 6일 빼기
      oneWeekAgo.setHours(oneWeekAgo.getHours() - 23); // 23시간 빼기
      oneWeekAgo.setMinutes(oneWeekAgo.getMinutes() - 59);
      statsParams.start = oneWeekAgo.toISOString();
    }

    if (!statsParams.end) {
      statsParams.end = new Date().toISOString();
    }

    if (!statsParams.value) {
      statsParams.value = StatisticsValueType.COUNT;
    }
    if (statsParams.type === 'date') {
      return this.statisticsService.getStatisticsByDate(statsParams);
    }
    if (statsParams.type === 'hour') {
      return this.statisticsService.getStatisticsByHour(statsParams);
    }
  }
}
