import type { ExtensibleEntityDto } from '@abp/ng.core';

export interface PmUserDto extends ExtensibleEntityDto<string> {
  userName?: string;
  name?: string;
  surname?: string;
}
