import type { BroadcastMessageDto, BroadcastMessageGetListInput, CreateUpdateBroadcastMessageDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BroadcastMessageService {
  apiName = 'general';
  

  create = (input: CreateUpdateBroadcastMessageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BroadcastMessageDto>({
      method: 'POST',
      url: '/api/app/broadcast-message',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/broadcast-message/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BroadcastMessageDto>({
      method: 'GET',
      url: `/api/app/broadcast-message/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: BroadcastMessageGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<BroadcastMessageDto>>({
      method: 'GET',
      url: '/api/app/broadcast-message',
      params: { userId: input.userId, categoryId: input.categoryId, expireStartDate: input.expireStartDate, expireEndDate: input.expireEndDate, areas: input.areas, cells: input.cells, workCenters: input.workCenters, isExcludeExpiredMessage: input.isExcludeExpiredMessage, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateBroadcastMessageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BroadcastMessageDto>({
      method: 'PUT',
      url: `/api/app/broadcast-message/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
