import type { KafkaIntegrationSettingsDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleBoardIntegrationSettingsService {
  apiName = 'Default';
  

  get = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, KafkaIntegrationSettingsDto[]>({
      method: 'GET',
      url: '/api/app/role-board-integration-settings',
    },
    { apiName: this.apiName,...config });
  

  update = (dto: KafkaIntegrationSettingsDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/app/role-board-integration-settings',
      body: dto,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
