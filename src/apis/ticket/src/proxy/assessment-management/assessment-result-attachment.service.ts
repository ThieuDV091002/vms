import type { AssessmentResultAttachmentDto, AssessmentResultAttachmentGetListInput, CreateUpdateAssessmentResultAttachmentDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AssessmentResultAttachmentService {
  apiName = 'ticket';
  

  create = (input: CreateUpdateAssessmentResultAttachmentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentResultAttachmentDto>({
      method: 'POST',
      url: '/api/app/assessment-result-attachment',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/assessment-result-attachment/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentResultAttachmentDto>({
      method: 'GET',
      url: `/api/app/assessment-result-attachment/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: AssessmentResultAttachmentGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AssessmentResultAttachmentDto>>({
      method: 'GET',
      url: '/api/app/assessment-result-attachment',
      params: { attachmentType: input.attachmentType, attachment: input.attachment, mimeType: input.mimeType, assessmentResultId: input.assessmentResultId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateAssessmentResultAttachmentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssessmentResultAttachmentDto>({
      method: 'PUT',
      url: `/api/app/assessment-result-attachment/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
