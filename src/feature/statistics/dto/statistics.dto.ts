import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { StatisticsValueType } from '../../../enum/statisticsValueType.enum';

export class StatisticsDTO {
  @IsOptional()
  @IsString()
  hashtag?: string;

  @IsOptional()
  value?: StatisticsValueType;

  @IsNotEmpty()
  type!: 'date' | 'hour';

  @IsOptional()
  start?: string;

  @IsOptional()
  end?: string;
}
