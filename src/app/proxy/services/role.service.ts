import type { RoleAppService_CompareRolePermissionDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { ListResultDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ModelingHistoryDto, ModelingInputDto } from '../dtos/modeling/models';
import type { ImportResultDto } from '../dtos/models';
import type { ExportRoleModelingDto } from '../dtos/role/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';
import type { GetIdentityRolesInput, IdentityRoleCreateDto, IdentityRoleDto } from '../volo/abp/identity/models';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  apiName = 'Default';
  

  compareRoleExtraPropertiesWithPermissionStore = (roleName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleAppService_CompareRolePermissionDto>({
      method: 'POST',
      url: '/api/app/role/compare-role-extra-properties-with-permission-store',
      params: { roleName },
    },
    { apiName: this.apiName,...config });
  

  create = (input: IdentityRoleCreateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IdentityRoleDto>({
      method: 'POST',
      url: '/api/app/role',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/role/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/role/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/role/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  getAssignableRoles = (userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ListResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: `/api/app/role/assignable-roles/${userId}`,
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportRoleModelingDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, IdentityRoleDto[]>({
      method: 'POST',
      url: '/api/app/role/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetIdentityRolesInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: '/api/app/role',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/role/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportRoleModelingDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/role/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/role/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  syncRoleExtraPropertiesFromPermissionStore = (roleName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/role/sync-role-extra-properties-from-permission-store',
      params: { roleName },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
