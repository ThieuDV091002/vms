import type { ActivityCardByAssessmentGetListInput, ActivityCardChangeDto, ActivityCardCreateDto, ActivityCardDto, ActivityCardDuplicateDto, ActivityCardGetInput, ActivityCardGetListInput, ActivityCardNotificationDto, ActivityCardNotifyInput, ActivityCardResultDto, ActivityCardSafetyInfoDto, ActivityCardTaskNotifyInput, ActivityCardUpdateDto, CreateUpdateActivityCardTaskListDto, CreateUpdateCommentDto, CreateUpdateRootCauseAnalysisListDto, GetActivityCardListInput, GetActivityCardListSummaryDto, GetActivityCardSummaryOutput, GetActivityCardTaskListDto, GetActivityCardTaskListInput, GetActivityCardTasksInput, GetUnsafeConditionCountsInput, GetZeroIncidentDayInput, ModelingHistoryDto, ModelingInputDto, SafetyCardCountByDayOutput, SafetyCardCountByMonthOutput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActivityCardService {
  apiName = 'ticket';
  

  addActivityCardCommentByDto = (dto: CreateUpdateCommentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/activity-card/activity-card-comment',
      body: dto,
    },
    { apiName: this.apiName,...config });
  

  create = (input: ActivityCardCreateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardDto>({
      method: 'POST',
      url: '/api/app/activity-card',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  deescalateActivityCardByInput = (input: ActivityCardChangeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/activity-card/deescalate-activity-card',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/activity-card/${id}`,
    },
    { apiName: this.apiName,...config });
  

  duplicateActivityCard = (input: ActivityCardDuplicateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/activity-card/duplicate-activity-card',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  escalateActivityCardByCardId = (cardId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/activity-card/escalate-activity-card/${cardId}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardDto>({
      method: 'GET',
      url: `/api/app/activity-card/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getActivityCardByAssessmentByInput = (input: ActivityCardByAssessmentGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GetActivityCardListSummaryDto>({
      method: 'GET',
      url: '/api/app/activity-card/activity-card-by-assessment',
      params: { assessmentId: input.assessmentId, assessmentResultId: input.assessmentResultId },
    },
    { apiName: this.apiName,...config });
  

  getActivityCardByCodeByCode = (code: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardDto>({
      method: 'GET',
      url: '/api/app/activity-card/activity-card-by-code',
      params: { code },
    },
    { apiName: this.apiName,...config });
  

  getActivityCardByInput = (input: ActivityCardGetInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardDto>({
      method: 'GET',
      url: '/api/app/activity-card/activity-card',
      params: { cardId: input.cardId, includeComments: input.includeComments, includeRootCauseAnalysis: input.includeRootCauseAnalysis, includeTasks: input.includeTasks },
    },
    { apiName: this.apiName,...config });
  

  getActivityCardListByInput = (input: GetActivityCardListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GetActivityCardListSummaryDto>({
      method: 'POST',
      url: '/api/app/activity-card/get-activity-card-list',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  getActivityCardSummaryBySiteKPIIndicator = (siteKPIIndicator: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GetActivityCardSummaryOutput>({
      method: 'GET',
      url: '/api/app/activity-card/activity-card-summary',
      params: { siteKPIIndicator },
    },
    { apiName: this.apiName,...config });
  

  getActivityCardTaskListByInput = (input: GetActivityCardTaskListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GetActivityCardTaskListDto[]>({
      method: 'GET',
      url: '/api/app/activity-card/activity-card-task-list',
      params: { dataTierList: input.dataTierList, dataTierType: input.dataTierType, cardTypeList: input.cardTypeList, ownerTypeList: input.ownerTypeList, userId: input.userId, startLastModificationTime: input.startLastModificationTime, endLastModificationTime: input.endLastModificationTime },
    },
    { apiName: this.apiName,...config });
  

  getActivityCardTasks = (input: GetActivityCardTasksInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<GetActivityCardTaskListDto>>({
      method: 'GET',
      url: '/api/app/activity-card/activity-card-tasks',
      params: { dataTierList: input.dataTierList, dataTierType: input.dataTierType, cardTypeList: input.cardTypeList, ownerTypeList: input.ownerTypeList, userId: input.userId, startLastModificationTime: input.startLastModificationTime, endLastModificationTime: input.endLastModificationTime, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getCardListByOwnerEmailByOwnerEmail = (ownerEmail: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, GetActivityCardListSummaryDto>({
      method: 'POST',
      url: '/api/app/activity-card/get-card-list-by-owner-email',
      body: ownerEmail,
    },
    { apiName: this.apiName,...config });
  

  getHistoryByInput = (input: ModelingInputDto<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
      method: 'GET',
      url: '/api/app/activity-card/history',
      params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ActivityCardGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ActivityCardDto>>({
      method: 'GET',
      url: '/api/app/activity-card',
      params: { cardTypeId: input.cardTypeId, categoryId: input.categoryId, currentStateId: input.currentStateId, previousStateId: input.previousStateId, instructions: input.instructions, longInstruction: input.longInstruction, dataTierId: input.dataTierId, dataTierType: input.dataTierType, dataTierStartTime: input.dataTierStartTime, escalatedFromCell: input.escalatedFromCell, escalatedFromArea: input.escalatedFromArea, originalDataTierId: input.originalDataTierId, originalDataTierType: input.originalDataTierType, previousDataTierId: input.previousDataTierId, previousDataTierType: input.previousDataTierType, priorityId: input.priorityId, assignedOwnerId: input.assignedOwnerId, ownerRoleName: input.ownerRoleName, location: input.location, incidentDate: input.incidentDate, onSupport: input.onSupport, hasAssessment: input.hasAssessment, reasonCode: input.reasonCode, results: input.results, valueRealization: input.valueRealization, externalProjectNo: input.externalProjectNo, lastStatusChangeTime: input.lastStatusChangeTime, assessmentId: input.assessmentId, assessmentResultId: input.assessmentResultId, isDuplicated: input.isDuplicated, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getSafetyActivityCardCountByDayBySafetyCardCategoryNameAndStartMonth = (safetyCardCategoryName: string, startMonth: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SafetyCardCountByDayOutput>({
      method: 'GET',
      url: '/api/app/activity-card/safety-activity-card-count-by-day',
      params: { safetyCardCategoryName, startMonth },
    },
    { apiName: this.apiName,...config });
  

  getSafetyActivityCardCountByMonthByActivityCardCategoryNameAndStartYear = (activityCardCategoryName: string, startYear: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SafetyCardCountByMonthOutput>({
      method: 'GET',
      url: '/api/app/activity-card/safety-activity-card-count-by-month',
      params: { activityCardCategoryName, startYear },
    },
    { apiName: this.apiName,...config });
  

  getSafetyInfo = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardSafetyInfoDto>({
      method: 'GET',
      url: '/api/app/activity-card/safety-info',
    },
    { apiName: this.apiName,...config });
  

  getUnsafeConditionCountsByInput = (input: GetUnsafeConditionCountsInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>({
      method: 'GET',
      url: '/api/app/activity-card/unsafe-condition-counts',
      params: { dataTierList: input.dataTierList, dataTierType: input.dataTierType, startDate: input.startDate, endDate: input.endDate },
    },
    { apiName: this.apiName,...config });
  

  getZeroIncidentDaysByInput = (input: GetZeroIncidentDayInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>({
      method: 'GET',
      url: '/api/app/activity-card/zero-incident-days',
      params: { dataTierList: input.dataTierList, dataTierType: input.dataTierType },
    },
    { apiName: this.apiName,...config });
  

  notifyCancelled = (input: ActivityCardNotifyInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardNotificationDto>({
      method: 'POST',
      url: '/api/app/activity-card/notify-cancelled',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  notifyCardOwnerByInput = (input: ActivityCardNotifyInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardNotificationDto>({
      method: 'POST',
      url: '/api/app/activity-card/notify-card-owner',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  notifyCardOwnerChanged = (input: ActivityCardNotifyInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardNotificationDto>({
      method: 'POST',
      url: '/api/app/activity-card/notify-card-owner-changed',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  notifyCompleted = (input: ActivityCardNotifyInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardNotificationDto>({
      method: 'POST',
      url: '/api/app/activity-card/notify-completed',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  notifyTaskOwnerByInput = (input: ActivityCardTaskNotifyInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardNotificationDto>({
      method: 'POST',
      url: '/api/app/activity-card/notify-task-owner',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  notifyTaskOwnerChanged = (input: ActivityCardTaskNotifyInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardNotificationDto>({
      method: 'POST',
      url: '/api/app/activity-card/notify-task-owner-changed',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  notifyTeamMember = (input: ActivityCardNotifyInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardNotificationDto>({
      method: 'POST',
      url: '/api/app/activity-card/notify-team-member',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  transferActivityCardByInput = (input: ActivityCardChangeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/activity-card/transfer-activity-card',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: ActivityCardUpdateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActivityCardDto>({
      method: 'PUT',
      url: `/api/app/activity-card/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateActivityCardResultByDto = (dto: ActivityCardResultDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'PUT',
      url: '/api/app/activity-card/activity-card-result',
      body: dto,
    },
    { apiName: this.apiName,...config });
  

  updateActivityCardStatusByCardIdAndNewStatusId = (cardId: string, newStatusId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'PUT',
      url: '/api/app/activity-card/activity-card-status',
      params: { cardId, newStatusId },
    },
    { apiName: this.apiName,...config });
  

  updateLastAcknowledgeDate = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'PUT',
      url: `/api/app/activity-card/${id}/last-acknowledge-date`,
    },
    { apiName: this.apiName,...config });
  

  updateRootCauseAnalysisByInput = (input: CreateUpdateRootCauseAnalysisListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'PUT',
      url: '/api/app/activity-card/root-cause-analysis',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateTasksByInput = (input: CreateUpdateActivityCardTaskListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'PUT',
      url: '/api/app/activity-card/tasks',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
