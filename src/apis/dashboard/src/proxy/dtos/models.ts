import type { EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';


export interface CreateUpdateDashboardDto extends CreateUpdateNameObjectDto {
  layout?: string;
  hasDateTier?: boolean;
  refSourceId?: string;
  showTenantDataTier?: boolean;
  dashboardWidgets: CreateUpdateDashboardWidgetDto[];
}

export interface CreateUpdateDashboardWidgetDto {
  dashboardId?: string;
  seq: number;
  widgetName?: string;
  name: string;
  description?: string;
  tenantId?: string;
  displayName?: string;
  extraProperties: Record<string, object>;
}

export interface CreateUpdateNameObjectDto {
  name: string;
  description?: string;
  tenantId?: string;
  tenantName?: string;
  displayName?: string;
  extraProperties: Record<string, object>;
}

export interface DashboardDto extends NameObjectDto<string> {
  layout?: string;
  hasDateTier?: boolean;
  refSourceId?: string;
  showTenantDataTier?: boolean;
  dashboardWidgets: DashboardWidgetDto[];
}

export interface DashboardExportDto {
  id?: string;
  name?: string;
  displayName?: string;
  dateTier?: string;
  layout?: string;
  showTenantDataTier?: boolean;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
  dashboardWidgets: DashboardWidgetItem[];
}

export interface DashboardGetListInput extends PagedAndSortedResultRequestDto {
}

export interface DashboardWidgetDto extends EntityDto<string> {
  name?: string;
  displayName?: string;
  description?: string;
  dashboardId?: string;
  seq: number;
  widgetName?: string;
  extraProperties: Record<string, object>;
}

export interface DashboardWidgetItem {
  name?: string;
  seq: number;
  widgetName?: string;
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
