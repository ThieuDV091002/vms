import type { AssessmentTypeGlobalDto, AssessmentTypeGlobalGetListInput, CreateUpdateAssessmentTypeGlobalDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ImportResultDto, ModelingHistoryDto, ModelingInputDto } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class AssessmentTypeGlobalService {
  apiName = 'ticket';
  

  copy = (input: CreateUpdateAssessmentTypeGlobalDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeGlobalDto>({
      method: 'POST',
      url: '/api/app/assessment-type-global/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateAssessmentTypeGlobalDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeGlobalDto>({
      method: 'POST',
      url: '/api/app/assessment-type-global',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateAssessmentTypeGlobalDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeGlobalDto>({
      method: 'POST',
      url: '/api/app/assessment-type-global/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/assessment-type-global/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/assessment-type-global/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/assessment-type-global/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeGlobalDto>({
      method: 'GET',
      url: `/api/app/assessment-type-global/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeGlobalDto[]>({
      method: 'GET',
      url: '/api/app/assessment-type-global/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeGlobalDto>({
      method: 'GET',
      url: '/api/app/assessment-type-global/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getByNameAndRevision = (name: string, revision: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeGlobalDto>({
      method: 'GET',
      url: '/api/app/assessment-type-global/by-name-and-revision',
      params: { name, revision },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: CreateUpdateAssessmentTypeGlobalDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeGlobalDto[]>({
      method: 'POST',
      url: '/api/app/assessment-type-global/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: AssessmentTypeGlobalGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AssessmentTypeGlobalDto>>({
      method: 'GET',
      url: '/api/app/assessment-type-global',
      params: { stateModelId: input.stateModelId, initialStatusId: input.initialStatusId, activityCardTypeId: input.activityCardTypeId, activityCardCategoryId: input.activityCardCategoryId, activeRevision: input.activeRevision, lastRevision: input.lastRevision, lastPublishTime: input.lastPublishTime, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/assessment-type-global/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getRevision = (id: string, revision: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeGlobalDto>({
      method: 'GET',
      url: `/api/app/assessment-type-global/${id}/revision`,
      params: { revision },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: CreateUpdateAssessmentTypeGlobalDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/assessment-type-global/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/assessment-type-global/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateAssessmentTypeGlobalDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeGlobalDto[]>({
      method: 'PUT',
      url: '/api/app/assessment-type-global/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  publishByIdAndRevision = (id: string, revision: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/assessment-type-global/${id}/publish`,
      params: { revision },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateAssessmentTypeGlobalDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeGlobalDto>({
      method: 'PUT',
      url: `/api/app/assessment-type-global/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
