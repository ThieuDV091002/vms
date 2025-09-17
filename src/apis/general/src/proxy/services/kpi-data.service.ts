import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { FPYDto, PerformanceDto, SPPMDto, UDTDto, UPPHDto } from '../dtos/kpi/models';

@Injectable({
  providedIn: 'root',
})
export class KpiDataService {
  apiName = 'general';
  

  getFpy = (startDate: string, endDate: string, shiftPatternId: string, areaIds: string[], cellIds: string[], workcenterIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, FPYDto[]>({
      method: 'GET',
      url: `/api/app/kpi-data/fpy/${shiftPatternId}`,
      params: { startDate, endDate, areaIds, cellIds, workcenterIds },
    },
    { apiName: this.apiName,...config });
  

  getPerformance = (startDate: string, endDate: string, shiftPatternId: string, areaIds: string[], cellIds: string[], workcenterIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, PerformanceDto[]>({
      method: 'GET',
      url: `/api/app/kpi-data/performance/${shiftPatternId}`,
      params: { startDate, endDate, areaIds, cellIds, workcenterIds },
    },
    { apiName: this.apiName,...config });
  

  getSppm = (startDate: string, endDate: string, shiftPatternId: string, areaIds: string[], cellIds: string[], workcenterIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, SPPMDto[]>({
      method: 'GET',
      url: `/api/app/kpi-data/sppm/${shiftPatternId}`,
      params: { startDate, endDate, areaIds, cellIds, workcenterIds },
    },
    { apiName: this.apiName,...config });
  

  getUdt = (startDate: string, endDate: string, shiftPatternId: string, areaIds: string[], cellIds: string[], workcenterIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, UDTDto[]>({
      method: 'GET',
      url: `/api/app/kpi-data/udt/${shiftPatternId}`,
      params: { startDate, endDate, areaIds, cellIds, workcenterIds },
    },
    { apiName: this.apiName,...config });
  

  getUpph = (startDate: string, endDate: string, shiftPatternId: string, areaIds: string[], cellIds: string[], workcenterIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, UPPHDto[]>({
      method: 'GET',
      url: `/api/app/kpi-data/upph/${shiftPatternId}`,
      params: { startDate, endDate, areaIds, cellIds, workcenterIds },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
