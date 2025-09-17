import type { ActivityCardDailySummaryDataDto, ActivityCardDailySummaryDataGetListInput, CreateUpdateActivityCardDailySummaryDataDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActivityCardDailySummaryDataService {
  apiName = 'ticket';
  

  create = (input: CreateUpdateActivityCardDailySummaryDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardDailySummaryDataDto>({
      method: 'POST',
      url: '/api/app/activity-card-daily-summary-data',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/activity-card-daily-summary-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  generateCellDailySummary = (date?: string, site?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/activity-card-daily-summary-data/generate-cell-daily-summary',
      params: { date, site },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardDailySummaryDataDto>({
      method: 'GET',
      url: `/api/app/activity-card-daily-summary-data/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByKeyCombinationByDateAndSiteIdAndAreaIdAndCellId = (date: string, siteId: string, areaId?: string, cellId?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardDailySummaryDataDto>({
      method: 'GET',
      url: '/api/app/activity-card-daily-summary-data/by-key-combination',
      params: { date, siteId, areaId, cellId },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ActivityCardDailySummaryDataGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ActivityCardDailySummaryDataDto>>({
      method: 'GET',
      url: '/api/app/activity-card-daily-summary-data',
      params: { date: input.date, siteId: input.siteId, siteDisplayName: input.siteDisplayName, areaId: input.areaId, areaDisplayName: input.areaDisplayName, cellId: input.cellId, cellDisplayName: input.cellDisplayName, dailyNearMisses: input.dailyNearMisses, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateActivityCardDailySummaryDataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardDailySummaryDataDto>({
      method: 'PUT',
      url: `/api/app/activity-card-daily-summary-data/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
