import {
  Controller, Get, Query, Param,
} from '@nestjs/common';
import { YieldInsightsService } from './yieldInsights.service';
import { YieldInsightsImpactDto } from './yieldInsightsImpact.dto';
import { YieldInsightsDependenceGraphDto } from './yieldInsightsDependenceGraph.dto';
import { YieldInsightsImpactInterface } from './yieldInsights.interface';
import { YieldInsightsGraphInterface } from './yieldInsightsDependencGraph.interface';

@Controller()
export class YieldInsightsController {
  constructor(
    private readonly yieldInsightsService: YieldInsightsService,
  ) {}

  @Get('yield-impact')
  async getYieldImpact(
    @Param('plantId') plantId: string,
    @Query() params: YieldInsightsImpactDto,
  ): Promise<YieldInsightsImpactInterface[]> {
    return this.yieldInsightsService.getYieldImpact(params, plantId);
  }

  @Get('materialids')
  async getMaterialIds(
    @Param('plantId') plantId: string,
  ): Promise<string[] | []> {
    return this.yieldInsightsService.getMaterialIds(plantId);
  }

  @Get('dependence-graph')
  async getDependenceGraphData(
    @Param('plantId') plantId: string,
    @Query() params: YieldInsightsDependenceGraphDto,
  ): Promise<YieldInsightsGraphInterface[]> {
    return this.yieldInsightsService.getDependenceGraphData(
      plantId,
      params.parameterName,
      params.targetVariable,
    );
  }
}
