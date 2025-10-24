import type { EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateImageLinkDto {
  section?: string;
  url?: string;
  heading?: string;
  body?: string;
  photo?: File;
  tenantId?: string;
  tenantName?: string;
}

export interface ImageLinkDto extends ExtensibleAuditedEntityDto<string> {
  section?: string;
  url?: string;
  heading?: string;
  body?: string;
  photoId?: string;
  photoName?: string;
  tenantId?: string;
  tenantName?: string;
  creator?: string;
  lastModifier?: string;
}