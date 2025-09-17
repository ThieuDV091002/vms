import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  apiName = 'notification';
  

  sendEmailToUser = (userId: string, subject: string, body: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/email/send-email-to-user/${userId}`,
      params: { subject, body },
    },
    { apiName: this.apiName,...config });
  

  sendEmailToUsers = (userIds: string[], subject: string, body: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/email/send-email-to-users',
      params: { subject, body },
      body: userIds,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
