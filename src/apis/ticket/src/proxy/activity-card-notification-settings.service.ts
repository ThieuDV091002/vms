import type { ActivityCardNotificationSettingsDto, CreateUpdateActivityCardNotificationSettingsDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActivityCardNotificationSettingsService {
  apiName = 'ticket';
  

  createOrUpdate = (input: CreateUpdateActivityCardNotificationSettingsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardNotificationSettingsDto>({
      method: 'POST',
      url: '/api/app/activity-card-notification-settings/or-update',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  getByUserId = (userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardNotificationSettingsDto>({
      method: 'GET',
      url: `/api/app/activity-card-notification-settings/by-user-id/${userId}`,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
