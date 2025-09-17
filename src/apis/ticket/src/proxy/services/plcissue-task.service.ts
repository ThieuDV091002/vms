import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { RoleBoardTaskDto, SingleResultWithStatusDto } from '../dtos/models';
import type { MachineCounterEventDto } from '../machine-counter/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class PLCIssueTaskService {
  apiName = 'ticket';
  

  tryCreateTaskFromMachineCounterUpdateEventByEventDto = (eventDto: MachineCounterEventDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SingleResultWithStatusDto<RoleBoardTaskDto>>({
      method: 'POST',
      url: '/api/app/p-lCIssue-task/try-create-task-from-machine-counter-update-event',
      body: eventDto,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
