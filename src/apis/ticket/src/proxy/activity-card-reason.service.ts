import type { ActivityCardReasonDto, ActivityCardReasonExportDto, ActivityCardReasonGetListInput, CreateUpdateActivityCardReasonDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActivityCardReasonService {
  apiName = 'ticket';
  

  copy = (input: CreateUpdateActivityCardReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardReasonDto>({
      method: 'POST',
      url: '/api/app/activity-card-reason/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateActivityCardReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardReasonDto>({
      method: 'POST',
      url: '/api/app/activity-card-reason',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateActivityCardReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardReasonDto>({
      method: 'POST',
      url: '/api/app/activity-card-reason/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/activity-card-reason/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/activity-card-reason/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/activity-card-reason/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardReasonDto>({
      method: 'GET',
      url: `/api/app/activity-card-reason/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardReasonDto[]>({
      method: 'GET',
      url: '/api/app/activity-card-reason/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardReasonDto>({
      method: 'GET',
      url: '/api/app/activity-card-reason/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ActivityCardReasonExportDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardReasonDto[]>({
      method: 'POST',
      url: '/api/app/activity-card-reason/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ActivityCardReasonGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ActivityCardReasonDto>>({
      method: 'GET',
      url: '/api/app/activity-card-reason',
      params: { cardCategoryId: input.cardCategoryId, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/activity-card-reason/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ActivityCardReasonExportDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/activity-card-reason/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/activity-card-reason/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateActivityCardReasonDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardReasonDto[]>({
      method: 'PUT',
      url: '/api/app/activity-card-reason/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateActivityCardReasonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardReasonDto>({
      method: 'PUT',
      url: `/api/app/activity-card-reason/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
