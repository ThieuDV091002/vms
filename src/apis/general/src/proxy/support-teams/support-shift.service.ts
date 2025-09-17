import type { CreateUpdateSupportShiftDto, SupportShiftDto, SupportShiftGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ExportNameObjectDto, ImportResultDto, ModelingHistoryDto, ModelingInput } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class SupportShiftService {
  apiName = 'general';
  

  copy = (input: CreateUpdateSupportShiftDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupportShiftDto>({
      method: 'POST',
      url: '/api/app/support-shift/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateSupportShiftDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupportShiftDto>({
      method: 'POST',
      url: '/api/app/support-shift',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateSupportShiftDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupportShiftDto>({
      method: 'POST',
      url: '/api/app/support-shift/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/support-shift/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/support-shift/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/support-shift/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupportShiftDto>({
      method: 'GET',
      url: `/api/app/support-shift/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupportShiftDto[]>({
      method: 'GET',
      url: '/api/app/support-shift/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupportShiftDto>({
      method: 'GET',
      url: '/api/app/support-shift/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportNameObjectDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupportShiftDto[]>({
      method: 'POST',
      url: '/api/app/support-shift/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: SupportShiftGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SupportShiftDto>>({
      method: 'GET',
      url: '/api/app/support-shift',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/support-shift/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportNameObjectDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/support-shift/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/support-shift/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateSupportShiftDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupportShiftDto[]>({
      method: 'PUT',
      url: '/api/app/support-shift/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateSupportShiftDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupportShiftDto>({
      method: 'PUT',
      url: `/api/app/support-shift/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
