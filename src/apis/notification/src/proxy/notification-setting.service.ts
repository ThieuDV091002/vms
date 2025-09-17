import type { ImportResultDto, ModelingHistoryDto, ModelingInputDto } from './dtos/models';
import type { CreateUpdateNotificationSettingDto, ExportNotificationSettingDto, NotificationSettingDto, NotificationSettingGetListInput } from './dtos/notification-settings/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationSettingService {
  apiName = 'notification';
  

  copy = (input: CreateUpdateNotificationSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationSettingDto>({
      method: 'POST',
      url: '/api/app/notification-setting/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateNotificationSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationSettingDto>({
      method: 'POST',
      url: '/api/app/notification-setting',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateNotificationSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationSettingDto>({
      method: 'POST',
      url: '/api/app/notification-setting/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/notification-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/notification-setting/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/notification-setting/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationSettingDto>({
      method: 'GET',
      url: `/api/app/notification-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationSettingDto[]>({
      method: 'GET',
      url: '/api/app/notification-setting/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationSettingDto>({
      method: 'GET',
      url: '/api/app/notification-setting/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportNotificationSettingDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationSettingDto[]>({
      method: 'POST',
      url: '/api/app/notification-setting/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: NotificationSettingGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<NotificationSettingDto>>({
      method: 'GET',
      url: '/api/app/notification-setting',
      params: { microservice: input.microservice, object: input.object, action: input.action, api: input.api, topic: input.topic, sender: input.sender, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/notification-setting/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportNotificationSettingDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/notification-setting/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/notification-setting/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateNotificationSettingDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationSettingDto[]>({
      method: 'PUT',
      url: '/api/app/notification-setting/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateNotificationSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationSettingDto>({
      method: 'PUT',
      url: `/api/app/notification-setting/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
