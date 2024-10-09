import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.model';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProductsByPlantId(
    @Param('plantId') plantId: string,
  ): Promise<Product[] | []> {
    return this.productService.getProductsByPlantId(plantId);
  }
}
