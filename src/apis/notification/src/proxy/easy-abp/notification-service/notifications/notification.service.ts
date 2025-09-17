import type { CreateUpdateNotificationDto, NotificationDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  apiName = 'notification';
  

  create = (input: CreateUpdateNotificationDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationDto>({
      method: 'POST',
      url: '/api/notification-service/notification',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/notification-service/notification/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationDto>({
      method: 'GET',
      url: `/api/notification-service/notification/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<NotificationDto>>({
      method: 'GET',
      url: '/api/notification-service/notification',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateNotificationDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationDto>({
      method: 'PUT',
      url: `/api/notification-service/notification/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
