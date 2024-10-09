import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BatchGenealogyReportingController } from './batch-genealogy-reporting.controller';
import { BatchGenealogyReportingService } from './batch-genealogy-reporting.service';
import { BatchGenealogy } from './batch-genealogy-reporting.model';

@Module({
  imports: [SequelizeModule.forFeature([BatchGenealogy])],
  controllers: [BatchGenealogyReportingController],
  providers: [BatchGenealogyReportingService],
})
export class BatchGenealogyReportingModule {}
