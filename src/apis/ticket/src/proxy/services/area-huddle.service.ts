import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { AreaHuddleGetInput } from '../dtos/area-huddle/models';
import type { ActivityCardByAreaDto, UnsafeConditionDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class AreaHuddleService {
  apiName = 'ticket';
  

  getActivityCardByAreaDataByAreaId = (areaId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardByAreaDto[]>({
      method: 'GET',
      url: `/api/app/area-huddle/activity-card-by-area-data/${areaId}`,
    },
    { apiName: this.apiName,...config });
  

  getUnsafeConditions = (input: AreaHuddleGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UnsafeConditionDto[]>({
      method: 'GET',
      url: '/api/app/area-huddle/unsafe-conditions',
      params: { area: input.area, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
