import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { MachineCounterUpdateEvent } from '../etos/machine-counter/models';
import type { MachineCounterEventDto, MachineCounterEventGetListInput } from '../machine-counter/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class MachineCounterUpdateService {
  apiName = 'ticket';
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/machine-counter-update/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MachineCounterEventDto>({
      method: 'GET',
      url: `/api/app/machine-counter-update/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: MachineCounterEventGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<MachineCounterEventDto>>({
      method: 'GET',
      url: '/api/app/machine-counter-update',
      params: { eventTimestamp: input.eventTimestamp, workCenter: input.workCenter, toolChangedRequired: input.toolChangedRequired, rmChangeRequired: input.rmChangeRequired, productChangeRequired: input.productChangeRequired, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  handleMachineCounterUpdateEvent = (eventData: MachineCounterUpdateEvent, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/machine-counter-update/handle-machine-counter-update-event',
      body: eventData,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
