import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { TreeviewUserWithAssignedDataTierDto, UpsertAssignedDataTiersDto, UserAssignnedDatatierDto, UserDefaultDataTierHierarchyDto, UserWithAssignedDataTierDto } from '../dtos/assigned-data-tiers/models';
import type { ModelingHistoryDto, ModelingInputDto } from '../dtos/modeling/models';
import type { ImportResultDto } from '../dtos/models';
import type { CreateUpdateUserModelingDto, CreateUserDto, ExportUserDto, GetListUserDto, ListUserDto, UpdateUserDto } from '../dtos/user/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';
import type { GetIdentityUsersInput, IdentityUserDto } from '../volo/abp/identity/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiName = 'Default';
  

  create = (input: CreateUserDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GetListUserDto>({
      method: 'POST',
      url: '/api/app/user',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/user/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/user/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/user/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  fullyUpdateUserDataTierMappingsByDto = (dto: UpsertAssignedDataTiersDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserWithAssignedDataTierDto>({
      method: 'POST',
      url: '/api/app/user/fully-update-user-data-tier-mappings',
      body: dto,
    },
    { apiName: this.apiName,...config });
  

  get = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, IdentityUserDto[]>({
      method: 'GET',
      url: '/api/app/user',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IdentityUserDto[]>({
      method: 'GET',
      url: '/api/app/user/instances',
    },
    { apiName: this.apiName,...config });
  

  getAssignnedDataTiersByUserIdByUserId = (userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserAssignnedDatatierDto>({
      method: 'GET',
      url: `/api/app/user/assignned-data-tiers-by-user-id/${userId}`,
    },
    { apiName: this.apiName,...config });
  

  getDataDataTiers = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserWithAssignedDataTierDto>({
      method: 'GET',
      url: '/api/app/user/data-data-tiers',
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: CreateUpdateUserModelingDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, IdentityUserDto[]>({
      method: 'POST',
      url: '/api/app/user/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/user/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getTreeviewDataTiersByUser = (userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TreeviewUserWithAssignedDataTierDto>({
      method: 'GET',
      url: `/api/app/user/treeview-data-tiers-by-user/${userId}`,
    },
    { apiName: this.apiName,...config });
  

  getUserDefaultDataTiersByIdByUserId = (userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserDefaultDataTierHierarchyDto>({
      method: 'GET',
      url: `/api/app/user/user-default-data-tiers-by-id/${userId}`,
    },
    { apiName: this.apiName,...config });
  

  getUserList = (input: GetIdentityUsersInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ListUserDto>>({
      method: 'GET',
      url: '/api/app/user/user-list',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getUserWithDataTiersByIdByUserId = (userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserWithAssignedDataTierDto>({
      method: 'GET',
      url: `/api/app/user/user-with-data-tiers-by-id/${userId}`,
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportUserDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/user/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/user/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateUserDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GetListUserDto>({
      method: 'PUT',
      url: `/api/app/user/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
