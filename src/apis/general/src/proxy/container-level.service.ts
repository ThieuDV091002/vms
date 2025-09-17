import type { ContainerLevelDto, ContainerLevelGetListInput, CreateUpdateContainerLevelDto, ExportContainerLevelDto, ImportResultDto, ModelingHistoryDto, ModelingInput } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContainerLevelService {
  apiName = 'general';
  

  copy = (input: CreateUpdateContainerLevelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContainerLevelDto>({
      method: 'POST',
      url: '/api/app/container-level/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateContainerLevelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContainerLevelDto>({
      method: 'POST',
      url: '/api/app/container-level',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateContainerLevelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContainerLevelDto>({
      method: 'POST',
      url: '/api/app/container-level/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/container-level/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/container-level/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/container-level/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContainerLevelDto>({
      method: 'GET',
      url: `/api/app/container-level/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContainerLevelDto[]>({
      method: 'GET',
      url: '/api/app/container-level/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContainerLevelDto>({
      method: 'GET',
      url: '/api/app/container-level/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportContainerLevelDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContainerLevelDto[]>({
      method: 'POST',
      url: '/api/app/container-level/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ContainerLevelGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ContainerLevelDto>>({
      method: 'GET',
      url: '/api/app/container-level',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/container-level/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportContainerLevelDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/container-level/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/container-level/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateContainerLevelDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContainerLevelDto[]>({
      method: 'PUT',
      url: '/api/app/container-level/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateContainerLevelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContainerLevelDto>({
      method: 'PUT',
      url: `/api/app/container-level/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
