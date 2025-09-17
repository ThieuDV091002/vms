import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateRoleBoardTaskTypeDto, ExportRoleBoardTaskTypeDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto, RoleBoardTaskTypeDto, RoleBoardTaskTypeGetListInput } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleBoardTaskTypeService {
  apiName = 'ticket';
  

  copy = (input: CreateUpdateRoleBoardTaskTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardTaskTypeDto>({
      method: 'POST',
      url: '/api/app/role-board-task-type/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateRoleBoardTaskTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardTaskTypeDto>({
      method: 'POST',
      url: '/api/app/role-board-task-type',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateRoleBoardTaskTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardTaskTypeDto>({
      method: 'POST',
      url: '/api/app/role-board-task-type/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/role-board-task-type/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/role-board-task-type/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/role-board-task-type/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardTaskTypeDto>({
      method: 'GET',
      url: `/api/app/role-board-task-type/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardTaskTypeDto[]>({
      method: 'GET',
      url: '/api/app/role-board-task-type/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardTaskTypeDto>({
      method: 'GET',
      url: '/api/app/role-board-task-type/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportRoleBoardTaskTypeDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardTaskTypeDto[]>({
      method: 'POST',
      url: '/api/app/role-board-task-type/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: RoleBoardTaskTypeGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<RoleBoardTaskTypeDto>>({
      method: 'GET',
      url: '/api/app/role-board-task-type',
      params: { stateModelId: input.stateModelId, category: input.category, alertColor: input.alertColor, warningColor: input.warningColor, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/role-board-task-type/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportRoleBoardTaskTypeDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/role-board-task-type/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/role-board-task-type/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateRoleBoardTaskTypeDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardTaskTypeDto[]>({
      method: 'PUT',
      url: '/api/app/role-board-task-type/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateRoleBoardTaskTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardTaskTypeDto>({
      method: 'PUT',
      url: `/api/app/role-board-task-type/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
