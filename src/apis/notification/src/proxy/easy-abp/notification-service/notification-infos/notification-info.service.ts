import type { CreateUpdateNotificationInfoDto, NotificationInfoDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationInfoService {
  apiName = 'notification';
  

  create = (input: CreateUpdateNotificationInfoDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationInfoDto>({
      method: 'POST',
      url: '/api/notification-service/notification-info',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/notification-service/notification-info/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationInfoDto>({
      method: 'GET',
      url: `/api/notification-service/notification-info/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<NotificationInfoDto>>({
      method: 'GET',
      url: '/api/notification-service/notification-info',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateNotificationInfoDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationInfoDto>({
      method: 'PUT',
      url: `/api/notification-service/notification-info/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
