import { mapEnumToOptions } from '@abp/ng.core';

export enum MenuType {
  Menu = 0,
  MenuItem = 1,
  SubMenu = 2,
}

export const menuTypeOptions = mapEnumToOptions(MenuType);
