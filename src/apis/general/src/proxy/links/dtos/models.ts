import type { CreateUpdateNameObjectDto, GetNameObjectInput, NameObjectDto } from '../../dtos/models';
import type { AuditedEntityDto } from '@abp/ng.core';

export interface CreateUpdateLinkCategoryDto extends CreateUpdateNameObjectDto {
  sequence: number;
}

export interface CreateUpdateLinkDto extends CreateUpdateNameObjectDto {
  url?: string;
  tags?: string;
  linkCategoryId?: string;
  linkCategoryName?: string;
  linkRoles: CreateUpdateLinkRoleDto[];
}

export interface CreateUpdateLinkRoleDto {
  linkId?: string;
  roleName?: string;
}

export interface LinkCategoryDto extends NameObjectDto<string> {
  sequence: number;
}

export interface LinkCategoryGetListInput extends GetNameObjectInput {
}

export interface LinkDto extends NameObjectDto<string> {
  url?: string;
  tags?: string;
  linkCategoryId?: string;
  linkCategoryName?: string;
  linkRoleDtos: LinkRoleDto[];
}

export interface LinkFavoriteDto extends AuditedEntityDto<string> {
  linkId?: string;
  userId?: string;
}

export interface LinkGetListInput extends GetNameObjectInput {
  url?: string;
  tags?: string;
  linkCategoryId?: string;
}

export interface LinkRoleDto extends AuditedEntityDto<string> {
  linkId?: string;
  roleName?: string;
}

export interface LinkSearchListInput extends GetNameObjectInput {
  keyword?: string;
}

export interface LinkViewDto extends AuditedEntityDto<string> {
  name?: string;
  displayName?: string;
  description?: string;
  url?: string;
  tags?: string;
  linkCategoryId?: string;
  linkCategoryName?: string;
  linkCategorySequence: number;
  isFavorite: boolean;
  linkRoleDtos: LinkRoleDto[];
  creator?: string;
  lastModifier?: string;
}
