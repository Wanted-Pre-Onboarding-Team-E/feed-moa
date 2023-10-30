import { PostLib } from '../post/post.lib';
import { Injectable } from '@nestjs/common';
import { StatisticsDTO } from './dto/statistics.dto';
import { StatisticsValueType } from '../../enum/statisticsValueType.enum';

@Injectable()
export class StatisticsService {
  constructor(private readonly postLib: PostLib) {}

  setDefaultValue(statisticsDTO: StatisticsDTO) {
    if (!statisticsDTO.value) {
      statisticsDTO.value = StatisticsValueType.COUNT;
    }

    if (!statisticsDTO.end) {
      statisticsDTO.end = new Date().toISOString();
    }

    if (statisticsDTO.type === 'date' && !statisticsDTO.start) {
      const thirtyDaysAgo = new Date(statisticsDTO.end);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
      statisticsDTO.start = thirtyDaysAgo.toISOString();
    }

    if (statisticsDTO.type === 'hour' && !statisticsDTO.start) {
      const oneWeekAgo = new Date(statisticsDTO.end);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 5);
      oneWeekAgo.setHours(oneWeekAgo.getHours() - 23);
      oneWeekAgo.setMinutes(oneWeekAgo.getMinutes() - 59);
      statisticsDTO.start = oneWeekAgo.toISOString();
    }
  }

  async getStatisticsByDate(statisticsDTO: StatisticsDTO) {
    this.setDefaultValue(statisticsDTO);
    return this.postLib.getStatisticsByDate(statisticsDTO);
  }

  async getStatisticsByHour(statisticsDTO: StatisticsDTO) {
    this.setDefaultValue(statisticsDTO);
    return this.postLib.getStatisticsByHour(statisticsDTO);
  }
}
