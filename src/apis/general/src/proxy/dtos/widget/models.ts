import type { CreateUpdateNameObjectDto, GetNameObjectInput, NameObjectDto } from '../models';
import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { DataTierInput } from '../../models';

export interface CreateUpdateMstStandardCategoryDto extends CreateUpdateNameObjectDto {
}

export interface CreateUpdateStandardCategoryDto {
  standardId?: string;
  categoryId?: string;
  tenantId?: string;
}

export interface CreateUpdateStandardDataTierDto {
  standardId?: string;
  dataTierType?: string;
  dataTierId?: string;
  tenantId?: string;
}

export interface CreateUpdateStandardDto {
  name: string;
  description?: string;
  tenantId?: string;
  displayName?: string;
}

export interface CreateUpdateStandardMediaDto {
  seq: number;
  standardId?: string;
  mediaUrl?: string;
  fileName?: string;
  mediaType?: string;
  headerNote?: string;
  footerNote?: string;
  name: string;
  description?: string;
  tenantId?: string;
  displayName?: string;
}

export interface CreateUpdateUserFavoriteStandardDto {
  standardId?: string;
  userId?: string;
  tenantId?: string;
}

export interface MstStandardCategoryDto extends NameObjectDto<string> {
}

export interface MstStandardCategoryGetListInput extends GetNameObjectInput {
}

export interface StandardCategoryDto extends AuditedEntityDto<string> {
  standardId?: string;
  categoryId?: string;
}

export interface StandardDataTierDto extends AuditedEntityDto<string> {
  standardId?: string;
  dataTierType?: string;
  dataTierId?: string;
  tenantId?: string;
}

export interface StandardDto extends NameObjectDto<string> {
  standardMediaDtos: StandardMediaDto[];
  standardCatetoryDtos: StandardCategoryDto[];
  standardDataTierDtos: StandardDataTierDto[];
}

export interface StandardGetListInput extends PagedAndSortedResultRequestDto {
  userId: string;
  filter?: string;
  dataTierList: DataTierInput[];
  categoryIds: string[];
}

export interface StandardMediaDto extends NameObjectDto<string> {
  seq: number;
  standardId?: string;
  mediaUrl?: string;
  fileName?: string;
  mediaType?: string;
  headerNote?: string;
  footerNote?: string;
}

export interface StandardMediaGetListInput extends PagedAndSortedResultRequestDto {
  seq?: number;
  standardId?: string;
  mediaUrl?: string;
  mediaType?: string;
  headerNote?: string;
  footerNote?: string;
}

export interface UserFavoriteStandardDto extends AuditedEntityDto<string> {
  standardId?: string;
  userId?: string;
}

export interface UserFavoriteStandardGetListInput extends GetNameObjectInput {
  standardId?: string;
  userId?: string;
}

export interface UserStandardDto extends NameObjectDto<string> {
  standardMediaDtos: StandardMediaDto[];
  isFavorite: boolean;
}
