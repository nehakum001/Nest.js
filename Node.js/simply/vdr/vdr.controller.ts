import { Controller, Get } from '@nestjs/common';
import { VdrService } from './vdr.service';

@Controller()
export class VdrController {
  constructor(private readonly vdrService: VdrService) {}

  @Get('node-fetch')
  async getSiteStrainCampaignsWithNodeFetch(): Promise<any> {
    return this.vdrService.getSiteStrainCampaignsWithNodeFetch();
  }

  @Get('http-module')
  async getSiteStrainCampaignsWithAxiosHttpModule(): Promise<any> {
    return this.vdrService.getSiteStrainCampaignsWithAxiosHttpModule();
  }
}
