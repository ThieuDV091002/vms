import type { CreateUpdateStateModelDto, ExportStateModelDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto, StateModelDto, StateModelGetListInput } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateModelService {
  apiName = 'ticket';
  

  copy = (input: CreateUpdateStateModelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateModelDto>({
      method: 'POST',
      url: '/api/app/state-model/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateStateModelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateModelDto>({
      method: 'POST',
      url: '/api/app/state-model',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateStateModelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateModelDto>({
      method: 'POST',
      url: '/api/app/state-model/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/state-model/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/state-model/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/state-model/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateModelDto>({
      method: 'GET',
      url: `/api/app/state-model/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateModelDto[]>({
      method: 'GET',
      url: '/api/app/state-model/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateModelDto>({
      method: 'GET',
      url: '/api/app/state-model/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportStateModelDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateModelDto[]>({
      method: 'POST',
      url: '/api/app/state-model/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: StateModelGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<StateModelDto>>({
      method: 'GET',
      url: '/api/app/state-model',
      params: { defaultState: input.defaultState, ids: input.ids, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/state-model/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportStateModelDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/state-model/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/state-model/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateStateModelDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateModelDto[]>({
      method: 'PUT',
      url: '/api/app/state-model/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateStateModelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StateModelDto>({
      method: 'PUT',
      url: `/api/app/state-model/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
