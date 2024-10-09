import { Controller, Get, Param } from '@nestjs/common';
import { Process } from './process.model';
import { ProcessService } from './process.service';

@Controller()
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @Get()
  async getProcesses(
    @Param('plantId') plantId: string,
    @Param('productId') productId: string,
  ): Promise<Process[] | []> {
    return this.processService.getProcesses(plantId, productId);
  }
}
