import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'SHAP_RESULT' })
export class ShapResult extends Model {
  @Column({ field: 'BATCH_ID' })
  batchId: string;

  @Column({ field: 'MATERIAL_ID' })
  materialId: string;

  @Column({ field: 'PLANT_ID' })
  plantId: string;

  @Column({ field: 'MANUFACTURE_DATE' })
  manufactureDate: string;

  @Column({ field: 'VARIABLE' })
  variable: string;

  @Column({ field: 'SHAP' })
  shap: string;

  @Column({ field: 'OBSERVED_VALUE' })
  observedValue: string;

  @Column({ field: 'SHAP_LOCAL_INCREMENT' })
  shapLocalIncrement: string;

  @Column({ field: 'SHAP_GLOBAL_INCREMENT' })
  shapGlobalIncrement: string;

  @Column({ field: 'SHAP_GLOBAL_INCREMENT_ABS' })
  shapGlobalIncrementAbs: string;

  @Column({ field: 'STAGE' })
  stage: string;

  @Column({ field: 'TARGET_VARIABLE' })
  targetVariable: string;

  @Column({ field: 'EXECUTION_TIME' })
  executionTime: string;

  @Column({ field: 'USED_FEATURES' })
  usedFeatures: string;
}
