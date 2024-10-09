import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Literal } from 'sequelize/types/utils';
import { BatchGenealogy } from './batch-genealogy-reporting.model';
import { SearchQueryDTO } from './batch-genealogy-reporting-search-query.dto';
import { BatchGenealogyDataDto } from './batch-genealogy-reporting.dto';
import { SearchResponseDTO } from './batch-genealogy-reporting-search-data.dto';
import { SearchResponse } from './batch-genealogy-reporting.interface';
import { BatchGenealogyConstants } from '../../config/batchGenealogyConstants';

@Injectable()
export class BatchGenealogyReportingService {
  attributes: string[] = [
    'level',
    'batchId',
    'materialId',
    'manufactureDate',
    'processOrderNumber',
    'movementType',
  ];

  levelAttributes: any[] = [
    [this.sequelize.fn('DISTINCT', this.sequelize.col('LEVEL')), 'level'],
  ];

  levelOrder: (Literal[] | any)[] = [[this.sequelize.literal('LEVEL ASC')]];

  materialIdAttributes: any[] = [
    [
      this.sequelize.fn('DISTINCT', this.sequelize.col('MATERIAL_ID')),
      'materialId',
    ],
  ];

  batchIdAttributes: any[] = [
    [this.sequelize.fn('DISTINCT', this.sequelize.col('BATCH_ID')), 'batchId'],
  ];

  processOrderNumberAttributes: any[] = [
    [
      this.sequelize.fn('DISTINCT', this.sequelize.col('PROCESS_ORDER_NUMBER')),
      'processOrderNumber',
    ],
  ];

  constructor(
    private sequelize: Sequelize,
    @InjectModel(BatchGenealogy)
    private readonly batchGenealogy: typeof BatchGenealogy,
  ) {}

  queryToFecthNodeData = `SELECT DISTINCT BATCH_ID AS "batchId", MATERIAL_ID AS "materialId",
  PLANT_ID AS "plantId", PROCESS_ORDER_NUMBER AS "processOrderNumber", MATERIAL_DESCRIPTION AS "materialDescription",
  CASE WHEN MOVEMENT_TYPE = '261' THEN 'Input' ELSE 'Output' END AS "movementType"
    FROM INT1_BATCH_GENEALOGY sr2 WHERE MOVEMENT_TYPE = :movementType
    AND EXISTS (SELECT 1 FROM (SELECT PLANT_ID , PROCESS_ORDER_NUMBER ,
       MOVEMENT_TYPE FROM INT1_BATCH_GENEALOGY
    WHERE PLANT_ID = :plantId AND PROCESS_ORDER_NUMBER IN (:processOrderNumber)
    AND MOVEMENT_TYPE = :parentMovementType ) AS sub
    WHERE sr2.PLANT_ID = sub.PLANT_ID AND sr2.PROCESS_ORDER_NUMBER = sub.PROCESS_ORDER_NUMBER)`;

  fetchOutputNodeData = `SELECT DISTINCT BATCH_ID AS "batchId", MATERIAL_ID AS "materialId",
    PLANT_ID AS "plantId", PROCESS_ORDER_NUMBER AS "processOrderNumber", MATERIAL_DESCRIPTION AS "materialDescription",
    CASE WHEN MOVEMENT_TYPE = '101' THEN 'Output' END AS "movementType"
     FROM INT1_BATCH_GENEALOGY sr2 WHERE MOVEMENT_TYPE = '101'
     AND EXISTS (SELECT 1 FROM (SELECT PLANT_ID, PROCESS_ORDER_NUMBER, MOVEMENT_TYPE FROM INT1_BATCH_GENEALOGY
     WHERE PLANT_ID = :plantId AND PROCESS_ORDER_NUMBER IN (:processOrderNumber)
     AND MOVEMENT_TYPE = '261' ) AS sub
     WHERE sr2.PLANT_ID = sub.PLANT_ID AND sr2.PROCESS_ORDER_NUMBER = sub.PROCESS_ORDER_NUMBER)`;

  fetchInputNodeData = `SELECT DISTINCT BATCH_ID AS "batchId", MATERIAL_ID AS "materialId",
    PLANT_ID AS "plantId", PROCESS_ORDER_NUMBER AS "processOrderNumber", MATERIAL_DESCRIPTION AS "materialDescription",
    CASE WHEN MOVEMENT_TYPE = '261' THEN 'Input' END AS "movementType"
     FROM INT1_BATCH_GENEALOGY sr2 WHERE MOVEMENT_TYPE = '261'
     AND EXISTS (SELECT 1 FROM (SELECT PLANT_ID, PROCESS_ORDER_NUMBER, MOVEMENT_TYPE FROM INT1_BATCH_GENEALOGY
     WHERE PLANT_ID = :plantId AND PROCESS_ORDER_NUMBER IN (:processOrderNumber)
     AND MOVEMENT_TYPE = '101' ) AS sub
     WHERE sr2.PLANT_ID = sub.PLANT_ID AND sr2.PROCESS_ORDER_NUMBER = sub.PROCESS_ORDER_NUMBER)`;

  async getBatchGenealogyData(
    plantId: string,
    query: BatchGenealogyDataDto,
  ): Promise<BatchGenealogy[] | []> {
    return this.batchGenealogy.findAll({
      attributes: this.attributes,
      where: {
        plantId,
        level: query.level,
        movementType: query.movementType,
      },
    });
  }

  async getAllLevels(plantId: string): Promise<string[]> {
    const rows: BatchGenealogy[] | [] = await this.batchGenealogy.findAll({
      attributes: this.levelAttributes,
      where: { plantId },
      order: this.levelOrder,
    });
    return rows.map((row) => row.level);
  }

  async getMaterialIds(
    plantId: string,
    query: SearchQueryDTO,
  ): Promise<string[] | []> {
    const rows: BatchGenealogy[] | [] = await this.batchGenealogy.findAll({
      attributes: this.materialIdAttributes,
      where: {
        plantId,
        ...(query.batchId && { batchId: query.batchId }),
      },
    });

    return rows.map((row) => row.materialId);
  }

  async getBatchIds(
    plantId: string,
    query: SearchQueryDTO,
  ): Promise<string[] | []> {
    const rows: BatchGenealogy[] | [] = await this.batchGenealogy.findAll({
      attributes: this.batchIdAttributes,
      where: {
        plantId,
        ...(query.materialId && { materialId: query.materialId }),
      },
    });

    return rows.map((row) => row.batchId);
  }

  async getSearchData(
    plantId: string,
    query: SearchResponseDTO,
  ): Promise<SearchResponse> {
    let result: any[];
    const whereClause = {
      batchId: query.batchId,
      materialId: query.materialId,
      plantId,
    };

    if (query.movementType !== BatchGenealogyConstants.outputNode && query.movementType !== BatchGenealogyConstants.inputNode) {
      const processOrderNumbers: BatchGenealogy[] | [] = await this.batchGenealogy.findAll({
        attributes: this.processOrderNumberAttributes,
        where: whereClause,
      });

      const processOrderNumbersList = processOrderNumbers.map(
        (row) => row.processOrderNumber,
      );

      const outputBatchNodes = await this.sequelize.query(
        this.fetchOutputNodeData,
        {
          replacements: {
            processOrderNumber: processOrderNumbersList,
            plantId,
          },
        },
      );

      const inputBatchNodes = await this.sequelize.query(
        this.fetchInputNodeData,
        {
          replacements: {
            processOrderNumber: processOrderNumbersList,
            plantId,
          },
        },
      );
      result = outputBatchNodes[0].concat(inputBatchNodes[0]);
    } else {
      const parentMovementType = query.movementType
      === BatchGenealogyConstants.outputNode ? BatchGenealogyConstants.inputNode : BatchGenealogyConstants.outputNode;
      whereClause[BatchGenealogyConstants.movementType] = query.movementType;
      const processOrderNumbers: BatchGenealogy[] | [] = await this.batchGenealogy.findAll({
        attributes: this.processOrderNumberAttributes,
        where: whereClause,
      });

      const processOrderNumbersList = processOrderNumbers.map(
        (row) => row.processOrderNumber,
      );

      const data: any[] = await this.sequelize.query(
        this.queryToFecthNodeData,
        {
          replacements: {
            processOrderNumber: processOrderNumbersList,
            plantId,
            movementType: query.movementType,
            parentMovementType,
          },
        },
      );
      [result] = data;
    }

    const response: SearchResponse = {
      node: result.map((item) => ({
        parentBatchId: query.batchId,
        parentMaterialId: query.materialId,
        ...item,
      })),
    };
    return response;
  }
}
