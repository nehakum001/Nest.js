import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
} from 'class-validator';
import { BatchGenealogyConstants } from '../../config/batchGenealogyConstants';

export class SearchResponseDTO {
  @IsOptional()
  @IsString()
  @IsIn([BatchGenealogyConstants.outputNode, BatchGenealogyConstants.inputNode])
  movementType: string | null;

  @IsNotEmpty()
  @IsString()
  materialId: string | null;

  @IsNotEmpty()
  @IsString()
  batchId: string | null;
}
