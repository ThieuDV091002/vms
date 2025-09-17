import type { AssessmentGuidelineStandardDto, AssessmentGuidelineStandardGetListInput, CreateUpdateAssessmentGuidelineStandardDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AssessmentGuidelineStandardService {
  apiName = 'ticket';
  

  create = (input: CreateUpdateAssessmentGuidelineStandardDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentGuidelineStandardDto>({
      method: 'POST',
      url: '/api/app/assessment-guideline-standard',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/assessment-guideline-standard/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentGuidelineStandardDto>({
      method: 'GET',
      url: `/api/app/assessment-guideline-standard/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: AssessmentGuidelineStandardGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AssessmentGuidelineStandardDto>>({
      method: 'GET',
      url: '/api/app/assessment-guideline-standard',
      params: { guidelineId: input.guidelineId, standardId: input.standardId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateAssessmentGuidelineStandardDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentGuidelineStandardDto>({
      method: 'PUT',
      url: `/api/app/assessment-guideline-standard/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
