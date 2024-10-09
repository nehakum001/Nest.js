import { IsOptional, IsString } from 'class-validator';

export class YieldInsightsImpactDto {
  @IsOptional()
  @IsString()
  materialId: string | null = null;

  @IsString()
  metrics: string;

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string;
}
