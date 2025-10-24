import type { EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateAttractionDto {
  name?: string;
  locationUrl?: string;
  description?: string;
  photo?: File;
  tenantId?: string;
  tenantName?: string;
}

export interface AttractionDto extends ExtensibleAuditedEntityDto<string> {
  name?: string;
  locationUrl?: string;
  description?: string;
  photoId?: string;
  photoName?: string;
  tenantId?: string;
  tenantName?: string;
  creator?: string;
  lastModifier?: string;
}