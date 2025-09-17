import type { AreaDto, AreaGetListInput, AreaTreeViewDto, AreaTreeViewGetListInput, CreateUpdateAreaDto, ExportAreaDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  apiName = 'corporate';
  

  copy = (input: CreateUpdateAreaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaDto>({
      method: 'POST',
      url: '/api/app/area/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateAreaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaDto>({
      method: 'POST',
      url: '/api/app/area',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateAreaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaDto>({
      method: 'POST',
      url: '/api/app/area/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/area/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/area/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportAllByTenantInfoByFileTypeAndTenantDataTierTypeAndTenantDataTierId = (fileType: FileType, tenantDataTierType?: string, tenantDataTierId?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/area/export-all-by-tenant',
      params: { fileType, tenantDataTierType, tenantDataTierId },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/area/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaDto>({
      method: 'GET',
      url: `/api/app/area/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaDto[]>({
      method: 'GET',
      url: '/api/app/area/instances',
    },
    { apiName: this.apiName,...config });
  

  getAllInstancesByTenantInfo = (tenantDataTierType?: string, tenantDataTierId?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaDto[]>({
      method: 'GET',
      url: '/api/app/area/instances-by-tenant',
      params: { tenantDataTierType, tenantDataTierId },
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaDto>({
      method: 'GET',
      url: '/api/app/area/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportAreaDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaDto[]>({
      method: 'POST',
      url: '/api/app/area/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: AreaGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AreaDto>>({
      method: 'GET',
      url: '/api/app/area',
      params: { site: input.site, name: input.name, ids: input.ids, tenantDataTierType: input.tenantDataTierType, tenantDataTierID: input.tenantDataTierID, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/area/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getTreeView = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaTreeViewDto>({
      method: 'GET',
      url: `/api/app/area/${id}/tree-view`,
    },
    { apiName: this.apiName,...config });
  

  getTreeViewList = (input: AreaTreeViewGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaTreeViewDto[]>({
      method: 'GET',
      url: '/api/app/area/tree-view-list',
      params: { site: input.site, name: input.name, ids: input.ids, tenantDataTierType: input.tenantDataTierType, tenantDataTierID: input.tenantDataTierID },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportAreaDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/area/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/area/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateAreaDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaDto[]>({
      method: 'PUT',
      url: '/api/app/area/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateAreaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaDto>({
      method: 'PUT',
      url: `/api/app/area/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
