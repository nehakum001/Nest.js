import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlantController } from './plant.controller';
import { PlantService } from './plant.service';
import { Plant } from './plant.model';

@Module({
  imports: [SequelizeModule.forFeature([Plant])],
  controllers: [PlantController],
  providers: [PlantService],
})
export class PlantModule {}
