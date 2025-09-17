import type { ActivityCardPriorityDto, ActivityCardPriorityExportDto, ActivityCardPriorityGetListInput, CreateUpdateActivityCardPriorityDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActivityCardPriorityService {
  apiName = 'ticket';
  

  copy = (input: CreateUpdateActivityCardPriorityDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardPriorityDto>({
      method: 'POST',
      url: '/api/app/activity-card-priority/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateActivityCardPriorityDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardPriorityDto>({
      method: 'POST',
      url: '/api/app/activity-card-priority',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateActivityCardPriorityDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardPriorityDto>({
      method: 'POST',
      url: '/api/app/activity-card-priority/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/activity-card-priority/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/activity-card-priority/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/activity-card-priority/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardPriorityDto>({
      method: 'GET',
      url: `/api/app/activity-card-priority/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardPriorityDto[]>({
      method: 'GET',
      url: '/api/app/activity-card-priority/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardPriorityDto>({
      method: 'GET',
      url: '/api/app/activity-card-priority/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ActivityCardPriorityExportDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardPriorityDto[]>({
      method: 'POST',
      url: '/api/app/activity-card-priority/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ActivityCardPriorityGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ActivityCardPriorityDto>>({
      method: 'GET',
      url: '/api/app/activity-card-priority',
      params: { color: input.color, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/activity-card-priority/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ActivityCardPriorityExportDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/activity-card-priority/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/activity-card-priority/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateActivityCardPriorityDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardPriorityDto[]>({
      method: 'PUT',
      url: '/api/app/activity-card-priority/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateActivityCardPriorityDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardPriorityDto>({
      method: 'PUT',
      url: `/api/app/activity-card-priority/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
