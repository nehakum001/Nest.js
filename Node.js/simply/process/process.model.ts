import {
  Column,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from '../product/product.model';

@Table({ tableName: 'SIMPLY_PROCESS' })
export class Process extends Model {
  @Column({ field: 'PROCESS_ID', primaryKey: true })
  processId: string;

  @Column({ field: 'PROCESS_NAME' })
  processName: string;

  @Column({ field: 'PROCESS_DESCRIPTION' })
  processDescription: string;

  @Column({ field: 'PROCESS_IMAGE_URL' })
  processImageUrl: string;

  @ForeignKey(() => Product)
  @Column({ field: 'PRODUCT_ID' })
  productId: string;

  @BelongsTo(() => Product)
  product: Product;

  @Column({ field: 'CREATE_DATE' })
  createDate: Date;

  @Column({ field: 'UPDATE_DATE' })
  updateDate: Date;
}
