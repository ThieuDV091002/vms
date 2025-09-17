import type { CreateUpdateToDoTypeDto, ToDoTypeDto, ToDoTypeGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ImportResultDto, ModelingHistoryDto, ModelingInputDto, ToDoTypeExportDto } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class ToDoTypeService {
  apiName = 'ticket';
  

  copy = (input: CreateUpdateToDoTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoTypeDto>({
      method: 'POST',
      url: '/api/app/to-do-type/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateToDoTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoTypeDto>({
      method: 'POST',
      url: '/api/app/to-do-type',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateToDoTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoTypeDto>({
      method: 'POST',
      url: '/api/app/to-do-type/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/to-do-type/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/to-do-type/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/to-do-type/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoTypeDto>({
      method: 'GET',
      url: `/api/app/to-do-type/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoTypeDto[]>({
      method: 'GET',
      url: '/api/app/to-do-type/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoTypeDto>({
      method: 'GET',
      url: '/api/app/to-do-type/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ToDoTypeExportDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoTypeDto[]>({
      method: 'POST',
      url: '/api/app/to-do-type/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ToDoTypeGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ToDoTypeDto>>({
      method: 'GET',
      url: '/api/app/to-do-type',
      params: { stateModelId: input.stateModelId, cardTypeId: input.cardTypeId, cardCategoryId: input.cardCategoryId, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/to-do-type/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ToDoTypeExportDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/to-do-type/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/to-do-type/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateToDoTypeDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoTypeDto[]>({
      method: 'PUT',
      url: '/api/app/to-do-type/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateToDoTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoTypeDto>({
      method: 'PUT',
      url: `/api/app/to-do-type/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
