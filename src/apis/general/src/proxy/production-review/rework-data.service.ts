import type { CreateUpdateReworkDataDto, ReworkDataDto, ReworkDataGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ReworkDataKpiFilter } from '../dtos/kpi/models';

@Injectable({
  providedIn: 'root',
})
export class ReworkDataService {
  apiName = 'general';
  

  create = (input: CreateUpdateReworkDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ReworkDataDto>({
      method: 'POST',
      url: '/api/app/rework-data',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/rework-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportByInput = (input: ReworkDataGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/rework-data/export',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ReworkDataDto>({
      method: 'GET',
      url: `/api/app/rework-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ReworkDataGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ReworkDataDto>>({
      method: 'GET',
      url: '/api/app/rework-data',
      params: { areas: input.areas, cells: input.cells, workCenters: input.workCenters, recordStartTimestamp: input.recordStartTimestamp, recordEndTimestamp: input.recordEndTimestamp, workOrder: input.workOrder, productId: input.productId, reworkQty: input.reworkQty, refSourceId: input.refSourceId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getReworkDataByFilterByFilter = (filter: ReworkDataKpiFilter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ReworkDataDto[]>({
      method: 'GET',
      url: '/api/app/rework-data/rework-data-by-filter',
      params: { startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getReworkFullDataByFilterByFilter = (filter: ReworkDataKpiFilter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ReworkDataDto[]>({
      method: 'GET',
      url: '/api/app/rework-data/rework-full-data-by-filter',
      params: { startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  sendInvalidDataNotification = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/rework-data/send-invalid-data-notification',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateReworkDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ReworkDataDto>({
      method: 'PUT',
      url: `/api/app/rework-data/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
