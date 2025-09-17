import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApplicationDto, CreateApplicationInput, GetApplicationListInput, UpdateApplicationInput } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  apiName = 'Default';
  

  create = (input: CreateApplicationInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApplicationDto>({
      method: 'POST',
      url: '/api/app/application',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/application/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApplicationDto>({
      method: 'GET',
      url: `/api/app/application/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetApplicationListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ApplicationDto>>({
      method: 'GET',
      url: '/api/app/application',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateApplicationInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApplicationDto>({
      method: 'PUT',
      url: `/api/app/application/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
