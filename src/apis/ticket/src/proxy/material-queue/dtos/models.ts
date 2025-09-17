import type { CreateUpdateMaterialSetupDto, MaterialSetupDto } from '../../dtos/models';
import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateWorkCenterSetupDto {
  workCenter?: string;
  materialQueue?: string;
  productionOrder?: string;
  operation?: string;
  materialSetups: CreateUpdateMaterialSetupDto[];
}

export interface WorkCenterSetupDto extends AuditedEntityDto<string> {
  workCenter?: string;
  materialQueue?: string;
  productionOrder?: string;
  operation?: string;
  materialSetups: MaterialSetupDto[];
}

export interface WorkCenterSetupGetListInput extends PagedAndSortedResultRequestDto {
  workCenter?: string;
  materialQueue?: string;
  productionOrder?: string;
  operation?: string;
}
