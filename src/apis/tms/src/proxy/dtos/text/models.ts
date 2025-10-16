import type { EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateTextDto {
  content?: string;
  section?: string;
  tenantId?: string;
  tenantName?: string;
}

export interface TextDto extends ExtensibleAuditedEntityDto<string> {
  content?: string;
  section?: string;
  tenantId?: string;
  tenantName?: string;
  creator?: string;
  lastModifier?: string;
}