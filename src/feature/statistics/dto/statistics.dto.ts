import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { StatisticsValueType } from '../../../enum/statisticsValueType.enum';

export class StatisticsDTO {
  @IsOptional()
  @IsString()
  hashtag?: string;

  @IsOptional()
  @IsEnum(StatisticsValueType)
  value?: StatisticsValueType;

  @IsNotEmpty()
  type!: 'date' | 'hour';

  @IsOptional()
  @IsDateString()
  start?: string;

  @IsOptional()
  @IsDateString()
  end?: string;
}
