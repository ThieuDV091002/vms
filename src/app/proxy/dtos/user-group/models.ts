import type { CreateUpdateNameObjectDto, GetNameObjectInput, NameObjectDto } from '../models';
import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateUserGroupDto extends CreateUpdateNameObjectDto {
  users: UserGroupUsersDto[];
}

export interface UserGroupDto extends NameObjectDto<string> {
  users: UserGroupUsersDto[];
}

export interface UserGroupExportInput {
  name?: string;
  displayName?: string;
  description?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
  users: UserGroupUsersItem[];
}

export interface UserGroupGetListInput extends GetNameObjectInput {
  ids: string[];
}

export interface UserGroupUsersDto extends EntityDto<string> {
  userId?: string;
  userGroupId?: string;
  userName?: string;
  userEmail?: string;
}

export interface UserGroupUsersItem {
  userName?: string;
  userEmail?: string;
}
