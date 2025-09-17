import type { CreateUpdateGlobalDowntimeCodeDto, ExportGlobalDowntimeCodeDto, GlobalDowntimeCodeDto, GlobalDowntimeCodeGetListInput, ImportResultDto, ModelingHistoryDto, ModelingInput } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalDowntimeCodeService {
  apiName = 'general';
  

  copy = (input: CreateUpdateGlobalDowntimeCodeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalDowntimeCodeDto>({
      method: 'POST',
      url: '/api/app/global-downtime-code/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateGlobalDowntimeCodeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalDowntimeCodeDto>({
      method: 'POST',
      url: '/api/app/global-downtime-code',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateGlobalDowntimeCodeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalDowntimeCodeDto>({
      method: 'POST',
      url: '/api/app/global-downtime-code/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/global-downtime-code/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/global-downtime-code/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/global-downtime-code/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalDowntimeCodeDto>({
      method: 'GET',
      url: `/api/app/global-downtime-code/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalDowntimeCodeDto[]>({
      method: 'GET',
      url: '/api/app/global-downtime-code/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalDowntimeCodeDto>({
      method: 'GET',
      url: '/api/app/global-downtime-code/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportGlobalDowntimeCodeDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalDowntimeCodeDto[]>({
      method: 'POST',
      url: '/api/app/global-downtime-code/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GlobalDowntimeCodeGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<GlobalDowntimeCodeDto>>({
      method: 'GET',
      url: '/api/app/global-downtime-code',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/global-downtime-code/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportGlobalDowntimeCodeDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/global-downtime-code/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/global-downtime-code/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateGlobalDowntimeCodeDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalDowntimeCodeDto[]>({
      method: 'PUT',
      url: '/api/app/global-downtime-code/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateGlobalDowntimeCodeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GlobalDowntimeCodeDto>({
      method: 'PUT',
      url: `/api/app/global-downtime-code/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
