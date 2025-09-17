import type { AuditedEntityDto } from '@abp/ng.core';
import type { AreaDto, CellDto, CorporateDto, DivisionDto, SiteDto, WorkCenterDto } from '../master-data/models';
import type { IdentityUserDto } from '../../volo/abp/identity/models';

export interface AssignedDataTierDto extends AuditedEntityDto<string> {
  userId?: string;
  dataTierType?: string;
  dataTierId?: string;
  dataTierName?: string;
  isDefault: boolean;
  cellId?: string;
  areaId?: string;
  workCenterId?: string;
  cellName?: string;
  areaName?: string;
  workCenterName?: string;
  tenantId?: string;
}

export interface CreateUpdateAssignedDataTierDto {
  userId?: string;
  dataTierType?: string;
  dataTierId?: string;
  dataTierName?: string;
}

export interface DataTierDto {
  dataTierType?: string;
  dataTierId?: string;
}

export interface TreeviewAssignedDataTierDto {
  dataTierType?: string;
  dataTierId?: string;
  dataTierName?: string;
  cellId?: string;
  areaId?: string;
  workCenterId?: string;
  cellName?: string;
  areaName?: string;
  workCenterName?: string;
  tenantId?: string;
}

export interface TreeviewUserWithAssignedDataTierDto {
  defaultDataTier: TreeviewAssignedDataTierDto;
  assignedDataTiers: TreeviewAssignedDataTierDto[];
}

export interface UpsertAssignedDataTiersDto {
  userId?: string;
  defaultDataTierType?: string;
  defaultDataTierId?: string;
  assignedDataTiers: CreateUpdateAssignedDataTierDto[];
}

export interface UserAssignnedDatatierDto {
  defaultDataTierType?: string;
  defaultDataTierId?: string;
  assignedDataTiers: DataTierDto[];
}

export interface UserDefaultDataTierHierarchyDto {
  userId?: string;
  corporate: CorporateDto;
  division: DivisionDto;
  site: SiteDto;
  area: AreaDto;
  cell: CellDto;
  workCenter: WorkCenterDto;
}

export interface UserWithAssignedDataTierDto extends IdentityUserDto {
  defaultDataTier: AssignedDataTierDto;
  assignedDataTiers: AssignedDataTierDto[];
}
