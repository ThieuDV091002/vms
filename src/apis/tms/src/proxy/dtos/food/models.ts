import type { EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateFoodDto {
  name?: string;
  locationUrl?: string;
  photo?: File;
  tenantId?: string;
  tenantName?: string;
}

export interface FoodDto extends ExtensibleAuditedEntityDto<string> {
  name?: string;
  locationUrl?: string;
  photoId?: string;
  photoName?: string;
  tenantId?: string;
  tenantName?: string;
  creator?: string;
  lastModifier?: string;
}