import type { EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateLocalAdminDto {
  fullName?: string;
  kochID?: string;
  site?: string;
  title?: string;
  photo?: File;
  tenantId?: string;
  tenantName?: string;
}

export interface LocalAdminDto extends ExtensibleAuditedEntityDto<string> {
  fullName?: string;
  kochID?: string;
  site?: string;
  title?: string;
  photoId?: string;
  photoName?: string;
  tenantId?: string;
  tenantName?: string;
  creator?: string;
  lastModifier?: string;
}