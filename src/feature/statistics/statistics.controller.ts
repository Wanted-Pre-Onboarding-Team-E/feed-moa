import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsDTO } from './dto/statistics.dto';
import { JwtAuthGuard } from '../auth/guard/jwtAuth.guard';

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
        message: '일자별 통계 조회에 성공하였습니다.',
        data: this.statisticsService.getStatisticsByDate(statisticsDTO),
      };
    }
    if (statisticsDTO.type === 'hour') {
      return {
        message: '시간별 통계 조회에 성공하였습니다.',
        data: this.statisticsService.getStatisticsByHour(statisticsDTO),
      };
    }
  }
}
