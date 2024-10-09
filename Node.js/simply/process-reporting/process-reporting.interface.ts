import { MasterML } from './process-reporting.model';

export interface ProcessOverviewResponse {
  batchIds: string | null;
  materialIds: string | null;
  stages: string | null;
  kind: string;
  startDate: string;
  endDate: string;
  batchCount: number;
  averageActivityCoefficientPercent: number;
  averageMassYieldPercent: number;
  averageOverallActivityYieldPercent: number;
  rows: MasterML[] | any[];
}

export interface ProcessOverviewFeatureNames {
  WET: string[];
  DRY: string[];
}

export interface ProcessOverviewWhereClause {
  plantId: string;
  featureName?: string[];
  featureValue: object;
  manufactureDate: string[] | any;
  materialId?: string[];
  batchId?: string[];
  stage?: string[];
}

export type ProcessDetailsFeatureNames = ProcessOverviewFeatureNames
export type ProcessDetailsResponse = ProcessOverviewResponse
export type ProcessDetailsWhereClause = ProcessOverviewWhereClause
