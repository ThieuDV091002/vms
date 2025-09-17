import type { CellDto, CellGetListInput, CreateUpdateCellDto, ExportCellDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CellService {
  apiName = 'corporate';
  

  copy = (input: CreateUpdateCellDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellDto>({
      method: 'POST',
      url: '/api/app/cell/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateCellDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellDto>({
      method: 'POST',
      url: '/api/app/cell',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateCellDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellDto>({
      method: 'POST',
      url: '/api/app/cell/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/cell/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/cell/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportAllByTenantInfoByFileTypeAndTenantDataTierTypeAndTenantDataTierId = (fileType: FileType, tenantDataTierType?: string, tenantDataTierId?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/cell/export-all-by-tenant',
      params: { fileType, tenantDataTierType, tenantDataTierId },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/cell/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellDto>({
      method: 'GET',
      url: `/api/app/cell/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellDto[]>({
      method: 'GET',
      url: '/api/app/cell/instances',
    },
    { apiName: this.apiName,...config });
  

  getAllInstancesByTenantInfo = (tenantDataTierType?: string, tenantDataTierId?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellDto[]>({
      method: 'GET',
      url: '/api/app/cell/instances-by-tenant',
      params: { tenantDataTierType, tenantDataTierId },
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellDto>({
      method: 'GET',
      url: '/api/app/cell/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportCellDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellDto[]>({
      method: 'POST',
      url: '/api/app/cell/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: CellGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CellDto>>({
      method: 'GET',
      url: '/api/app/cell',
      params: { name: input.name, area: input.area, tenantDataTierType: input.tenantDataTierType, tenantDataTierID: input.tenantDataTierID, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/cell/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportCellDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/cell/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/cell/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateCellDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellDto[]>({
      method: 'PUT',
      url: '/api/app/cell/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCellDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellDto>({
      method: 'PUT',
      url: `/api/app/cell/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
