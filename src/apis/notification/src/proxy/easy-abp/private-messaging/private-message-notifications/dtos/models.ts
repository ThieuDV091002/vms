import type { EntityDto } from '@abp/ng.core';

export interface PrivateMessageNotificationDto extends EntityDto<string> {
  tenantId?: string;
  userId?: string;
  privateMessageId?: string;
  titlePreview?: string;
}
