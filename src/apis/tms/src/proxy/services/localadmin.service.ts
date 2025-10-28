import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { CreateUpdateLocalAdminDto, LocalAdminDto } from '../dtos/localadmin';

@Injectable({
  providedIn: 'root',
})
export class LocalAdminService {
  apiName = 'vms';

  create = (input: CreateUpdateLocalAdminDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalAdminDto>(
      {
        method: 'POST',
        url: '/api/app/local-admin',
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
        url: `/api/app/local-admin/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalAdminDto>(
      {
        method: 'GET',
        url: `/api/app/local-admin/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LocalAdminDto>>(
      {
        method: 'GET',
        url: '/api/app/local-admin',
      },
      { apiName: this.apiName, ...config }
    );

  getBySite = (site: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalAdminDto[]>(
      {
        method: 'GET',
        url: '/api/app/local-admin/by-site',
        params: { site },
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateLocalAdminDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LocalAdminDto>(
      {
        method: 'PUT',
        url: `/api/app/local-admin/${id}`,
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
