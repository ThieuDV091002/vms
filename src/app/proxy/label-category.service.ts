import type { CreateUpdateLabelCategoryDto, ExportLabelCategoryDto, LabelCategoryDto, LabelCategoryGetListInput } from './dtos/label-category/models';
import type { ModelingHistoryDto, ModelingInputDto } from './dtos/modeling/models';
import type { ImportResultDto } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LabelCategoryService {
  apiName = 'Default';
  

  copy = (input: CreateUpdateLabelCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LabelCategoryDto>({
      method: 'POST',
      url: '/api/app/label-category/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateLabelCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LabelCategoryDto>({
      method: 'POST',
      url: '/api/app/label-category',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateLabelCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LabelCategoryDto>({
      method: 'POST',
      url: '/api/app/label-category/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/label-category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/label-category/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/label-category/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LabelCategoryDto>({
      method: 'GET',
      url: `/api/app/label-category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LabelCategoryDto[]>({
      method: 'GET',
      url: '/api/app/label-category/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LabelCategoryDto>({
      method: 'GET',
      url: '/api/app/label-category/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportLabelCategoryDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, LabelCategoryDto[]>({
      method: 'POST',
      url: '/api/app/label-category/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: LabelCategoryGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LabelCategoryDto>>({
      method: 'GET',
      url: '/api/app/label-category',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/label-category/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportLabelCategoryDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/label-category/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/label-category/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateLabelCategoryDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LabelCategoryDto[]>({
      method: 'PUT',
      url: '/api/app/label-category/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLabelCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LabelCategoryDto>({
      method: 'PUT',
      url: `/api/app/label-category/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
