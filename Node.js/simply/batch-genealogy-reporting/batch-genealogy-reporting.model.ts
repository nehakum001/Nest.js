import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'INT1_BATCH_GENEALOGY' })
export class BatchGenealogy extends Model {
  @Column({ field: 'BATCH_ID' })
  batchId: string;

  @Column({ field: 'MATERIAL_ID' })
  materialId: string;

  @Column({ field: 'PLANT_ID' })
  plantId: string;

  @Column({ field: 'LEVEL' })
  level: string;

  @Column({ field: 'TREE_ID' })
  treeId: string;

  @Column({ field: 'PROCESS_ORDER_NUMBER' })
  processOrderNumber: string;

  @Column({ field: 'MANUFACTURE_DATE' })
  manufactureDate: Date;

  @Column({ field: 'MATERIAL_DESCRIPTION' })
  materialDescription: string;

  @Column({ field: 'QUANTITY' })
  quantity: string;

  @Column({ field: 'UNIT_OF_MEASURE' })
  unitOfMeasure: string;

  @Column({ field: 'MOVEMENT_TYPE' })
  movementType: string;

  @Column({ field: 'BATCH_GENEALOGY_PLANT_ID' })
  batchGenealogyPlantId: string;
}
