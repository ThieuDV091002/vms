import type { CreateUpdateRoleBoardSettingDto, RoleBoardSettingDto, RoleBoardSettingGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ImportResultDto, ModelingHistoryDto, ModelingInputDto } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleBoardSettingService {
  apiName = 'ticket';
  

  create = (input: CreateUpdateRoleBoardSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardSettingDto>({
      method: 'POST',
      url: '/api/app/role-board-setting',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/role-board-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/role-board-setting/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/role-board-setting/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardSettingDto>({
      method: 'GET',
      url: `/api/app/role-board-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardSettingDto[]>({
      method: 'GET',
      url: '/api/app/role-board-setting/instances',
    },
    { apiName: this.apiName,...config });
  

  getList = (input: RoleBoardSettingGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<RoleBoardSettingDto>>({
      method: 'GET',
      url: '/api/app/role-board-setting',
      params: { areaId: input.areaId, areaName: input.areaName, fgCollectionWindow: input.fgCollectionWindow, fgCollectionTaskRoleName: input.fgCollectionTaskRoleName, minorStoppageDurationMinutes: input.minorStoppageDurationMinutes, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/role-board-setting/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: CreateUpdateRoleBoardSettingDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/role-board-setting/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/role-board-setting/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateRoleBoardSettingDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardSettingDto[]>({
      method: 'PUT',
      url: '/api/app/role-board-setting/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateRoleBoardSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleBoardSettingDto>({
      method: 'PUT',
      url: `/api/app/role-board-setting/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
