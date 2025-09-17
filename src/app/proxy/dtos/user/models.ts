import type { IdentityUserCreateDto, IdentityUserDto, IdentityUserUpdateDto } from '../../volo/abp/identity/models';
import type { UpsertAssignedDataTiersDto, UserWithAssignedDataTierDto } from '../assigned-data-tiers/models';

export interface CreateUpdateUserModelingDto {
  surname?: string;
  phoneNumber?: string;
  email?: string;
  name?: string;
  userName?: string;
  isActive: boolean;
  roleNames: string[];
  lockoutEnabled?: boolean;
  defaultDataTierType?: string;
  defaultDataTier?: string;
  creationTime?: string;
  lastModificationTime?: string;
}

export interface CreateUserDto extends IdentityUserCreateDto {
  dataTiers: UpsertAssignedDataTiersDto;
}

export interface ExportUserDto {
  surname?: string;
  phoneNumber?: string;
  email?: string;
  name?: string;
  userName?: string;
  isActive: boolean;
  roleNames: string[];
  lockoutEnabled?: boolean;
  defaultDataTierType?: string;
  defaultDataTier?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface GetListUserDto extends IdentityUserDto {
  dataTier: UserWithAssignedDataTierDto;
}

export interface ListUserDto extends IdentityUserDto {
  creator?: string;
  lastModifier?: string;
}

export interface UpdateUserDto extends IdentityUserUpdateDto {
  dataTiers: UpsertAssignedDataTiersDto;
}
