import type { CreateUpdateNameObjectDto, NameObjectDto } from '../../../dtos/models';
import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface ApplicationsDto extends NameObjectDto<string> {
  url?: string;
  icon?: string;
}

export interface ApplicationsGetListInput extends PagedAndSortedResultRequestDto {
  name?: string;
}

export interface CreateUpdateApplicationsDto extends CreateUpdateNameObjectDto {
  url?: string;
  icon?: string;
}

export interface AccessibleTenantDto extends AuditedEntityDto<string> {
  userId?: string;
  tenantId?: string;
  displayLongText?: string;
  displayName?: string;
  tenantName?: string;
}

export interface CreateUpdateAccessibleTenantDto {
  userId?: string;
  tenantId?: string;
  tenantName?: string;
}
