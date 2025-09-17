import type { CreateUpdateProductFamilyDto, ProductFamilyDto, ProductFamilyGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ExportNameObjectDto, ImportResultDto, ModelingHistoryDto, ModelingInput } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class ProductFamilyService {
  apiName = 'general';
  

  copy = (input: CreateUpdateProductFamilyDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductFamilyDto>({
      method: 'POST',
      url: '/api/app/product-family/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateProductFamilyDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductFamilyDto>({
      method: 'POST',
      url: '/api/app/product-family',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateProductFamilyDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductFamilyDto>({
      method: 'POST',
      url: '/api/app/product-family/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/product-family/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/product-family/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/product-family/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductFamilyDto>({
      method: 'GET',
      url: `/api/app/product-family/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductFamilyDto[]>({
      method: 'GET',
      url: '/api/app/product-family/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductFamilyDto>({
      method: 'GET',
      url: '/api/app/product-family/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportNameObjectDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductFamilyDto[]>({
      method: 'POST',
      url: '/api/app/product-family/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ProductFamilyGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ProductFamilyDto>>({
      method: 'GET',
      url: '/api/app/product-family',
      params: { ids: input.ids, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/product-family/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportNameObjectDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/product-family/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/product-family/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateProductFamilyDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductFamilyDto[]>({
      method: 'PUT',
      url: '/api/app/product-family/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateProductFamilyDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductFamilyDto>({
      method: 'PUT',
      url: `/api/app/product-family/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
