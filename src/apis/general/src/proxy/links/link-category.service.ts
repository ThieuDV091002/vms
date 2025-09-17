import type { CreateUpdateLinkCategoryDto, LinkCategoryDto, LinkCategoryGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ImportResultDto, LinkCategoryExportDto, ModelingHistoryDto, ModelingInput } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class LinkCategoryService {
  apiName = 'general';
  

  copy = (input: CreateUpdateLinkCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkCategoryDto>({
      method: 'POST',
      url: '/api/app/link-category/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateLinkCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkCategoryDto>({
      method: 'POST',
      url: '/api/app/link-category',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateLinkCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkCategoryDto>({
      method: 'POST',
      url: '/api/app/link-category/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/link-category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/link-category/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/link-category/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkCategoryDto>({
      method: 'GET',
      url: `/api/app/link-category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkCategoryDto[]>({
      method: 'GET',
      url: '/api/app/link-category/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkCategoryDto>({
      method: 'GET',
      url: '/api/app/link-category/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: LinkCategoryExportDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkCategoryDto[]>({
      method: 'POST',
      url: '/api/app/link-category/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: LinkCategoryGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LinkCategoryDto>>({
      method: 'GET',
      url: '/api/app/link-category',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/link-category/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: LinkCategoryExportDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/link-category/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/link-category/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateLinkCategoryDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkCategoryDto[]>({
      method: 'PUT',
      url: '/api/app/link-category/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLinkCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkCategoryDto>({
      method: 'PUT',
      url: `/api/app/link-category/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
