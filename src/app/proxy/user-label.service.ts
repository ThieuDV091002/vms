import type { ModelingHistoryDto, ModelingInputDto } from './dtos/modeling/models';
import type { ImportResultDto } from './dtos/models';
import type { CreateUpdateUserLabelDto, ExportUserLabelDto, UserLabelDto, UserLabelGetListInput } from './dtos/user-label/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserLabelService {
  apiName = 'Default';
  

  copy = (input: CreateUpdateUserLabelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserLabelDto>({
      method: 'POST',
      url: '/api/app/user-label/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateUserLabelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserLabelDto>({
      method: 'POST',
      url: '/api/app/user-label',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateUserLabelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserLabelDto>({
      method: 'POST',
      url: '/api/app/user-label/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/user-label/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/user-label/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/user-label/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserLabelDto>({
      method: 'GET',
      url: `/api/app/user-label/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserLabelDto[]>({
      method: 'GET',
      url: '/api/app/user-label/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserLabelDto>({
      method: 'GET',
      url: '/api/app/user-label/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportUserLabelDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserLabelDto[]>({
      method: 'POST',
      url: '/api/app/user-label/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: UserLabelGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<UserLabelDto>>({
      method: 'GET',
      url: '/api/app/user-label',
      params: { category: input.category, labelValue: input.labelValue, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/user-label/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportUserLabelDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/user-label/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/user-label/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateUserLabelDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserLabelDto[]>({
      method: 'PUT',
      url: '/api/app/user-label/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateUserLabelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserLabelDto>({
      method: 'PUT',
      url: `/api/app/user-label/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
