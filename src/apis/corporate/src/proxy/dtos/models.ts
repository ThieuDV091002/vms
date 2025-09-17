import type { ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

import type { AccessibleTenantDto, CreateUpdateAccessibleTenantDto } from '../molex/uef/dtos/models';

export interface ExportApplicationsDto {
  name?: string;
  displayName?: string;
  description?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
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

export interface ModelingInputDto<TKey> extends PagedAndSortedResultRequestDto {
  id: TKey;
}

export interface ModelingPropertyDto {
  propertyName?: string;
  originalValue?: string;
  newValue?: string;
}

export interface CreateUpdateNameObjectDto {
  name: string;
  displayName?: string;
  description?: string;
  extraProperties: Record<string, object>;
}

export interface ExportTenantDto {
  name?: string;
  applicationName?: string;
  displayLongText?: string;
  displayName?: string;
  description?: string;
  dataTierType?: string;
  dataTierName?: string;
}

export interface NameObjectDto<Tkey> extends ExtensibleAuditedEntityDto<Tkey> {
  name?: string;
  description?: string;
  displayName?: string;
  normalizedName?: string;
  creator?: string;
  lastModifier?: string;
}

export interface AreaDto extends DataTierDto<string> {
  type?: string;
  site?: string;
  siteName?: string;
  cells: CellDto[];
}

export interface AreaGetListInput extends GetNameObjectInput {
  site?: string;
  name?: string;
  ids: string[];
  tenantDataTierType?: string;
  tenantDataTierID?: string;
}

export interface AreaTreeViewDto {
  type?: string;
  id?: string;
  site?: string;
  name?: string;
  displayName?: string;
  cells: CellTreeViewDto[];
}

export interface AreaTreeViewGetListInput {
  site?: string;
  name?: string;
  ids: string[];
  tenantDataTierType?: string;
  tenantDataTierID?: string;
}

export interface CellDto extends DataTierDto<string> {
  type?: string;
  area?: string;
  areaName?: string;
  workCenters: WorkCenterDto[];
}

export interface CellGetListInput extends PagedAndSortedResultRequestDto {
  name?: string;
  area?: string;
  tenantDataTierType?: string;
  tenantDataTierID?: string;
}

export interface CellTreeViewDto {
  type?: string;
  area?: string;
  id?: string;
  name?: string;
  displayName?: string;
  workCenters: WorkCenterTreeViewDto[];
}

export interface CentralizedUserDto extends NameObjectDto<string> {
  emailAddress?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  supervisor?: string;
  isActive: boolean;
  lockoutEnabled: boolean;
  accessibleTenants: AccessibleTenantDto[];
}

export interface CentralizedUserGetListInput extends GetNameObjectInput {
  emailAddress?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  supervisor?: string;
  isActive?: boolean;
  lockoutEnabled?: boolean;
}

export interface CorporateDto extends DataTierDto<string> {
  type?: string;
  divisions: DivisionDto[];
}

export interface CorporateGetListInput extends PagedAndSortedResultRequestDto {
  name?: string;
}

export interface CreateUpdateAreaDto extends CreateUpdateNameObjectDto {
  site?: string;
  siteName?: string;
}

export interface CreateUpdateCellDto extends CreateUpdateNameObjectDto {
  area?: string;
  areaName?: string;
}

export interface CreateUpdateCentralizedUserDto extends CreateUpdateNameObjectDto {
  emailAddress?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  supervisor?: string;
  isActive: boolean;
  lockoutEnabled: boolean;
  accessibleTenants: CreateUpdateAccessibleTenantDto[];
}

export interface CreateUpdateCorporateDto extends CreateUpdateNameObjectDto {
}

export interface CreateUpdateDivisionDto extends CreateUpdateNameObjectDto {
  corporate?: string;
  corporateName?: string;
}

export interface CreateUpdateSiteDto extends CreateUpdateNameObjectDto {
  division?: string;
  divisionName?: string;
  sapSiteCode?: string;
}

export interface CreateUpdateWorkCenterDto extends CreateUpdateNameObjectDto {
  cell?: string;
  cellName?: string;
}

export interface DataTierDto<TKey> extends NameObjectDto<TKey> {
  type?: string;
}

export interface DivisionDto extends DataTierDto<string> {
  type?: string;
  corporate?: string;
  corporateName?: string;
  sites: SiteDto[];
}

export interface DivisionGetListInput extends PagedAndSortedResultRequestDto {
  name?: string;
  corporate?: string;
}

export interface ExportAreaDto {
  name?: string;
  displayName?: string;
  description?: string;
  siteName?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportCellDto {
  name?: string;
  displayName?: string;
  description?: string;
  areaName?: string;
  siteCode?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportCentralizedUserDto {
  name?: string;
  displayName?: string;
  emailAddress?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive: boolean;
  lockoutEnabled: boolean;
  accessTenants: string[];
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportCorporateDto extends ExportNameObjectDto {
}

export interface ExportDivisionDto {
  name?: string;
  displayName?: string;
  description?: string;
  corporateName?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportNameObjectDto {
  name: string;
  displayName?: string;
  description?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportSiteDto {
  name?: string;
  displayName?: string;
  description?: string;
  divisionName?: string;
  sapSiteCode?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportWorkCenterDto {
  name?: string;
  displayName?: string;
  description?: string;
  cellName?: string;
  siteCode?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface GetNameObjectInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface SiteDto extends DataTierDto<string> {
  type?: string;
  division?: string;
  divisionName?: string;
  areas: AreaDto[];
  sapSiteCode?: string;
}

export interface SiteGetListInput extends PagedAndSortedResultRequestDto {
  division?: string;
  sapSiteCode?: string;
  name?: string;
}

export interface SiteTreeViewDto {
  type?: string;
  division?: string;
  id?: string;
  name?: string;
  displayName?: string;
  areas: AreaTreeViewDto[];
}

export interface WorkCenterDto extends DataTierDto<string> {
  type?: string;
  cell?: string;
  area?: string;
  cellName?: string;
}

export interface WorkCenterGetListInput extends PagedAndSortedResultRequestDto {
  name?: string;
  area?: string;
  cell?: string;
  creationTimeFrom?: string;
  creationTimeTo?: string;
  modificationTimeFrom?: string;
  modificationTimeTo?: string;
  tenantDataTierType?: string;
  tenantDataTierID?: string;
}

export interface WorkCenterTreeViewDto {
  type?: string;
  cell?: string;
  id?: string;
  name?: string;
  displayName?: string;
}
