import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { KafkaIntegrationSettingsDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class ProductionReviewIntegrationSettingsService {
  apiName = 'Default';
  

  get = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, KafkaIntegrationSettingsDto[]>({
      method: 'GET',
      url: '/api/app/production-review-integration-settings',
    },
    { apiName: this.apiName,...config });
  

  reStartConsumer = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/production-review-integration-settings/re-start-consumer',
    },
    { apiName: this.apiName,...config });
  

  update = (dto: KafkaIntegrationSettingsDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/app/production-review-integration-settings',
      body: dto,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
