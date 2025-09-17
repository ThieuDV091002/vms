import type { CreateUpdateProductionDataByRange, CreateUpdateProductionDataDto, ProductionDataDto, ProductionDataGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ProductionDataKpiFilter } from '../dtos/kpi/models';

@Injectable({
  providedIn: 'root',
})
export class ProductionDataService {
  apiName = 'general';
  

  create = (input: CreateUpdateProductionDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionDataDto>({
      method: 'POST',
      url: '/api/app/production-data',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/production-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportByInput = (input: ProductionDataGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/production-data/export',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionDataDto>({
      method: 'GET',
      url: `/api/app/production-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ProductionDataGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ProductionDataDto>>({
      method: 'GET',
      url: '/api/app/production-data',
      params: { areas: input.areas, cells: input.cells, workCenters: input.workCenters, recordStartTimestamp: input.recordStartTimestamp, recordEndTimestamp: input.recordEndTimestamp, workOrder: input.workOrder, productId: input.productId, plannedQty: input.plannedQty, baseQty: input.baseQty, producedQty: input.producedQty, refSourceId: input.refSourceId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getProductionDataByFilterByFilter = (filter: ProductionDataKpiFilter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionDataDto[]>({
      method: 'GET',
      url: '/api/app/production-data/production-data-by-filter',
      params: { startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getProductionFullDataByFilterByFilter = (filter: ProductionDataKpiFilter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionDataDto[]>({
      method: 'GET',
      url: '/api/app/production-data/production-full-data-by-filter',
      params: { startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  insertProductionDataByRangeByInput = (input: CreateUpdateProductionDataByRange, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/production-data/production-data-by-range',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  sendInvalidDataNotification = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/production-data/send-invalid-data-notification',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateProductionDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionDataDto>({
      method: 'PUT',
      url: `/api/app/production-data/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
