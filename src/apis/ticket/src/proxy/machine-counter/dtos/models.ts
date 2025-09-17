import type { AuditedEntityDto } from '@abp/ng.core';
import type { GetNameObjectInput } from '../../dtos/models';

export interface MachineCounterEventDto extends AuditedEntityDto<string> {
  tenantId?: string;
  eventTimestamp?: string;
  workCenter?: string;
  orderList: OrderInfoDto[];
  nextOrderList: NextOrderInfoDto[];
  toolChangedRequired: boolean;
  rmChangeRequired: boolean;
  productChangeRequired: boolean;
}

export interface MachineCounterEventGetListInput extends GetNameObjectInput {
  eventTimestamp?: string;
  workCenter?: string;
  toolChangedRequired?: boolean;
  rmChangeRequired?: boolean;
  productChangeRequired?: boolean;
}

export interface NextOrderInfoDto extends AuditedEntityDto<string> {
  parentId?: string;
  tenantId?: string;
  orderName?: string;
  product?: string;
  operation?: string;
  qty: number;
  spq: number;
}

export interface OrderInfoDto extends AuditedEntityDto<string> {
  tenantId?: string;
  orderName?: string;
  product?: string;
  operation?: string;
  qty: number;
  spq: number;
  processTime: number;
  completeRemainingMinutes: number;
  collectRemainingMinutes: number;
  accumulativeGoodCount: number;
  accumulativeScrapCount: number;
  scrapList: ScrapInfoDto[];
}

export interface ScrapInfoDto extends AuditedEntityDto<string> {
  scrapReason?: string;
  scrapQty: number;
  orderInfoOrderName?: string;
}
