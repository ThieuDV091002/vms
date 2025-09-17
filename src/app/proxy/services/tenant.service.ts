import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ModelingHistoryDto, ModelingInputDto } from '../dtos/modeling/models';
import type { ImportResultDto } from '../dtos/models';
import type { CreateUpdateTenantModelingDto, ExportTenantDto, UpdateTenantPasswordDto } from '../dtos/tenant/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';
import type { GetTenantsInput, TenantDto } from '../volo/abp/tenant-management/models';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  apiName = 'Default';
  

  checkConnectionString = (connectionString: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/tenant/check-connection-string',
      params: { connectionString },
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/tenant/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/tenant/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: CreateUpdateTenantModelingDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, TenantDto[]>({
      method: 'POST',
      url: '/api/app/tenant/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetTenantsInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<TenantDto>>({
      method: 'GET',
      url: '/api/app/tenant',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/tenant/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportTenantDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/tenant/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/tenant/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  updateResetPassword = (input: UpdateTenantPasswordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/app/tenant/reset-password',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
