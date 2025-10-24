import type { EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateTravelToolDto {
  name?: string;
  toolType?: string;
  url?: string;
  photo?: File;
  tenantId?: string;
  tenantName?: string;
}

export interface TravelToolDto extends ExtensibleAuditedEntityDto<string> {
  name?: string;
  toolType?: string;
  url?: string;
  photoId?: string;
  photoName?: string;
  tenantId?: string;
  tenantName?: string;
  creator?: string;
  lastModifier?: string;
}