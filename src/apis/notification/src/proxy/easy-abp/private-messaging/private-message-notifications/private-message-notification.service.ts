import type { PrivateMessageNotificationDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { IActionResult } from '../../../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class PrivateMessageNotificationService {
  apiName = 'notification';
  

  count = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>({
      method: 'POST',
      url: '/api/private-messaging/private-message-notification/count',
    },
    { apiName: this.apiName,...config });
  

  delete = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/private-messaging/private-message-notification',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PrivateMessageNotificationDto>>({
      method: 'GET',
      url: '/api/private-messaging/private-message-notification',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  pmNotification = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/widgets/pm-notification',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
