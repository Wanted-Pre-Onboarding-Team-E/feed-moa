import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsDTO } from './dto/statistics.dto';
import { JwtAuthGuard } from '../auth/guard/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  getStatistics(@Query() statisticsDTO: StatisticsDTO, @Req() req) {
    if (!statisticsDTO.hashtag) {
      statisticsDTO.hashtag = req.user.username;
    }
    if (statisticsDTO.type === 'date') {
      return this.statisticsService.getStatisticsByDate(statisticsDTO);
    }
    if (statisticsDTO.type === 'hour') {
      return this.statisticsService.getStatisticsByHour(statisticsDTO);
    }
  }
}
