import {
  Column, Model, Table, DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'MASTER_ML' })
export class MasterML extends Model {
  @Column({ field: 'BATCH_ID', type: DataType.STRING })
  batchId: string;

  @Column({ field: 'FEATURE_NAME', type: DataType.STRING })
  featureName: string;

  @Column({ field: 'FEATURE_VALUE', type: DataType.STRING })
  featureValue: string;

  @Column({ field: 'MATERIAL_ID', type: DataType.STRING })
  materialId: string;

  @Column({ field: 'PLANT_ID', type: DataType.STRING })
  plantId: string;

  @Column({ field: 'STAGE', type: DataType.STRING })
  stage: string;

  @Column
  activityCoefficientPercent: number; // aggregated field

  @Column
  massYieldPercent: number; // aggregated field

  @Column
  overallActivityYieldPercent: number; // aggregated field

  @Column({ field: 'MANUFACTURE_DATE', type: DataType.STRING })
  manufactureDate: string; // This is a VARCHAR in the DB

  @Column
  averageActivityCoefficientPercent: number; // aggregated field

  @Column
  averageMassYieldPercent: number; // aggregated field

  @Column
  averageOverallActivityYieldPercent: number; // aggregated field

  @Column
  weightedAntiCoag: number; // aggregated field

  @Column
  antiXa: number; // aggregated field

  @Column
  antiIiaSurSec: number; // aggregated field
}
