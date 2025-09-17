import type { ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';


export interface CreateUpdateNameObjectDto {
  name: string;
  description?: string;
  tenantId?: string;
  tenantName?: string;
  displayName?: string;
  extraProperties: Record<string, object>;
}

export interface CreateUpdateSchedulerSettingDto extends CreateUpdateNameObjectDto {
  microService?: string;
  object?: string;
  action?: string;
  api?: string;
  username?: string;
  password?: string;
  scheduleCron?: string;
  payload?: string;
  url?: string;
  timeout: number;
}

export interface ExportSchedulerSettingDto {
  name?: string;
  displayName?: string;
  description?: string;
  microService?: string;
  object?: string;
  action?: string;
  api?: string;
  username?: string;
  password?: string;
  scheduleCron?: string;
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

export interface SchedulerExecutionHistoryDto {
  jobId?: string;
  jobName?: string;
  jobGroup?: string;
  startExecutionTime?: string;
  endExecutionTime?: string;
  data?: string;
  exception?: string;
  isSuccess: boolean;
}

export interface SchedulerExecutionHistoryGetListInput extends PagedAndSortedResultRequestDto {
  schedulerId?: string;
}

export interface SchedulerSettingDto extends NameObjectDto<string> {
  microService?: string;
  object?: string;
  action?: string;
  api?: string;
  username?: string;
  password?: string;
  scheduleCron?: string;
  runningStatus?: string;
  nextFireTime?: string;
  previousFireTime?: string;
  payload?: string;
  url?: string;
  timeout: number;
}

export interface SchedulerSettingGetListInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}
