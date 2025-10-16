import type { EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateHotelDto extends CreateUpdateNameObjectDto {
  room?: string;
  roomRate?: string;
  address?: string;
  distanceToMolexDongAnh?: number;
  drivingTimeToMolexDongAnh?: number;
  distanceToNoiBai?: number;
  drivingTimeToNoiBai?: number;
}

export interface HotelDto extends NameObjectDto<string> {
  room?: string;
  roomRate?: string;
  address?: string;
  distanceToMolexDongAnh?: number;
  drivingTimeToMolexDongAnh?: number;
  distanceToNoiBai?: number;
  drivingTimeToNoiBai?: number;
}

export interface HotelGetListInput extends GetNameObjectInput {
  ids: string[];
}

export interface GetNameObjectInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface NameObjectDto<Tkey> extends ExtensibleAuditedEntityDto<Tkey> {
  name?: string;
  description?: string;
  tenantId?: string;
  tenantName?: string;
  normalizedName?: string;
  displayName?: string;
  creator?: string;
  lastModifier?: string;
}

export interface CreateUpdateNameObjectDto {
  name: string;
  description?: string;
  tenantId?: string;
  tenantName?: string;
  displayName?: string;
  extraProperties: Record<string, object>;
}

export interface FailedImportResultItemDto {
  name?: string;
  errorMessage?: string;
}

export interface ImportResultDto {
  status: boolean;
  totalCount: number;
  successCount: number;
  failedCount: number;
  items: FailedImportResultItemDto[];
}

export interface ModelingHistoryDto {
  id?: string;
  userName?: string;
  executionTime?: string;
  changeType?: string;
  children: ModelingPropertyDto[];
}

export interface ModelingInput<TKey> extends PagedAndSortedResultRequestDto {
  id: TKey;
}

export interface ModelingPropertyDto {
  propertyName?: string;
  originalValue?: string;
  newValue?: string;
}