import type { CreateUpdateLanguagesDto, ExportLanguageDto, LanguagesDto, LanguagesGetListInput } from './dtos/language/models';
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
export class LanguagesService {
  apiName = 'Default';
  

  copy = (input: CreateUpdateLanguagesDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LanguagesDto>({
      method: 'POST',
      url: '/api/app/languages/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateLanguagesDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LanguagesDto>({
      method: 'POST',
      url: '/api/app/languages',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateLanguagesDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LanguagesDto>({
      method: 'POST',
      url: '/api/app/languages/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/languages/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/languages/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/languages/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LanguagesDto>({
      method: 'GET',
      url: `/api/app/languages/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LanguagesDto[]>({
      method: 'GET',
      url: '/api/app/languages/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LanguagesDto>({
      method: 'GET',
      url: '/api/app/languages/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportLanguageDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, LanguagesDto[]>({
      method: 'POST',
      url: '/api/app/languages/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: LanguagesGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LanguagesDto>>({
      method: 'GET',
      url: '/api/app/languages',
      params: { name: input.name, creationTimeFrom: input.creationTimeFrom, creationTimeTo: input.creationTimeTo, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/languages/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportLanguageDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/languages/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/languages/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateLanguagesDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LanguagesDto[]>({
      method: 'PUT',
      url: '/api/app/languages/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLanguagesDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LanguagesDto>({
      method: 'PUT',
      url: `/api/app/languages/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
