import type { AuditedEntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { DigitsType } from '../digits-type.enum';


export interface AreaDto extends DataTierDto<string> {
  type?: string;
  site?: string;
  siteName?: string;
  cells: CellDto[];
}

export interface AssignedBroadcastMessageDataTierDto extends ExecutionObjectDto<string> {
  messageId?: string;
  dataTierType?: string;
  dataTierId?: string;
  dataTierName?: string;
}

export interface AssignedShiftPatternDataTierDto extends AuditedEntityDto<string> {
  parentId?: string;
  dataTierType?: string;
  dataTierId?: string;
  tenantId?: string;
}

export interface AssignedSupportTeamDataTierDto extends AuditedEntityDto<string> {
  supportTeamId?: string;
  dataTierType?: string;
  dataTierId?: string;
  dataTierName?: string;
  isDefault: boolean;
  tenantId?: string;
}

export interface BroadcastMessageDto extends ExecutionObjectDto<string> {
  expiryTime?: string;
  message?: string;
  messageCategoryId?: string;
  messageCategoryName?: string;
  lastModifier?: string;
  datatiers: AssignedBroadcastMessageDataTierDto[];
}

export interface BroadcastMessageGetListInput extends PagedAndSortedResultRequestDto {
  userId?: string;
  categoryId?: string;
  expireStartDate?: string;
  expireEndDate?: string;
  areas: string[];
  cells: string[];
  workCenters: string[];
  isExcludeExpiredMessage: boolean;
  filter?: string;
}

export interface CellDto extends DataTierDto<string> {
  type?: string;
  area?: string;
  areaName?: string;
  workCenters: WorkCenterDto[];
}

export interface CommentDto extends ExecutionObjectDto<string> {
  productionDate?: string;
  shiftId?: string;
  shift: ShiftDto;
  shiftIntervals?: string;
  areaId?: string;
  area: AreaDto;
  areaName?: string;
  cellId?: string;
  cell: CellDto;
  cellName?: string;
  location?: string;
  commentText?: string;
  creatorName?: string;
  lastModifierName?: string;
}

export interface CommentGetListInput extends PagedAndSortedResultRequestDto {
  productionDate?: string;
  shiftId?: string;
  shiftIntervals?: string;
  areaId?: string;
  cellId?: string;
  keyword?: string;
  location?: string;
  commentText?: string;
  isShiftCommentOnly: boolean;
}

export interface ContainerLevelDto extends NameObjectDto<string> {
}

export interface ContainerLevelGetListInput extends GetNameObjectInput {
}

export interface CreateLocalDowntimeReasonFromMESDto {
  name?: string;
  displayName?: string;
  globalDowntimeCode?: string;
  isPlanned?: string;
  isDeleted: boolean;
}

export interface CreateUpdateAssignedBroadcastMessageDataTierDto {
  id?: string;
  dataTierType?: string;
  dataTierId?: string;
  messageId?: string;
}

export interface CreateUpdateAssignedShiftPatternDataTierDto {
  id?: string;
  parentId?: string;
  dataTierType?: string;
  dataTierId?: string;
  tenantId?: string;
}

export interface CreateUpdateAssignedSupportTeamDataTierDto {
  supportTeamId?: string;
  dataTierType?: string;
  dataTierId?: string;
  isDefault: boolean;
  tenantId?: string;
}

export interface CreateUpdateBroadcastMessageDto {
  expiryTime?: string;
  message?: string;
  messageCategoryId?: string;
  messageCategoryName?: string;
  tenantId?: string;
  datatiers: CreateUpdateAssignedBroadcastMessageDataTierDto[];
  extraProperties: Record<string, object>;
}

export interface CreateUpdateCommentDto extends CreateUpdateExecutionObjectDto {
  productionDate?: string;
  shiftId?: string;
  shiftIntervals?: string;
  areaId?: string;
  cellId?: string;
  location?: string;
  commentText?: string;
}

export interface CreateUpdateContainerLevelDto extends CreateUpdateNameObjectDto {
}

export interface CreateUpdateExecutionObjectDto {
  tenantId?: string;
  tenantName?: string;
  extraProperties: Record<string, object>;
}

export interface CreateUpdateGlobalDowntimeCodeDto extends CreateUpdateNameObjectDto {
  isPlanned?: string;
  isCosted?: string;
}

export interface CreateUpdateLocalBreaktimeReasonDto extends CreateUpdateNameObjectDto {
}

export interface CreateUpdateLocalDowntimeReasonDto extends CreateUpdateNameObjectDto {
  globalDowntimeCodeId?: string;
  globalDowntimeCode?: string;
  isPlanned?: string;
}

export interface CreateUpdateLocalScrapReasonDto extends CreateUpdateNameObjectDto {
  globalScrapCodeId: string;
  globalScrapCode?: string;
}

export interface CreateUpdateMessageCategoryDto extends CreateUpdateNameObjectDto {
}

export interface CreateUpdateNameObjectDto {
  name: string;
  description?: string;
  tenantId?: string;
  tenantName?: string;
  displayName?: string;
  extraProperties: Record<string, object>;
}

export interface CreateUpdateNamingGeneratorDto extends CreateUpdateNameObjectDto {
  code?: string;
}

export interface CreateUpdateNamingRuleDto extends CreateUpdateNameObjectDto {
  prefix?: string;
  suffix?: string;
  length: number;
  digitsType: DigitsType;
  expression?: string;
  generator?: string;
  lastSeq: number;
  expressionValue?: string;
  isDeleted: boolean;
}

export interface CreateUpdateProductionReviewBoardSettingDto extends CreateUpdateNameObjectDto {
  reviewType?: string;
  l1GroupList?: string;
  l2GroupList?: string;
  l3GroupList?: string;
  displayList?: string;
}

export interface CreateUpdateShiftDto extends CreateUpdateNameObjectDto {
}

export interface CreateUpdateShiftPatternDetailDto {
  id?: string;
  parentId?: string;
  shiftId?: string;
  startTime?: string;
  tenantId?: string;
}

export interface CreateUpdateShiftPatternDto extends CreateUpdateNameObjectDto {
  timeIncrement?: string;
  shiftPatternDetails: CreateUpdateShiftPatternDetailDto[];
  assignedShiftPatternDataTiers: CreateUpdateAssignedShiftPatternDataTierDto[];
}

export interface CreateUpdateSiteSettingDto extends CreateUpdateNameObjectDto {
  siteId?: string;
  siteName?: string;
  safetyIncidentsTarget?: string;
  nearMissesTarget?: string;
  externalQNsTarget?: string;
  internalQNsTarget?: string;
  copqTarget?: string;
  copqcogsTarget?: string;
  peopleProdTarget?: string;
  assetProdTarget?: string;
  oeeTarget?: string;
  poeeTarget?: string;
}

export interface DataTierDto<TKey> extends NameObjectDto<TKey> {
  type?: string;
}

export interface ExecutionObjectDto<Tkey> extends ExtensibleAuditedEntityDto<Tkey> {
  tenantId?: string;
  tenantName?: string;
}

export interface ExportContainerLevelDto {
  name: string;
  displayName: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportGlobalDowntimeCodeDto {
  name?: string;
  displayName?: string;
  description?: string;
  isPlanned?: string;
  isCosted?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportLocalDowntimeReasonDto {
  name: string;
  displayName?: string;
  description?: string;
  globalDowntimeCode?: string;
  isPlanned?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportLocalScrapReasonDto {
  name: string;
  displayName: string;
  description?: string;
  globalScrapCode: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportNameObjectDto {
  name: string;
  displayName: string;
  description?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportNamingGeneratorDto {
  name: string;
  displayName?: string;
  description?: string;
  code?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportNamingRuleDto {
  name: string;
  displayName?: string;
  description?: string;
  prefix?: string;
  suffix?: string;
  length: number;
  digitsType: DigitsType;
  expression?: string;
  generator?: string;
  lastSeq: number;
  expressionValue?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportProductionReviewBoardSettingDto {
  name?: string;
  displayName?: string;
  description?: string;
  reviewType?: string;
  l1GroupList?: string;
  l2GroupList?: string;
  l3GroupList?: string;
  displayList?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportShiftPatternDto {
  name?: string;
  displayName?: string;
  description?: string;
  timeIncrement?: string;
  dataTier: string[];
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
  shiftPatternDetails: ShiftPatternDetailItem[];
}

export interface ExportSiteSettingDto {
  site?: string;
  safetyIncidentsTarget?: string;
  nearMissesTarget?: string;
  externalQNsTarget?: string;
  internalQNsTarget?: string;
  copqTarget?: string;
  copqcogsTarget?: string;
  peopleProdTarget?: string;
  assetProdTarget?: string;
  oeeTarget?: string;
  poeeTarget?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface FailedImportResultItemDto {
  name?: string;
  errorMessage?: string;
}

export interface GetNameObjectInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface GetShiftMasterDataIds {
  areaIds: string[];
  cellIds: string[];
  wrokCenterIds: string[];
}

export interface GlobalDowntimeCodeDto extends NameObjectDto<string> {
  isPlanned?: string;
  isCosted?: string;
}

export interface GlobalDowntimeCodeGetListInput extends GetNameObjectInput {
}

export interface ImportResultDto {
  status: boolean;
  totalCount: number;
  successCount: number;
  failedCount: number;
  items: FailedImportResultItemDto[];
}

export interface LocalBreaktimeReasonDto extends NameObjectDto<string> {
}

export interface LocalBreaktimeReasonGetListInput extends GetNameObjectInput {
}

export interface LocalDowntimeReasonDto extends NameObjectDto<string> {
  globalDowntimeCodeId?: string;
  globalDowntimeCode?: string;
  isPlanned?: string;
}

export interface LocalDowntimeReasonGetListInput extends GetNameObjectInput {
  globalDowntimeCodeId?: string;
}

export interface LocalScrapReasonDto extends NameObjectDto<string> {
  globalScrapCodeId?: string;
  globalScrapCode?: string;
}

export interface LocalScrapReasonGetListInput extends GetNameObjectInput {
  globalScrapCodeId?: string;
}

export interface MessageCategoryDto extends NameObjectDto<string> {
}

export interface MessageCategoryGetListInput extends GetNameObjectInput {
}

export interface ModelingHistoryDto {
  id?: string;
  userName?: string;
  executionTime?: string;
  changeType?: string;
  children: ModelingPropertyDto[];
}

export interface ModelingInput<TKey> extends PagedAndSortedResultRequestDto {
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
  displayName?: string;
  normalizedName?: string;
  creator?: string;
  lastModifier?: string;
}

export interface NamingGeneratorDto extends NameObjectDto<string> {
  code?: string;
}

export interface NamingGeneratorGetListInput extends GetNameObjectInput {
}

export interface NamingRuleDto extends NameObjectDto<string> {
  prefix?: string;
  suffix?: string;
  length: number;
  digitsType: DigitsType;
  expression?: string;
  generator?: string;
  generatorName?: string;
  code?: string;
  lastSeq: number;
  expressionValue?: string;
  isDeleted: boolean;
}

export interface NamingRuleGetListInput extends GetNameObjectInput {
}

export interface ProductionReviewBoardSettingDto extends NameObjectDto<string> {
  reviewType?: string;
  l1GroupList?: string;
  l2GroupList?: string;
  l3GroupList?: string;
  displayList?: string;
}

export interface ProductionReviewBoardSettingGetListInput extends GetNameObjectInput {
  reviewType?: string;
  l1GroupList?: string;
  l2GroupList?: string;
  l3GroupList?: string;
  displayList?: string;
}

export interface ShiftByDataTierDto {
  shiftPatternId?: string;
  shiftPatternName?: string;
  shiftIncrement?: string;
  items: ShiftByDataTierItemDto[];
}

export interface ShiftByDataTierItemDto {
  shiftId?: string;
  shiftName?: string;
  shiftDisplayName?: string;
  shiftStartTime?: string;
  shiftIncrementList: string[];
}

export interface ShiftDto extends NameObjectDto<string> {
}

export interface ShiftExportInput {
  name?: string;
  displayName?: string;
  description?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ShiftGetListInput extends GetNameObjectInput {
}

export interface ShiftPatternBreakdownDto {
  dateDict: Record<string, ShiftPatternIncrementDto[]>;
}

export interface ShiftPatternByDateDto {
  shiftPatternId?: string;
  shiftName?: string;
  shiftDisplayName?: string;
  shiftId?: string;
  timeIncrement?: string;
  startTime?: string;
  startDateTimeUtc?: string;
  firstShiftStartDateTimeUtc?: string;
  intervalList: string[];
  productionDate?: string;
}

export interface ShiftPatternDetailDto extends AuditedEntityDto<string> {
  parentId?: string;
  shiftId?: string;
  startTime?: string;
  tenantId?: string;
}

export interface ShiftPatternDetailItem {
  shift?: string;
  startTime?: string;
}

export interface ShiftPatternDto extends NameObjectDto<string> {
  timeIncrement?: string;
  shiftPatternDetails: ShiftPatternDetailDto[];
  assignedShiftPatternDataTiers: AssignedShiftPatternDataTierDto[];
}

export interface ShiftPatternGetListInput extends GetNameObjectInput {
}

export interface ShiftPatternIncrementDto {
  incrementStartDatetime?: string;
  incrementEndDatetime?: string;
  incrementStartTimeString?: string;
  incrementEndTimeString?: string;
  shiftName?: string;
  shiftDisplayName?: string;
}

export interface SiteSettingDto extends NameObjectDto<string> {
  siteId?: string;
  siteName?: string;
  safetyIncidentsTarget?: string;
  nearMissesTarget?: string;
  externalQNsTarget?: string;
  internalQNsTarget?: string;
  copqTarget?: string;
  copqcogsTarget?: string;
  peopleProdTarget?: string;
  assetProdTarget?: string;
  oeeTarget?: string;
  poeeTarget?: string;
}

export interface SiteSettingGetListInput extends GetNameObjectInput {
  siteId?: string;
  safetyIncidentsTarget?: string;
  nearMissesTarget?: string;
  externalQNsTarget?: string;
  internalQNsTarget?: string;
  copqTarget?: string;
  copqcogsTarget?: string;
  peopleProdTarget?: string;
  assetProdTarget?: string;
  oeeTarget?: string;
  poeeTarget?: string;
}

export interface WorkCenterDto extends DataTierDto<string> {
  type?: string;
  cell?: string;
  cellName?: string;
  tenantId?: string;
}

export interface LinkCategoryExportDto {
  name: string;
  displayName?: string;
  description?: string;
  sequence: number;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface LinkExportDto {
  name?: string;
  displayName?: string;
  description?: string;
  url?: string;
  category?: string;
  targetReaders?: string;
  tags?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface SupportTeamWithAssignedDataTierDto {
  id?: string;
  userId?: string;
  userName?: string;
  email?: string;
  phoneNumber?: string;
  jobFunctionId?: string;
  jobFunctionName?: string;
  jobFunctionColor?: string;
  supportShiftId?: string;
  supportShiftName?: string;
  tenantId?: string;
  assignedDataTiers: AssignedSupportTeamDataTierDto[];
}
