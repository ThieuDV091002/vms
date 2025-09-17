import type { AuditedEntityDto, EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto, PagedResultRequestDto } from '@abp/ng.core';
import type { DataTierInput } from '../models';
import type { ActivityCardSummaryFilterType } from '../activity-card-summary-filter-type.enum';
import type { ToDoTaskCommentDto, ToDoTaskDto } from '../to-do-tasks/dtos/models';
import type { IdentityRoleDto, IdentityUserDto } from '../volo/abp/identity/models';

export interface ActivityCardAttachmentDto extends ExecutionObjectDto<string> {
  cardId?: string;
  attachmentType?: string;
  fileId?: string;
  mimeType?: string;
}

export interface ActivityCardByAssessmentGetListInput {
  assessmentId?: string;
  assessmentResultId?: string;
}

export interface ActivityCardCategoryDto extends NameObjectDto<string> {
  cardTypeId?: string;
  cardTypeName?: string;
  cardType: ActivityCardTypeDto;
  reasonsDataSource?: string;
  color?: string;
  unsafeCondition?: boolean;
  reportAsIncident?: boolean;
  siteKPIIndicator?: string;
}

export interface ActivityCardCategoryExportDto {
  name?: string;
  displayName?: string;
  description?: string;
  cardTypeName?: string;
  reasonsDataSource?: string;
  color?: string;
  siteKPIIndicator?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ActivityCardCategoryGetListInput extends GetNameObjectInput {
  cardTypeId?: string;
  reasonsDataSource?: string;
  color?: string;
  unsafeCondition?: boolean;
  reportAsIncident?: boolean;
}

export interface ActivityCardChangeDto {
  cardId?: string;
  toDataTierId?: string;
  toDataTierType?: string;
}

export interface ActivityCardCreateDto extends CreateUpdateActivityCardDto {
  dataTierId?: string;
  dataTierType?: string;
  cardTypeId?: string;
}

export interface ActivityCardDailySummaryDataDto extends ExecutionObjectDto<string> {
  date?: string;
  siteId?: string;
  siteDisplayName?: string;
  areaId?: string;
  areaDisplayName?: string;
  cellId?: string;
  cellDisplayName?: string;
  dailyNearMisses: number;
  dailyUnsafeConditions: number;
  dailyUnsafeConditionsTarget: number;
}

export interface ActivityCardDailySummaryDataGetListInput extends PagedAndSortedResultRequestDto {
  date?: string;
  siteId?: string;
  siteDisplayName?: string;
  areaId?: string;
  areaDisplayName?: string;
  cellId?: string;
  cellDisplayName?: string;
  dailyNearMisses?: number;
}

export interface ActivityCardDto extends ExecutionObjectDto<string> {
  code?: string;
  cardTypeId?: string;
  categoryId?: string;
  currentStateId?: string;
  currentStateName?: string;
  previousStateId?: string;
  instructions?: string;
  longInstruction?: string;
  dataTierId?: string;
  dataTierType?: string;
  dataTierStartTime?: string;
  escalatedFromCell?: string;
  escalatedFromArea?: string;
  originalDataTierId?: string;
  originalDataTierType?: string;
  previousDataTierId?: string;
  previousDataTierType?: string;
  priorityId?: string;
  assignedOwnerId?: string;
  ownerRoleName?: string;
  location?: string;
  incidentDate?: string;
  onSupport: boolean;
  hasAssessment: boolean;
  reasonCode?: string;
  lastAcknowledgeDate?: string;
  comments: CommentDto[];
  teams: ActivityCardTeamDto[];
  rootCauseAnalysiss: RootCauseAnalysisDto[];
  tasks: ActivityCardTaskDto[];
  attachments: ActivityCardAttachmentDto[];
  results?: string;
  valueRealization: boolean;
  externalProjectNo?: string;
  lastStatusChangeTime?: string;
  categoryField?: string;
  reasonField?: string;
  locationField?: string;
  priorityField?: string;
  incidentDateField?: string;
  assessmentField?: string;
  extraProjectNumField?: string;
  assessmentId?: string;
  assessmentResultId?: string;
  isDuplicated?: boolean;
}

export interface ActivityCardDuplicateDto {
  userId?: string;
  cardId?: string;
  dataTierId?: string;
  dataTierType?: string;
}

export interface ActivityCardGetInput {
  cardId?: string;
  includeComments: boolean;
  includeRootCauseAnalysis: boolean;
  includeTasks: boolean;
}

export interface ActivityCardGetListInput extends PagedAndSortedResultRequestDto {
  cardTypeId?: string;
  categoryId?: string;
  currentStateId?: string;
  previousStateId?: string;
  instructions?: string;
  longInstruction?: string;
  dataTierId?: string;
  dataTierType?: string;
  dataTierStartTime?: string;
  escalatedFromCell?: string;
  escalatedFromArea?: string;
  originalDataTierId?: string;
  originalDataTierType?: string;
  previousDataTierId?: string;
  previousDataTierType?: string;
  priorityId?: string;
  assignedOwnerId?: string;
  ownerRoleName?: string;
  location?: string;
  incidentDate?: string;
  onSupport?: boolean;
  hasAssessment?: boolean;
  reasonCode?: string;
  results?: string;
  valueRealization?: boolean;
  externalProjectNo?: string;
  lastStatusChangeTime?: string;
  assessmentId?: string;
  assessmentResultId?: string;
  isDuplicated?: boolean;
}

export interface ActivityCardNotificationDto {
  notifyUserIds: string[];
  notificationMode?: string;
  cardId?: string;
  cardLink?: string;
  cardType?: string;
  site?: string;
  area?: string;
  cell?: string;
  shortDescription?: string;
  createDate?: string;
  lastModifiedDate?: string;
  createBy?: string;
  priority?: string;
  cardDueDate?: string;
  cardOwner?: string;
  task?: string;
  taskOwner?: string;
  taskDueDate?: string;
  results?: string;
  lastModifierId?: string;
  creatorId?: string;
}

export interface ActivityCardNotificationSettingsDto extends ExecutionObjectDto<string> {
  userId?: string;
  cardOwnerEmail: boolean;
  cardOwnerInApp: boolean;
  taskOwnerEmail: boolean;
  taskOwnerInApp: boolean;
  teamMemberEmail: boolean;
  teamMemberInApp: boolean;
  creatorEmail: boolean;
  creatorInApp: boolean;
}

export interface ActivityCardNotifyInput {
  userId: string;
  notifyUserIds: string[];
  activityCardId: string;
  notificationMode?: string;
  baseLink?: string;
}

export interface ActivityCardPriorityDto extends NameObjectDto<string> {
  color?: string;
}

export interface ActivityCardPriorityExportDto {
  name?: string;
  displayName?: string;
  description?: string;
  color?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ActivityCardPriorityGetListInput extends GetNameObjectInput {
  color?: string;
}

export interface ActivityCardReasonDto extends NameObjectDto<string> {
  cardCategoryId?: string;
  cardCategoryName?: string;
  cardCategory: ActivityCardCategoryDto;
}

export interface ActivityCardReasonExportDto {
  name?: string;
  displayName?: string;
  description?: string;
  cardCategoryName?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ActivityCardReasonGetListInput extends GetNameObjectInput {
  cardCategoryId?: string;
}

export interface ActivityCardResultDto {
  cardId?: string;
  results?: string;
  valueRealization: boolean;
  externalProjectNo?: string;
}

export interface ActivityCardSafetyInfoDto {
  noOfYTDIncident: number;
  noOfDaysSinceLastIncidents: number;
  noOfUnsafeConditions: number;
  noOfSafetySuggestion: number;
  last24HSafetyIncident: number;
  last24HNearMissedIncident: number;
}

export interface ActivityCardSettingsDto extends NameObjectDto<string> {
  site?: string;
  siteName?: string;
  area?: string;
  areaName?: string;
  cell?: string;
  cellName?: string;
  defaultOwner?: string;
  defaultOwnerName?: string;
  defaultPriority?: string;
  defaultPriorityName?: string;
  escalationDuration?: number;
}

export interface ActivityCardSettingsExportDto {
  siteName?: string;
  areaName?: string;
  cellName?: string;
  defaultOwnerName?: string;
  defaultPriorityName?: string;
  escalationDuration?: number;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ActivityCardSettingsGetListInput extends GetNameObjectInput {
  keyword?: string;
  filter?: string;
}

export interface ActivityCardTaskDto extends ExecutionObjectDto<string> {
  cardId?: string;
  taskDescription?: string;
  ownerId?: string;
  dueDate?: string;
  originalDueDate?: string;
  completeDate?: string;
  status?: string;
  support?: boolean;
}

export interface ActivityCardTaskNotifyInput extends ActivityCardNotifyInput {
  taskId: string;
}

export interface ActivityCardTeamDto extends ExecutionObjectDto<string> {
  cardId?: string;
  memberId?: string;
}

export interface ActivityCardTypeDto extends NameObjectDto<string> {
  stateModelId?: string;
  stateModelName?: string;
  stateModel: StateModelDto;
  initialStatusId?: string;
  initialStatusName?: string;
  initialStatus: StateDto;
  cardColor?: string;
  requiredEscalation: boolean;
  requiredValueRealization: boolean;
  requiredIncidentDate: boolean;
  requiredReason: boolean;
  categoryField?: string;
  reasonField?: string;
  locationField?: string;
  priorityField?: string;
  incidentDateField?: string;
  assessmentField?: string;
  extraProjectNumField?: string;
}

export interface ActivityCardTypeExportDto {
  name?: string;
  displayName?: string;
  description?: string;
  stateModelName?: string;
  initialStatusName?: string;
  cardColor?: string;
  categoryField?: string;
  reasonField?: string;
  locationField?: string;
  priorityField?: string;
  incidentDateField?: string;
  assessmentField?: string;
  extraProjectNumField?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ActivityCardTypeGetListInput extends GetNameObjectInput {
  stateModelId?: string;
  initialStatusId?: string;
  cardColor?: string;
  requiredEscalation?: boolean;
  requiredValueRealization?: boolean;
  requiredIncidentDate?: boolean;
  requiredReason?: boolean;
}

export interface ActivityCardUpdateDto extends CreateUpdateActivityCardDto {
  status?: string;
}

export interface AreaDto extends NameObjectDto<string> {
  site?: string;
}

export interface AssessmentSchedulingRuleAssignedDataTierDto extends AuditedEntityDto<string> {
  assessmentSchedulingRuleId?: string;
  assessmentSchedulingRuleName?: string;
  dataTierId?: string;
  dataTierName?: string;
}

export interface AssessmentSchedulingRuleDto extends NameObjectDto<string> {
  assessmentType?: string;
  assessmentTypeName?: string;
  teams: AssessmentTeamDto[];
  scheduleType?: string;
  dataTierType?: string;
  dataTiers: AssessmentSchedulingRuleAssignedDataTierDto[];
  dataTierNames: string[];
  lastAssessmentDate?: string;
  startDate?: string;
  startTime?: string;
  asssessmentDuration: number;
  repeatEvery: number;
  weekDaysOnly: boolean;
  atMonday: boolean;
  atTuesday: boolean;
  atWednesday: boolean;
  atThursday: boolean;
  atFriday: boolean;
  atSaturday: boolean;
  atSunday: boolean;
  noOfAssessmentPerDataTier: number;
  isAutoScheduling: boolean;
}

export interface AssessmentSchedulingRuleGetListInput extends GetNameObjectInput {
  assessmentType?: string;
  dataTierType?: string;
  dataTierId?: string;
  teams?: string;
  scheduleType?: string;
  lastAssessmentDate?: string;
  isAutoScheduling?: boolean;
  startDate?: string;
  startTime?: string;
  asssessmentDuration?: number;
  repeatEvery?: number;
  weekDaysOnly?: boolean;
  atMonday?: boolean;
  atTuesday?: boolean;
  atWednesday?: boolean;
  atThursday?: boolean;
  atFriday?: boolean;
  atSaturday?: boolean;
  atSunday?: boolean;
  noOfAssessmentPerDataTier?: number;
  dataTierFilters: DataTierInput[];
}

export interface AssessmentTeamDto extends AuditedEntityDto<string> {
  owner?: string;
  ownerName?: string;
  userGroup?: string;
  userGroupName?: string;
  maxAssessmentPerDay: number;
}

export interface CellDto extends NameObjectDto<string> {
  area?: string;
}

export interface CommentDto extends ExecutionObjectDto<string> {
  parentId?: string;
  commentText?: string;
}

export interface CreateUpdateActivityCardAttachmentDto {
  id?: string;
  cardId?: string;
  attachmentType?: string;
  fileId?: string;
  mimeType?: string;
}

export interface CreateUpdateActivityCardCategoryDto extends CreateUpdateNameObjectDto {
  cardTypeId?: string;
  cardTypeName?: string;
  reasonsDataSource?: string;
  color?: string;
  unsafeCondition?: boolean;
  reportAsIncident?: boolean;
  siteKPIIndicator?: string;
}

export interface CreateUpdateActivityCardDailySummaryDataDto {
  date?: string;
  siteId?: string;
  siteDisplayName?: string;
  areaId?: string;
  areaDisplayName?: string;
  cellId?: string;
  cellDisplayName?: string;
  dailyNearMisses: number;
  dailyUnsafeConditions: number;
  dailyUnsafeConditionsTarget: number;
}

export interface CreateUpdateActivityCardDto extends CreateUpdateExecutionObjectDto {
  code?: string;
  categoryId?: string;
  currentStateId?: string;
  previousStateId?: string;
  instructions?: string;
  longInstruction?: string;
  dataTierStartTime?: string;
  escalatedFromCell?: string;
  escalatedFromArea?: string;
  originalDataTierId?: string;
  originalDataTierType?: string;
  previousDataTierId?: string;
  previousDataTierType?: string;
  priorityId?: string;
  assignedOwnerId?: string;
  ownerRoleName?: string;
  location?: string;
  incidentDate?: string;
  onSupport: boolean;
  hasAssessment?: boolean;
  reasonCode?: string;
  results?: string;
  valueRealization?: boolean;
  externalProjectNo?: string;
  lastStatusChangeTime?: string;
  lastAcknowledgeDate?: string;
  assessmentId?: string;
  assessmentResultId?: string;
  isDuplicated?: boolean;
  teams: CreateUpdateActivityCardTeamDto[];
  attachments: CreateUpdateActivityCardAttachmentDto[];
}

export interface CreateUpdateActivityCardNotificationSettingsDto extends CreateUpdateExecutionObjectDto {
  userId?: string;
  cardOwnerEmail: boolean;
  cardOwnerInApp: boolean;
  taskOwnerEmail: boolean;
  taskOwnerInApp: boolean;
  teamMemberEmail: boolean;
  teamMemberInApp: boolean;
  creatorEmail: boolean;
  creatorInApp: boolean;
}

export interface CreateUpdateActivityCardPriorityDto extends CreateUpdateNameObjectDto {
  color?: string;
}

export interface CreateUpdateActivityCardReasonDto extends CreateUpdateNameObjectDto {
  cardCategoryId?: string;
  cardCategoryName?: string;
}

export interface CreateUpdateActivityCardSettingsDto extends CreateUpdateNameObjectDto {
  site?: string;
  siteName?: string;
  area?: string;
  areaName?: string;
  cell?: string;
  cellName?: string;
  defaultOwner?: string;
  defaultOwnerName?: string;
  defaultPriority?: string;
  defaultPriorityName?: string;
  escalationDuration?: number;
}

export interface CreateUpdateActivityCardTaskDto {
  id?: string;
  cardId?: string;
  taskDescription?: string;
  ownerId?: string;
  dueDate?: string;
  originalDueDate?: string;
  completeDate?: string;
  action?: string;
  status?: string;
  support?: boolean;
}

export interface CreateUpdateActivityCardTaskListDto {
  cardId?: string;
  tasks: CreateUpdateActivityCardTaskDto[];
  attachments: CreateUpdateActivityCardAttachmentDto[];
}

export interface CreateUpdateActivityCardTeamDto {
  id?: string;
  cardId?: string;
  memberId?: string;
}

export interface CreateUpdateActivityCardTypeDto extends CreateUpdateNameObjectDto {
  stateModelId?: string;
  stateModelName?: string;
  initialStatusId?: string;
  initialStatusName?: string;
  cardColor?: string;
  requiredEscalation: boolean;
  requiredValueRealization: boolean;
  requiredIncidentDate: boolean;
  requiredReason: boolean;
  categoryField?: string;
  reasonField?: string;
  locationField?: string;
  priorityField?: string;
  incidentDateField?: string;
  assessmentField?: string;
  extraProjectNumField?: string;
}

export interface CreateUpdateAssessmentSchedulingRuleAssignedDataTierDto extends CreateUpdateNameObjectDto {
  id?: string;
  assessmentSchedulingRuleId?: string;
  dataTierId?: string;
  dataTierName?: string;
}

export interface CreateUpdateAssessmentSchedulingRuleDto extends CreateUpdateNameObjectDto {
  assessmentType?: string;
  assessmentTypeName?: string;
  teams: CreateUpdateAssessmentTeamDto[];
  scheduleType?: string;
  dataTierType?: string;
  dataTiers: CreateUpdateAssessmentSchedulingRuleAssignedDataTierDto[];
  startDate?: string;
  startTime?: string;
  asssessmentDuration: number;
  repeatEvery?: number;
  weekDaysOnly?: boolean;
  atMonday?: boolean;
  atTuesday?: boolean;
  atWednesday?: boolean;
  atThursday?: boolean;
  atFriday?: boolean;
  atSaturday?: boolean;
  atSunday?: boolean;
  noOfAssessmentPerDataTier?: number;
  isAutoScheduling: boolean;
}

export interface CreateUpdateAssessmentTeamDto extends CreateUpdateNameObjectDto {
  id?: string;
  owner?: string;
  userGroup?: string;
  userGroupName?: string;
  maxAssessmentPerDay: number;
}

export interface CreateUpdateCommentDto extends CreateUpdateExecutionObjectDto {
  parentId?: string;
  commentText?: string;
}

export interface CreateUpdateExecutionObjectDto {
  tenantId?: string;
  tenantName?: string;
  extraProperties: Record<string, object>;
}

export interface CreateUpdateMaterialListDto {
  product?: string;
  operation?: string;
  qtyRequired: number;
  uom?: string;
  movementType?: string;
}

export interface CreateUpdateMaterialSetupDto {
  container?: string;
  qty: number;
  product?: string;
  uom?: string;
  batch?: string;
}

export interface CreateUpdateNameObjectDto {
  name: string;
  description?: string;
  tenantId?: string;
  tenantName?: string;
  displayName?: string;
  extraProperties: Record<string, object>;
}

export interface CreateUpdateOrderStatusEventDto {
  eventTimestamp?: string;
  productionOrder?: string;
  quantity: number;
  statusCode?: string;
  fromOrderStatus?: string;
  fromOrderState?: string;
  toOrderStatus?: string;
  toOrderState?: string;
}

export interface CreateUpdateResourceStatusEventDto {
  eventTimestamp?: string;
  workCenter?: string;
  resourceStatusReason?: string;
  resourceStatusCode?: string;
  sapGlobalCode?: string;
  physicalStatus?: string;
  stdEqpCode?: string;
}

export interface CreateUpdateRootCauseAnalysisDto {
  id?: string;
  cardId?: string;
  why?: string;
  category?: string;
}

export interface CreateUpdateRootCauseAnalysisListDto {
  cardId?: string;
  rootCauseAnalysisDtos: CreateUpdateRootCauseAnalysisDto[];
  attachments: CreateUpdateActivityCardAttachmentDto[];
}

export interface CreateUpdateStateDto extends CreateUpdateNameObjectDto {
  isCompleted: boolean;
  color?: string;
}

export interface CreateUpdateStateModelDto extends CreateUpdateNameObjectDto {
  defaultState?: string;
  defaultStateName?: string;
  transitions: CreateUpdateStateTransitionDto[];
}

export interface CreateUpdateStateTransitionDto {
  sequence: number;
  fromState?: string;
  toState?: string;
  eventName?: string;
}

export interface ExecutionObjectDto<Tkey> extends ExtensibleAuditedEntityDto<Tkey> {
  tenantId?: string;
  tenantName?: string;
}

export interface ExportStateModelDto {
  name?: string;
  displayName?: string;
  description?: string;
  defaultState?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
  stateTransition: ExportStateTransitionItem[];
}

export interface ExportStateTransitionItem {
  fromState?: string;
  toState?: string;
}

export interface FailedImportResultItemDto {
  name?: string;
  errorMessage?: string;
}

export interface GetActivityCardListDto {
  id?: string;
  code?: string;
  dataTierId?: string;
  dataTierName?: string;
  dataTierType?: string;
  dataTierStartTime?: string;
  needToEscalate: boolean;
  previousDataTierId?: string;
  previousDataTierType?: string;
  previousDataTierName?: string;
  originalDataTierId?: string;
  originalDataTierType?: string;
  originalDataTierName?: string;
  cardTypeId?: string;
  cardTypeName?: string;
  instructions?: string;
  longInstruction?: string;
  currentStateId?: string;
  currentStateName?: string;
  categoryId?: string;
  categoryName?: string;
  priorityId?: string;
  priorityName?: string;
  assignedOwnerId?: string;
  assignedOwnerName?: string;
  assignedOwnerEmail?: string;
  createByName?: string;
  createByEmail?: string;
  cardColor?: string;
  statusColor?: string;
  categoryColor?: string;
  priorityColor?: string;
  location?: string;
  incidentDate?: string;
  onSupport?: boolean;
  hasAssessment?: boolean;
  creationTime?: string;
  dueDate?: string;
  orignalDueDate?: string;
  completedDate?: string;
  lastTaskCompletedDate?: string;
  lastModificationTime?: string;
  lastStatusChangeTime?: string;
  isPastDue: boolean;
  isDueDateChanged: boolean;
  categoryField?: string;
  reasonField?: string;
  locationField?: string;
  priorityField?: string;
  incidentDateField?: string;
  assessmentField?: string;
  extraProjectNumField?: string;
  noOfComments: number;
  noOfDaysOpen: number;
  supportNum: number;
  overdueNum: number;
  lastAcknowledgeDate?: string;
  maxDueDate?: string;
  maxOrignalDueDate?: string;
  lastTaskChangeDate?: string;
  noOfTaskOpen: number;
  assessmentId?: string;
  assessmentResultId?: string;
  tasks: ActivityCardTaskDto[];
}

export interface GetActivityCardListInput {
  filter?: string;
  dataTierList: DataTierInput[];
  cardTypeList: string[];
  statusList: string[];
  ownerList: string[];
  categoryList: string[];
  startTime?: string;
  endTime?: string;
  summaryFilterType?: ActivityCardSummaryFilterType;
  expandSubTiers?: boolean;
}

export interface GetActivityCardListSummaryDto {
  activityCardList: GetActivityCardListDto[];
  noOfCardsNoUpdate: number;
  noOfCardsActive: number;
  noOfCardsTaskOverdue: number;
  noOfCardsUnassignedTasks: number;
  noOfCardsMissingDueDate: number;
}

export interface GetActivityCardSummaryOutput {
  totalOpenCards: number;
  totalActiveMore21days: number;
  totalNoUpdateMore10days: number;
  totalOverdue: number;
}

export interface GetActivityCardTaskListDto {
  id?: string;
  code?: string;
  cardTypeId?: string;
  cardTypeName?: string;
  instructions?: string;
  assignedOwnerId?: string;
  assignedOwnerName?: string;
  taskDescription?: string;
  dueDate?: string;
  priorityId?: string;
  priorityName?: string;
  ownerType?: string;
  dataTierType?: string;
  dataTierDetail?: string;
  dataTierId?: string;
}

export interface GetActivityCardTaskListInput {
  dataTierList: string[];
  dataTierType?: string;
  cardTypeList: string[];
  ownerTypeList: string[];
  userId?: string;
  startLastModificationTime?: string;
  endLastModificationTime?: string;
}

export interface GetActivityCardTasksInput extends PagedAndSortedResultRequestDto {
  dataTierList: string[];
  dataTierType?: string;
  cardTypeList: string[];
  ownerTypeList: string[];
  userId?: string;
  startLastModificationTime?: string;
  endLastModificationTime?: string;
}

export interface GetNameObjectInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface GetUnsafeConditionCountsInput {
  dataTierList: string[];
  dataTierType?: string;
  startDate: string;
  endDate: string;
}

export interface GetZeroIncidentDayInput {
  dataTierList: string[];
  dataTierType?: string;
}

export interface ImportResultDto {
  status: boolean;
  totalCount: number;
  successCount: number;
  failedCount: number;
  items: FailedImportResultItemDto[];
}

export interface LocalDowntimeReasonDto extends NameObjectDto<string> {
  globalDowntimeCodeId?: string;
}

export interface MaterialListDto {
  product?: string;
  operation?: string;
  qtyRequired: number;
  uom?: string;
  movementType?: string;
  tenantId?: string;
}

export interface MaterialSetupDto {
  container?: string;
  qty: number;
  product?: string;
  uom?: string;
  batch?: string;
  tenantId?: string;
}

export interface ModelingHistoryDto {
  id?: string;
  userName?: string;
  executionTime?: string;
  changeType?: string;
  children: ModelingPropertyDto[];
}

export interface ModelingInputDto<TKey> extends PagedAndSortedResultRequestDto {
  id: TKey;
}

export interface ModelingPropertyDto {
  propertyName?: string;
  originalValue?: string;
  newValue?: string;
}

export interface NameObjectDto<Tkey> extends ExtensibleAuditedEntityDto<Tkey> {
  name?: string;
  description?: string;
  tenantId?: string;
  tenantName?: string;
  normalizedName?: string;
  displayName?: string;
  creator?: string;
  lastModifier?: string;
}

export interface OrderStatusEventDto extends ExecutionObjectDto<string> {
  eventTimestamp?: string;
  productionOrder?: string;
  quantity: number;
  statusCode?: string;
  fromOrderStatus?: string;
  fromOrderState?: string;
  toOrderStatus?: string;
  toOrderState?: string;
}

export interface OrderStatusEventGetListInput extends PagedAndSortedResultRequestDto {
  eventTimestamp?: string;
  productionOrder?: string;
  quantity?: number;
  statusCode?: string;
  fromOrderStatus?: string;
  fromOrderState?: string;
  toOrderStatus?: string;
  toOrderState?: string;
}

export interface RootCauseAnalysisDto extends ExecutionObjectDto<string> {
  cardId?: string;
  why?: string;
  category?: string;
}

export interface SafetyCardCountByDayDto {
  date?: string;
  area?: string;
  activityCardCount: number;
}

export interface SafetyCardCountByDayOutput {
  activityCardCounts: SafetyCardCountByDayDto[];
  mtdCount: number;
  mtdLimit: number;
}

export interface SafetyCardCountByMonthDto {
  month: number;
  area?: string;
  activityCardCount: number;
}

export interface SafetyCardCountByMonthOutput {
  activityCardCounts: SafetyCardCountByMonthDto[];
  ytdCount: number;
  ytdLimit: number;
}

export interface SingleResultDto {
  status: boolean;
  message?: string;
}

export interface StateDto extends NameObjectDto<string> {
  isCompleted: boolean;
  color?: string;
}

export interface StateExportDto {
  name?: string;
  displayName?: string;
  description?: string;
  isCompleted: boolean;
  color?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface StateGetListInput extends GetNameObjectInput {
  isCompleted?: boolean;
  color?: string;
}

export interface StateModelDto extends NameObjectDto<string> {
  defaultState?: string;
  defaultStateName?: string;
  transitions: StateTransitionDto[];
}

export interface StateModelGetListInput extends GetNameObjectInput {
  defaultState?: string;
  ids: string[];
}

export interface StateTransitionDto extends EntityDto<string> {
  sequence: number;
  fromState?: string;
  toState?: string;
  eventName?: string;
}

export interface WorkCenterDto extends NameObjectDto<string> {
  cell?: string;
}

export interface ActivityCardByAreaDto {
  area?: string;
  cell?: string;
  totalOpenCount?: number;
  totalPassDueCount?: number;
}

export interface ActivityCardCountInfoDto {
  areaId?: string;
  areaName?: string;
  areaDisplayName?: string;
  cellId?: string;
  cellName?: string;
  cellDisplayName?: string;
  totalOpenCount: number;
  totalPassDueCount: number;
}

export interface AssignToDoTaskDto {
  taskIds: string[];
  users: AssignToDoTaskUserAndDate[];
}

export interface AssignToDoTaskResultDto extends SingleResultDto {
  count: number;
  tasks: ToDoTaskDto[];
}

export interface AssignToDoTaskUserAndDate {
  userId?: string;
  expiryDate?: string;
}

export interface AutoConfirmationStatusEventDto extends ExecutionObjectDto<string> {
  eventTimestamp?: string;
  workCenter?: string;
  productionOrder?: string;
  confirmQty: number;
  status?: string;
  errorCode?: string;
  statusDescription?: string;
  referenceId?: string;
}

export interface CreateCompleteTasksProcessResultDto extends SingleResultDto {
  createdTaskList: RoleBoardTaskDto[];
  completedTaskList: RoleBoardTaskDto[];
}

export interface CreateUpdateRoleBoardTaskDto extends CreateUpdateExecutionObjectDto {
  taskTypeId?: string;
  taskTime?: string;
  warningTime?: string;
  alertTime?: string;
  isUrgent: boolean;
  priority?: number;
  instructions?: string;
  dataTierId?: string;
  dataTierType?: string;
  currentStateId?: string;
  assignedOwnerId?: string;
  ownerRoleName?: string;
  comments: CreateUpdateCommentDto[];
  contextKey?: string;
  contextType?: string;
}

export interface CreateUpdateRoleBoardTaskTypeDto extends CreateUpdateNameObjectDto {
  stateModelId?: string;
  stateModelName?: string;
  category?: string;
  alertColor?: string;
  warningColor?: string;
}

export interface DailyNearMissesDto {
  date?: string;
  dailyNearMisses: number;
}

export interface ExportFocusedItemDto {
  workCenterName?: string;
  partNumber?: string;
  priority: number;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportRoleBoardTaskTypeDto {
  name?: string;
  displayName?: string;
  description?: string;
  stateModelName?: string;
  category?: string;
  alertColor?: string;
  warningColor?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface GenerateToDoTaskResultDto extends SingleResultDto {
  count: number;
  tasks: ToDoTaskDto[];
}

export interface MinorStoppagesByDayDto {
  workCenterName?: string;
  date?: string;
  noOfStoppages: number;
  areaName?: string;
  cellName?: string;
}

export interface MinorStoppagesByShiftDto {
  workCenterName?: string;
  noOfStoppages: number;
  areaName?: string;
  cellName?: string;
}

export interface MonthlyNearMissesDto {
  year: number;
  month: number;
  monthlyNearMisses: number;
}

export interface MyToDoTaskDto extends ExecutionObjectDto<string> {
  statusId?: string;
  statusDisplayName?: string;
  shiftId?: string;
  shiftDisplayName?: string;
  toDo?: string;
  toDoTypeId?: string;
  assigneeId?: string;
  assignedCardId?: string;
  assigneeDisplayName?: string;
  assigneeCardId?: string;
  dataTierType?: string;
  dataTierId?: string;
  dataTierDisplayName?: string;
  expiryDate?: string;
  comments: ToDoTaskCommentDto[];
}

export interface MyToDoTasksRequestDto extends PagedResultRequestDto {
  filter?: string;
  assigneeId?: string;
  dataTierType?: string;
  dataTierId?: string;
  shiftIds: string[];
  toDoListSetupIds: string[];
  statusIds: string[];
  expiryDateFrom?: string;
  expiryDateTo?: string;
  showMyToDoType?: number;
}

export interface NearMissesDailyDto {
  currentMonthTarget: number;
  mtdActual: number;
  last24Hours: number;
  nearMissesList: DailyNearMissesDto[];
}

export interface NearMissesGetInput {
  siteId: string;
  areaIds: string[];
  cellIds: string[];
  startDate: string;
  endDate: string;
}

export interface NearMissesMonthlyDto {
  ytdActual: number;
  last30Days: number;
  nearMissesList: MonthlyNearMissesDto[];
}

export interface NotifyManualTaskCompleteInputDto {
  taskCompleteUserId?: string;
  taskCompleteUserName?: string;
  taskId?: string;
  taskInstructions?: string;
  taskType?: string;
  taskDataTierName?: string;
  taskDataTierType?: string;
  completeReason?: string;
}

export interface NotifyManualTaskCompleteOutputDto {
  taskCompleteUserId?: string;
  taskCompleteUserName?: string;
  taskId?: string;
  taskInstructions?: string;
  taskType?: string;
  taskDataTierName?: string;
  taskDataTierType?: string;
  completeReason?: string;
  message?: string;
}

export interface RoleBoardTaskDto extends ExecutionObjectDto<string> {
  taskTypeId?: string;
  taskType: RoleBoardTaskTypeDto;
  taskTime?: string;
  warningTime?: string;
  alertTime?: string;
  duration?: string;
  durationHours: number;
  isUrgent: boolean;
  priority?: number;
  status?: string;
  instructions?: string;
  dataTierId?: string;
  dataTierType?: string;
  currentStateId?: string;
  currentState: StateDto;
  assignedOwnerId?: string;
  assignedOwner: IdentityUserDto;
  ownerRoleName?: string;
  ownerRole: IdentityRoleDto;
  comments: CommentDto[];
  contextKey?: string;
  contextType?: string;
}

export interface RoleBoardTaskGetListInput extends PagedAndSortedResultRequestDto {
  taskTypeId?: string;
  taskTime?: string;
  warningTime?: string;
  alertTime?: string;
  isUrgent?: boolean;
  priority?: number;
  status?: string;
  instructions?: string;
  dataTierId?: string;
  dataTierType?: string;
  currentStateId?: string;
  assignedOwnerId?: string;
  ownerRoleName?: string;
}

export interface RoleBoardTaskSearchInput extends PagedAndSortedResultRequestDto {
  areaIds: string[];
  cellIds: string[];
  workCenterIds: string[];
  ownerRoleName?: string;
}

export interface RoleBoardTaskTypeDto extends NameObjectDto<string> {
  stateModelId?: string;
  stateModelName?: string;
  stateModel: StateModelDto;
  category?: string;
  alertColor?: string;
  warningColor?: string;
}

export interface RoleBoardTaskTypeGetListInput extends GetNameObjectInput {
  stateModelId?: string;
  category?: string;
  alertColor?: string;
  warningColor?: string;
}

export interface ScrapIncreaseTaskProcessResultDto extends SingleResultDto {
  createdTaskList: RoleBoardTaskDto[];
  completedTaskList: RoleBoardTaskDto[];
}

export interface SingleResultWithStatusDto<T> {
  status: boolean;
  message?: string;
  item: T;
}

export interface SiteHuddleCardQueryInput {
  siteId: string;
  areaIds: string[];
  cellIds: string[];
  siteKPIIndicator: string;
}

export interface SiteHuddleCardStatisticsDto {
  noUpdate10Days: number;
  open21Days: number;
  noTaskOwner: number;
  taskPastDue: number;
}

export interface ToDoListSetupDataTierExportDto {
  dataTierType?: string;
  dataTierName?: string;
}

export interface ToDoListSetupDetailExportDto {
  toDoTask?: string;
  order: number;
  toDoListSetupStandards: ToDoListSetupStandardExportDto[];
  toDoListSetupLinks: ToDoListSetupLinkExportDto[];
}

export interface ToDoListSetupExportDto {
  name?: string;
  displayName?: string;
  description?: string;
  toDoTypeName?: string;
  scope?: string;
  scheduleCronExpression?: string;
  scheduleCompletionDate?: string;
  toDoListSetupDataTiers: ToDoListSetupDataTierExportDto[];
  toDoListSetupShifts: ToDoListSetupShiftExportDto[];
  toDoListSetupUsers: ToDoListSetupUserExportDto[];
  toDoListSetupDetails: ToDoListSetupDetailExportDto[];
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ToDoListSetupLinkExportDto {
  displayName?: string;
  url?: string;
}

export interface ToDoListSetupShiftExportDto {
  shiftName?: string;
}

export interface ToDoListSetupStandardExportDto {
  standardId?: string;
  standardName?: string;
}

export interface ToDoListSetupUserExportDto {
  userName?: string;
  expiryTime?: string;
  shiftName?: string;
  dataTierType?: string;
  dataTierName?: string;
}

export interface ToDoTaskSearchRequestDto extends PagedAndSortedResultRequestDto {
  areaIds: string[];
  cellIds: string[];
  workCenterIds: string[];
  filter?: string;
  taskDateFrom?: string;
  taskDateTo?: string;
  expiryDateFrom?: string;
  expiryDateTo?: string;
  shiftIds: string[];
  toDoListSetupIds: string[];
  assigneeIds: string[];
  statusIds: string[];
}

export interface ToDoTypeExportDto {
  name?: string;
  displayName?: string;
  description?: string;
  stateModelName?: string;
  cardTypeName?: string;
  cardCategoryName?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface TopMinorStoppagesDto {
  minorStoppagesByShift: MinorStoppagesByShiftDto[];
  minorStoppagesByDay: MinorStoppagesByDayDto[];
}

export interface UnsafeConditionDto {
  cell?: string;
  date?: string;
  totalCount?: number;
}

export interface UnsafeConditionInfoCountDto {
  date?: string;
  areaId?: string;
  areaName?: string;
  areaDisplayName?: string;
  cellId?: string;
  cellName?: string;
  cellDisplayName?: string;
  totalCount: number;
  targetCount: number;
  toleranceCount: number;
  kpi: number;
}
