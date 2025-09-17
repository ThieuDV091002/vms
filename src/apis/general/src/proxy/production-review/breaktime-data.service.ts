import type { BreaktimeDataDto, BreaktimeDataGetListInput, CreateUpdateBreaktimeDataByRange, CreateUpdateBreaktimeDataDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BreaktimeDataKpiFilter } from '../dtos/kpi/models';

@Injectable({
  providedIn: 'root',
})
export class BreaktimeDataService {
  apiName = 'general';
  

  create = (input: CreateUpdateBreaktimeDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BreaktimeDataDto>({
      method: 'POST',
      url: '/api/app/breaktime-data',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/breaktime-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportByInput = (input: BreaktimeDataGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/breaktime-data/export',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BreaktimeDataDto>({
      method: 'GET',
      url: `/api/app/breaktime-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getBreaktimeDataByFilterByFilter = (filter: BreaktimeDataKpiFilter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BreaktimeDataDto[]>({
      method: 'GET',
      url: '/api/app/breaktime-data/breaktime-data-by-filter',
      params: { startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getBreaktimeFullDataByFilterByFilter = (filter: BreaktimeDataKpiFilter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BreaktimeDataDto[]>({
      method: 'GET',
      url: '/api/app/breaktime-data/breaktime-full-data-by-filter',
      params: { startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: BreaktimeDataGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<BreaktimeDataDto>>({
      method: 'GET',
      url: '/api/app/breaktime-data',
      params: { areas: input.areas, cells: input.cells, workCenters: input.workCenters, recordStartTimestamp: input.recordStartTimestamp, recordEndTimestamp: input.recordEndTimestamp, workOrder: input.workOrder, breaktime: input.breaktime, localBreaktimeReasonId: input.localBreaktimeReasonId, productId: input.productId, refSourceId: input.refSourceId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  insertBreaktimeDataByRangeByInput = (input: CreateUpdateBreaktimeDataByRange, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/breaktime-data/breaktime-data-by-range',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  sendInvalidDataNotification = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/breaktime-data/send-invalid-data-notification',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateBreaktimeDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BreaktimeDataDto>({
      method: 'PUT',
      url: `/api/app/breaktime-data/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
