import type { CreateUpdateJobFunctionDto, JobFunctionDto, JobFunctionExportDto, JobFunctionGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ImportResultDto, ModelingHistoryDto, ModelingInput } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class JobFunctionService {
  apiName = 'general';
  

  copy = (input: CreateUpdateJobFunctionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, JobFunctionDto>({
      method: 'POST',
      url: '/api/app/job-function/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateJobFunctionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, JobFunctionDto>({
      method: 'POST',
      url: '/api/app/job-function',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateJobFunctionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, JobFunctionDto>({
      method: 'POST',
      url: '/api/app/job-function/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/job-function/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/job-function/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/job-function/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, JobFunctionDto>({
      method: 'GET',
      url: `/api/app/job-function/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, JobFunctionDto[]>({
      method: 'GET',
      url: '/api/app/job-function/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, JobFunctionDto>({
      method: 'GET',
      url: '/api/app/job-function/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: JobFunctionExportDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, JobFunctionDto[]>({
      method: 'POST',
      url: '/api/app/job-function/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: JobFunctionGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<JobFunctionDto>>({
      method: 'GET',
      url: '/api/app/job-function',
      params: { color: input.color, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/job-function/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: JobFunctionExportDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/job-function/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/job-function/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateJobFunctionDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, JobFunctionDto[]>({
      method: 'PUT',
      url: '/api/app/job-function/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateJobFunctionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, JobFunctionDto>({
      method: 'PUT',
      url: `/api/app/job-function/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
