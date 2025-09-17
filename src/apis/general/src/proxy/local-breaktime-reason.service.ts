import type { CreateUpdateLocalBreaktimeReasonDto, ExportNameObjectDto, ImportResultDto, LocalBreaktimeReasonDto, LocalBreaktimeReasonGetListInput, ModelingHistoryDto, ModelingInput } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalBreaktimeReasonService {
  apiName = 'general';
  

  copy = (input: CreateUpdateLocalBreaktimeReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalBreaktimeReasonDto>({
      method: 'POST',
      url: '/api/app/local-breaktime-reason/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateLocalBreaktimeReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalBreaktimeReasonDto>({
      method: 'POST',
      url: '/api/app/local-breaktime-reason',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateLocalBreaktimeReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalBreaktimeReasonDto>({
      method: 'POST',
      url: '/api/app/local-breaktime-reason/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/local-breaktime-reason/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/local-breaktime-reason/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/local-breaktime-reason/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalBreaktimeReasonDto>({
      method: 'GET',
      url: `/api/app/local-breaktime-reason/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalBreaktimeReasonDto[]>({
      method: 'GET',
      url: '/api/app/local-breaktime-reason/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalBreaktimeReasonDto>({
      method: 'GET',
      url: '/api/app/local-breaktime-reason/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportNameObjectDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalBreaktimeReasonDto[]>({
      method: 'POST',
      url: '/api/app/local-breaktime-reason/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: LocalBreaktimeReasonGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LocalBreaktimeReasonDto>>({
      method: 'GET',
      url: '/api/app/local-breaktime-reason',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/local-breaktime-reason/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportNameObjectDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/local-breaktime-reason/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/local-breaktime-reason/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateLocalBreaktimeReasonDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalBreaktimeReasonDto[]>({
      method: 'PUT',
      url: '/api/app/local-breaktime-reason/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLocalBreaktimeReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalBreaktimeReasonDto>({
      method: 'PUT',
      url: `/api/app/local-breaktime-reason/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
