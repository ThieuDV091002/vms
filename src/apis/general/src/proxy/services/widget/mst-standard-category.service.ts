import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ExportNameObjectDto, ImportResultDto, ModelingHistoryDto, ModelingInput } from '../../dtos/models';
import type { CreateUpdateMstStandardCategoryDto, MstStandardCategoryDto, MstStandardCategoryGetListInput } from '../../dtos/widget/models';
import type { FileType } from '../../file-type.enum';
import type { OverridingMode } from '../../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class MstStandardCategoryService {
  apiName = 'general';
  

  copy = (input: CreateUpdateMstStandardCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MstStandardCategoryDto>({
      method: 'POST',
      url: '/api/app/mst-standard-category/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateMstStandardCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MstStandardCategoryDto>({
      method: 'POST',
      url: '/api/app/mst-standard-category',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateMstStandardCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MstStandardCategoryDto>({
      method: 'POST',
      url: '/api/app/mst-standard-category/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/mst-standard-category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/mst-standard-category/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/mst-standard-category/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MstStandardCategoryDto>({
      method: 'GET',
      url: `/api/app/mst-standard-category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, MstStandardCategoryDto[]>({
      method: 'GET',
      url: '/api/app/mst-standard-category/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MstStandardCategoryDto>({
      method: 'GET',
      url: '/api/app/mst-standard-category/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportNameObjectDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, MstStandardCategoryDto[]>({
      method: 'POST',
      url: '/api/app/mst-standard-category/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: MstStandardCategoryGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<MstStandardCategoryDto>>({
      method: 'GET',
      url: '/api/app/mst-standard-category',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/mst-standard-category/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportNameObjectDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/mst-standard-category/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/mst-standard-category/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateMstStandardCategoryDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MstStandardCategoryDto[]>({
      method: 'PUT',
      url: '/api/app/mst-standard-category/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateMstStandardCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MstStandardCategoryDto>({
      method: 'PUT',
      url: `/api/app/mst-standard-category/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
