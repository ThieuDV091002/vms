import type { CellSettingDto, CellSettingGetListInput, CreateUpdateCellSettingDto, ExportCellSettingDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ImportResultDto, ModelingHistoryDto, ModelingInput } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class CellSettingService {
  apiName = 'general';
  

  copy = (input: CreateUpdateCellSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellSettingDto>({
      method: 'POST',
      url: '/api/app/cell-setting/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateCellSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellSettingDto>({
      method: 'POST',
      url: '/api/app/cell-setting',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateCellSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellSettingDto>({
      method: 'POST',
      url: '/api/app/cell-setting/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/cell-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/cell-setting/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/cell-setting/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellSettingDto>({
      method: 'GET',
      url: `/api/app/cell-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellSettingDto[]>({
      method: 'GET',
      url: '/api/app/cell-setting/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellSettingDto>({
      method: 'GET',
      url: '/api/app/cell-setting/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportCellSettingDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellSettingDto[]>({
      method: 'POST',
      url: '/api/app/cell-setting/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: CellSettingGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CellSettingDto>>({
      method: 'GET',
      url: '/api/app/cell-setting',
      params: { cellId: input.cellId, kpiReviewType: input.kpiReviewType, qualityReviewType: input.qualityReviewType, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/cell-setting/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportCellSettingDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/cell-setting/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/cell-setting/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateCellSettingDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellSettingDto[]>({
      method: 'PUT',
      url: '/api/app/cell-setting/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCellSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CellSettingDto>({
      method: 'PUT',
      url: `/api/app/cell-setting/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
