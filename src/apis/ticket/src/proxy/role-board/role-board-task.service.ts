import { RestService, Rest } from '@abp/ng.core';
import type { ListResultDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CommentDto, CreateUpdateCommentDto, CreateUpdateRoleBoardTaskDto, NotifyManualTaskCompleteInputDto, NotifyManualTaskCompleteOutputDto, RoleBoardTaskDto, RoleBoardTaskGetListInput, RoleBoardTaskSearchInput, SingleResultDto, TopMinorStoppagesDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class RoleBoardTaskService {
  apiName = 'ticket';
  

  addTaskCommentByDto = (dto: CreateUpdateCommentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SingleResultDto>({
      method: 'POST',
      url: '/api/app/role-board-task/task-comment',
      body: dto,
    },
    { apiName: this.apiName,...config });
  

  completeTaskByTaskIdAndIsManualAndCompleteReason = (taskId: string, IsManual?: boolean, CompleteReason?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SingleResultDto>({
      method: 'POST',
      url: `/api/app/role-board-task/complete-task/${taskId}`,
      params: { isManual: IsManual, completeReason: CompleteReason },
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateRoleBoardTaskDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardTaskDto>({
      method: 'POST',
      url: '/api/app/role-board-task',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/role-board-task/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardTaskDto>({
      method: 'GET',
      url: `/api/app/role-board-task/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getIncomingTasks = (input: RoleBoardTaskSearchInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<RoleBoardTaskDto>>({
      method: 'GET',
      url: '/api/app/role-board-task/incoming-tasks',
      params: { areaIds: input.areaIds, cellIds: input.cellIds, workCenterIds: input.workCenterIds, ownerRoleName: input.ownerRoleName, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: RoleBoardTaskGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<RoleBoardTaskDto>>({
      method: 'GET',
      url: '/api/app/role-board-task',
      params: { taskTypeId: input.taskTypeId, taskTime: input.taskTime, warningTime: input.warningTime, alertTime: input.alertTime, isUrgent: input.isUrgent, priority: input.priority, status: input.status, instructions: input.instructions, dataTierId: input.dataTierId, dataTierType: input.dataTierType, currentStateId: input.currentStateId, assignedOwnerId: input.assignedOwnerId, ownerRoleName: input.ownerRoleName, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getTaskCommentsByTaskId = (taskId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ListResultDto<CommentDto>>({
      method: 'GET',
      url: `/api/app/role-board-task/task-comments/${taskId}`,
    },
    { apiName: this.apiName,...config });
  

  getTopThreeWorkcenterFailuresByAreaIdsAndCellIdsAndWorkCenterIds = (areaIds: string[], cellIds: string[], workCenterIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, TopMinorStoppagesDto>({
      method: 'GET',
      url: '/api/app/role-board-task/top-three-workcenter-failures',
      params: { areaIds, cellIds, workCenterIds },
    },
    { apiName: this.apiName,...config });
  

  getUrgentTasks = (input: RoleBoardTaskSearchInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<RoleBoardTaskDto>>({
      method: 'GET',
      url: '/api/app/role-board-task/urgent-tasks',
      params: { areaIds: input.areaIds, cellIds: input.cellIds, workCenterIds: input.workCenterIds, ownerRoleName: input.ownerRoleName, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  notifyManualTaskCompleteByRequest = (request: NotifyManualTaskCompleteInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotifyManualTaskCompleteOutputDto>({
      method: 'POST',
      url: '/api/app/role-board-task/notify-manual-task-complete',
      body: request,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateRoleBoardTaskDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardTaskDto>({
      method: 'PUT',
      url: `/api/app/role-board-task/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
