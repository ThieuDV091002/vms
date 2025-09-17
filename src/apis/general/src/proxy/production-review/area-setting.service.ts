import type { AreaSettingDto, AreaSettingGetListInput, CreateUpdateAreaSettingDto, ExportAreaSettingDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ImportResultDto, ModelingHistoryDto, ModelingInput } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class AreaSettingService {
  apiName = 'general';
  

  copy = (input: CreateUpdateAreaSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaSettingDto>({
      method: 'POST',
      url: '/api/app/area-setting/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateAreaSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaSettingDto>({
      method: 'POST',
      url: '/api/app/area-setting',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateAreaSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaSettingDto>({
      method: 'POST',
      url: '/api/app/area-setting/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/area-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/area-setting/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/area-setting/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaSettingDto>({
      method: 'GET',
      url: `/api/app/area-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaSettingDto[]>({
      method: 'GET',
      url: '/api/app/area-setting/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaSettingDto>({
      method: 'GET',
      url: '/api/app/area-setting/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportAreaSettingDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaSettingDto[]>({
      method: 'POST',
      url: '/api/app/area-setting/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: AreaSettingGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AreaSettingDto>>({
      method: 'GET',
      url: '/api/app/area-setting',
      params: { areaId: input.areaId, yearlyInternalQNsTarget: input.yearlyInternalQNsTarget, yearlyExternalQNsTarget: input.yearlyExternalQNsTarget, unsafeConditionTarget: input.unsafeConditionTarget, planActualDiffTol: input.planActualDiffTol, fpyTargetTol: input.fpyTargetTol, sppmTargetTol: input.sppmTargetTol, machineCOPQTarget: input.machineCOPQTarget, machineCOPQTargetTol: input.machineCOPQTargetTol, poeeTarget: input.poeeTarget, poeeTargetTol: input.poeeTargetTol, performanceTargetTol: input.performanceTargetTol, udtTargetTol: input.udtTargetTol, laborCOPQTarget: input.laborCOPQTarget, laborCOPQTargetTol: input.laborCOPQTargetTol, oleTarget: input.oleTarget, oleTargetTol: input.oleTargetTol, upphTargetTol: input.upphTargetTol, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListByAreaIdsByAreaIds = (areaIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaSettingDto[]>({
      method: 'GET',
      url: '/api/app/area-setting/by-area-ids',
      params: { areaIds },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/area-setting/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportAreaSettingDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/area-setting/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/area-setting/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateAreaSettingDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaSettingDto[]>({
      method: 'PUT',
      url: '/api/app/area-setting/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateAreaSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AreaSettingDto>({
      method: 'PUT',
      url: `/api/app/area-setting/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
