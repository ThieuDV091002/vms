import type { CreateUpdateWorkCenterDto, ExportWorkCenterDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto, WorkCenterDto, WorkCenterGetListInput } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkCenterService {
  apiName = 'corporate';
  

  copy = (input: CreateUpdateWorkCenterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterDto>({
      method: 'POST',
      url: '/api/app/work-center/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateWorkCenterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterDto>({
      method: 'POST',
      url: '/api/app/work-center',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateWorkCenterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterDto>({
      method: 'POST',
      url: '/api/app/work-center/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/work-center/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/work-center/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportAllByTenantInfoByFileTypeAndTenantDataTierTypeAndTenantDataTierId = (fileType: FileType, tenantDataTierType?: string, tenantDataTierId?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/work-center/export-all-by-tenant',
      params: { fileType, tenantDataTierType, tenantDataTierId },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/work-center/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterDto>({
      method: 'GET',
      url: `/api/app/work-center/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterDto[]>({
      method: 'GET',
      url: '/api/app/work-center/instances',
    },
    { apiName: this.apiName,...config });
  

  getAllInstancesByTenantInfo = (tenantDataTierType?: string, tenantDataTierId?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterDto[]>({
      method: 'GET',
      url: '/api/app/work-center/instances-by-tenant',
      params: { tenantDataTierType, tenantDataTierId },
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterDto>({
      method: 'GET',
      url: '/api/app/work-center/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportWorkCenterDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterDto[]>({
      method: 'POST',
      url: '/api/app/work-center/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: WorkCenterGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<WorkCenterDto>>({
      method: 'GET',
      url: '/api/app/work-center',
      params: { name: input.name, area: input.area, cell: input.cell, creationTimeFrom: input.creationTimeFrom, creationTimeTo: input.creationTimeTo, modificationTimeFrom: input.modificationTimeFrom, modificationTimeTo: input.modificationTimeTo, tenantDataTierType: input.tenantDataTierType, tenantDataTierID: input.tenantDataTierID, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/work-center/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportWorkCenterDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/work-center/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/work-center/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateWorkCenterDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterDto[]>({
      method: 'PUT',
      url: '/api/app/work-center/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateWorkCenterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterDto>({
      method: 'PUT',
      url: `/api/app/work-center/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
