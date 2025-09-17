import type { ProductionCalendarDto } from './dtos/kpi/models';
import type { CreateUpdateShiftPatternDto, ExportShiftPatternDto, ImportResultDto, ModelingHistoryDto, ModelingInput, ShiftPatternBreakdownDto, ShiftPatternDto, ShiftPatternGetListInput } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShiftPatternService {
  apiName = 'general';
  

  copy = (input: CreateUpdateShiftPatternDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftPatternDto>({
      method: 'POST',
      url: '/api/app/shift-pattern/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateShiftPatternDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftPatternDto>({
      method: 'POST',
      url: '/api/app/shift-pattern',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateShiftPatternDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftPatternDto>({
      method: 'POST',
      url: '/api/app/shift-pattern/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/shift-pattern/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/shift-pattern/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/shift-pattern/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftPatternDto>({
      method: 'GET',
      url: `/api/app/shift-pattern/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftPatternDto[]>({
      method: 'GET',
      url: '/api/app/shift-pattern/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftPatternDto>({
      method: 'GET',
      url: '/api/app/shift-pattern/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getDataTierListByShiftsByShifts = (shifts: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, string[]>({
      method: 'GET',
      url: '/api/app/shift-pattern/data-tier-list-by-shifts',
      params: { shifts },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportShiftPatternDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftPatternDto[]>({
      method: 'POST',
      url: '/api/app/shift-pattern/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ShiftPatternGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ShiftPatternDto>>({
      method: 'GET',
      url: '/api/app/shift-pattern',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/shift-pattern/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getProductionCalendarByShiftPatternIdByIdAndStartDateAndEndDate = (id: string, startDate: string, endDate: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionCalendarDto>({
      method: 'GET',
      url: `/api/app/shift-pattern/${id}/production-calendar-by-shift-pattern-id`,
      params: { startDate, endDate },
    },
    { apiName: this.apiName,...config });
  

  getShiftBreakDownIncrementsByIdAndDateByIdAndStartDatetime = (id: string, startDatetime: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftPatternBreakdownDto>({
      method: 'GET',
      url: `/api/app/shift-pattern/${id}/shift-break-down-increments-by-id-and-date`,
      params: { startDatetime },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportShiftPatternDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/shift-pattern/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/shift-pattern/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateShiftPatternDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftPatternDto[]>({
      method: 'PUT',
      url: '/api/app/shift-pattern/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateShiftPatternDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShiftPatternDto>({
      method: 'PUT',
      url: `/api/app/shift-pattern/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
