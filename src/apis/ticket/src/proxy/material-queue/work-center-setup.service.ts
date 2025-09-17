import type { CreateUpdateWorkCenterSetupDto, WorkCenterSetupDto, WorkCenterSetupGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkCenterSetupService {
  apiName = 'ticket';
  

  create = (input: CreateUpdateWorkCenterSetupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterSetupDto>({
      method: 'POST',
      url: '/api/app/work-center-setup',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/work-center-setup/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterSetupDto>({
      method: 'GET',
      url: `/api/app/work-center-setup/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByKeys = (workCenter: string, materialQueue: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterSetupDto>({
      method: 'GET',
      url: '/api/app/work-center-setup/by-keys',
      params: { workCenter, materialQueue },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: WorkCenterSetupGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<WorkCenterSetupDto>>({
      method: 'GET',
      url: '/api/app/work-center-setup',
      params: { workCenter: input.workCenter, materialQueue: input.materialQueue, productionOrder: input.productionOrder, operation: input.operation, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateWorkCenterSetupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, WorkCenterSetupDto>({
      method: 'PUT',
      url: `/api/app/work-center-setup/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
