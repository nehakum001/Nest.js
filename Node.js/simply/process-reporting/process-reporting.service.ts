import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Interval, DateTime } from 'luxon';
import { Fn, Literal } from 'sequelize/types/utils';
import { MasterML } from './process-reporting.model';
import { ProcessOverviewQueryDto } from './process-reporting.dto';
import { ProcessDetailsQueryDto } from './process-details-query.dto';
import { getAverage } from '../utils';
import {
  ProcessOverviewResponse,
  ProcessOverviewFeatureNames,
  ProcessOverviewWhereClause,
  ProcessDetailsFeatureNames,
  ProcessDetailsResponse,
  ProcessDetailsWhereClause,
} from './process-reporting.interface';

@Injectable()
export class ProcessReportingService {
  materialIdAttributes: [Fn, string][] = [
    [
      this.sequelize.fn('DISTINCT', this.sequelize.col('MATERIAL_ID')),
      'materialId',
    ],
  ];

  materialIdOrder: (Literal[]|any)[] = [[this.sequelize.literal('MATERIAL_ID ASC')]];

  processOverviewFeatureNames: ProcessOverviewFeatureNames = {
    WET: [
      'activity_coefficient_as_it_is',
      'mass_yield_without_tail',
      'overall_activity_yield_as_it_is',
    ],
    DRY: [
      'activity_coefficient',
      'dried_mass_yield_without_tail',
      'overall_activity_yield',
    ],
  };

  processDetailsFeatureNames: ProcessDetailsFeatureNames = {
    WET: [
      'weighted_s-1_anticoag_wet_at_s0',
      'anti-xa_wet_s0',
      'anti-iia_sur_tel_s0',
    ],
    DRY: [
      'weighted_s-1_anticoag_dry_at_s0',
      'anti-xa_dry_s0',
      'anti-iia_sur_sec_s0',
    ],
  };

  processOverviewGroup: (string|[Fn, string])[] = [
    'batchId',
    'materialId',
    [
      this.sequelize.fn('REPLACE', this.sequelize.col('MANUFACTURE_DATE'), '-', ''),
      'manufactureDate',
    ],
  ];

  processOverviewAttributes: ([Literal, string]|string|[Fn, string])[] = [...this.processOverviewGroup];

  processDetailsGroup: (string|[Fn, string])[] = [...this.processOverviewGroup];

  processDetailsAttributes: ([Literal, string]|string|[Fn, string])[] = [...this.processDetailsGroup];

  constructor(
    private sequelize: Sequelize,
    @InjectModel(MasterML) private readonly masterMl: typeof MasterML,
  ) {}

  async getMaterialIds(
    plantId: string,
  ): Promise<string[] | []> {
    return this.masterMl.findAll({
      attributes: this.materialIdAttributes,
      where: { plantId },
      order: this.materialIdOrder,
    }).then((rows) => rows.map((row) => row.materialId));
  }

  async getProcessOverview(
    plantId: string,
    query: ProcessOverviewQueryDto,
  ): Promise<ProcessOverviewResponse> {
    const whereClause: ProcessOverviewWhereClause = {
      plantId,
      featureName: this.processOverviewFeatureNames[query.kind],
      featureValue: { [Op.ne]: 'nan' },
      manufactureDate: Interval.fromDateTimes(
        DateTime.fromISO(query.startDate.toISOString().split('T')[0]),
        DateTime.fromISO(query.endDate.toISOString().split('T')[0]),
      )
        .splitBy({ day: 1 })
        // Code fix for inconsistent date format in the DB - YYYY-mm-dd & YYYYmmdd
        .flatMap((date: Interval) => [date.start.toISODate(), date.start.toISODate().replaceAll('-', '')]),
      ...(query.materialIds && { materialId: query.materialIds }),
      ...(query.batchIds && { batchId: query.batchIds }),
      ...(query.stages && { stage: query.stages }),
    };

    const processOverviewAttributes:([Literal, string]|string|[Fn, string])[] = [
      ...this.processOverviewAttributes,
      [
        this.sequelize.literal(
          `TRY_TO_DECIMAL(MAX(CASE WHEN (FEATURE_NAME = '${this.processOverviewFeatureNames[query.kind][0]}') 
            THEN FEATURE_VALUE ELSE NULL END), 10, 4) * 100`,
        ),
        'activityCoefficientPercent',
      ],
      [
        this.sequelize.literal(
          `TRY_TO_DECIMAL(MAX(CASE WHEN (FEATURE_NAME = '${this.processOverviewFeatureNames[query.kind][1]}') 
            THEN FEATURE_VALUE ELSE NULL END), 10, 4) * 100`,
        ),
        'massYieldPercent',
      ],
      [
        this.sequelize.literal(
          `TRY_TO_DECIMAL(MAX(CASE WHEN (FEATURE_NAME = '${this.processOverviewFeatureNames[query.kind][2]}') 
            THEN FEATURE_VALUE ELSE NULL END), 10, 4) * 100`,
        ),
        'overallActivityYieldPercent',
      ],
    ];

    const queryOptions: object = { // Can't infer type here as findAll has a separate FindOptions<any> type
      attributes: processOverviewAttributes,
      where: whereClause,
      group: this.processOverviewGroup,
    };

    const result: MasterML[] | [] = await this.masterMl.findAll(queryOptions);

    const response: ProcessOverviewResponse = {
      batchIds: query.batchIds ? query.batchIds.toString() : null,
      materialIds: query.materialIds ? query.materialIds.toString() : null,
      stages: query.stages ? query.stages.toString() : null,
      kind: query.kind,
      startDate: query.startDate.toISOString().split('T')[0],
      endDate: query.endDate.toISOString().split('T')[0],
      batchCount: result.length,
      averageActivityCoefficientPercent: getAverage(result.map((row) => row.activityCoefficientPercent)),
      averageMassYieldPercent: getAverage(result.map((row) => row.massYieldPercent)),
      averageOverallActivityYieldPercent: getAverage(result.map((row) => row.overallActivityYieldPercent)),
      rows: result.sort((a, b) => a.manufactureDate.localeCompare(b.manufactureDate)),
    };

    return response;
  }

  async getProcessDetails(
    plantId: string,
    query: ProcessDetailsQueryDto,
  ): Promise<ProcessDetailsResponse> {
    const processDetailsWhereClause: ProcessDetailsWhereClause = {
      plantId,
      featureValue: { [Op.ne]: 'nan' },
      ...(query.materialIds && { materialId: query.materialIds }),
      ...(query.batchIds && { batchId: query.batchIds }),
      ...(query.stages && { stage: query.stages }),
      manufactureDate: {
        [Op.and]: [
          this.sequelize.where(
            this.sequelize.fn(
              'TO_DATE',
              this.sequelize.fn(
                'REPLACE',
                this.sequelize.col('MANUFACTURE_DATE'),
                '-',
                '',
              ),
              'YYYYMMDD',
            ),
            '>=',
            query.startDate,
          ),
          this.sequelize.where(
            this.sequelize.fn(
              'TO_DATE',
              this.sequelize.fn(
                'REPLACE',
                this.sequelize.col('MANUFACTURE_DATE'),
                '-',
                '',
              ),
              'YYYYMMDD',
            ),
            '<=',
            query.endDate,
          ),
        ],
      },
    };

    const processDetailsAttributes:([Literal, string]|string|[Fn, string])[] = [
      ...this.processDetailsAttributes,
      [
        this.sequelize.literal(
          `TRY_TO_DECIMAL(MAX(CASE WHEN (FEATURE_NAME = '${this.processDetailsFeatureNames[query.kind][0]}') 
            THEN FEATURE_VALUE ELSE NULL END), 10, 2)`,
        ),
        'weightedAntiCoag',
      ],
      [
        this.sequelize.literal(
          `TRY_TO_DECIMAL(MAX(CASE WHEN (FEATURE_NAME = '${this.processDetailsFeatureNames[query.kind][1]}') 
            THEN FEATURE_VALUE ELSE NULL END), 10, 2)`,
        ),
        'antiXa',
      ],
      [
        this.sequelize.literal(
          `TRY_TO_DECIMAL(MAX(CASE WHEN (FEATURE_NAME = '${this.processDetailsFeatureNames[query.kind][2]}') 
            THEN FEATURE_VALUE ELSE NULL END), 10, 2)`,
        ),
        'antiIiaSurSec',
      ],
      [
        this.sequelize.literal(
          `TRY_TO_DECIMAL(MAX(CASE WHEN (FEATURE_NAME = '${this.processOverviewFeatureNames[query.kind][0]}') 
            THEN FEATURE_VALUE ELSE NULL END), 10, 4) * 100`,
        ),
        'activityCoefficientPercent',
      ],
      [
        this.sequelize.literal(
          `TRY_TO_DECIMAL(MAX(CASE WHEN (FEATURE_NAME = '${this.processOverviewFeatureNames[query.kind][1]}') 
            THEN FEATURE_VALUE ELSE NULL END), 10, 4) * 100`,
        ),
        'massYieldPercent',
      ],
      [
        this.sequelize.literal(
          `TRY_TO_DECIMAL(MAX(CASE WHEN (FEATURE_NAME = '${this.processOverviewFeatureNames[query.kind][2]}') 
            THEN FEATURE_VALUE ELSE NULL END), 10, 4) * 100`,
        ),
        'overallActivityYieldPercent',
      ],
    ];

    const processDetailsQueryOptions: object = { // Can't infer type here as findAll has a separate FindOptions<any> type
      attributes: processDetailsAttributes,
      where: {
        ...processDetailsWhereClause,
        featureName: [
          ...this.processDetailsFeatureNames[query.kind],
          ...this.processOverviewFeatureNames[query.kind],
        ],
      },
      group: this.processDetailsGroup,
      order: [['manufactureDate', 'ASC']],
    };

    const rows: MasterML[] | [] = await this.masterMl.findAll(processDetailsQueryOptions);

    return {
      batchIds: query.batchIds ? query.batchIds.toString() : null,
      materialIds: query.materialIds ? query.materialIds.toString() : null,
      stages: query.stages ? query.stages.toString() : null,
      kind: query.kind,
      batchCount: rows.length,
      startDate: query.startDate.toISOString().split('T')[0],
      endDate: query.endDate.toISOString().split('T')[0],
      averageActivityCoefficientPercent: getAverage(rows.map((row) => row.activityCoefficientPercent)),
      averageMassYieldPercent: getAverage(rows.map((row) => row.massYieldPercent)),
      averageOverallActivityYieldPercent: getAverage(rows.map((row) => row.overallActivityYieldPercent)),
      rows: rows.map((row) => ({
        batchId: row.batchId,
        materialId: row.materialId,
        manufactureDate: row.manufactureDate,
        weightedAntiCoag: row.weightedAntiCoag,
        antiXa: row.antiXa,
        antiIiaSurSec: row.antiIiaSurSec,
      })),
    };
  }
}
