import type { ActivityCardSettingsDto, ActivityCardSettingsExportDto, ActivityCardSettingsGetListInput, CreateUpdateActivityCardSettingsDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import type { IdentityUserDto } from './volo/abp/identity/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActivityCardSettingsService {
  apiName = 'ticket';
  

  copy = (input: CreateUpdateActivityCardSettingsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardSettingsDto>({
      method: 'POST',
      url: '/api/app/activity-card-settings/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateActivityCardSettingsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardSettingsDto>({
      method: 'POST',
      url: '/api/app/activity-card-settings',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateActivityCardSettingsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardSettingsDto>({
      method: 'POST',
      url: '/api/app/activity-card-settings/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/activity-card-settings/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/activity-card-settings/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/activity-card-settings/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardSettingsDto>({
      method: 'GET',
      url: `/api/app/activity-card-settings/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardSettingsDto[]>({
      method: 'GET',
      url: '/api/app/activity-card-settings/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardSettingsDto>({
      method: 'GET',
      url: '/api/app/activity-card-settings/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getDefaultOwnerByDataTierIdAndDataTierType = (dataTierId: string, dataTierType: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IdentityUserDto>({
      method: 'GET',
      url: `/api/app/activity-card-settings/default-owner/${dataTierId}`,
      params: { dataTierType },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ActivityCardSettingsExportDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardSettingsDto[]>({
      method: 'POST',
      url: '/api/app/activity-card-settings/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ActivityCardSettingsGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ActivityCardSettingsDto>>({
      method: 'GET',
      url: '/api/app/activity-card-settings',
      params: { keyword: input.keyword, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/activity-card-settings/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ActivityCardSettingsExportDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/activity-card-settings/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/activity-card-settings/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateActivityCardSettingsDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardSettingsDto[]>({
      method: 'PUT',
      url: '/api/app/activity-card-settings/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateActivityCardSettingsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardSettingsDto>({
      method: 'PUT',
      url: `/api/app/activity-card-settings/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
