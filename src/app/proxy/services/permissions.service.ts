import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { GetPermissionListResultDto, UpdatePermissionsDto } from '../volo/abp/permission-management/models';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  apiName = 'Default';
  

  get = (providerName: string, providerKey: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GetPermissionListResultDto>({
      method: 'GET',
      url: '/api/app/permissions',
      params: { providerName, providerKey },
    },
    { apiName: this.apiName,...config });
  

  update = (providerName: string, providerKey: string, input: UpdatePermissionsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/app/permissions',
      params: { providerName, providerKey },
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
