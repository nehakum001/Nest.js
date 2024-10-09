import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Process } from './process.model';
import { Plant } from '../plant/plant.model';
import { Product } from '../product/product.model';

@Injectable()
export class ProcessService {
  attributes: string[] = [
    'processId',
    'processName',
    'processDescription',
    'processImageUrl',
    'productId',
  ];

  constructor(@InjectModel(Process) private readonly process: typeof Process) {}

  async getProcesses(
    plantId: string,
    productId: string,
  ): Promise<Process[] | []> {
    return this.process.findAll({
      where: { productId },
      include: [
        {
          model: Product,
          where: { productId },
          attributes: [],
          include: [
            {
              model: Plant,
              attributes: [],
              where: { plantId },
            },
          ],
        },
      ],
      attributes: this.attributes,
    });
  }
}
