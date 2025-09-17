import type { CreateUpdateNameObjectDto, GetNameObjectInput, NameObjectDto } from '../../dtos/models';
import type { MenuType } from '../../menu-type.enum';

export interface CreateUpdateUserMenuDto extends CreateUpdateNameObjectDto {
  path: string;
  requiredPolicy?: string;
  order: number;
  iconClass?: string;
  layout?: string;
  parentId?: string;
  parentName?: string;
  menuType: MenuType;
  subMenuId?: string;
  subMenuName?: string;
  children: CreateUpdateUserMenuDto[];
}

export interface GetUserMenuInput extends GetNameObjectInput {
}

export interface UserMenuDto extends NameObjectDto<string> {
  path?: string;
  requiredPolicy?: string;
  order: number;
  iconClass?: string;
  layout?: string;
  parentId?: string;
  parentName?: string;
  menuType: MenuType;
  subMenuId?: string;
  subMenuName?: string;
  children: UserMenuDto[];
}
