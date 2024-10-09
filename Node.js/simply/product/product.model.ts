import {
  Column,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { Plant } from '../plant/plant.model';

@Table({ tableName: 'SIMPLY_PRODUCT' })
export class Product extends Model {
  @Column({ field: 'PRODUCT_ID', primaryKey: true })
  productId: string;

  @Column({ field: 'PRODUCT_NAME' })
  productName: string;

  @ForeignKey(() => Plant)
  @Column({ field: 'PLANT_ID' })
  plantId: string;

  @BelongsTo(() => Plant)
  plant: Plant;

  @Column({ field: 'PRODUCT_IMAGE_URL1' })
  productImageUrl1: string;

  @Column({ field: 'PRODUCT_IMAGE_URL2' })
  productImageUrl2: string;

  @Column({ field: 'CREATE_DATE' })
  createDate: Date;

  @Column({ field: 'UPDATE_DATE' })
  updateDate: Date;
}
