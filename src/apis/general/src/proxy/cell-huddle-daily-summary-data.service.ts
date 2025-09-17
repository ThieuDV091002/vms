import type { CellFPYDto, CellFPYEnhancedDto, CellHuddleEnhancedGetInput, CellHuddleGetInput, CellPerformanceDto, CellPerformanceEnhancedDto, CellSPPMDto, CellSPPMEnhancedDto, CellUPPHDto, CellUPPHEnhancedDto, CellUnplannedDowntimePercentageDto, CellUnscheduledDowntimeDto, CellUnscheduledDowntimeEnhancedDto } from './dtos/cell-huddle/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CellHuddleDailySummaryDataService {
  apiName = 'general';
  

  generateCellDailySummary = (date: string, site: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/cell-huddle-daily-summary-data/generate-cell-daily-summary',
      params: { date, site },
    },
    { apiName: this.apiName,...config });
  

  getFPYData = (input: CellHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellFPYDto[]>({
      method: 'GET',
      url: '/api/app/cell-huddle-daily-summary-data/f-pYData',
      params: { cell: input.cell, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getFpyDataByAreaCellList = (input: CellHuddleEnhancedGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellFPYEnhancedDto[]>({
      method: 'GET',
      url: '/api/app/cell-huddle-daily-summary-data/fpy-data-by-area-cell-list',
      params: { areas: input.areas, cells: input.cells, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getPerformanceData = (input: CellHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellPerformanceDto[]>({
      method: 'GET',
      url: '/api/app/cell-huddle-daily-summary-data/performance-data',
      params: { cell: input.cell, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getSPPMData = (input: CellHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellSPPMDto[]>({
      method: 'GET',
      url: '/api/app/cell-huddle-daily-summary-data/s-pPMData',
      params: { cell: input.cell, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getUPPHData = (input: CellHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellUPPHDto[]>({
      method: 'GET',
      url: '/api/app/cell-huddle-daily-summary-data/u-pPHData',
      params: { cell: input.cell, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getUnplannedDowntimePercentageData = (input: CellHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellUnplannedDowntimePercentageDto[]>({
      method: 'GET',
      url: '/api/app/cell-huddle-daily-summary-data/unplanned-downtime-percentage-data',
      params: { cell: input.cell, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getUnscheduledDowntimeData = (input: CellHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellUnscheduledDowntimeDto[]>({
      method: 'GET',
      url: '/api/app/cell-huddle-daily-summary-data/unscheduled-downtime-data',
      params: { cell: input.cell, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  performanceDataByAreaCellList = (input: CellHuddleEnhancedGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellPerformanceEnhancedDto[]>({
      method: 'POST',
      url: '/api/app/cell-huddle-daily-summary-data/performance-data-by-area-cell-list',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  sppmDataByAreaCellList = (input: CellHuddleEnhancedGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellSPPMEnhancedDto[]>({
      method: 'POST',
      url: '/api/app/cell-huddle-daily-summary-data/sppm-data-by-area-cell-list',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  udtDataByAreaCellList = (input: CellHuddleEnhancedGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellUnscheduledDowntimeEnhancedDto[]>({
      method: 'POST',
      url: '/api/app/cell-huddle-daily-summary-data/udt-data-by-area-cell-list',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  upphDataByAreaCellList = (input: CellHuddleEnhancedGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellUPPHEnhancedDto[]>({
      method: 'POST',
      url: '/api/app/cell-huddle-daily-summary-data/upph-data-by-area-cell-list',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
