import type { CreateUpdateDowntimeDataByRange, CreateUpdateDowntimeDataDto, DowntimeDataDto, DowntimeDataGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DowntimeDataKpiFilter } from '../dtos/kpi/models';

@Injectable({
  providedIn: 'root',
})
export class DowntimeDataService {
  apiName = 'general';
  

  create = (input: CreateUpdateDowntimeDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DowntimeDataDto>({
      method: 'POST',
      url: '/api/app/downtime-data',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/downtime-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportByInput = (input: DowntimeDataGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/downtime-data/export',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DowntimeDataDto>({
      method: 'GET',
      url: `/api/app/downtime-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getDowntimeDataByFilterByFilter = (filter: DowntimeDataKpiFilter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DowntimeDataDto[]>({
      method: 'GET',
      url: '/api/app/downtime-data/downtime-data-by-filter',
      params: { isPlanned: filter.isPlanned, isCosted: filter.isCosted, excludeDowntimeReasonIds: filter.excludeDowntimeReasonIds, startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getDowntimeFullDataByFilterByFilter = (filter: DowntimeDataKpiFilter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DowntimeDataDto[]>({
      method: 'GET',
      url: '/api/app/downtime-data/downtime-full-data-by-filter',
      params: { isPlanned: filter.isPlanned, isCosted: filter.isCosted, excludeDowntimeReasonIds: filter.excludeDowntimeReasonIds, startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: DowntimeDataGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DowntimeDataDto>>({
      method: 'GET',
      url: '/api/app/downtime-data',
      params: { areas: input.areas, cells: input.cells, workCenters: input.workCenters, recordStartTimestamp: input.recordStartTimestamp, recordEndTimestamp: input.recordEndTimestamp, downtime: input.downtime, workOrder: input.workOrder, productId: input.productId, globalDowntimeCodeId: input.globalDowntimeCodeId, localDowntimeReasonId: input.localDowntimeReasonId, refSourceId: input.refSourceId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  insertDowntimeDataByRangeByInput = (input: CreateUpdateDowntimeDataByRange, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/downtime-data/downtime-data-by-range',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  sendInvalidDataNotification = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/downtime-data/send-invalid-data-notification',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateDowntimeDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DowntimeDataDto>({
      method: 'PUT',
      url: `/api/app/downtime-data/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
