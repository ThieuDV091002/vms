import type { AreaDto, CellDto, CreateUpdateExecutionObjectDto, ExecutionObjectDto, LocalDowntimeReasonDto, WorkCenterDto } from '../../dtos/models';
import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { IdentityRoleDto } from '../../volo/abp/identity/models';

export interface CellSettingDto extends ExecutionObjectDto<string> {
  parentId?: string;
  cellId?: string;
  cell: CellDto;
  isMinorStopagesTaskEnabled: boolean;
  isDowntimeTaskEnabled: boolean;
  isOrderChangeTaskEnabled: boolean;
  isFGCollectionTaskEnabled: boolean;
  isScrapIncreaseTaskEnabled: boolean;
  scrapMonitorDurationMinutes?: number;
  scrapPPM?: number;
  isPLCIssueTaskEnabled: boolean;
  plcCountMonitorDurationMinutes?: number;
  isAutoConfirmErrorTaskEnabled: boolean;
  isMaterialLoadTaskEnabled: boolean;
}

export interface CreateUpdateCellSettingDto {
  id?: string;
  parentId?: string;
  cellId?: string;
  isMinorStopagesTaskEnabled: boolean;
  isDowntimeTaskEnabled: boolean;
  isOrderChangeTaskEnabled: boolean;
  isFGCollectionTaskEnabled: boolean;
  isScrapIncreaseTaskEnabled: boolean;
  scrapMonitorDurationMinutes?: number;
  scrapPPM?: number;
  isPLCIssueTaskEnabled: boolean;
  plcCountMonitorDurationMinutes?: number;
  isAutoConfirmErrorTaskEnabled: boolean;
  isMaterialLoadTaskEnabled: boolean;
}

export interface CreateUpdateFocusedItemDto extends CreateUpdateExecutionObjectDto {
  workCenterId?: string;
  workCenterName?: string;
  partNumber?: string;
  priority: number;
}

export interface CreateUpdateMachineDowntimeSettingDto {
  id?: string;
  parentId?: string;
  localDownTimeReasonId?: string;
  roleName?: string;
  warningMinutes: number;
  alertMinutes: number;
  escalatedMinutes: number;
}

export interface CreateUpdateOrderChangeSettingDto {
  id?: string;
  parentId?: string;
  roleName?: string;
  isProductChange: boolean;
  isToolChange: boolean;
  isRMChange: boolean;
  displayInstruction?: string;
  warningMinutes: number;
  alertMinutes: number;
}

export interface CreateUpdateRoleBoardSettingDto extends CreateUpdateExecutionObjectDto {
  areaId?: string;
  areaName?: string;
  fgCollectionWindow: number;
  fgCollectionTaskRoleName?: string;
  minorStoppageDurationMinutes: number;
  minorStoppageCount: number;
  minorStoppageWithinDurationMinutes: number;
  alertRemainingTimeMinutes: number;
  minorStoppageTaskDisplayInstruction?: string;
  fgCollectionDisplayInstruction?: string;
  plcIssueDisplayInstruction?: string;
  autoConfirmationDisplayInstruction?: string;
  scrapIncreaseDisplayInstruction?: string;
  materialLoadingDisplayInstruction?: string;
  machineDowntimeSettings: CreateUpdateMachineDowntimeSettingDto[];
  orderChangeSettings: CreateUpdateOrderChangeSettingDto[];
  cellSettings: CreateUpdateCellSettingDto[];
}

export interface FocusedItemDto extends ExecutionObjectDto<string> {
  workCenterId?: string;
  workCenterName?: string;
  workCenter: WorkCenterDto;
  partNumber?: string;
  priority: number;
  creator?: string;
  lastModifier?: string;
}

export interface FocusedItemGetListInput extends PagedAndSortedResultRequestDto {
  workCenterName?: string;
  workCenterId?: string;
  partNumber?: string;
  priority?: number;
}

export interface MachineDowntimeSettingDto extends ExecutionObjectDto<string> {
  parentId?: string;
  localDownTimeReasonId?: string;
  localDownTimeReason: LocalDowntimeReasonDto;
  roleName?: string;
  role: IdentityRoleDto;
  warningMinutes: number;
  alertMinutes: number;
  escalatedMinutes: number;
}

export interface OrderChangeSettingDto extends ExecutionObjectDto<string> {
  parentId?: string;
  roleName?: string;
  role: IdentityRoleDto;
  isProductChange: boolean;
  isToolChange: boolean;
  isRMChange: boolean;
  displayInstruction?: string;
  warningMinutes: number;
  alertMinutes: number;
}

export interface RoleBoardSettingDto extends ExecutionObjectDto<string> {
  areaId?: string;
  areaName?: string;
  area: AreaDto;
  fgCollectionWindow: number;
  fgCollectionTaskRoleName?: string;
  fgCollectionTaskRole: IdentityRoleDto;
  minorStoppageDurationMinutes: number;
  minorStoppageCount: number;
  minorStoppageWithinDurationMinutes: number;
  alertRemainingTimeMinutes: number;
  minorStoppageTaskDisplayInstruction?: string;
  fgCollectionDisplayInstruction?: string;
  plcIssueDisplayInstruction?: string;
  autoConfirmationDisplayInstruction?: string;
  scrapIncreaseDisplayInstruction?: string;
  materialLoadingDisplayInstruction?: string;
  machineDowntimeSettings: MachineDowntimeSettingDto[];
  orderChangeSettings: OrderChangeSettingDto[];
  cellSettings: CellSettingDto[];
  creator?: string;
  lastModifier?: string;
}

export interface RoleBoardSettingGetListInput extends PagedAndSortedResultRequestDto {
  areaId?: string;
  areaName?: string;
  fgCollectionWindow?: number;
  fgCollectionTaskRoleName?: string;
  minorStoppageDurationMinutes?: number;
}
