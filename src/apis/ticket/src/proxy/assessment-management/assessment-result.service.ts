import type { AssessmentResultDto, AssessmentResultGetListInput, CreateUpdateAssessmentResultDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AssessmentResultService {
  apiName = 'ticket';
  

  create = (input: CreateUpdateAssessmentResultDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentResultDto>({
      method: 'POST',
      url: '/api/app/assessment-result',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/assessment-result/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentResultDto>({
      method: 'GET',
      url: `/api/app/assessment-result/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: AssessmentResultGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AssessmentResultDto>>({
      method: 'GET',
      url: '/api/app/assessment-result',
      params: { recordUser: input.recordUser, questionId: input.questionId, questionNo: input.questionNo, answerType: input.answerType, question: input.question, longDescription: input.longDescription, rating: input.rating, yesNo: input.yesNo, thumbUp: input.thumbUp, comment: input.comment, assessmentId: input.assessmentId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateAssessmentResultDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentResultDto>({
      method: 'PUT',
      url: `/api/app/assessment-result/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
