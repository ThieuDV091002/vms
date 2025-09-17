import type { GetCOPQByReasonsInput, GetCOPQByReasonsOutput, SafetyIncidentDailyDto, SiteAssetProdMonthlyDto, SiteCOPQMonthlyDto, SiteCopqDto, SiteHuddleAssetProdGetInput, SiteHuddleCOPQMonthlyGetInput, SiteHuddleGetInput, SiteHuddleOEEGetInput, SiteHuddlePOEEGetInput, SiteHuddlePeopleProdGetInput, SiteHuddleQNGetInput, SiteHuddleQNWithoutAreaGetInput, SiteHuddleWithWorkCenterGetInput, SiteHuddleWithoutAreaGetInput, SiteMonthlyTargetDto, SiteMonthlyTargetGetInput, SiteOEEMonthlyDto, SitePOEEMonthlyDto, SitePeopleProdMonthlyDto, SitePoeeDailyDto, SiteQNDailyDto, SiteQNMonthlyDto, SiteSafetyIncidenMonthlytDto } from './dtos/site-huddle/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SiteHuddleWithSnowflakeService {
  apiName = 'general';
  

  getAssetProdMonthlyBySiteByInput = (input: SiteHuddleAssetProdGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteAssetProdMonthlyDto>({
      method: 'GET',
      url: '/api/app/site-huddle-with-snowflake/asset-prod-monthly-by-site',
      params: { siteId: input.siteId, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getCOPQByReasonsByInput = (input: GetCOPQByReasonsInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GetCOPQByReasonsOutput>({
      method: 'GET',
      url: '/api/app/site-huddle-with-snowflake/c-oPQBy-reasons',
      params: { siteId: input.siteId, startDate: input.startDate, endDate: input.endDate, areaIds: input.areaIds },
    },
    { apiName: this.apiName,...config });
  

  getCOPQDailyByInput = (input: SiteHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteCopqDto>({
      method: 'GET',
      url: '/api/app/site-huddle-with-snowflake/c-oPQDaily',
      params: { siteId: input.siteId, areaId: input.areaId, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getCOPQMonthlyBySiteByInput = (input: SiteHuddleCOPQMonthlyGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteCOPQMonthlyDto>({
      method: 'GET',
      url: '/api/app/site-huddle-with-snowflake/c-oPQMonthly-by-site',
      params: { siteId: input.siteId, areaIds: input.areaIds, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getOEEMonthlyBySiteByInput = (input: SiteHuddleOEEGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteOEEMonthlyDto>({
      method: 'GET',
      url: '/api/app/site-huddle-with-snowflake/o-eEMonthly-by-site',
      params: { siteId: input.siteId, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getPOEEDailyBySiteByInput = (input: SiteHuddleWithoutAreaGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SitePoeeDailyDto[]>({
      method: 'GET',
      url: '/api/app/site-huddle-with-snowflake/p-oEEDaily-by-site',
      params: { siteId: input.siteId, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getPOEEDailyByWorkCenterByInput = (input: SiteHuddleWithWorkCenterGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SitePoeeDailyDto[]>({
      method: 'GET',
      url: '/api/app/site-huddle-with-snowflake/p-oEEDaily-by-work-center',
      params: { workCenterId: input.workCenterId, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getPOEEMonthlyBySiteByInput = (input: SiteHuddlePOEEGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SitePOEEMonthlyDto>({
      method: 'GET',
      url: '/api/app/site-huddle-with-snowflake/p-oEEMonthly-by-site',
      params: { siteId: input.siteId, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getPeopleProdMonthlyBySiteByInput = (input: SiteHuddlePeopleProdGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SitePeopleProdMonthlyDto>({
      method: 'GET',
      url: '/api/app/site-huddle-with-snowflake/people-prod-monthly-by-site',
      params: { siteId: input.siteId, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getQNDailyByInput = (input: SiteHuddleQNGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteQNDailyDto>({
      method: 'GET',
      url: '/api/app/site-huddle-with-snowflake/q-nDaily',
      params: { siteId: input.siteId, areaId: input.areaId, startDate: input.startDate, endDate: input.endDate, type: input.type },
    },
    { apiName: this.apiName,...config });
  

  getQNMonthlyBySiteByInput = (input: SiteHuddleQNWithoutAreaGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteQNMonthlyDto>({
      method: 'GET',
      url: '/api/app/site-huddle-with-snowflake/q-nMonthly-by-site',
      params: { siteId: input.siteId, startDate: input.startDate, endDate: input.endDate, type: input.type },
    },
    { apiName: this.apiName,...config });
  

  getSafetyIncidentDailyByInput = (input: SiteHuddleWithoutAreaGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SafetyIncidentDailyDto>({
      method: 'GET',
      url: '/api/app/site-huddle-with-snowflake/safety-incident-daily',
      params: { siteId: input.siteId, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getSafetyIncidentMonthlyByInput = (input: SiteHuddleWithoutAreaGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteSafetyIncidenMonthlytDto>({
      method: 'GET',
      url: '/api/app/site-huddle-with-snowflake/safety-incident-monthly',
      params: { siteId: input.siteId, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getSiteMonthlyTargetByInput = (input: SiteMonthlyTargetGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SiteMonthlyTargetDto>({
      method: 'GET',
      url: '/api/app/site-huddle-with-snowflake/site-monthly-target',
      params: { siteId: input.siteId, targetType: input.targetType, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
