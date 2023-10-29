import { PostLib } from '../post/post.lib';
import { Injectable } from '@nestjs/common';
import { StatisticsDTO } from './dto/statistics.dto';

@Injectable()
export class StatisticsService {
  constructor(private readonly postLib: PostLib) {}

  async getStatisticsByDate(statisticsDTO: StatisticsDTO) {
    return this.postLib.getStatisticsByDate(statisticsDTO);
  }

  async getStatisticsByHour(statisticsDTO: StatisticsDTO) {
    return this.postLib.getStatisticsByHour(statisticsDTO);
  }
}
