import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface ModelingHistoryDto {
  id?: string;
  userName?: string;
  executionTime?: string;
  changeType?: string;
  children: ModelingPropertyDto[];
}

export interface ModelingInputDto<TKey> extends PagedAndSortedResultRequestDto {
  id: TKey;
}

export interface ModelingPropertyDto {
  propertyName?: string;
  originalValue?: string;
  newValue?: string;
}
