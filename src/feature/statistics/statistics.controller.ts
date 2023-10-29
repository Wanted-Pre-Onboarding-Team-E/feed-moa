import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsDTO } from './dto/statistics.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  getStatistics(@Query() statisticsDTO: StatisticsDTO) {
    if (statisticsDTO.type === 'date') {
      return this.statisticsService.getStatisticsByDate(statisticsDTO);
    }
    if (statisticsDTO.type === 'hour') {
      return this.statisticsService.getStatisticsByHour(statisticsDTO);
    }
  }
}
