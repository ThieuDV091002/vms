import type { CreationAuditedEntityDto } from '@abp/ng.core';

export interface CreateUpdateNotificationDto {
  userId?: string;
  notificationInfoId?: string;
  notificationMethod?: string;
  success?: boolean;
  completionTime?: string;
  failureReason?: string;
  retryForNotificationId?: string;
}

export interface NotificationDto extends CreationAuditedEntityDto<string> {
  userId?: string;
  notificationInfoId?: string;
  notificationMethod?: string;
  success?: boolean;
  completionTime?: string;
  failureReason?: string;
  retryForNotificationId?: string;
}
