import type { AssessmentTypeDto, AssessmentTypeGetListInput, CreateUpdateAssessmentTypeDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ImportResultDto, ModelingHistoryDto, ModelingInputDto } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class AssessmentTypeService {
  apiName = 'ticket';
  

  activateByIdAndRevision = (id: string, revision: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/assessment-type/${id}/activate`,
      params: { revision },
    },
    { apiName: this.apiName,...config });
  

  copy = (input: CreateUpdateAssessmentTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeDto>({
      method: 'POST',
      url: '/api/app/assessment-type/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateAssessmentTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeDto>({
      method: 'POST',
      url: '/api/app/assessment-type',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateAssessmentTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeDto>({
      method: 'POST',
      url: '/api/app/assessment-type/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/assessment-type/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/assessment-type/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/assessment-type/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeDto>({
      method: 'GET',
      url: `/api/app/assessment-type/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeDto[]>({
      method: 'GET',
      url: '/api/app/assessment-type/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeDto>({
      method: 'GET',
      url: '/api/app/assessment-type/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getByNameAndRevision = (name: string, revision: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeDto>({
      method: 'GET',
      url: '/api/app/assessment-type/by-name-and-revision',
      params: { name, revision },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: CreateUpdateAssessmentTypeDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeDto[]>({
      method: 'POST',
      url: '/api/app/assessment-type/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: AssessmentTypeGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AssessmentTypeDto>>({
      method: 'GET',
      url: '/api/app/assessment-type',
      params: { globalId: input.globalId, stateModelId: input.stateModelId, initialStatusId: input.initialStatusId, activityCardTypeId: input.activityCardTypeId, activityCardCategoryId: input.activityCardCategoryId, activeRevision: input.activeRevision, lastRevision: input.lastRevision, globalActiveRevision: input.globalActiveRevision, lastPublishTime: input.lastPublishTime, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/assessment-type/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getRevision = (id: string, revision: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeDto>({
      method: 'GET',
      url: `/api/app/assessment-type/${id}/revision`,
      params: { revision },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: CreateUpdateAssessmentTypeDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/assessment-type/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/assessment-type/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateAssessmentTypeDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeDto[]>({
      method: 'PUT',
      url: '/api/app/assessment-type/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateAssessmentTypeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentTypeDto>({
      method: 'PUT',
      url: `/api/app/assessment-type/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
