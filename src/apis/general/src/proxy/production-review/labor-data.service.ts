import type { CreateUpdateLaborDataByRange, CreateUpdateLaborDataDto, LaborDataDto, LaborDataGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LaborDataService {
  apiName = 'general';
  

  create = (input: CreateUpdateLaborDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LaborDataDto>({
      method: 'POST',
      url: '/api/app/labor-data',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/labor-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportByInput = (input: LaborDataGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/labor-data/export',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LaborDataDto>({
      method: 'GET',
      url: `/api/app/labor-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: LaborDataGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LaborDataDto>>({
      method: 'GET',
      url: '/api/app/labor-data',
      params: { areas: input.areas, cells: input.cells, workCenters: input.workCenters, recordStartTimestamp: input.recordStartTimestamp, recordEndTimestamp: input.recordEndTimestamp, workOrder: input.workOrder, productId: input.productId, staffNeeded: input.staffNeeded, staffActual: input.staffActual, refSourceId: input.refSourceId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  insertbyShiftIntervalByInput = (input: CreateUpdateLaborDataByRange, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/labor-data/by-shift-interval',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  sendInvalidDataNotification = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/labor-data/send-invalid-data-notification',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLaborDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LaborDataDto>({
      method: 'PUT',
      url: `/api/app/labor-data/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
