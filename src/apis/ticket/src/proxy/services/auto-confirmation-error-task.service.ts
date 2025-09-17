import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { AutoConfirmationStatusEventDto, RoleBoardTaskDto, SingleResultWithStatusDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class AutoConfirmationErrorTaskService {
  apiName = 'ticket';
  

  tryProcessAutoConfirmationStatusChangeByEventData = (eventData: AutoConfirmationStatusEventDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SingleResultWithStatusDto<RoleBoardTaskDto>>({
      method: 'POST',
      url: '/api/app/auto-confirmation-error-task/try-process-auto-confirmation-status-change',
      body: eventData,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
