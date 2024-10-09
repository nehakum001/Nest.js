import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProcessReportingController } from './process-reporting.controller';
import { ProcessReportingService } from './process-reporting.service';
import { MasterML } from './process-reporting.model';

@Module({
  imports: [SequelizeModule.forFeature([MasterML])],
  controllers: [ProcessReportingController],
  providers: [ProcessReportingService],
})
export class ProcessReportingModule {}
