import type { CreateUpdateNameObjectDto, ExecutionObjectDto, GetNameObjectInput, NameObjectDto } from '../../dtos/models';
import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface AssessmentCommentHistoryDto {
  assessmentId?: string;
  date?: string;
  comment?: string;
  userName?: string;
}

export interface AssessmentDto extends ExecutionObjectDto<string> {
  name?: string;
  typeId?: string;
  schedulingRuleId?: string;
  assessmentDate?: string;
  assessmentTime?: string;
  assessmentDuration?: number;
  status?: string;
  dataTierType?: string;
  dataTierId?: string;
  ownerId?: string;
  userGroupId?: string;
  assessmentTypeName?: string;
  statusName?: string;
  scheduleName?: string;
  datatierName?: string;
  ownerName?: string;
  userGroupName?: string;
  creator?: string;
  lastModifier?: string;
}

export interface AssessmentGenerateDto {
  schedulingRuleId?: string;
}

export interface AssessmentGetListInput extends PagedAndSortedResultRequestDto {
  dataTierType?: string;
  dataTierId?: string;
  assessmentTypeIds: string[];
  userId?: string;
  isOwner: boolean;
  isTeamMember: boolean;
  ownerId?: string;
  userGroupId?: string;
  status?: string;
  assessmentDateStart?: string;
  assessmentDateEnd?: string;
}

export interface AssessmentGlobalGuidelineDto extends ExecutionObjectDto<string> {
  questionNo: number;
  question?: string;
  longDescription?: string;
  answerType?: string;
  revisionId?: string;
}

export interface AssessmentGuidelineDto extends ExecutionObjectDto<string> {
  globalID?: string;
  questionNo: number;
  question?: string;
  longDescription?: string;
  answerType?: string;
  questionLocal?: string;
  longDescriptionLocal?: string;
  revisionId?: string;
  standards: AssessmentGuidelineStandardDto[];
}

export interface AssessmentGuidelineStandardDto extends ExecutionObjectDto<string> {
  guidelineId?: string;
  standardId?: string;
}

export interface AssessmentGuidelineStandardGetListInput extends PagedAndSortedResultRequestDto {
  guidelineId?: string;
  standardId?: string;
}

export interface AssessmentPreviewDto {
  assessments: AssessmentDto[];
  lastAssessmentDate?: string;
}

export interface AssessmentResultAttachmentDto extends ExecutionObjectDto<string> {
  attachmentType?: string;
  attachment?: string;
  mimeType?: string;
  assessmentResultId?: string;
}

export interface AssessmentResultAttachmentGetListInput extends PagedAndSortedResultRequestDto {
  attachmentType?: string;
  attachment?: string;
  mimeType?: string;
  assessmentResultId?: string;
}

export interface AssessmentResultDto extends ExecutionObjectDto<string> {
  recordUser?: string;
  questionId?: string;
  questionNo: number;
  answerType?: string;
  question?: string;
  longDescription?: string;
  rating?: number;
  yesNo?: string;
  thumbUp?: boolean;
  comment?: string;
  assessmentId?: string;
}

export interface AssessmentResultFileDto {
  assessmentResultId?: string;
  attachment?: string;
  attachmentType?: string;
  mimeType?: string;
}

export interface AssessmentResultGetListInput extends PagedAndSortedResultRequestDto {
  recordUser?: string;
  questionId?: string;
  questionNo?: number;
  answerType?: string;
  question?: string;
  longDescription?: string;
  rating?: number;
  yesNo?: string;
  thumbUp?: boolean;
  comment?: string;
  assessmentId?: string;
}

export interface AssessmentSummaryDto {
  questionSummaries: QuestionSummaryDto[];
  commentSummaries: CommentSummaryDto[];
}

export interface AssessmentTypeDto extends NameObjectDto<string> {
  globalId?: string;
  stateModelId?: string;
  stateModelName?: string;
  initialStatusId?: string;
  initialStatusName?: string;
  activityCardTypeId?: string;
  activityCardTypeName?: string;
  activityCardCategoryId?: string;
  activityCardCategoryName?: string;
  activeRevision?: string;
  lastRevision?: string;
  globalActiveRevision?: string;
  lastPublishTime?: string;
  revisions: string[];
  guideLines: AssessmentGuidelineDto[];
}

export interface AssessmentTypeGetListInput extends GetNameObjectInput {
  globalId?: string;
  stateModelId?: string;
  initialStatusId?: string;
  activityCardTypeId?: string;
  activityCardCategoryId?: string;
  activeRevision?: string;
  lastRevision?: string;
  globalActiveRevision?: string;
  lastPublishTime?: string;
}

export interface AssessmentTypeGlobalDto extends NameObjectDto<string> {
  stateModelId?: string;
  stateModelName?: string;
  initialStatusId?: string;
  initialStatusName?: string;
  activityCardTypeId?: string;
  activityCardTypeName?: string;
  activityCardCategoryId?: string;
  activityCardCategoryName?: string;
  activeRevision?: string;
  lastRevision?: string;
  lastPublishTime?: string;
  tenants: AssessmentTypeGlobalTenantDto[];
  guideLines: AssessmentGlobalGuidelineDto[];
  revisions: string[];
}

export interface AssessmentTypeGlobalGetListInput extends GetNameObjectInput {
  stateModelId?: string;
  initialStatusId?: string;
  activityCardTypeId?: string;
  activityCardCategoryId?: string;
  activeRevision?: string;
  lastRevision?: string;
  lastPublishTime?: string;
}

export interface AssessmentTypeGlobalTenantDto extends ExecutionObjectDto<string> {
  tenantId?: string;
  tenantName?: string;
  assessmentTypeId?: string;
}

export interface CommentSummaryDto {
  questionNo: number;
  comment?: string;
}

export interface CreateUpdateAssessmentDto {
  name?: string;
  typeId?: string;
  schedulingRuleId?: string;
  assessmentDate?: string;
  assessmentTime?: string;
  assessmentDuration?: number;
  status?: string;
  dataTierType?: string;
  dataTierId?: string;
  ownerId?: string;
  userGroupId?: string;
}

export interface CreateUpdateAssessmentGlobalGuidelineDto {
  id?: string;
  questionNo: number;
  question?: string;
  longDescription?: string;
  answerType?: string;
  revisionId?: string;
}

export interface CreateUpdateAssessmentGuidelineDto {
  globalID?: string;
  questionNo: number;
  question?: string;
  longDescription?: string;
  answerType?: string;
  questionLocal?: string;
  longDescriptionLocal?: string;
  revisionId?: string;
  standards: CreateUpdateAssessmentGuidelineStandardDto[];
}

export interface CreateUpdateAssessmentGuidelineStandardDto {
  guidelineId?: string;
  standardId?: string;
}

export interface CreateUpdateAssessmentResultAttachmentDto {
  attachmentType?: string;
  attachment?: string;
  mimeType?: string;
  assessmentResultId?: string;
}

export interface CreateUpdateAssessmentResultDto {
  recordUser?: string;
  questionId?: string;
  questionNo: number;
  answerType?: string;
  question?: string;
  longDescription?: string;
  rating?: number;
  yesNo?: string;
  thumbUp?: boolean;
  comment?: string;
  assessmentId?: string;
}

export interface CreateUpdateAssessmentTypeDto extends CreateUpdateNameObjectDto {
  globalId?: string;
  stateModelId?: string;
  initialStatusId?: string;
  activityCardTypeId?: string;
  activityCardCategoryId?: string;
  activeRevision?: string;
  lastRevision?: string;
  globalActiveRevision?: string;
  lastPublishTime?: string;
  revisions: CreateUpdateAssessmentTypeRevisionDto[];
  guidelines: CreateUpdateAssessmentGuidelineDto[];
}

export interface CreateUpdateAssessmentTypeGlobalDto extends CreateUpdateNameObjectDto {
  stateModelId?: string;
  stateModelName?: string;
  initialStatusId?: string;
  initialStatusName?: string;
  activityCardTypeId?: string;
  activityCardTypeName?: string;
  activityCardCategoryId?: string;
  activityCardCategoryName?: string;
  lastRevision?: string;
  lastPublishTime?: string;
  revisions: CreateUpdateAssessmentTypeGlobalRevisionDto[];
  guidelines: CreateUpdateAssessmentGlobalGuidelineDto[];
  tenants: CreateUpdateAssessmentTypeGlobalTenantDto[];
}

export interface CreateUpdateAssessmentTypeGlobalRevisionDto {
  name?: string;
  revision?: string;
  isActive?: boolean;
  isPublished?: boolean;
  assessmentTypeId?: string;
  guidelines: CreateUpdateAssessmentGlobalGuidelineDto[];
}

export interface CreateUpdateAssessmentTypeGlobalTenantDto {
  id?: string;
  tenantId?: string;
  tenantName?: string;
  assessmentTypeId?: string;
}

export interface CreateUpdateAssessmentTypeRevisionDto {
  globalId?: string;
  assessmentTypeId?: string;
  name?: string;
  revision?: string;
  isActive?: boolean;
  guidelines: CreateUpdateAssessmentGuidelineDto[];
}

export interface GuidelineDto extends ExecutionObjectDto<string> {
  assessmentGuidelines: AssessmentGuidelineDto[];
  results: AssessmentResultDto[];
}

export interface QuestionSummaryDto {
  questionNo: number;
  rating: number;
  thumbUp: number;
  cards: number;
}
