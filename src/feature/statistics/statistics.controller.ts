import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsDTO } from './dto/statistics.dto';

@Controller('posts/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  getStatistics(@Query() query: StatisticsDTO) {
    if (query.type === 'date') {
      return this.statisticsService.getStatisticsByDate(query);
    }
    if (query.type === 'hour') {
      return this.statisticsService.getStatisticsByHour(query);
    }
  }
}
