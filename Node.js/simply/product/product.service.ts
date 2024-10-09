import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';

@Injectable()
export class ProductService {
  attributes: string[] = [
    'productId',
    'productName',
    'plantId',
    'productImageUrl1',
    'productImageUrl2',
  ];

  constructor(@InjectModel(Product) private readonly product: typeof Product) {}

  async getProductsByPlantId(plantId: string): Promise<Product[] | []> {
    return this.product.findAll({
      where: { plantId },
      attributes: this.attributes,
    });
  }
}
