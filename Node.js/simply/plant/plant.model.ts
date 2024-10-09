import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'SIMPLY_PLANT' })
export class Plant extends Model {
  @Column({ field: 'PLANT_ID', primaryKey: true })
  plantId: string;

  @Column({ field: 'PLANT_NAME' })
  plantName: string;

  @Column({ field: 'PLANT_FLAG_IMAGE_URL' })
  plantFlagImageUrl: string;

  @Column({ field: 'PLANT_IMAGE_URL' })
  plantImageUrl: string;

  @Column({ field: 'PLANT_LOCATION' })
  plantLocation: string;

  @Column({ field: 'CREATE_DATE' })
  createDate: Date;

  @Column({ field: 'UPDATE_DATE' })
  updateDate: Date;
}
