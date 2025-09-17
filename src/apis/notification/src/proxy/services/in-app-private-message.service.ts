import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PrivateMessageNotificationDto } from '../easy-abp/private-messaging/private-message-notifications/dtos/models';
import type { CreatePrivateMessageByUserIdDto, CreateUpdatePrivateMessageDto, PrivateMessageDto } from '../easy-abp/private-messaging/private-messages/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class InAppPrivateMessageService {
  apiName = 'notification';
  

  createPrivateMessage = (input: CreateUpdatePrivateMessageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrivateMessageDto>({
      method: 'POST',
      url: '/api/app/in-app-private-message/private-message',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createPrivateMessageByUserId = (input: CreatePrivateMessageByUserIdDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrivateMessageDto>({
      method: 'POST',
      url: '/api/app/in-app-private-message/private-message-by-user-id',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  deletePrivateMessageNotifications = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/in-app-private-message/private-message-notifications',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  deletePrivateMessages = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/in-app-private-message/private-messages',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  getPrivateMessage = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrivateMessageDto>({
      method: 'GET',
      url: `/api/app/in-app-private-message/${id}/private-message`,
    },
    { apiName: this.apiName,...config });
  

  getPrivateMessageList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PrivateMessageDto>>({
      method: 'GET',
      url: '/api/app/in-app-private-message/private-message-list',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getPrivateMessageNotificationList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PrivateMessageNotificationDto>>({
      method: 'GET',
      url: '/api/app/in-app-private-message/private-message-notification-list',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getSentPrivateMessageList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PrivateMessageDto>>({
      method: 'GET',
      url: '/api/app/in-app-private-message/sent-private-message-list',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getUnreadNotificationCount = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>({
      method: 'GET',
      url: '/api/app/in-app-private-message/unread-notification-count',
    },
    { apiName: this.apiName,...config });
  

  getUnreadPrivateMessageList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PrivateMessageDto>>({
      method: 'GET',
      url: '/api/app/in-app-private-message/unread-private-message-list',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  setPrivateMessagesRead = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/in-app-private-message/set-private-messages-read',
      body: ids,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
