import type { CorporateDto, CorporateGetListInput, CreateUpdateCorporateDto, ExportCorporateDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CorporateService {
  apiName = 'corporate';
  

  copy = (input: CreateUpdateCorporateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CorporateDto>({
      method: 'POST',
      url: '/api/app/corporate/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateCorporateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CorporateDto>({
      method: 'POST',
      url: '/api/app/corporate',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateCorporateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CorporateDto>({
      method: 'POST',
      url: '/api/app/corporate/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/corporate/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/corporate/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/corporate/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CorporateDto>({
      method: 'GET',
      url: `/api/app/corporate/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, CorporateDto[]>({
      method: 'GET',
      url: '/api/app/corporate/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CorporateDto>({
      method: 'GET',
      url: '/api/app/corporate/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportCorporateDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, CorporateDto[]>({
      method: 'POST',
      url: '/api/app/corporate/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: CorporateGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CorporateDto>>({
      method: 'GET',
      url: '/api/app/corporate',
      params: { name: input.name, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/corporate/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportCorporateDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/corporate/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/corporate/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateCorporateDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CorporateDto[]>({
      method: 'PUT',
      url: '/api/app/corporate/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCorporateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CorporateDto>({
      method: 'PUT',
      url: `/api/app/corporate/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
