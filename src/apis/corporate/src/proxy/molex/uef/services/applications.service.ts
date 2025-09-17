import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ExportApplicationsDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto } from '../../../dtos/models';
import type { ApplicationsDto, ApplicationsGetListInput, CreateUpdateApplicationsDto } from '../dtos/models';
import type { FileType } from '../../../file-type.enum';
import type { OverridingMode } from '../../../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  apiName = 'corporate';
  

  copy = (input: CreateUpdateApplicationsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApplicationsDto>({
      method: 'POST',
      url: '/api/app/applications/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateApplicationsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApplicationsDto>({
      method: 'POST',
      url: '/api/app/applications',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateApplicationsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApplicationsDto>({
      method: 'POST',
      url: '/api/app/applications/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/applications/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/applications/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/applications/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApplicationsDto>({
      method: 'GET',
      url: `/api/app/applications/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApplicationsDto[]>({
      method: 'GET',
      url: '/api/app/applications/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApplicationsDto>({
      method: 'GET',
      url: '/api/app/applications/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportApplicationsDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApplicationsDto[]>({
      method: 'POST',
      url: '/api/app/applications/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ApplicationsGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ApplicationsDto>>({
      method: 'GET',
      url: '/api/app/applications',
      params: { name: input.name, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/applications/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getUserApplications = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApplicationsDto[]>({
      method: 'GET',
      url: '/api/app/applications/user-applications',
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportApplicationsDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/applications/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/applications/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateApplicationsDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApplicationsDto[]>({
      method: 'PUT',
      url: '/api/app/applications/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateApplicationsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApplicationsDto>({
      method: 'PUT',
      url: `/api/app/applications/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
