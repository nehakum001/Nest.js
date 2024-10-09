import { Module } from '@nestjs/common';
import { VdrController } from './vdr.controller';
import { VdrService } from './vdr.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [VdrController],
  providers: [VdrService],
})
export class VdrModule {}
