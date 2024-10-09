import {
  Controller, Get, Param, Query,
} from '@nestjs/common';
import { BatchGenealogyReportingService } from './batch-genealogy-reporting.service';
import { SearchQueryDTO } from './batch-genealogy-reporting-search-query.dto';
import { BatchGenealogy } from './batch-genealogy-reporting.model';
import { BatchGenealogyDataDto } from './batch-genealogy-reporting.dto';
import { SearchResponseDTO } from './batch-genealogy-reporting-search-data.dto';
import { SearchResponse } from './batch-genealogy-reporting.interface';

@Controller()
export class BatchGenealogyReportingController {
  constructor(
    private readonly batchGenealogyReportingService: BatchGenealogyReportingService,
  ) {}

  @Get()
  async getBatchGenealogyData(
  @Param('plantId') plantId: string,
  @Query() query: BatchGenealogyDataDto,
  ): Promise<BatchGenealogy[] | []> {
    return this.batchGenealogyReportingService.getBatchGenealogyData(plantId, query);
  }

  @Get('materialIds')
  async getMaterialIds(
    @Param('plantId') plantId: string,
    @Query() query?: SearchQueryDTO,
  ): Promise<string[] | []> {
    return this.batchGenealogyReportingService.getMaterialIds(plantId, query);
  }

  @Get('batchIds')
  async getBatchIds(
    @Param('plantId') plantId: string,
    @Query() query?: SearchQueryDTO,
  ): Promise<string[] | []> {
    return this.batchGenealogyReportingService.getBatchIds(plantId, query);
  }

  @Get('levels')
  async getAllLevels(
    @Param('plantId') plantId: string,
  ): Promise<string[] | []> {
    return this.batchGenealogyReportingService.getAllLevels(plantId);
  }

  @Get('search')
  async getSearchData(
    @Param('plantId') plantId: string,
    @Query() query?: SearchResponseDTO,
  ): Promise<SearchResponse> {
    return this.batchGenealogyReportingService.getSearchData(plantId, query);
  }
}
