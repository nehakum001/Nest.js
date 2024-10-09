import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Plant } from './plant.model';

@Injectable()
export class PlantService {
  attributes: string[] = [
    'plantId',
    'plantName',
    'plantFlagImageUrl',
    'plantImageUrl',
  ];

  constructor(@InjectModel(Plant) private readonly plant: typeof Plant) {}

  async getPlants(): Promise<Plant[] | []> {
    return this.plant.findAll({
      attributes: this.attributes,
    });
  }
}
