import type { CreateUpdateUserMenuDto, GetUserMenuInput, UserMenuDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ModelingHistoryDto, ModelingInputDto } from '../dtos/modeling/models';
import type { ExportUserMenuDto, ImportResultDto } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class UserMenuService {
  apiName = 'Default';
  

  copy = (input: CreateUpdateUserMenuDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserMenuDto>({
      method: 'POST',
      url: '/api/app/user-menu/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateUserMenuDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserMenuDto>({
      method: 'POST',
      url: '/api/app/user-menu',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateUserMenuDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserMenuDto>({
      method: 'POST',
      url: '/api/app/user-menu/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/user-menu/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/user-menu/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/user-menu/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserMenuDto>({
      method: 'GET',
      url: `/api/app/user-menu/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserMenuDto[]>({
      method: 'GET',
      url: '/api/app/user-menu/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserMenuDto>({
      method: 'GET',
      url: '/api/app/user-menu/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportUserMenuDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserMenuDto[]>({
      method: 'POST',
      url: '/api/app/user-menu/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetUserMenuInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<UserMenuDto>>({
      method: 'GET',
      url: '/api/app/user-menu',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/user-menu/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getUserMenuByRoles = (roleNames: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserMenuDto[]>({
      method: 'GET',
      url: '/api/app/user-menu/user-menu-by-roles',
      params: { roleNames },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportUserMenuDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/user-menu/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/user-menu/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateUserMenuDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserMenuDto[]>({
      method: 'PUT',
      url: '/api/app/user-menu/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateUserMenuDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserMenuDto>({
      method: 'PUT',
      url: `/api/app/user-menu/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
