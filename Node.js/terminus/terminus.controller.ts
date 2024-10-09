import {
  MemoryHealthIndicator,
  HealthCheck,
  HealthCheckService,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';

@Controller()
export class TerminusController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get('/health')
  @HealthCheck()
  healthCheck() {
    return this.health.check([
      async () =>
        this.memory.checkHeap(
          'MemoryHeap',
          this.configService.get('TERMINUS_HEAP_THRESHOLD'),
        ),
      async () =>
        this.memory.checkRSS(
          'MemoryRSS',
          this.configService.get('TERMINUS_RSS_THRESHOLD'),
        ),
    ]);
  }
}
