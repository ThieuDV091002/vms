import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { CreateUpdateTravelToolDto, TravelToolDto } from '../dtos/travel-tool';

@Injectable({
  providedIn: 'root',
})
export class TravelToolService {
  apiName = 'vms';

  create = (input: CreateUpdateTravelToolDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TravelToolDto>(
      {
        method: 'POST',
        url: '/api/app/tool',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  getPhoto = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<void, any>(
      {
        method: 'GET',
        params: { fileId: id },
        url: `/api/app/file`,
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/tool/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TravelToolDto>(
      {
        method: 'GET',
        url: `/api/app/tool/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<TravelToolDto>>(
      {
        method: 'GET',
        url: '/api/app/tool',
      },
      { apiName: this.apiName, ...config }
    );

  getByToolType = (section: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TravelToolDto>(
      {
        method: 'GET',
        url: '/api/app/tool/by-tool-type',
        params: { section },
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateTravelToolDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TravelToolDto>(
      {
        method: 'PUT',
        url: `/api/app/tool/${id}`,
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
