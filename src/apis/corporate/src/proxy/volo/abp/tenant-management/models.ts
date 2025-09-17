import type { ExtensibleEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface GetTenantsInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface TenantDto extends ExtensibleEntityDto<string> {
  name?: string;
  concurrencyStamp?: string;
}
