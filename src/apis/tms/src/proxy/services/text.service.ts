import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateTextDto, TextDto } from '../dtos/text/models';

@Injectable({
  providedIn: 'root',
})
export class TextService {
  apiName = 'vms';

  create = (input: CreateUpdateTextDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TextDto>(
      {
        method: 'POST',
        url: '/api/app/text',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/text/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TextDto>(
      {
        method: 'GET',
        url: `/api/app/text/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getBySection = (section: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TextDto>(
      {
        method: 'GET',
        url: '/api/app/text/by-section',
        params: { section },
      },
      { apiName: this.apiName, ...config }
    );

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<TextDto>>(
      {
        method: 'GET',
        url: '/api/app/text',
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateTextDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TextDto>(
      {
        method: 'PUT',
        url: `/api/app/text/${id}`,
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
