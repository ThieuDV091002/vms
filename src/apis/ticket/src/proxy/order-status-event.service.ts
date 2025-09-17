import type { CreateUpdateOrderStatusEventDto, OrderStatusEventDto, OrderStatusEventGetListInput, SingleResultDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderStatusEventService {
  apiName = 'ticket';
  

  create = (input: CreateUpdateOrderStatusEventDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderStatusEventDto>({
      method: 'POST',
      url: '/api/app/order-status-event',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/order-status-event/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderStatusEventDto>({
      method: 'GET',
      url: `/api/app/order-status-event/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: OrderStatusEventGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<OrderStatusEventDto>>({
      method: 'GET',
      url: '/api/app/order-status-event',
      params: { eventTimestamp: input.eventTimestamp, productionOrder: input.productionOrder, quantity: input.quantity, statusCode: input.statusCode, fromOrderStatus: input.fromOrderStatus, fromOrderState: input.fromOrderState, toOrderStatus: input.toOrderStatus, toOrderState: input.toOrderState, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  tryCompleteTasksFromOrderStatusEventByDto = (dto: OrderStatusEventDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SingleResultDto>({
      method: 'POST',
      url: '/api/app/order-status-event/try-complete-tasks-from-order-status-event',
      body: dto,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateOrderStatusEventDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderStatusEventDto>({
      method: 'PUT',
      url: `/api/app/order-status-event/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
