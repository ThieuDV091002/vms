import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateAttractionDto, AttractionDto } from '../dtos/attraction/models';

@Injectable({
  providedIn: 'root',
})
export class AttractionService {
  apiName = 'vms';

  create = (input: CreateUpdateAttractionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttractionDto>(
      {
        method: 'POST',
        url: '/api/app/attraction',
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
        url: `/api/app/attraction/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttractionDto>(
      {
        method: 'GET',
        url: `/api/app/attraction/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AttractionDto>>(
      {
        method: 'GET',
        url: '/api/app/attraction',
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateAttractionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttractionDto>(
      {
        method: 'PUT',
        url: `/api/app/attraction/${id}`,
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
