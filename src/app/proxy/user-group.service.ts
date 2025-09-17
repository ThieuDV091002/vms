import type { ModelingHistoryDto, ModelingInputDto } from './dtos/modeling/models';
import type { ImportResultDto } from './dtos/models';
import type { CreateUpdateUserGroupDto, UserGroupDto, UserGroupExportInput, UserGroupGetListInput } from './dtos/user-group/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserGroupService {
  apiName = 'Default';
  

  copy = (input: CreateUpdateUserGroupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserGroupDto>({
      method: 'POST',
      url: '/api/app/user-group/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateUserGroupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserGroupDto>({
      method: 'POST',
      url: '/api/app/user-group',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateUserGroupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserGroupDto>({
      method: 'POST',
      url: '/api/app/user-group/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/user-group/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/user-group/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/user-group/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserGroupDto>({
      method: 'GET',
      url: `/api/app/user-group/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserGroupDto[]>({
      method: 'GET',
      url: '/api/app/user-group/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserGroupDto>({
      method: 'GET',
      url: '/api/app/user-group/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: UserGroupExportInput[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserGroupDto[]>({
      method: 'POST',
      url: '/api/app/user-group/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: UserGroupGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<UserGroupDto>>({
      method: 'GET',
      url: '/api/app/user-group',
      params: { ids: input.ids, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/user-group/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: UserGroupExportInput[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/user-group/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/user-group/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateUserGroupDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserGroupDto[]>({
      method: 'PUT',
      url: '/api/app/user-group/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateUserGroupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserGroupDto>({
      method: 'PUT',
      url: `/api/app/user-group/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
