import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { SingleResultDto } from '../dtos/models';
import type { MaterialQueueChangeEvent } from '../etos/material-queue/models';

@Injectable({
  providedIn: 'root',
})
export class MaterialQueueChangeEventService {
  apiName = 'ticket';
  

  handleMaterialQueueChangeEvent = (eventData: MaterialQueueChangeEvent, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SingleResultDto>({
      method: 'POST',
      url: '/api/app/material-queue-change-event/handle-material-queue-change-event',
      body: eventData,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
