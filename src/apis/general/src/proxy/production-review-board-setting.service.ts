import type { CreateUpdateProductionReviewBoardSettingDto, ExportProductionReviewBoardSettingDto, ImportResultDto, ModelingHistoryDto, ModelingInput, ProductionReviewBoardSettingDto, ProductionReviewBoardSettingGetListInput } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductionReviewBoardSettingService {
  apiName = 'general';
  

  copy = (input: CreateUpdateProductionReviewBoardSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionReviewBoardSettingDto>({
      method: 'POST',
      url: '/api/app/production-review-board-setting/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateProductionReviewBoardSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionReviewBoardSettingDto>({
      method: 'POST',
      url: '/api/app/production-review-board-setting',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateProductionReviewBoardSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionReviewBoardSettingDto>({
      method: 'POST',
      url: '/api/app/production-review-board-setting/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/production-review-board-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/production-review-board-setting/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/production-review-board-setting/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionReviewBoardSettingDto>({
      method: 'GET',
      url: `/api/app/production-review-board-setting/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionReviewBoardSettingDto[]>({
      method: 'GET',
      url: '/api/app/production-review-board-setting/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionReviewBoardSettingDto>({
      method: 'GET',
      url: '/api/app/production-review-board-setting/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: ExportProductionReviewBoardSettingDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionReviewBoardSettingDto[]>({
      method: 'POST',
      url: '/api/app/production-review-board-setting/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ProductionReviewBoardSettingGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ProductionReviewBoardSettingDto>>({
      method: 'GET',
      url: '/api/app/production-review-board-setting',
      params: { reviewType: input.reviewType, l1GroupList: input.l1GroupList, l2GroupList: input.l2GroupList, l3GroupList: input.l3GroupList, displayList: input.displayList, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/production-review-board-setting/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: ExportProductionReviewBoardSettingDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/production-review-board-setting/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/production-review-board-setting/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateProductionReviewBoardSettingDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionReviewBoardSettingDto[]>({
      method: 'PUT',
      url: '/api/app/production-review-board-setting/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateProductionReviewBoardSettingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionReviewBoardSettingDto>({
      method: 'PUT',
      url: `/api/app/production-review-board-setting/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
