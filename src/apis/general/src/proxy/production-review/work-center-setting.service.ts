import type { CreateUpdateWorkCenterSettingDto, ExportWorkCenterSettingDto, WorkCenterListDto, WorkCenterListGetInputDto, WorkCenterSettingDto, WorkCenterSettingGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ImportResultDto, ModelingHistoryDto, ModelingInput } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class WorkCenterSettingService {
  apiName = 'general';
  

  copy = (input: CreateUpdateWorkCenterSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterSettingDto>({
      method: 'POST',
      url: '/api/app/work-center-setting/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateWorkCenterSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterSettingDto>({
      method: 'POST',
      url: '/api/app/work-center-setting',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateWorkCenterSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterSettingDto>({
      method: 'POST',
      url: '/api/app/work-center-setting/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/work-center-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/work-center-setting/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/work-center-setting/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterSettingDto>({
      method: 'GET',
      url: `/api/app/work-center-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterSettingDto[]>({
      method: 'GET',
      url: '/api/app/work-center-setting/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterSettingDto>({
      method: 'GET',
      url: '/api/app/work-center-setting/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportWorkCenterSettingDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterSettingDto[]>({
      method: 'POST',
      url: '/api/app/work-center-setting/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: WorkCenterSettingGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<WorkCenterSettingDto>>({
      method: 'GET',
      url: '/api/app/work-center-setting',
      params: { workCenterId: input.workCenterId, dataIntegrationSettingId: input.dataIntegrationSettingId, kpi: input.kpi, goodQtyOption: input.goodQtyOption, scrapQtyOption: input.scrapQtyOption, fpyTarget: input.fpyTarget, sppmTarget: input.sppmTarget, performanceTarget: input.performanceTarget, upphTarget: input.upphTarget, udtTarget: input.udtTarget, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListByWorkCenterIdsByWorkCenterIds = (workCenterIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterSettingDto[]>({
      method: 'GET',
      url: '/api/app/work-center-setting/by-work-center-ids',
      params: { workCenterIds },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/work-center-setting/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getWorkCenterList = (input: WorkCenterListGetInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterListDto[]>({
      method: 'GET',
      url: '/api/app/work-center-setting/work-center-list',
      params: { method: input.method, type: input.type, databaseName: input.databaseName, site: input.site },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportWorkCenterSettingDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/work-center-setting/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/work-center-setting/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateWorkCenterSettingDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterSettingDto[]>({
      method: 'PUT',
      url: '/api/app/work-center-setting/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateWorkCenterSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterSettingDto>({
      method: 'PUT',
      url: `/api/app/work-center-setting/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
