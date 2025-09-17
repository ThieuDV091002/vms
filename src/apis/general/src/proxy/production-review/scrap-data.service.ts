import type { CreateUpdateScrapDataByRangeDto, CreateUpdateScrapDataDto, ScrapDataDto, ScrapDataGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ScrapDataKpiFilter } from '../dtos/kpi/models';

@Injectable({
  providedIn: 'root',
})
export class ScrapDataService {
  apiName = 'general';
  

  create = (input: CreateUpdateScrapDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ScrapDataDto>({
      method: 'POST',
      url: '/api/app/scrap-data',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/scrap-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportByInput = (input: ScrapDataGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/scrap-data/export',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ScrapDataDto>({
      method: 'GET',
      url: `/api/app/scrap-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ScrapDataGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ScrapDataDto>>({
      method: 'GET',
      url: '/api/app/scrap-data',
      params: { areas: input.areas, cells: input.cells, workCenters: input.workCenters, recordStartTimestamp: input.recordStartTimestamp, recordEndTimestamp: input.recordEndTimestamp, workOrder: input.workOrder, productId: input.productId, scrapQty: input.scrapQty, globalScrapCodeId: input.globalScrapCodeId, localScrapReasonId: input.localScrapReasonId, refSourceId: input.refSourceId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getScrapDataByFilterByFilter = (filter: ScrapDataKpiFilter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ScrapDataDto[]>({
      method: 'GET',
      url: '/api/app/scrap-data/scrap-data-by-filter',
      params: { excludeScrapReasonIds: filter.excludeScrapReasonIds, startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getScrapFullDataByFilterByFilter = (filter: ScrapDataKpiFilter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ScrapDataDto[]>({
      method: 'GET',
      url: '/api/app/scrap-data/scrap-full-data-by-filter',
      params: { excludeScrapReasonIds: filter.excludeScrapReasonIds, startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  insertScrapDataByRangeByInput = (input: CreateUpdateScrapDataByRangeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/scrap-data/scrap-data-by-range',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  sendInvalidDataNotification = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/scrap-data/send-invalid-data-notification',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateScrapDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ScrapDataDto>({
      method: 'PUT',
      url: `/api/app/scrap-data/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
