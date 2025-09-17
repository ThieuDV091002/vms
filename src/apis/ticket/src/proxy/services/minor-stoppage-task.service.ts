import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateCompleteTasksProcessResultDto, CreateUpdateResourceStatusEventDto } from '../dtos/models';
import type { MachineCounterEventDto } from '../machine-counter/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class MinorStoppageTaskService {
  apiName = 'ticket';
  

  tryCompleteTaskFromMachineCounterUpdateEventByEventDto = (eventDto: MachineCounterEventDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CreateCompleteTasksProcessResultDto>({
      method: 'POST',
      url: '/api/app/minor-stoppage-task/try-complete-task-from-machine-counter-update-event',
      body: eventDto,
    },
    { apiName: this.apiName,...config });
  

  tryCreateTaskFromResourceStatusEventByEventDto = (eventDto: CreateUpdateResourceStatusEventDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CreateCompleteTasksProcessResultDto>({
      method: 'POST',
      url: '/api/app/minor-stoppage-task/try-create-task-from-resource-status-event',
      body: eventDto,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
