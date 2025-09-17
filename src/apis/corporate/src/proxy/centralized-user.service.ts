import type { CentralizedUserDto, CentralizedUserGetListInput, CreateUpdateCentralizedUserDto, ExportCentralizedUserDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CentralizedUserService {
  apiName = 'corporate';
  

  copy = (input: CreateUpdateCentralizedUserDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CentralizedUserDto>({
      method: 'POST',
      url: '/api/app/centralized-user/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateCentralizedUserDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CentralizedUserDto>({
      method: 'POST',
      url: '/api/app/centralized-user',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateCentralizedUserDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CentralizedUserDto>({
      method: 'POST',
      url: '/api/app/centralized-user/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/centralized-user/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/centralized-user/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/centralized-user/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CentralizedUserDto>({
      method: 'GET',
      url: `/api/app/centralized-user/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, CentralizedUserDto[]>({
      method: 'GET',
      url: '/api/app/centralized-user/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CentralizedUserDto>({
      method: 'GET',
      url: '/api/app/centralized-user/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportCentralizedUserDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, CentralizedUserDto[]>({
      method: 'POST',
      url: '/api/app/centralized-user/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: CentralizedUserGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CentralizedUserDto>>({
      method: 'GET',
      url: '/api/app/centralized-user',
      params: { emailAddress: input.emailAddress, firstName: input.firstName, lastName: input.lastName, phoneNumber: input.phoneNumber, supervisor: input.supervisor, isActive: input.isActive, lockoutEnabled: input.lockoutEnabled, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/centralized-user/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportCentralizedUserDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/centralized-user/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/centralized-user/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateCentralizedUserDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CentralizedUserDto[]>({
      method: 'PUT',
      url: '/api/app/centralized-user/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCentralizedUserDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CentralizedUserDto>({
      method: 'PUT',
      url: `/api/app/centralized-user/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
