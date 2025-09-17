import type { CreateUpdateLinkDto, LinkDto, LinkFavoriteDto, LinkGetListInput, LinkSearchListInput, LinkViewDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ImportResultDto, LinkExportDto, ModelingHistoryDto, ModelingInput } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  apiName = 'general';
  

  addAsFavoriteByLinkId = (linkId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkFavoriteDto>({
      method: 'POST',
      url: `/api/app/link/as-favorite/${linkId}`,
    },
    { apiName: this.apiName,...config });
  

  copy = (input: CreateUpdateLinkDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkDto>({
      method: 'POST',
      url: '/api/app/link/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateLinkDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkDto>({
      method: 'POST',
      url: '/api/app/link',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateLinkDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkDto>({
      method: 'POST',
      url: '/api/app/link/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/link/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteFromFavoriteByLinkId = (linkId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/link/from-favorite/${linkId}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/link/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/link/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkDto>({
      method: 'GET',
      url: `/api/app/link/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkDto[]>({
      method: 'GET',
      url: '/api/app/link/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkDto>({
      method: 'GET',
      url: '/api/app/link/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: LinkExportDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkDto[]>({
      method: 'POST',
      url: '/api/app/link/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getLinksViewList = (input: LinkSearchListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LinkViewDto>>({
      method: 'GET',
      url: '/api/app/link/links-view-list',
      params: { keyword: input.keyword, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getLinksViewListWithoutFilterTargetRole = (input: LinkSearchListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LinkViewDto>>({
      method: 'GET',
      url: '/api/app/link/links-view-list-without-filter-target-role',
      params: { keyword: input.keyword, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: LinkGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LinkDto>>({
      method: 'GET',
      url: '/api/app/link',
      params: { url: input.url, tags: input.tags, linkCategoryId: input.linkCategoryId, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/link/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getUserFavorites = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkDto[]>({
      method: 'GET',
      url: '/api/app/link/user-favorites',
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: LinkExportDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/link/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/link/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateLinkDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkDto[]>({
      method: 'PUT',
      url: '/api/app/link/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLinkDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LinkDto>({
      method: 'PUT',
      url: `/api/app/link/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
