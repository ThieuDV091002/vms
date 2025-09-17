import type { AssessmentSchedulingRuleDto, AssessmentSchedulingRuleGetListInput, CreateUpdateAssessmentSchedulingRuleDto, ImportResultDto, ModelingHistoryDto, ModelingInputDto } from './dtos/models';
import type { FileType } from './file-type.enum';
import type { OverridingMode } from './overriding-mode.enum';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AssessmentSchedulingRuleService {
  apiName = 'ticket';
  

  copy = (input: CreateUpdateAssessmentSchedulingRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentSchedulingRuleDto>({
      method: 'POST',
      url: '/api/app/assessment-scheduling-rule/copy',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateAssessmentSchedulingRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentSchedulingRuleDto>({
      method: 'POST',
      url: '/api/app/assessment-scheduling-rule',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createOrUpdate = (data: CreateUpdateAssessmentSchedulingRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentSchedulingRuleDto>({
      method: 'POST',
      url: '/api/app/assessment-scheduling-rule/or-update',
      body: data,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/assessment-scheduling-rule/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/assessment-scheduling-rule/export-all',
      params: { fileType },
    },
    { apiName: this.apiName,...config });
  

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/assessment-scheduling-rule/export',
      params: { fileType },
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentSchedulingRuleDto>({
      method: 'GET',
      url: `/api/app/assessment-scheduling-rule/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentSchedulingRuleDto[]>({
      method: 'GET',
      url: '/api/app/assessment-scheduling-rule/instances',
    },
    { apiName: this.apiName,...config });
  

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentSchedulingRuleDto>({
      method: 'GET',
      url: '/api/app/assessment-scheduling-rule/by-name',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  getExistInstances = (entities: CreateUpdateAssessmentSchedulingRuleDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentSchedulingRuleDto[]>({
      method: 'POST',
      url: '/api/app/assessment-scheduling-rule/get-exist-instances',
      body: entities,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: AssessmentSchedulingRuleGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AssessmentSchedulingRuleDto>>({
      method: 'POST',
      url: '/api/app/assessment-scheduling-rule/get-list',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  getModelingHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/assessment-scheduling-rule/modeling-history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  importByDtosAndMode = (dtos: CreateUpdateAssessmentSchedulingRuleDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportResultDto>({
      method: 'POST',
      url: '/api/app/assessment-scheduling-rule/import',
      params: { mode },
      body: dtos,
    },
    { apiName: this.apiName,...config });
  

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/assessment-scheduling-rule/multiple-delete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  multipleUpdate = (inputs: Record<string, CreateUpdateAssessmentSchedulingRuleDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentSchedulingRuleDto[]>({
      method: 'PUT',
      url: '/api/app/assessment-scheduling-rule/multiple-update',
      body: inputs,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateAssessmentSchedulingRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentSchedulingRuleDto>({
      method: 'PUT',
      url: `/api/app/assessment-scheduling-rule/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
