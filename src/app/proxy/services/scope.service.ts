import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateScopeInput, GetScopeListInput, ScopeDto, UpdateScopeInput } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class ScopeService {
  apiName = 'Default';
  

  create = (input: CreateScopeInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ScopeDto>({
      method: 'POST',
      url: '/api/app/scope',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/scope/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ScopeDto>({
      method: 'GET',
      url: `/api/app/scope/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllScopes = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ScopeDto[]>({
      method: 'GET',
      url: '/api/app/scope/scopes',
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetScopeListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ScopeDto>>({
      method: 'GET',
      url: '/api/app/scope',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateScopeInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ScopeDto>({
      method: 'PUT',
      url: `/api/app/scope/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
