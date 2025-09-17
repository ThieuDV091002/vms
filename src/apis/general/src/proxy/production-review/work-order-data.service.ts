import type { CreateUpdateWorkOrderDataDto, WorkOrderDataDto, WorkOrderDataGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderDataService {
  apiName = 'general';
  

  create = (input: CreateUpdateWorkOrderDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkOrderDataDto>({
      method: 'POST',
      url: '/api/app/work-order-data',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/work-order-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkOrderDataDto>({
      method: 'GET',
      url: `/api/app/work-order-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: WorkOrderDataGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<WorkOrderDataDto>>({
      method: 'GET',
      url: '/api/app/work-order-data',
      params: { workCenterId: input.workCenterId, recordTimestamp: input.recordTimestamp, workOrder: input.workOrder, workOrderQty: input.workOrderQty, productId: input.productId, uph: input.uph, staffNeeded: input.staffNeeded, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateWorkOrderDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkOrderDataDto>({
      method: 'PUT',
      url: `/api/app/work-order-data/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
