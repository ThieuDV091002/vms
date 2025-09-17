import type { ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';


export interface CreateUpdateNameObjectDto {
  name: string;
  description?: string;
  tenantId?: string;
  tenantName?: string;
  displayName?: string;
  extraProperties: Record<string, object>;
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

export interface ImportResultDto {
  status: boolean;
  totalCount: number;
  successCount: number;
  failedCount: number;
  items: ImportResultItemDto[];
}

export interface ImportResultItemDto {
  name?: string;
  errorMessage?: string;
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

export interface MessageNotificationDto {
  title?: string;
  content?: string;
  userIds: string[];
  tenantId?: string;
}

export interface NotificationGetListInput extends PagedAndSortedResultRequestDto {
  userId?: string;
  userName?: string;
  notificationInfoId?: string;
  notificationMethod?: string;
  success?: boolean;
  creationTime?: string;
  creatorId?: string;
  completionTime?: string;
  failureReason?: string;
  retryForNotificationId?: string;
}

export interface TeamsMessageDto {
}
