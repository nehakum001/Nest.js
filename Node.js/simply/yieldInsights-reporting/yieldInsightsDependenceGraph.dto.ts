import { IsNotEmpty } from 'class-validator';

export class YieldInsightsDependenceGraphDto {
  @IsNotEmpty()
  parameterName: string;

  @IsNotEmpty()
  targetVariable: string;
}
