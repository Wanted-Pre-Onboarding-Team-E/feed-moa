import { IsNotEmpty } from 'class-validator';

export class StatisticsDTO {
  hashtag: string;

  value: 'count' | 'view_count' | 'like_count' | 'share_count';

  @IsNotEmpty()
  type: 'date' | 'hour';

  start: string;

  end: string;
}
