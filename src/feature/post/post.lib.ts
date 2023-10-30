import { Injectable } from '@nestjs/common';
import { PostService } from './post.service';
import { StatisticsDTO } from '../statistics/dto/statistics.dto';

@Injectable()
export class PostLib {
  constructor(private readonly postService: PostService) {}

  getStatisticsByDate(statisticsDTO: StatisticsDTO) {
    return this.postService.getStatisticsByDate(statisticsDTO);
  }

  getStatisticsByHour(statisticsDTO: StatisticsDTO) {
    return this.postService.getStatisticsByHour(statisticsDTO);
  }
}
