import type { CreateUpdateToDoListSetupDto, ToDoListSetupDto, ToDoListSetupGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { GenerateToDoTaskResultDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto, ToDoListSetupExportDto } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class ToDoListSetupService {
  apiName = 'ticket';
  

  copy = (input: CreateUpdateToDoListSetupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoListSetupDto>({
      method: 'POST',
      url: '/api/app/to-do-list-setup/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateToDoListSetupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoListSetupDto>({
      method: 'POST',
      url: '/api/app/to-do-list-setup',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateToDoListSetupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoListSetupDto>({
      method: 'POST',
      url: '/api/app/to-do-list-setup/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/to-do-list-setup/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/to-do-list-setup/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/to-do-list-setup/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  generateDailyTasksForAllSetups = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, GenerateToDoTaskResultDto[]>({
      method: 'POST',
      url: '/api/app/to-do-list-setup/generate-daily-tasks-for-all-setups',
    },
    { apiName: this.apiName,...config });
  

  generateTasksBySetupIdByIdAndStartDateAndEndDate = (id: string, startDate: string, endDate: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GenerateToDoTaskResultDto>({
      method: 'POST',
      url: `/api/app/to-do-list-setup/${id}/generate-tasks-by-setup-id`,
      params: { startDate, endDate },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoListSetupDto>({
      method: 'GET',
      url: `/api/app/to-do-list-setup/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoListSetupDto[]>({
      method: 'GET',
      url: '/api/app/to-do-list-setup/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoListSetupDto>({
      method: 'GET',
      url: '/api/app/to-do-list-setup/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ToDoListSetupExportDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoListSetupDto[]>({
      method: 'POST',
      url: '/api/app/to-do-list-setup/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ToDoListSetupGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ToDoListSetupDto>>({
      method: 'GET',
      url: '/api/app/to-do-list-setup',
      params: { toDoTypeId: input.toDoTypeId, scope: input.scope, scheduleCronExpression: input.scheduleCronExpression, scheduleCompletionDate: input.scheduleCompletionDate, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/to-do-list-setup/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ToDoListSetupExportDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/to-do-list-setup/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/to-do-list-setup/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateToDoListSetupDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoListSetupDto[]>({
      method: 'PUT',
      url: '/api/app/to-do-list-setup/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateToDoListSetupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoListSetupDto>({
      method: 'PUT',
      url: `/api/app/to-do-list-setup/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
