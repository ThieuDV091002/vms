import type { CreateUpdateMessageCategoryDto, ExportNameObjectDto, ImportResultDto, MessageCategoryDto, MessageCategoryGetListInput, ModelingHistoryDto, ModelingInput } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageCategoryService {
  apiName = 'general';
  

  copy = (input: CreateUpdateMessageCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MessageCategoryDto>({
      method: 'POST',
      url: '/api/app/message-category/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateMessageCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MessageCategoryDto>({
      method: 'POST',
      url: '/api/app/message-category',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateMessageCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MessageCategoryDto>({
      method: 'POST',
      url: '/api/app/message-category/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/message-category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/message-category/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/message-category/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MessageCategoryDto>({
      method: 'GET',
      url: `/api/app/message-category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, MessageCategoryDto[]>({
      method: 'GET',
      url: '/api/app/message-category/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MessageCategoryDto>({
      method: 'GET',
      url: '/api/app/message-category/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportNameObjectDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, MessageCategoryDto[]>({
      method: 'POST',
      url: '/api/app/message-category/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: MessageCategoryGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<MessageCategoryDto>>({
      method: 'GET',
      url: '/api/app/message-category',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/message-category/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportNameObjectDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/message-category/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/message-category/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateMessageCategoryDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MessageCategoryDto[]>({
      method: 'PUT',
      url: '/api/app/message-category/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateMessageCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MessageCategoryDto>({
      method: 'PUT',
      url: `/api/app/message-category/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
