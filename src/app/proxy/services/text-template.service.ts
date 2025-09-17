import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ModelingHistoryDto, ModelingInputDto } from '../dtos/modeling/models';
import type { ImportResultDto } from '../dtos/models';
import type { CreateUpdateTextTemplateDto, ExportTextTemplateDto, TextTemplateDto, TextTemplateGetListInput } from '../dtos/text-template/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class TextTemplateService {
  apiName = 'Default';
  

  copy = (input: CreateUpdateTextTemplateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TextTemplateDto>({
      method: 'POST',
      url: '/api/app/text-template/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateTextTemplateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TextTemplateDto>({
      method: 'POST',
      url: '/api/app/text-template',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateTextTemplateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TextTemplateDto>({
      method: 'POST',
      url: '/api/app/text-template/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/text-template/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/text-template/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/text-template/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TextTemplateDto>({
      method: 'GET',
      url: `/api/app/text-template/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, TextTemplateDto[]>({
      method: 'GET',
      url: '/api/app/text-template/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TextTemplateDto>({
      method: 'GET',
      url: '/api/app/text-template/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportTextTemplateDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, TextTemplateDto[]>({
      method: 'POST',
      url: '/api/app/text-template/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: TextTemplateGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<TextTemplateDto>>({
      method: 'GET',
      url: '/api/app/text-template',
      params: { isLayout: input.isLayout, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/text-template/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportTextTemplateDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/text-template/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/text-template/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateTextTemplateDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TextTemplateDto[]>({
      method: 'PUT',
      url: '/api/app/text-template/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateTextTemplateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TextTemplateDto>({
      method: 'PUT',
      url: `/api/app/text-template/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
