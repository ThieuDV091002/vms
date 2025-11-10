import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { CreateUpdateTransportationAppDto, TransportationAppDto } from '../dtos/transportation-app';

@Injectable({
  providedIn: 'root',
})
export class TransportationAppService {
  apiName = 'vms';

  create = (input: CreateUpdateTransportationAppDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TransportationAppDto>(
      {
        method: 'POST',
        url: '/api/app/transportation-app',
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
        url: `/api/app/transportation-app/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TransportationAppDto>(
      {
        method: 'GET',
        url: `/api/app/transportation-app/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getList = (
        query?: { skipCount?: number; maxResultCount?: number; sorting?: string },
        config?: Partial<Rest.Config>
      ) =>
        this.restService.request<any, PagedResultDto<TransportationAppDto>>(
          {
            method: 'GET',
            url: '/api/app/transportation-app',
            params: query,
          },
          { apiName: this.apiName, ...config }
        );

  update = (id: string, input: CreateUpdateTransportationAppDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TransportationAppDto>(
      {
        method: 'PUT',
        url: `/api/app/transportation-app/${id}`,
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
