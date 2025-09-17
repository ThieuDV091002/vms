import type { CreateLocalDowntimeReasonFromMESDto, CreateUpdateLocalDowntimeReasonDto, ExportLocalDowntimeReasonDto, ImportResultDto, LocalDowntimeReasonDto, LocalDowntimeReasonGetListInput, ModelingHistoryDto, ModelingInput } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalDowntimeReasonService {
  apiName = 'general';
  

  copy = (input: CreateUpdateLocalDowntimeReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalDowntimeReasonDto>({
      method: 'POST',
      url: '/api/app/local-downtime-reason/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateLocalDowntimeReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalDowntimeReasonDto>({
      method: 'POST',
      url: '/api/app/local-downtime-reason',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateLocalDowntimeReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalDowntimeReasonDto>({
      method: 'POST',
      url: '/api/app/local-downtime-reason/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/local-downtime-reason/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/local-downtime-reason/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/local-downtime-reason/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalDowntimeReasonDto>({
      method: 'GET',
      url: `/api/app/local-downtime-reason/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalDowntimeReasonDto[]>({
      method: 'GET',
      url: '/api/app/local-downtime-reason/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalDowntimeReasonDto>({
      method: 'GET',
      url: '/api/app/local-downtime-reason/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportLocalDowntimeReasonDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalDowntimeReasonDto[]>({
      method: 'POST',
      url: '/api/app/local-downtime-reason/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: LocalDowntimeReasonGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LocalDowntimeReasonDto>>({
      method: 'GET',
      url: '/api/app/local-downtime-reason',
      params: { globalDowntimeCodeId: input.globalDowntimeCodeId, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/local-downtime-reason/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportLocalDowntimeReasonDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/local-downtime-reason/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  localDowntimeReasonFromMESByInput = (input: CreateLocalDowntimeReasonFromMESDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/local-downtime-reason/Local-Downtime-Reason-From-MES',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/local-downtime-reason/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateLocalDowntimeReasonDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalDowntimeReasonDto[]>({
      method: 'PUT',
      url: '/api/app/local-downtime-reason/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLocalDowntimeReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalDowntimeReasonDto>({
      method: 'PUT',
      url: `/api/app/local-downtime-reason/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
