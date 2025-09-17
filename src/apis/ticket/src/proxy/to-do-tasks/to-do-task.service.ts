import type { CreateUpdateToDoTaskDto, ToDoTaskDto, ToDoTaskGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { AssignToDoTaskDto, AssignToDoTaskResultDto, MyToDoTaskDto, MyToDoTasksRequestDto, SingleResultWithStatusDto, ToDoTaskSearchRequestDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class ToDoTaskService {
  apiName = 'ticket';
  

  addCommentToToDoTaskByIdAndContent = (id: string, content: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoTaskDto>({
      method: 'POST',
      url: `/api/app/to-do-task/${id}/comment-to-to-do-task`,
      params: { content },
    },
    { apiName: this.apiName,...config });
  

  assignActivityCardToToDoTaskByIdAndActivityCardId = (id: string, activityCardId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoTaskDto>({
      method: 'POST',
      url: `/api/app/to-do-task/${id}/assign-activity-card-to-to-do-task/${activityCardId}`,
    },
    { apiName: this.apiName,...config });
  

  assignUsersToTasksByInput = (input: AssignToDoTaskDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssignToDoTaskResultDto>({
      method: 'POST',
      url: '/api/app/to-do-task/assign-users-to-tasks',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  cancelTaskByIdsByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, SingleResultWithStatusDto<number>>({
      method: 'POST',
      url: '/api/app/to-do-task/cancel-task-by-ids',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateToDoTaskDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoTaskDto>({
      method: 'POST',
      url: '/api/app/to-do-task',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  editCommentOnToDoTaskByIdAndCommentIdAndContent = (id: string, commentId: string, content: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoTaskDto>({
      method: 'POST',
      url: `/api/app/to-do-task/${id}/edit-comment-on-to-do-task/${commentId}`,
      params: { content },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ToDoTaskDto>({
      method: 'GET',
      url: `/api/app/to-do-task/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ToDoTaskGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ToDoTaskDto>>({
      method: 'GET',
      url: '/api/app/to-do-task',
      params: { taskInfo: input.taskInfo, toDoTypeId: input.toDoTypeId, currentStatusId: input.currentStatusId, scope: input.scope, taskDate: input.taskDate, expiryDate: input.expiryDate, shiftId: input.shiftId, assigneeId: input.assigneeId, dataTierType: input.dataTierType, dataTierId: input.dataTierId, dataTierName: input.dataTierName, assignedCardId: input.assignedCardId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getMyToDoTasksByInput = (input: MyToDoTasksRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<MyToDoTaskDto>>({
      method: 'GET',
      url: '/api/app/to-do-task/my-to-do-tasks',
      params: { filter: input.filter, assigneeId: input.assigneeId, dataTierType: input.dataTierType, dataTierId: input.dataTierId, shiftIds: input.shiftIds, toDoListSetupIds: input.toDoListSetupIds, statusIds: input.statusIds, expiryDateFrom: input.expiryDateFrom, expiryDateTo: input.expiryDateTo, showMyToDoType: input.showMyToDoType, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getNextStatusByToDoTypeIdAndCurrentStatusIdAndEventName = (ToDoTypeId: string, CurrentStatusId: string, EventName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'GET',
      responseType: 'text',
      url: '/api/app/to-do-task/next-status',
      params: { toDoTypeId: ToDoTypeId, currentStatusId: CurrentStatusId, eventName: EventName },
    },
    { apiName: this.apiName,...config });
  

  restoreTaskByIdsByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, SingleResultWithStatusDto<number>>({
      method: 'POST',
      url: '/api/app/to-do-task/restore-task-by-ids',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  searchTaskByFilterByInput = (input: ToDoTaskSearchRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ToDoTaskDto>>({
      method: 'POST',
      url: '/api/app/to-do-task/search-task-by-filter',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateTaskStatusByIdByIdAndEvent = (id: string, event: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SingleResultWithStatusDto<number>>({
      method: 'POST',
      url: `/api/app/to-do-task/${id}/update-task-status-by-id`,
      params: { event },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
