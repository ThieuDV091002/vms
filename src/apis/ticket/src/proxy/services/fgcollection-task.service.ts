import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateCompleteTasksProcessResultDto, CreateUpdateResourceStatusEventDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class FGCollectionTaskService {
  apiName = 'ticket';
  

  tryCompleteTaskFromResourceStatusEventByEventDto = (eventDto: CreateUpdateResourceStatusEventDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CreateCompleteTasksProcessResultDto>({
      method: 'POST',
      url: '/api/app/f-gCollection-task/try-complete-task-from-resource-status-event',
      body: eventDto,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
