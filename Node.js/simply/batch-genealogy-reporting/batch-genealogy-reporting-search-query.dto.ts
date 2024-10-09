import { IsOptional, IsString } from 'class-validator';

export class SearchQueryDTO {
  @IsOptional()
  @IsString()
  materialId: string | null;

  @IsOptional()
  @IsString()
  batchId: string | null;
}
