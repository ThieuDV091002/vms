import type { CreateUpdateSiteSettingDto, ExportSiteSettingDto, ImportResultDto, ModelingHistoryDto, ModelingInput, SiteSettingDto, SiteSettingGetListInput } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import type { SiteSettingTargetType } from './site-setting-target-type.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SiteSettingService {
  apiName = 'general';
  

  copy = (input: CreateUpdateSiteSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteSettingDto>({
      method: 'POST',
      url: '/api/app/site-setting/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateSiteSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteSettingDto>({
      method: 'POST',
      url: '/api/app/site-setting',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateSiteSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteSettingDto>({
      method: 'POST',
      url: '/api/app/site-setting/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/site-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/site-setting/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/site-setting/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteSettingDto>({
      method: 'GET',
      url: `/api/app/site-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteSettingDto[]>({
      method: 'GET',
      url: '/api/app/site-setting/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteSettingDto>({
      method: 'GET',
      url: '/api/app/site-setting/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportSiteSettingDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteSettingDto[]>({
      method: 'POST',
      url: '/api/app/site-setting/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: SiteSettingGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SiteSettingDto>>({
      method: 'GET',
      url: '/api/app/site-setting',
      params: { siteId: input.siteId, safetyIncidentsTarget: input.safetyIncidentsTarget, nearMissesTarget: input.nearMissesTarget, externalQNsTarget: input.externalQNsTarget, internalQNsTarget: input.internalQNsTarget, copqTarget: input.copqTarget, copqcogsTarget: input.copqcogsTarget, peopleProdTarget: input.peopleProdTarget, assetProdTarget: input.assetProdTarget, oeeTarget: input.oeeTarget, poeeTarget: input.poeeTarget, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListBySiteIdsBySiteIds = (siteIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteSettingDto[]>({
      method: 'GET',
      url: '/api/app/site-setting/by-site-ids',
      params: { siteIds },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/site-setting/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getTargetValue = (siteId: string, targetType: SiteSettingTargetType, date: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>({
      method: 'GET',
      url: `/api/app/site-setting/target-value/${siteId}`,
      params: { targetType, date },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportSiteSettingDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/site-setting/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/site-setting/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateSiteSettingDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteSettingDto[]>({
      method: 'PUT',
      url: '/api/app/site-setting/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateSiteSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteSettingDto>({
      method: 'PUT',
      url: `/api/app/site-setting/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
