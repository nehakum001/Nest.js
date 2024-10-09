import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { YieldInsightsController } from './yieldInsights.controller';
import { YieldInsightsService } from './yieldInsights.service';
import { ShapResult } from './yieldInsights.model';

@Module({
  imports: [SequelizeModule.forFeature([ShapResult])],
  controllers: [YieldInsightsController],
  providers: [YieldInsightsService],
})
export class YieldInsightsModule {}
