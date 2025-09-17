import type { AreaAvailabilityDto, AreaAvailabilityEnhancedDto, AreaFPYDto, AreaFPYEnhancedDto, AreaHuddleByCellGetEnhancedInput, AreaHuddleByCellGetInput, AreaHuddleEnhancedGetInput, AreaHuddleGetInput, AreaPerformanceDto, AreaPerformanceEnhancedDto, AreaSPPMDto, AreaSPPMEhnancedDto, AreaUPPHDto, AreaUPPHEnhancedDto, POEEDto, POEEEnhancedDto, UnsafeConditionDto } from './dtos/area-huddle/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AreaHuddleService {
  apiName = 'general';
  

  getAvailabilityAreaDataByInput = (input: AreaHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaAvailabilityDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle/availability-area-data',
      params: { area: input.area, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getFPYAreaDataByInput = (input: AreaHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaFPYDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle/f-pYArea-data',
      params: { area: input.area, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getFpyDataByAreaCellListByInput = (input: AreaHuddleEnhancedGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaFPYEnhancedDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle/fpy-data-by-area-cell-list',
      params: { areas: input.areas, cells: input.cells, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getPOEEAreaDataByInput = (input: AreaHuddleByCellGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, POEEDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle/p-oEEArea-data',
      params: { area: input.area, startDate: input.startDate, endDate: input.endDate, isByCell: input.isByCell },
    },
    { apiName: this.apiName,...config });
  

  getPerformanceAreaDataByInput = (input: AreaHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaPerformanceDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle/performance-area-data',
      params: { area: input.area, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getPerformanceDataByAreaCellListByInput = (input: AreaHuddleEnhancedGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaPerformanceEnhancedDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle/performance-data-by-area-cell-list',
      params: { areas: input.areas, cells: input.cells, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getPoeeDataByAreaCellListByInput = (input: AreaHuddleByCellGetEnhancedInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, POEEEnhancedDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle/poee-data-by-area-cell-list',
      params: { isByCell: input.isByCell, areas: input.areas, cells: input.cells, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getSPPMAreaDataByInput = (input: AreaHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaSPPMDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle/s-pPMArea-data',
      params: { area: input.area, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getSppmDataByAreaCellListByInput = (input: AreaHuddleEnhancedGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaSPPMEhnancedDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle/sppm-data-by-area-cell-list',
      params: { areas: input.areas, cells: input.cells, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getUPPHAreaDataByInput = (input: AreaHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaUPPHDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle/u-pPHArea-data',
      params: { area: input.area, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getUdtDataByAreaCellListByInput = (input: AreaHuddleEnhancedGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaAvailabilityEnhancedDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle/udt-data-by-area-cell-list',
      params: { areas: input.areas, cells: input.cells, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getUnsafeConditionDataByInput = (input: AreaHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UnsafeConditionDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle/unsafe-condition-data',
      params: { area: input.area, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getUpphDataByAreaCellListByInput = (input: AreaHuddleEnhancedGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaUPPHEnhancedDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle/upph-data-by-area-cell-list',
      params: { areas: input.areas, cells: input.cells, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
