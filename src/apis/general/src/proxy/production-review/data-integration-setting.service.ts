import type { CreateUpdateDataIntegrationSettingDto, DataIntegrationSettingDto, DataIntegrationSettingGetListInput, ExportIntegrationSettingDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ImportResultDto, ModelingHistoryDto, ModelingInput } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class DataIntegrationSettingService {
  apiName = 'general';
  

  copy = (input: CreateUpdateDataIntegrationSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DataIntegrationSettingDto>({
      method: 'POST',
      url: '/api/app/data-integration-setting/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateDataIntegrationSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DataIntegrationSettingDto>({
      method: 'POST',
      url: '/api/app/data-integration-setting',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateDataIntegrationSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DataIntegrationSettingDto>({
      method: 'POST',
      url: '/api/app/data-integration-setting/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/data-integration-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/data-integration-setting/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/data-integration-setting/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DataIntegrationSettingDto>({
      method: 'GET',
      url: `/api/app/data-integration-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DataIntegrationSettingDto[]>({
      method: 'GET',
      url: '/api/app/data-integration-setting/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DataIntegrationSettingDto>({
      method: 'GET',
      url: '/api/app/data-integration-setting/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportIntegrationSettingDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, DataIntegrationSettingDto[]>({
      method: 'POST',
      url: '/api/app/data-integration-setting/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: DataIntegrationSettingGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DataIntegrationSettingDto>>({
      method: 'GET',
      url: '/api/app/data-integration-setting',
      params: { databaseName: input.databaseName, goodQtyStoredProc: input.goodQtyStoredProc, scrapQtyStoredProc: input.scrapQtyStoredProc, reworkQtyStoredProc: input.reworkQtyStoredProc, downtimeStoredProc: input.downtimeStoredProc, breaktimeStoredProc: input.breaktimeStoredProc, laborStoredProc: input.laborStoredProc, productionQtyDataMethod: input.productionQtyDataMethod, scrapQtyDataMethod: input.scrapQtyDataMethod, reworkQtyDataMethod: input.reworkQtyDataMethod, downtimeDataMethod: input.downtimeDataMethod, breaktimeDataMethod: input.breaktimeDataMethod, laborDataMethod: input.laborDataMethod, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/data-integration-setting/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportIntegrationSettingDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/data-integration-setting/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/data-integration-setting/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateDataIntegrationSettingDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DataIntegrationSettingDto[]>({
      method: 'PUT',
      url: '/api/app/data-integration-setting/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateDataIntegrationSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DataIntegrationSettingDto>({
      method: 'PUT',
      url: `/api/app/data-integration-setting/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
