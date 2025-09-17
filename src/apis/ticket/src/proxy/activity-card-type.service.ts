import type { ActivityCardTypeDto, ActivityCardTypeExportDto, ActivityCardTypeGetListInput, CreateUpdateActivityCardTypeDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActivityCardTypeService {
  apiName = 'ticket';
  

  copy = (input: CreateUpdateActivityCardTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardTypeDto>({
      method: 'POST',
      url: '/api/app/activity-card-type/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateActivityCardTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardTypeDto>({
      method: 'POST',
      url: '/api/app/activity-card-type',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateActivityCardTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardTypeDto>({
      method: 'POST',
      url: '/api/app/activity-card-type/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/activity-card-type/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/activity-card-type/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/activity-card-type/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardTypeDto>({
      method: 'GET',
      url: `/api/app/activity-card-type/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardTypeDto[]>({
      method: 'GET',
      url: '/api/app/activity-card-type/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardTypeDto>({
      method: 'GET',
      url: '/api/app/activity-card-type/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ActivityCardTypeExportDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardTypeDto[]>({
      method: 'POST',
      url: '/api/app/activity-card-type/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ActivityCardTypeGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ActivityCardTypeDto>>({
      method: 'GET',
      url: '/api/app/activity-card-type',
      params: { stateModelId: input.stateModelId, initialStatusId: input.initialStatusId, cardColor: input.cardColor, requiredEscalation: input.requiredEscalation, requiredValueRealization: input.requiredValueRealization, requiredIncidentDate: input.requiredIncidentDate, requiredReason: input.requiredReason, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/activity-card-type/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ActivityCardTypeExportDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/activity-card-type/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/activity-card-type/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateActivityCardTypeDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardTypeDto[]>({
      method: 'PUT',
      url: '/api/app/activity-card-type/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateActivityCardTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardTypeDto>({
      method: 'PUT',
      url: `/api/app/activity-card-type/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
