import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ActivityCardCountInfoDto, NearMissesDailyDto, NearMissesGetInput, NearMissesMonthlyDto, SiteHuddleCardQueryInput, SiteHuddleCardStatisticsDto, UnsafeConditionInfoCountDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class SiteHuddleService {
  apiName = 'ticket';
  

  getActiveActivityCardInfoByAreaCellByAreaIdsAndCellIds = (areaIds: string[], cellIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardCountInfoDto[]>({
      method: 'GET',
      url: '/api/app/site-huddle/active-activity-card-info-by-area-cell',
      params: { areaIds, cellIds },
    },
    { apiName: this.apiName,...config });
  

  getActivityCardInfoByKPIIndicatorByInput = (input: SiteHuddleCardQueryInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteHuddleCardStatisticsDto>({
      method: 'GET',
      url: '/api/app/site-huddle/activity-card-info-by-kPIIndicator',
      params: { siteId: input.siteId, areaIds: input.areaIds, cellIds: input.cellIds, siteKPIIndicator: input.siteKPIIndicator },
    },
    { apiName: this.apiName,...config });
  

  getNearMissesDailyByInput = (input: NearMissesGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NearMissesDailyDto>({
      method: 'GET',
      url: '/api/app/site-huddle/near-misses-daily',
      params: { siteId: input.siteId, areaIds: input.areaIds, cellIds: input.cellIds, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getNearMissesMonthlyByInput = (input: NearMissesGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NearMissesMonthlyDto>({
      method: 'GET',
      url: '/api/app/site-huddle/near-misses-monthly',
      params: { siteId: input.siteId, areaIds: input.areaIds, cellIds: input.cellIds, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getUnsafeConditionsByAreaCellByAreaIdsAndCellIdsAndStartTimeAndEndTime = (areaIds: string[], cellIds: string[], startTime: string, endTime: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UnsafeConditionInfoCountDto[]>({
      method: 'GET',
      url: '/api/app/site-huddle/unsafe-conditions-by-area-cell',
      params: { areaIds, cellIds, startTime, endTime },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
