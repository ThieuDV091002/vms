import type { CreateUpdateNamingRuleDto, ExportNamingRuleDto, ImportResultDto, ModelingHistoryDto, ModelingInput, NamingRuleDto, NamingRuleGetListInput } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NamingRuleService {
  apiName = 'general';
  

  copy = (input: CreateUpdateNamingRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingRuleDto>({
      method: 'POST',
      url: '/api/app/naming-rule/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateNamingRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingRuleDto>({
      method: 'POST',
      url: '/api/app/naming-rule',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateNamingRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingRuleDto>({
      method: 'POST',
      url: '/api/app/naming-rule/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/naming-rule/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/naming-rule/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/naming-rule/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingRuleDto>({
      method: 'GET',
      url: `/api/app/naming-rule/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingRuleDto[]>({
      method: 'GET',
      url: '/api/app/naming-rule/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingRuleDto>({
      method: 'GET',
      url: '/api/app/naming-rule/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportNamingRuleDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingRuleDto[]>({
      method: 'POST',
      url: '/api/app/naming-rule/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: NamingRuleGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<NamingRuleDto>>({
      method: 'GET',
      url: '/api/app/naming-rule',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/naming-rule/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportNamingRuleDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/naming-rule/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/naming-rule/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateNamingRuleDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingRuleDto[]>({
      method: 'PUT',
      url: '/api/app/naming-rule/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateNamingRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NamingRuleDto>({
      method: 'PUT',
      url: `/api/app/naming-rule/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
