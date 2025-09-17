import type { CreateUpdateMaterialListDto, MaterialListDto } from '../../dtos/models';
import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateProductionOrderDto {
  orderName?: string;
  qty?: string;
  orderStatus?: string;
  materialLists: CreateUpdateMaterialListDto[];
}

export interface ProductionOrderDto extends AuditedEntityDto<string> {
  orderName?: string;
  qty?: string;
  orderStatus?: string;
  materialLists: MaterialListDto[];
}

export interface ProductionOrderGetListInput extends PagedAndSortedResultRequestDto {
  orderName?: string;
  qty?: string;
  orderStatus?: string;
}
