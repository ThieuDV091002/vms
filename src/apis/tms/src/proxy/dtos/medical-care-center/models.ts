import type { EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateMedicalCareCenterDto {
  name?: string;
  city?: string;
  locationUrl?: string;
  photo?: File;
  tenantId?: string;
  tenantName?: string;
}

export interface MedicalCareCenterDto extends ExtensibleAuditedEntityDto<string> {
  name?: string;
  city?: string;
  locationUrl?: string;
  photoId?: string;
  photoName?: string;
  tenantId?: string;
  tenantName?: string;
  creator?: string;
  lastModifier?: string;
}