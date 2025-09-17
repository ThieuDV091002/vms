import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { NotificationSettingEmailEto } from '../etos/models';

@Injectable({
  providedIn: 'root',
})
export class EmailTestService {
  apiName = 'notification';
  

  handleEvent = (eventData: NotificationSettingEmailEto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/email-test/handle-event',
      body: eventData,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
