import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateSchedulerSettingDto, ExportSchedulerSettingDto, ImportResultDto, ModelingHistoryDto, ModelingInput, SchedulerExecutionHistoryDto, SchedulerExecutionHistoryGetListInput, SchedulerSettingDto, SchedulerSettingGetListInput } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class SchedulerSettingService {
  apiName = 'scheduler';
  

  copy = (input: CreateUpdateSchedulerSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SchedulerSettingDto>({
      method: 'POST',
      url: '/api/app/scheduler-setting/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateSchedulerSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SchedulerSettingDto>({
      method: 'POST',
      url: '/api/app/scheduler-setting',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/scheduler-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/scheduler-setting/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/scheduler-setting/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SchedulerSettingDto>({
      method: 'GET',
      url: `/api/app/scheduler-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, SchedulerSettingDto[]>({
      method: 'GET',
      url: '/api/app/scheduler-setting/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SchedulerSettingDto>({
      method: 'GET',
      url: '/api/app/scheduler-setting/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExecutionHistoryByInput = (input: SchedulerExecutionHistoryGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SchedulerExecutionHistoryDto>>({
      method: 'GET',
      url: '/api/app/scheduler-setting/execution-history',
      params: { schedulerId: input.schedulerId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportSchedulerSettingDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, SchedulerSettingDto[]>({
      method: 'POST',
      url: '/api/app/scheduler-setting/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: SchedulerSettingGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SchedulerSettingDto>>({
      method: 'GET',
      url: '/api/app/scheduler-setting',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/scheduler-setting/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByEntitiesAndMode = (entities: ExportSchedulerSettingDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/scheduler-setting/import',
      params: { mode },
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/scheduler-setting/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  startSchedulerJobBySchedulerId = (schedulerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SchedulerSettingDto>({
      method: 'POST',
      url: `/api/app/scheduler-setting/start-scheduler-job/${schedulerId}`,
    },
    { apiName: this.apiName,...config });
  

  stopSchedulerJobBySchedulerId = (schedulerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SchedulerSettingDto>({
      method: 'POST',
      url: `/api/app/scheduler-setting/stop-scheduler-job/${schedulerId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateSchedulerSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SchedulerSettingDto>({
      method: 'PUT',
      url: `/api/app/scheduler-setting/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
