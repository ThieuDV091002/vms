import type { CreateUpdateShiftDto, GetShiftMasterDataIds, ImportResultDto, ModelingHistoryDto, ModelingInput, ShiftByDataTierDto, ShiftDto, ShiftExportInput, ShiftGetListInput, ShiftPatternByDateDto } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  apiName = 'general';
  

  copy = (input: CreateUpdateShiftDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftDto>({
      method: 'POST',
      url: '/api/app/shift/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateShiftDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftDto>({
      method: 'POST',
      url: '/api/app/shift',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateShiftDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftDto>({
      method: 'POST',
      url: '/api/app/shift/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/shift/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/shift/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/shift/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftDto>({
      method: 'GET',
      url: `/api/app/shift/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftDto[]>({
      method: 'GET',
      url: '/api/app/shift/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftDto>({
      method: 'GET',
      url: '/api/app/shift/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ShiftExportInput[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftDto[]>({
      method: 'POST',
      url: '/api/app/shift/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ShiftGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ShiftDto>>({
      method: 'GET',
      url: '/api/app/shift',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/shift/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getNextShift = (productionDate: string, ShiftId: string, dataTiers: GetShiftMasterDataIds, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftPatternByDateDto>({
      method: 'GET',
      url: `/api/app/shift/next-shift/${ShiftId}`,
      params: { productionDate, areaIds: dataTiers.areaIds, cellIds: dataTiers.cellIds, wrokCenterIds: dataTiers.wrokCenterIds },
    },
    { apiName: this.apiName,...config });
  

  getPreviousShift = (productionDate: string, ShiftId: string, dataTiers: GetShiftMasterDataIds, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftPatternByDateDto>({
      method: 'GET',
      url: `/api/app/shift/previous-shift/${ShiftId}`,
      params: { productionDate, areaIds: dataTiers.areaIds, cellIds: dataTiers.cellIds, wrokCenterIds: dataTiers.wrokCenterIds },
    },
    { apiName: this.apiName,...config });
  

  getShiftByDataTier = (dataTiers: GetShiftMasterDataIds, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftByDataTierDto>({
      method: 'GET',
      url: '/api/app/shift/shift-by-data-tier',
      params: { areaIds: dataTiers.areaIds, cellIds: dataTiers.cellIds, wrokCenterIds: dataTiers.wrokCenterIds },
    },
    { apiName: this.apiName,...config });
  

  getShiftByDate = (dateTime: string, dataTiers: GetShiftMasterDataIds, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftPatternByDateDto>({
      method: 'GET',
      url: '/api/app/shift/shift-by-date',
      params: { dateTime, areaIds: dataTiers.areaIds, cellIds: dataTiers.cellIds, wrokCenterIds: dataTiers.wrokCenterIds },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ShiftExportInput[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/shift/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/shift/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateShiftDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftDto[]>({
      method: 'PUT',
      url: '/api/app/shift/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateShiftDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftDto>({
      method: 'PUT',
      url: `/api/app/shift/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
