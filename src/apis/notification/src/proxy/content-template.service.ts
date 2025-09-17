import type { ContentTemplateCacheDto, ContentTemplateDto, ContentTemplateGetListInput, CreateUpdateContentTemplateDto, ExportContentTemplateDto } from './dtos/content-templates/models';
import type { ImportResultDto, ModelingHistoryDto, ModelingInputDto } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContentTemplateService {
  apiName = 'notification';
  

  copy = (input: CreateUpdateContentTemplateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContentTemplateDto>({
      method: 'POST',
      url: '/api/app/content-template/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateContentTemplateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContentTemplateDto>({
      method: 'POST',
      url: '/api/app/content-template',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateContentTemplateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContentTemplateDto>({
      method: 'POST',
      url: '/api/app/content-template/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/content-template/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/content-template/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/content-template/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContentTemplateDto>({
      method: 'GET',
      url: `/api/app/content-template/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContentTemplateDto[]>({
      method: 'GET',
      url: '/api/app/content-template/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContentTemplateDto>({
      method: 'GET',
      url: '/api/app/content-template/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getCache = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContentTemplateCacheDto[]>({
      method: 'GET',
      url: '/api/app/content-template/cache',
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportContentTemplateDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContentTemplateDto[]>({
      method: 'POST',
      url: '/api/app/content-template/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ContentTemplateGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ContentTemplateDto>>({
      method: 'GET',
      url: '/api/app/content-template',
      params: { subject: input.subject, content: input.content, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/content-template/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportContentTemplateDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/content-template/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/content-template/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateContentTemplateDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContentTemplateDto[]>({
      method: 'PUT',
      url: '/api/app/content-template/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateContentTemplateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContentTemplateDto>({
      method: 'PUT',
      url: `/api/app/content-template/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
