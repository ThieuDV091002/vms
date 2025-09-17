import type { CreateUpdateResourceStatusEventDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResourceStatusEventService {
  apiName = 'ticket';
  

  resourceStatusChange = (input: CreateUpdateResourceStatusEventDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/resource-status-event/resource-status-change',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
