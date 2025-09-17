import type { CreatePrivateMessageByUserIdDto, CreateUpdatePrivateMessageDto, PrivateMessageDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrivateMessageService {
  apiName = 'notification';
  

  create = (input: CreateUpdatePrivateMessageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrivateMessageDto>({
      method: 'POST',
      url: '/api/private-messaging/private-message',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createByUserId = (input: CreatePrivateMessageByUserIdDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrivateMessageDto>({
      method: 'POST',
      url: '/api/private-messaging/private-message/by-user-id',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/private-messaging/private-message',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrivateMessageDto>({
      method: 'GET',
      url: `/api/private-messaging/private-message/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PrivateMessageDto>>({
      method: 'GET',
      url: '/api/private-messaging/private-message',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListSent = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PrivateMessageDto>>({
      method: 'GET',
      url: '/api/private-messaging/private-message/sent',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListUnread = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PrivateMessageDto>>({
      method: 'GET',
      url: '/api/private-messaging/private-message/unread',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  setRead = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/private-messaging/private-message/set-read',
      body: ids,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
