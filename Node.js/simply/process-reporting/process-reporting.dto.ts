import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsArray,
  IsString,
  IsIn,
} from 'class-validator';

export class ProcessOverviewQueryDto {
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsOptional()
  batchIds: string[] | null = null;

  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsOptional()
  materialIds: string[] | null = null;

  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsOptional()
  stages: string[] | null = null;

  @IsString()
  @IsIn(['WET', 'DRY'])
  @IsOptional()
  kind = 'DRY';

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate: Date = new Date(new Date().setDate(new Date().getDate() - 30));

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate: Date = new Date();
}
