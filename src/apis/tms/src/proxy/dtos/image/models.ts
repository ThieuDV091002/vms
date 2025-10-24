import type { EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateImageDto {
  section?: string;
  photo?: File;
  tenantId?: string;
  tenantName?: string;
}

export interface ImageDto extends ExtensibleAuditedEntityDto<string> {
  section?: string;
  photoId?: string;
  photoName?: string;
  tenantId?: string;
  tenantName?: string;
  creator?: string;
  lastModifier?: string;
}