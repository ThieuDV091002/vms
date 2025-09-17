import type { CreateUpdateNameObjectDto, GetNameObjectInput, NameObjectDto } from '../models';
import type { AuditedEntityDto } from '@abp/ng.core';
import type { ContentTemplateDto } from '../content-templates/models';

export interface CreateUpdateNotificationDetailDto {
  id?: string;
  parentId?: string;
  tenantId?: string;
  mode?: string;
  contentTemplateId?: string;
  recipientTypes: CreateUpdateRecipientTypeDto[];
  recipientUserGroups: CreateUpdateRecipientUserGroupDto[];
  recipientUsers: CreateUpdateRecipientUserDto[];
}

export interface CreateUpdateNotificationSettingDto extends CreateUpdateNameObjectDto {
  microservice?: string;
  object?: string;
  action?: string;
  api?: string;
  topic?: string;
  sender?: string;
  notificationDetails: CreateUpdateNotificationDetailDto[];
}

export interface CreateUpdateRecipientTypeDto {
  id?: string;
  parentId?: string;
  tenantId?: string;
  recipientTypeValue?: string;
}

export interface CreateUpdateRecipientUserDto {
  id?: string;
  parentId?: string;
  tenantId?: string;
  userId?: string;
  userName?: string;
}

export interface CreateUpdateRecipientUserGroupDto {
  id?: string;
  parentId?: string;
  tenantId?: string;
  userGroupId?: string;
  userGroupName?: string;
}

export interface ExportNotificationDetailDto {
  mode?: string;
  contentTemplate?: string;
  recipientTypes: string[];
  recipientUserGroups: string[];
  recipientUsers: string[];
}

export interface ExportNotificationSettingDto {
  microservice?: string;
  object?: string;
  action?: string;
  api?: string;
  topic?: string;
  sender?: string;
  description?: string;
  notificationDetails: ExportNotificationDetailDto[];
}

export interface NotificationDetailDto extends AuditedEntityDto<string> {
  tenantId?: string;
  mode?: string;
  contentTemplateId?: string;
  contentTemplate: ContentTemplateDto;
  recipientTypes: RecipientTypeDto[];
  recipientUserGroups: RecipientUserGroupDto[];
  recipientUsers: RecipientUserDto[];
}

export interface NotificationSettingDto extends NameObjectDto<string> {
  microservice?: string;
  object?: string;
  action?: string;
  api?: string;
  topic?: string;
  sender?: string;
  notificationDetails: NotificationDetailDto[];
}

export interface NotificationSettingGetListInput extends GetNameObjectInput {
  microservice?: string;
  object?: string;
  action?: string;
  api?: string;
  topic?: string;
  sender?: string;
}

export interface RecipientTypeDto extends AuditedEntityDto<string> {
  tenantId?: string;
  recipientTypeValue?: string;
}

export interface RecipientUserDto extends AuditedEntityDto<string> {
  tenantId?: string;
  userId?: string;
  userName?: string;
}

export interface RecipientUserGroupDto extends AuditedEntityDto<string> {
  tenantId?: string;
  userGroupId?: string;
  userGroupName?: string;
}
