export interface YieldInsightsGraphInterface {
  variable: string;
  materialId: string;
  batchId: string;
  plantId: string;
  shap: number;
  observedValue: number;
  manufactureDate: string;
  isPure: boolean;
  targetVariable: string;
}
