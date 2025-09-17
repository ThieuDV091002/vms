import type { CreateUpdateSupportTeamDto, SupportTeamDto, SupportTeamGetListInput, SupportTeamSearchListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { SupportTeamWithAssignedDataTierDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class SupportTeamService {
  apiName = 'general';
  

  create = (dto: CreateUpdateSupportTeamDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupportTeamDto>({
      method: 'POST',
      url: '/api/app/support-team',
      body: dto,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/support-team/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupportTeamDto>({
      method: 'GET',
      url: `/api/app/support-team/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getFullSupportTeamWithDataTiersByIdById = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupportTeamWithAssignedDataTierDto>({
      method: 'GET',
      url: `/api/app/support-team/${id}/full-support-team-with-data-tiers-by-id`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: SupportTeamGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SupportTeamDto>>({
      method: 'GET',
      url: '/api/app/support-team',
      params: { user: input.user, jobFunction: input.jobFunction, supportShift: input.supportShift, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getSupportTeamViewList = (input: SupportTeamSearchListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SupportTeamWithAssignedDataTierDto>>({
      method: 'GET',
      url: '/api/app/support-team/support-team-view-list',
      params: { userId: input.userId, areaId: input.areaId, cellId: input.cellId, workCenterId: input.workCenterId, keyword: input.keyword, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateSupportTeamDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupportTeamDto>({
      method: 'PUT',
      url: `/api/app/support-team/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
