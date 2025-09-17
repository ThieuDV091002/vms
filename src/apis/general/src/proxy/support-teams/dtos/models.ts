import type { AssignedSupportTeamDataTierDto, CreateUpdateAssignedSupportTeamDataTierDto, CreateUpdateNameObjectDto, GetNameObjectInput, NameObjectDto } from '../../dtos/models';
import type { AuditedEntityDto } from '@abp/ng.core';

export interface CreateUpdateJobFunctionDto extends CreateUpdateNameObjectDto {
  color?: string;
}

export interface CreateUpdateSupportShiftDto extends CreateUpdateNameObjectDto {
}

export interface CreateUpdateSupportTeamDto {
  user?: string;
  jobFunction?: string;
  supportShift?: string;
  assignedDataTiers: CreateUpdateAssignedSupportTeamDataTierDto[];
  tenantId?: string;
}

export interface JobFunctionDto extends NameObjectDto<string> {
  color?: string;
}

export interface JobFunctionExportDto {
  name?: string;
  displayName?: string;
  description?: string;
  color: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface JobFunctionGetListInput extends GetNameObjectInput {
  color?: string;
}

export interface SupportShiftDto extends NameObjectDto<string> {
}

export interface SupportShiftGetListInput extends GetNameObjectInput {
}

export interface SupportTeamDto extends AuditedEntityDto<string> {
  user?: string;
  jobFunction?: string;
  supportShift?: string;
  assignedDataTiers: AssignedSupportTeamDataTierDto[];
  tenantId?: string;
}

export interface SupportTeamGetListInput extends GetNameObjectInput {
  user?: string;
  jobFunction?: string;
  supportShift?: string;
}

export interface SupportTeamSearchListInput extends GetNameObjectInput {
  userId?: string;
  areaId?: string;
  cellId?: string;
  workCenterId?: string;
  keyword?: string;
}
