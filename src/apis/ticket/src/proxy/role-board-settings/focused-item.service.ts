import type { CreateUpdateFocusedItemDto, FocusedItemDto, FocusedItemGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ExportFocusedItemDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class FocusedItemService {
  apiName = 'ticket';
  

  create = (input: CreateUpdateFocusedItemDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FocusedItemDto>({
      method: 'POST',
      url: '/api/app/focused-item',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/focused-item/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/focused-item/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/focused-item/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FocusedItemDto>({
      method: 'GET',
      url: `/api/app/focused-item/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, FocusedItemDto[]>({
      method: 'GET',
      url: '/api/app/focused-item/instances',
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportFocusedItemDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, FocusedItemDto[]>({
      method: 'POST',
      url: '/api/app/focused-item/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: FocusedItemGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<FocusedItemDto>>({
      method: 'GET',
      url: '/api/app/focused-item',
      params: { workCenterName: input.workCenterName, workCenterId: input.workCenterId, partNumber: input.partNumber, priority: input.priority, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/focused-item/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportFocusedItemDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/focused-item/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/focused-item/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateFocusedItemDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FocusedItemDto[]>({
      method: 'PUT',
      url: '/api/app/focused-item/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateFocusedItemDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FocusedItemDto>({
      method: 'PUT',
      url: `/api/app/focused-item/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
