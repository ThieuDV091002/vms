import type { EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateTransportationAppDto {
  name?: string;
  downloadUrl?: string;
  photo?: File;
  tenantId?: string;
  tenantName?: string;
}

export interface TransportationAppDto extends ExtensibleAuditedEntityDto<string> {
  name?: string;
  downloadUrl?: string;
  photoId?: string;
  photoName?: string;
  tenantId?: string;
  tenantName?: string;
  creator?: string;
  lastModifier?: string;
}