import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { TeamsMessageDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  apiName = 'notification';
  

  sendMessage = (message: TeamsMessageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/teams/send-message',
      body: message,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
