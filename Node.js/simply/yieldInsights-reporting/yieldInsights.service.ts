import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { ShapResult } from './yieldInsights.model';
import { YieldInsightsImpactDto } from './yieldInsightsImpact.dto';
import { YieldInsightsImpactInterface } from './yieldInsights.interface';
import { YieldInsightsConstants } from '../../config/yieldInsightsConstants';
import { YieldInsightsGraphInterface } from './yieldInsightsDependencGraph.interface';
import { mergeArrays } from '../utils';
import { QueryConstants } from '../../config/queryConstants';

@Injectable()
export class YieldInsightsService {
  yieldInsightsImpactAttributes: any[] = [
    [YieldInsightsConstants.variable, YieldInsightsConstants.parameterName],
    [
      this.sequelize.fn(
        QueryConstants.absolute,
        this.sequelize.fn(
          QueryConstants.average,
          this.sequelize.col(YieldInsightsConstants.observesValue),
        ),
      ),
      YieldInsightsConstants.averageObservedValue,
    ],
    [
      this.sequelize.fn(
        QueryConstants.absolute,
        this.sequelize.fn(
          QueryConstants.average,
          this.sequelize.col(YieldInsightsConstants.shap),
        ),
      ),
      YieldInsightsConstants.averageContributionValue,
    ],
  ];

  materialIdAttributes: any[] = [
    [
      this.sequelize.fn(
        QueryConstants.distinct,
        this.sequelize.col(YieldInsightsConstants.materialId),
      ),
      'materialId',
    ],
  ];

  isPureQuery = `SELECT CASE WHEN sr2.feature_value = 1.0 THEN True ELSE False END AS isPure, 
      sr2.batch_id as batchId, sr2.material_id as materialId, sr2.plant_id as plantId
      FROM master_ml sr2
      WHERE feature_name = 'is_pure'
      AND EXISTS (SELECT 1 FROM (
      SELECT DISTINCT BATCH_ID, MATERIAL_ID, PLANT_ID
      FROM shap_result
      WHERE target_variable = :targetVariable AND variable = :parameterName AND plant_id = :plantId) 
      as sub
      WHERE sr2.BATCH_ID = sub.BATCH_ID 
      AND sr2.MATERIAL_ID = sub.MATERIAL_ID 
      AND sr2.PLANT_ID = sub.PLANT_ID)`;

  constructor(
    private sequelize: Sequelize,
    @InjectModel(ShapResult) private readonly shapResult: typeof ShapResult,
  ) {}

  async getYieldImpact(
    params: YieldInsightsImpactDto,
    plantId: string,
  ): Promise<YieldInsightsImpactInterface[]> {
    const whereCondition: any = {
      PLANT_ID: plantId,
      EXECUTION_TIME: {
        [Op.eq]: this.sequelize.literal(
          '(SELECT MAX("EXECUTION_TIME") FROM "SHAP_RESULT")',
        ),
      },
    };

    if (params.startDate && params.endDate) {
      whereCondition[YieldInsightsConstants.manufactureDate] = {
        [Op.and]: [
          this.sequelize.where(
            this.sequelize.fn(
              QueryConstants.toDate,
              this.sequelize.fn(
                QueryConstants.replace,
                this.sequelize.col(YieldInsightsConstants.manufactureDate),
                '-',
                '',
              ),
              QueryConstants.dateFormate,
            ),
            '>=',
            params.startDate,
          ),
          this.sequelize.where(
            this.sequelize.fn(
              QueryConstants.toDate,
              this.sequelize.fn(
                QueryConstants.replace,
                this.sequelize.col(YieldInsightsConstants.manufactureDate),
                '-',
                '',
              ),
              QueryConstants.dateFormate,
            ),
            '<=',
            params.endDate,
          ),
        ],
      };
    }

    if (params.materialId) {
      whereCondition[YieldInsightsConstants.materialId] = params.materialId;
    }

    if (params.metrics) {
      whereCondition[YieldInsightsConstants.targetVariable] = params.metrics;
    }
    const result: ShapResult[] = await this.shapResult.findAll({
      where: whereCondition,
      attributes: this.yieldInsightsImpactAttributes,
      group: [YieldInsightsConstants.variable, YieldInsightsConstants.materialId],
    });
    const mappedResult: any[] = result.slice();
    const response: YieldInsightsImpactInterface[] = mappedResult;
    return response;
  }

  async getMaterialIds(plantId: string): Promise<string[] | []> {
    const rows = await this.shapResult.findAll({
      where: { plantId },
      attributes: this.materialIdAttributes,
    });

    return rows.map((row) => row.materialId);
  }

  async getDependenceGraphData(
    plantId: string,
    parameterName: string,
    targetVariable: string,
  ): Promise<YieldInsightsGraphInterface[]> {
    const isPureResult: any = await this.sequelize.query(this.isPureQuery, {
      replacements: {
        targetVariable,
        parameterName,
        plantId,
      },
    });

    const result: any = await this.shapResult.findAll({
      where: {
        PLANT_ID: plantId,
        VARIABLE: parameterName,
        TARGET_VARIABLE: targetVariable,
      },
      attributes: [
        'variable',
        'batchId',
        'materialId',
        'plantId',
        'manufactureDate',
        'shap',
        'observedValue',
        'targetVariable',
      ],
    });

    const resultantArray: YieldInsightsGraphInterface[] = mergeArrays(
      isPureResult[0],
      result,
    );
    return resultantArray;
  }
}
