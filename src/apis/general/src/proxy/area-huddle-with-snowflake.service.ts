import type { AreaHuddleEnhancedGetInput, AreaHuddleGetInput, COPQDto, COPQEnhancedDto, QNDto, SafetyIncidentDto } from './dtos/area-huddle/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AreaHuddleWithSnowflakeService {
  apiName = 'general';
  

  getCOPQAreaDataByInput = (input: AreaHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, COPQDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle-with-snowflake/c-oPQArea-data',
      params: { area: input.area, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getCopqDataByAreaListByInput = (input: AreaHuddleEnhancedGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, COPQEnhancedDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle-with-snowflake/copq-data-by-area-list',
      params: { areas: input.areas, cells: input.cells, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getQNDataByAreaId = (areaId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QNDto[]>({
      method: 'GET',
      url: `/api/app/area-huddle-with-snowflake/q-nData/${areaId}`,
    },
    { apiName: this.apiName,...config });
  

  getQnDataByAreaListByAreaIds = (areaIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, QNDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle-with-snowflake/qn-data-by-area-list',
      params: { areaIds },
    },
    { apiName: this.apiName,...config });
  

  getSafetyIncidentBySiteId = (siteId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SafetyIncidentDto>({
      method: 'GET',
      url: `/api/app/area-huddle-with-snowflake/safety-incident/${siteId}`,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
