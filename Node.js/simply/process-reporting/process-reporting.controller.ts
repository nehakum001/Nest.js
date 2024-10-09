import {
  Controller, Get, Param, Query,
} from '@nestjs/common';
import { ProcessReportingService } from './process-reporting.service';
import { ProcessOverviewQueryDto } from './process-reporting.dto';
import { ProcessDetailsQueryDto } from './process-details-query.dto';
import { ProcessOverviewResponse, ProcessDetailsResponse } from './process-reporting.interface';

@Controller()
export class ProcessReportingController {
  constructor(private readonly processReportingService: ProcessReportingService) {}

  @Get('materialids')
  async getMaterialIds(
    @Param('plantId') plantId: string,
  ): Promise<string[] | []> {
    return this.processReportingService.getMaterialIds(plantId);
  }

  @Get('overview')
  async getProcessOverview(
    @Param('plantId') plantId: string,
    @Query() query: ProcessOverviewQueryDto,
  ): Promise<ProcessOverviewResponse> {
    return this.processReportingService.getProcessOverview(plantId, query);
  }

  @Get('details')
  async getProcessDetails(
    @Param('plantId') plantId: string,
    @Query() query: ProcessDetailsQueryDto,
  ): Promise<ProcessDetailsResponse> {
    return this.processReportingService.getProcessDetails(plantId, query);
  }
}
