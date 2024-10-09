import { IsNotEmpty, IsString } from 'class-validator';

export class BatchGenealogyDataDto {
  @IsNotEmpty()
  @IsString()
  level: string;

  @IsNotEmpty()
  @IsString()
  movementType: string;
}
