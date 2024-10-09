import { Module } from '@nestjs/common';
import { Routes, RouterModule } from '@nestjs/core';
import { Sequelize } from 'sequelize-typescript';
import { PlantModule } from './plant/plant.module';
import { Plant } from './plant/plant.model';
import { ProductModule } from './product/product.module';
import { ProcessModule } from './process/process.module';
import { ProcessReportingModule } from './process-reporting/process-reporting.module';
import { YieldInsightsModule } from './yieldInsights-reporting/yieldInsights.module';
import { Product } from './product/product.model';
import { Process } from './process/process.model';
import { MasterML } from './process-reporting/process-reporting.model';
import { ShapResult } from './yieldInsights-reporting/yieldInsights.model';
import { BatchGenealogyReportingModule } from './batch-genealogy-reporting/batch-genealogy-reporting.module';
import { BatchGenealogy } from './batch-genealogy-reporting/batch-genealogy-reporting.model';
import { VdrModule } from './vdr/vdr.module';

const routes: Routes = [
  {
    path: '/vdr',
    module: VdrModule,
  },
  {
    path: '/plants',
    module: PlantModule,
    children: [
      {
        path: '/:plantId/products',
        module: ProductModule,
        children: [
          {
            path: '/:productId/processes',
            module: ProcessModule,
          },
        ],
      },
      {
        path: '/:plantId/process-reporting',
        module: ProcessReportingModule,
      },
      {
        path: '/:plantId/yield-insights',
        module: YieldInsightsModule,
      },
      {
        path: '/:plantId/batch-genealogy-reporting',
        module: BatchGenealogyReportingModule,
      },
    ],
  },
];
@Module({
  imports: [
    RouterModule.register(routes),
    VdrModule,
    PlantModule,
    ProductModule,
    ProcessModule,
    ProcessReportingModule,
    YieldInsightsModule,
    BatchGenealogyReportingModule,
  ],
})
export class SimplyModule {
  constructor(private sequelize: Sequelize) {
    sequelize.addModels([
      Plant,
      Product,
      Process,
      MasterML,
      ShapResult,
      BatchGenealogy,
    ]);
  }
}
