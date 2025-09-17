import type { CreateUpdateGlobalScrapCodeDto, GlobalScrapCodeDto, GlobalScrapCodeGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ExportNameObjectDto, ImportResultDto, ModelingHistoryDto, ModelingInput } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class GlobalScrapCodeService {
  apiName = 'general';
  

  copy = (input: CreateUpdateGlobalScrapCodeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalScrapCodeDto>({
      method: 'POST',
      url: '/api/app/global-scrap-code/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateGlobalScrapCodeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalScrapCodeDto>({
      method: 'POST',
      url: '/api/app/global-scrap-code',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateGlobalScrapCodeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalScrapCodeDto>({
      method: 'POST',
      url: '/api/app/global-scrap-code/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/global-scrap-code/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/global-scrap-code/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/global-scrap-code/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalScrapCodeDto>({
      method: 'GET',
      url: `/api/app/global-scrap-code/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalScrapCodeDto[]>({
      method: 'GET',
      url: '/api/app/global-scrap-code/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalScrapCodeDto>({
      method: 'GET',
      url: '/api/app/global-scrap-code/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportNameObjectDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalScrapCodeDto[]>({
      method: 'POST',
      url: '/api/app/global-scrap-code/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GlobalScrapCodeGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<GlobalScrapCodeDto>>({
      method: 'GET',
      url: '/api/app/global-scrap-code',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/global-scrap-code/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportNameObjectDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/global-scrap-code/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/global-scrap-code/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateGlobalScrapCodeDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalScrapCodeDto[]>({
      method: 'PUT',
      url: '/api/app/global-scrap-code/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateGlobalScrapCodeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalScrapCodeDto>({
      method: 'PUT',
      url: `/api/app/global-scrap-code/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
