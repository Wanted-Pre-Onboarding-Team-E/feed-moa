import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsDTO } from './dto/statistics.dto';
import { JwtAuthGuard } from '../auth/guard/jwtAuth.guard';
import { SuccessType } from '../../enum/successType.enum';

@UseGuards(JwtAuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/')
  getStatistics(@Query() statisticsDTO: StatisticsDTO, @Req() req) {
    if (!statisticsDTO.hashtag) {
      statisticsDTO.hashtag = req.user.username;
    }
    if (statisticsDTO.type === 'date') {
      return {
        message: SuccessType.STATISTIC_DAYS_GET,
        data: this.statisticsService.getStatisticsByDate(statisticsDTO),
      };
    }
    if (statisticsDTO.type === 'hour') {
      return {
        message: SuccessType.STATISTIC_TIME_GET,
        data: this.statisticsService.getStatisticsByHour(statisticsDTO),
      };
    }
  }
}
