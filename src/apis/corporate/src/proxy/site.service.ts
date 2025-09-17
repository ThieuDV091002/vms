import type { CreateUpdateSiteDto, ExportSiteDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto, SiteDto, SiteGetListInput, SiteTreeViewDto } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  apiName = 'corporate';
  

  copy = (input: CreateUpdateSiteDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteDto>({
      method: 'POST',
      url: '/api/app/site/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateSiteDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteDto>({
      method: 'POST',
      url: '/api/app/site',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateSiteDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteDto>({
      method: 'POST',
      url: '/api/app/site/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/site/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/site/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportAllByTenantInfoByFileTypeAndTenantDataTierTypeAndTenantDataTierId = (fileType: FileType, tenantDataTierType?: string, tenantDataTierId?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/site/export-all-by-tenant',
      params: { fileType, tenantDataTierType, tenantDataTierId },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/site/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteDto>({
      method: 'GET',
      url: `/api/app/site/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteDto[]>({
      method: 'GET',
      url: '/api/app/site/instances',
    },
    { apiName: this.apiName,...config });
  

  getAllInstancesByTenantInfo = (tenantDataTierType?: string, tenantDataTierId?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteDto[]>({
      method: 'GET',
      url: '/api/app/site/instances-by-tenant',
      params: { tenantDataTierType, tenantDataTierId },
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteDto>({
      method: 'GET',
      url: '/api/app/site/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportSiteDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteDto[]>({
      method: 'POST',
      url: '/api/app/site/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: SiteGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SiteDto>>({
      method: 'GET',
      url: '/api/app/site',
      params: { division: input.division, sapSiteCode: input.sapSiteCode, name: input.name, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/site/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getTreeView = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteTreeViewDto>({
      method: 'GET',
      url: `/api/app/site/${id}/tree-view`,
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportSiteDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/site/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/site/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateSiteDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteDto[]>({
      method: 'PUT',
      url: '/api/app/site/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateSiteDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteDto>({
      method: 'PUT',
      url: `/api/app/site/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
