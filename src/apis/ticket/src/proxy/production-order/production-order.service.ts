import type { CreateUpdateProductionOrderDto, ProductionOrderDto, ProductionOrderGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductionOrderService {
  apiName = 'ticket';
  

  create = (input: CreateUpdateProductionOrderDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionOrderDto>({
      method: 'POST',
      url: '/api/app/production-order',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createUpdateProductionOrderByOrderNameByDto = (dto: CreateUpdateProductionOrderDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionOrderDto>({
      method: 'POST',
      url: '/api/app/production-order/update-production-order-by-order-name',
      body: dto,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/production-order/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionOrderDto>({
      method: 'GET',
      url: `/api/app/production-order/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ProductionOrderGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ProductionOrderDto>>({
      method: 'GET',
      url: '/api/app/production-order',
      params: { orderName: input.orderName, qty: input.qty, orderStatus: input.orderStatus, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateProductionOrderDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionOrderDto>({
      method: 'PUT',
      url: `/api/app/production-order/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
