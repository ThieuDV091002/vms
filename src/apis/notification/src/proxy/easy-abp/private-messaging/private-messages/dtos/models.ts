import type { ExtensibleFullAuditedEntityDto, ExtensibleObject } from '@abp/ng.core';
import type { PmUserDto } from '../../users/dtos/models';

export interface CreatePrivateMessageByUserIdDto extends ExtensibleObject {
  toUserId: string;
  title: string;
  content?: string;
}

export interface CreateUpdatePrivateMessageDto extends ExtensibleObject {
  toUserName: string;
  title: string;
  content?: string;
}

export interface PrivateMessageDto extends ExtensibleFullAuditedEntityDto<string> {
  fromUserId?: string;
  toUserId?: string;
  fromUser: PmUserDto;
  toUser: PmUserDto;
  title?: string;
  content?: string;
  readTime?: string;
}
