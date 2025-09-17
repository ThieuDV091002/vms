import type { CreateUpdateStateDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto, StateDto, StateExportDto, StateGetListInput } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  apiName = 'ticket';
  

  copy = (input: CreateUpdateStateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateDto>({
      method: 'POST',
      url: '/api/app/state/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateStateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateDto>({
      method: 'POST',
      url: '/api/app/state',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateStateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateDto>({
      method: 'POST',
      url: '/api/app/state/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/state/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/state/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/state/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateDto>({
      method: 'GET',
      url: `/api/app/state/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateDto[]>({
      method: 'GET',
      url: '/api/app/state/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateDto>({
      method: 'GET',
      url: '/api/app/state/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: StateExportDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateDto[]>({
      method: 'POST',
      url: '/api/app/state/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: StateGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<StateDto>>({
      method: 'GET',
      url: '/api/app/state',
      params: { isCompleted: input.isCompleted, color: input.color, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/state/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: StateExportDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/state/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/state/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateStateDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateDto[]>({
      method: 'PUT',
      url: '/api/app/state/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateStateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateDto>({
      method: 'PUT',
      url: `/api/app/state/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
