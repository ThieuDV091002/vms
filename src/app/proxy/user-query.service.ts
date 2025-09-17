import type { ModelingHistoryDto, ModelingInputDto } from './dtos/modeling/models';
import type { ExportUserQueryDto, ImportResultDto } from './dtos/models';
import type { CreateUpdateUserQueryDto, UserQueryDto, UserQueryGetListInput } from './dtos/user-query/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserQueryService {
  apiName = 'Default';
  

  copy = (input: CreateUpdateUserQueryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserQueryDto>({
      method: 'POST',
      url: '/api/app/user-query/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateUserQueryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserQueryDto>({
      method: 'POST',
      url: '/api/app/user-query',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateUserQueryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserQueryDto>({
      method: 'POST',
      url: '/api/app/user-query/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/user-query/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/user-query/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/user-query/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserQueryDto>({
      method: 'GET',
      url: `/api/app/user-query/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserQueryDto[]>({
      method: 'GET',
      url: '/api/app/user-query/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserQueryDto>({
      method: 'GET',
      url: '/api/app/user-query/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportUserQueryDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserQueryDto[]>({
      method: 'POST',
      url: '/api/app/user-query/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: UserQueryGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<UserQueryDto>>({
      method: 'GET',
      url: '/api/app/user-query',
      params: { parameters: input.parameters, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/user-query/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportUserQueryDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/user-query/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/user-query/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateUserQueryDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserQueryDto[]>({
      method: 'PUT',
      url: '/api/app/user-query/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateUserQueryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserQueryDto>({
      method: 'PUT',
      url: `/api/app/user-query/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  validateSql = (input: CreateUpdateUserQueryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/user-query/validate-sql',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
