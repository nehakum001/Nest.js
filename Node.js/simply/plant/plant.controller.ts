import { Controller, Get } from '@nestjs/common';
import { PlantService } from './plant.service';
import { Plant } from './plant.model';

@Controller()
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @Get()
  async getPlants(): Promise<Plant[] | []> {
    return this.plantService.getPlants();
  }
}
