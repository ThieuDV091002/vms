import type { CreateUpdateLocalScrapReasonDto, ExportLocalScrapReasonDto, ImportResultDto, LocalScrapReasonDto, LocalScrapReasonGetListInput, ModelingHistoryDto, ModelingInput } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalScrapReasonService {
  apiName = 'general';
  

  copy = (input: CreateUpdateLocalScrapReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalScrapReasonDto>({
      method: 'POST',
      url: '/api/app/local-scrap-reason/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateLocalScrapReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalScrapReasonDto>({
      method: 'POST',
      url: '/api/app/local-scrap-reason',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateLocalScrapReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalScrapReasonDto>({
      method: 'POST',
      url: '/api/app/local-scrap-reason/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/local-scrap-reason/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/local-scrap-reason/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/local-scrap-reason/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalScrapReasonDto>({
      method: 'GET',
      url: `/api/app/local-scrap-reason/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalScrapReasonDto[]>({
      method: 'GET',
      url: '/api/app/local-scrap-reason/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalScrapReasonDto>({
      method: 'GET',
      url: '/api/app/local-scrap-reason/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportLocalScrapReasonDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalScrapReasonDto[]>({
      method: 'POST',
      url: '/api/app/local-scrap-reason/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: LocalScrapReasonGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LocalScrapReasonDto>>({
      method: 'GET',
      url: '/api/app/local-scrap-reason',
      params: { globalScrapCodeId: input.globalScrapCodeId, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/local-scrap-reason/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportLocalScrapReasonDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/local-scrap-reason/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/local-scrap-reason/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateLocalScrapReasonDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalScrapReasonDto[]>({
      method: 'PUT',
      url: '/api/app/local-scrap-reason/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLocalScrapReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalScrapReasonDto>({
      method: 'PUT',
      url: `/api/app/local-scrap-reason/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
