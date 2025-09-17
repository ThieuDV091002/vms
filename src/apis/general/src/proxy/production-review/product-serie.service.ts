import type { CreateUpdateProductSerieDto, ProductSerieDto, ProductSerieGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ExportNameObjectDto, ImportResultDto, ModelingHistoryDto, ModelingInput } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class ProductSerieService {
  apiName = 'general';
  

  copy = (input: CreateUpdateProductSerieDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductSerieDto>({
      method: 'POST',
      url: '/api/app/product-serie/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateProductSerieDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductSerieDto>({
      method: 'POST',
      url: '/api/app/product-serie',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateProductSerieDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductSerieDto>({
      method: 'POST',
      url: '/api/app/product-serie/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/product-serie/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/product-serie/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/product-serie/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductSerieDto>({
      method: 'GET',
      url: `/api/app/product-serie/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductSerieDto[]>({
      method: 'GET',
      url: '/api/app/product-serie/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductSerieDto>({
      method: 'GET',
      url: '/api/app/product-serie/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportNameObjectDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductSerieDto[]>({
      method: 'POST',
      url: '/api/app/product-serie/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ProductSerieGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ProductSerieDto>>({
      method: 'GET',
      url: '/api/app/product-serie',
      params: { ids: input.ids, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/product-serie/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportNameObjectDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/product-serie/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/product-serie/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateProductSerieDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductSerieDto[]>({
      method: 'PUT',
      url: '/api/app/product-serie/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateProductSerieDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductSerieDto>({
      method: 'PUT',
      url: `/api/app/product-serie/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
