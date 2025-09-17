import type { CreateUpdateDivisionDto, DivisionDto, DivisionGetListInput, ExportDivisionDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DivisionService {
  apiName = 'corporate';
  

  copy = (input: CreateUpdateDivisionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DivisionDto>({
      method: 'POST',
      url: '/api/app/division/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateDivisionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DivisionDto>({
      method: 'POST',
      url: '/api/app/division',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateDivisionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DivisionDto>({
      method: 'POST',
      url: '/api/app/division/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/division/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/division/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportAllByTenantInfoByFileTypeAndTenantDataTierTypeAndTenantDataTierId = (fileType: FileType, tenantDataTierType?: string, tenantDataTierId?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/division/export-all-by-tenant',
      params: { fileType, tenantDataTierType, tenantDataTierId },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/division/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DivisionDto>({
      method: 'GET',
      url: `/api/app/division/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DivisionDto[]>({
      method: 'GET',
      url: '/api/app/division/instances',
    },
    { apiName: this.apiName,...config });
  

  getAllInstancesByTenantInfo = (tenantDataTierType?: string, tenantDataTierId?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DivisionDto[]>({
      method: 'GET',
      url: '/api/app/division/instances-by-tenant',
      params: { tenantDataTierType, tenantDataTierId },
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DivisionDto>({
      method: 'GET',
      url: '/api/app/division/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportDivisionDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, DivisionDto[]>({
      method: 'POST',
      url: '/api/app/division/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: DivisionGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DivisionDto>>({
      method: 'GET',
      url: '/api/app/division',
      params: { name: input.name, corporate: input.corporate, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/division/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportDivisionDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/division/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/division/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateDivisionDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DivisionDto[]>({
      method: 'PUT',
      url: '/api/app/division/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateDivisionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DivisionDto>({
      method: 'PUT',
      url: `/api/app/division/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
