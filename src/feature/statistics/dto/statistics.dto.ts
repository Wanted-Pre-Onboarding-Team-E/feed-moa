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
  @IsEnum
  value?: StatisticsValueType;

  @IsNotEmpty()
  type!: 'date' | 'hour';

  @IsOptional()
  @IsDateString
  start?: string;

  @IsOptional()
  @IsDateString
  end?: string;
}
