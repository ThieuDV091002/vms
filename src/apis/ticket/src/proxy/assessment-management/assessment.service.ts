import type { AssessmentCommentHistoryDto, AssessmentDto, AssessmentGenerateDto, AssessmentGetListInput, AssessmentPreviewDto, AssessmentResultFileDto, AssessmentSummaryDto, CreateUpdateAssessmentDto, CreateUpdateAssessmentResultDto, GuidelineDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  apiName = 'ticket';
  

  attachFileByFile = (file: AssessmentResultFileDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/assessment/attach-file',
      body: file,
    },
    { apiName: this.apiName,...config });
  

  autoSchedulingGenerate = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, object>({
      method: 'POST',
      url: '/api/app/assessment/auto-scheduling-generate',
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateAssessmentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentDto>({
      method: 'POST',
      url: '/api/app/assessment',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/assessment/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteAllOpenByScheduleId = (scheduleId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'DELETE',
      url: `/api/app/assessment/all-open/${scheduleId}`,
    },
    { apiName: this.apiName,...config });
  

  generateByDto = (dto: AssessmentGenerateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/assessment/generate',
      body: dto,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentDto>({
      method: 'GET',
      url: `/api/app/assessment/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getCommentHistoryByAssessmentGuidelineIdAndDataTierId = (assessmentGuidelineId: string, dataTierId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentCommentHistoryDto[]>({
      method: 'GET',
      url: '/api/app/assessment/comment-history',
      params: { assessmentGuidelineId, dataTierId },
    },
    { apiName: this.apiName,...config });
  

  getGuidelineByAssessmentIdAndUserId = (assessmentId: string, userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GuidelineDto>({
      method: 'GET',
      url: '/api/app/assessment/guideline',
      params: { assessmentId, userId },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: AssessmentGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AssessmentDto>>({
      method: 'GET',
      url: '/api/app/assessment',
      params: { dataTierType: input.dataTierType, dataTierId: input.dataTierId, assessmentTypeIds: input.assessmentTypeIds, userId: input.userId, isOwner: input.isOwner, isTeamMember: input.isTeamMember, ownerId: input.ownerId, userGroupId: input.userGroupId, status: input.status, assessmentDateStart: input.assessmentDateStart, assessmentDateEnd: input.assessmentDateEnd, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getPreviewByRuleId = (ruleId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentPreviewDto>({
      method: 'GET',
      url: `/api/app/assessment/preview/${ruleId}`,
    },
    { apiName: this.apiName,...config });
  

  getSummaryByAssessmentId = (assessmentId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentSummaryDto>({
      method: 'GET',
      url: `/api/app/assessment/summary/${assessmentId}`,
    },
    { apiName: this.apiName,...config });
  

  recordResultByResultDto = (resultDto: CreateUpdateAssessmentResultDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/assessment/record-result',
      body: resultDto,
    },
    { apiName: this.apiName,...config });
  

  submitResultByAssessmentId = (assessmentId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/assessment/submit-result/${assessmentId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateAssessmentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentDto>({
      method: 'PUT',
      url: `/api/app/assessment/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
