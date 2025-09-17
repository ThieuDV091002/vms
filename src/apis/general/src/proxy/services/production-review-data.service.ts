import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DowntimeDataKpiApiFilter, DowntimeMinutesDto, ProductPerformanceDto, ProductionDataKpiApiFilter, ScrapDataKpiApiFilter, ScrapQuantityDto } from '../dtos/kpi/models';
import type { LaborFocusL1Dto, LaborFocusL1Filter, LaborFocusL2Dto, LaborFocusL2Filter, LaborFocusL3Dto, LaborFocusL3Filter, MachineFocusL1Dto, MachineFocusL1Filter, MachineFocusL2Dto, MachineFocusL2Filter, MachineFocusL3Dto, MachineFocusL3Filter, ProductionReviewGeneralDataDto, ProductionReviewGeneralDataInput } from '../dtos/production-review/models';

@Injectable({
  providedIn: 'root',
})
export class ProductionReviewDataService {
  apiName = 'general';
  

  getLaborFocusL1 = (filter: LaborFocusL1Filter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LaborFocusL1Dto>({
      method: 'GET',
      url: '/api/app/production-review-data/labor-focus-l1',
      params: { shiftPatternId: filter.shiftPatternId, mode: filter.mode, areaIds: filter.areaIds, cellIds: filter.cellIds, startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getLaborFocusL2 = (filter: LaborFocusL2Filter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LaborFocusL2Dto>({
      method: 'GET',
      url: '/api/app/production-review-data/labor-focus-l2',
      params: { mode: filter.mode, productGroupingId: filter.productGroupingId, incrementStartTime: filter.incrementStartTime, incrementEndTime: filter.incrementEndTime, referenceId: filter.referenceId, isNoOrder: filter.isNoOrder, areaIds: filter.areaIds, cellIds: filter.cellIds, startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getLaborFocusL3 = (filter: LaborFocusL3Filter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LaborFocusL3Dto>({
      method: 'GET',
      url: '/api/app/production-review-data/labor-focus-l3',
      params: { incrementStartTime: filter.incrementStartTime, incrementEndTime: filter.incrementEndTime, productGroupingId: filter.productGroupingId, mode: filter.mode, productId: filter.productId, hasWorkOrderFilter: filter.hasWorkOrderFilter, workOrder: filter.workOrder, operation: filter.operation, referenceId: filter.referenceId, isNoOrder: filter.isNoOrder, areaIds: filter.areaIds, cellIds: filter.cellIds, startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getMachineFocusL1 = (filter: MachineFocusL1Filter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MachineFocusL1Dto>({
      method: 'GET',
      url: '/api/app/production-review-data/machine-focus-l1',
      params: { mode: filter.mode, areaIds: filter.areaIds, cellIds: filter.cellIds, startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getMachineFocusL2 = (filter: MachineFocusL2Filter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MachineFocusL2Dto>({
      method: 'GET',
      url: '/api/app/production-review-data/machine-focus-l2',
      params: { mode: filter.mode, productGroupingId: filter.productGroupingId, referenceId: filter.referenceId, isNoOrder: filter.isNoOrder, areaIds: filter.areaIds, cellIds: filter.cellIds, startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getMachineFocusL3 = (filter: MachineFocusL3Filter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MachineFocusL3Dto>({
      method: 'GET',
      url: '/api/app/production-review-data/machine-focus-l3',
      params: { productGroupingId: filter.productGroupingId, mode: filter.mode, workCenterId: filter.workCenterId, referenceId: filter.referenceId, isNoOrder: filter.isNoOrder, areaIds: filter.areaIds, cellIds: filter.cellIds, startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getProductionReviewDataByInput = (input: ProductionReviewGeneralDataInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionReviewGeneralDataDto>({
      method: 'POST',
      url: '/api/app/production-review-data/get-production-review-data',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  getTopFiveDowntimeReasons = (filter: DowntimeDataKpiApiFilter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DowntimeMinutesDto[]>({
      method: 'GET',
      url: '/api/app/production-review-data/top-five-downtime-reasons',
      params: { areaIds: filter.areaIds, cellIds: filter.cellIds, isPlanned: filter.isPlanned, isCosted: filter.isCosted, excludeDowntimeReasonIds: filter.excludeDowntimeReasonIds, startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getTopFivePerformedProducts = (filter: ProductionDataKpiApiFilter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductPerformanceDto[]>({
      method: 'GET',
      url: '/api/app/production-review-data/top-five-performed-products',
      params: { areaIds: filter.areaIds, cellIds: filter.cellIds, startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });
  

  getTopFiveScrapReasons = (filter: ScrapDataKpiApiFilter, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ScrapQuantityDto[]>({
      method: 'GET',
      url: '/api/app/production-review-data/top-five-scrap-reasons',
      params: { areaIds: filter.areaIds, cellIds: filter.cellIds, excludeScrapReasonIds: filter.excludeScrapReasonIds, startDate: filter.startDate, endDate: filter.endDate, workCenterIds: filter.workCenterIds, productSerieIds: filter.productSerieIds, productFamilyIds: filter.productFamilyIds, productIds: filter.productIds, workOrders: filter.workOrders, operations: filter.operations },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
