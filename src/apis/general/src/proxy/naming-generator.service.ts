import type { CreateUpdateNamingGeneratorDto, ExportNamingGeneratorDto, ImportResultDto, ModelingHistoryDto, ModelingInput, NamingGeneratorDto, NamingGeneratorGetListInput } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NamingGeneratorService {
  apiName = 'general';
  

  copy = (input: CreateUpdateNamingGeneratorDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingGeneratorDto>({
      method: 'POST',
      url: '/api/app/naming-generator/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateNamingGeneratorDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingGeneratorDto>({
      method: 'POST',
      url: '/api/app/naming-generator',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateNamingGeneratorDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingGeneratorDto>({
      method: 'POST',
      url: '/api/app/naming-generator/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/naming-generator/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/naming-generator/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/naming-generator/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingGeneratorDto>({
      method: 'GET',
      url: `/api/app/naming-generator/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingGeneratorDto[]>({
      method: 'GET',
      url: '/api/app/naming-generator/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingGeneratorDto>({
      method: 'GET',
      url: '/api/app/naming-generator/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportNamingGeneratorDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingGeneratorDto[]>({
      method: 'POST',
      url: '/api/app/naming-generator/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: NamingGeneratorGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<NamingGeneratorDto>>({
      method: 'GET',
      url: '/api/app/naming-generator',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/naming-generator/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportNamingGeneratorDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/naming-generator/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/naming-generator/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateNamingGeneratorDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingGeneratorDto[]>({
      method: 'PUT',
      url: '/api/app/naming-generator/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateNamingGeneratorDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingGeneratorDto>({
      method: 'PUT',
      url: `/api/app/naming-generator/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
