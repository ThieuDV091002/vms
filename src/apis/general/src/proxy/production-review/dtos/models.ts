import type { CreateUpdateNameObjectDto, GetNameObjectInput, NameObjectDto } from '../../dtos/models';
import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface AreaSettingDto extends NameObjectDto<string> {
  areaId?: string;
  areaName?: string;
  yearlyInternalQNsTarget?: number;
  yearlyExternalQNsTarget?: number;
  unsafeConditionTarget?: number;
  planActualDiffTol?: number;
  fpyTargetTol?: number;
  sppmTargetTol?: number;
  machineCOPQTarget?: number;
  machineCOPQTargetTol?: number;
  poeeTarget?: number;
  poeeTargetTol?: number;
  performanceTargetTol?: number;
  udtTargetTol?: number;
  laborCOPQTarget?: number;
  laborCOPQTargetTol?: number;
  oleTarget?: number;
  oleTargetTol?: number;
  upphTargetTol?: number;
  costCenter?: string;
  kpiReviewType?: string;
}

export interface AreaSettingGetListInput extends GetNameObjectInput {
  areaId?: string;
  yearlyInternalQNsTarget?: number;
  yearlyExternalQNsTarget?: number;
  unsafeConditionTarget?: number;
  planActualDiffTol?: number;
  fpyTargetTol?: number;
  sppmTargetTol?: number;
  machineCOPQTarget?: number;
  machineCOPQTargetTol?: number;
  poeeTarget?: number;
  poeeTargetTol?: number;
  performanceTargetTol?: number;
  udtTargetTol?: number;
  laborCOPQTarget?: number;
  laborCOPQTargetTol?: number;
  oleTarget?: number;
  oleTargetTol?: number;
  upphTargetTol?: number;
}

export interface BreaktimeDataDto extends AuditedEntityDto<string> {
  workCenterId?: string;
  recordTimestamp?: string;
  workOrder?: string;
  breaktime?: number;
  localBreaktimeReasonId?: string;
  localBreaktimeReason?: string;
  productName?: string;
  workCenterName?: string;
  productId?: string;
  refSourceId?: string;
  tenantId?: string;
  createBy?: string;
  lastModifiedBy?: string;
  operation?: string;
  productFamilyId?: string;
  productSerieId?: string;
}

export interface BreaktimeDataGetListInput extends PagedAndSortedResultRequestDto {
  areas: string[];
  cells: string[];
  workCenters: string[];
  recordStartTimestamp?: string;
  recordEndTimestamp?: string;
  workOrder?: string;
  breaktime?: number;
  localBreaktimeReasonId?: string;
  productId?: string;
  refSourceId?: string;
}

export interface CellSettingDto extends NameObjectDto<string> {
  cellId?: string;
  cellName?: string;
  kpiReviewType?: string;
  qualityReviewType?: string;
}

export interface CellSettingGetListInput extends GetNameObjectInput {
  cellId?: string;
  kpiReviewType?: string;
  qualityReviewType?: string;
}

export interface CreateUpdateAreaSettingDto extends CreateUpdateNameObjectDto {
  areaId?: string;
  areaName?: string;
  yearlyInternalQNsTarget?: number;
  yearlyExternalQNsTarget?: number;
  unsafeConditionTarget?: number;
  planActualDiffTol?: number;
  fpyTargetTol?: number;
  sppmTargetTol?: number;
  machineCOPQTarget?: number;
  machineCOPQTargetTol?: number;
  poeeTarget?: number;
  poeeTargetTol?: number;
  performanceTargetTol?: number;
  udtTargetTol?: number;
  laborCOPQTarget?: number;
  laborCOPQTargetTol?: number;
  oleTarget?: number;
  oleTargetTol?: number;
  upphTargetTol?: number;
  costCenter?: string;
  kpiReviewType?: string;
}

export interface CreateUpdateBreaktimeDataByRange {
  startTime?: string;
  endTime?: string;
  workCenterId?: string;
  recordTimestamp?: string;
  workOrder?: string;
  localBreaktimeReasonId?: string;
  productId?: string;
  localBreaktimeReason?: string;
  productName?: string;
  workCenterName?: string;
  refSourceId?: string;
  tenantId?: string;
  operation?: string;
}

export interface CreateUpdateBreaktimeDataDto {
  workCenterId?: string;
  recordTimestamp?: string;
  workOrder?: string;
  breaktime?: number;
  localBreaktimeReasonId?: string;
  productId?: string;
  refSourceId?: string;
  tenantId?: string;
  localBreaktimeReason?: string;
  productName?: string;
  workCenterName?: string;
  operation?: string;
}

export interface CreateUpdateCellSettingDto extends CreateUpdateNameObjectDto {
  cellId?: string;
  cellName?: string;
  kpiReviewType?: string;
  qualityReviewType?: string;
}

export interface CreateUpdateDataIntegrationSettingDto extends CreateUpdateNameObjectDto {
  databaseName?: string;
  goodQtyStoredProc?: string;
  scrapQtyStoredProc?: string;
  reworkQtyStoredProc?: string;
  downtimeStoredProc?: string;
  breaktimeStoredProc?: string;
  laborStoredProc?: string;
  productionQtyDataMethod?: string;
  scrapQtyDataMethod?: string;
  reworkQtyDataMethod?: string;
  downtimeDataMethod?: string;
  breaktimeDataMethod?: string;
  laborDataMethod?: string;
}

export interface CreateUpdateDowntimeDataByRange {
  startTime?: string;
  endTime?: string;
  workCenterId?: string;
  recordTimestamp?: string;
  workOrder?: string;
  productId?: string;
  globalDowntimeCodeId?: string;
  localDowntimeReasonId?: string;
  localDowntimeReason?: string;
  globalDowntimeCode?: string;
  productName?: string;
  workCenterName?: string;
  refSourceId?: string;
  tenantId?: string;
  operation?: string;
}

export interface CreateUpdateDowntimeDataDto {
  workCenterId?: string;
  recordTimestamp?: string;
  downtime?: number;
  workOrder?: string;
  productId?: string;
  globalDowntimeCodeId?: string;
  localDowntimeReasonId?: string;
  refSourceId?: string;
  tenantId?: string;
  localDowntimeReason?: string;
  globalDowntimeCode?: string;
  productName?: string;
  workCenterName?: string;
  operation?: string;
}

export interface CreateUpdateGlobalScrapCodeDto extends CreateUpdateNameObjectDto {
}

export interface CreateUpdateLaborDataByRange extends CreateUpdateLaborDataDto {
  productionDateStartTime?: string;
  productionDateEndTime?: string;
}

export interface CreateUpdateLaborDataDto {
  workCenterId?: string;
  recordTimestamp?: string;
  workOrder?: string;
  productId?: string;
  staffNeeded?: number;
  staffActual?: number;
  refSourceId?: string;
  tenantId?: string;
  productName?: string;
  workCenterName?: string;
  operation?: string;
}

export interface CreateUpdateProductDto extends CreateUpdateNameObjectDto {
  productFamilyId?: string;
  productFamilyName?: string;
  productSerieId?: string;
  productSerieName?: string;
}

export interface CreateUpdateProductFamilyDto extends CreateUpdateNameObjectDto {
}

export interface CreateUpdateProductSerieDto extends CreateUpdateNameObjectDto {
}

export interface CreateUpdateProductionDataByRange extends CreateUpdateProductionDataDto {
  startTime?: string;
  endTime?: string;
}

export interface CreateUpdateProductionDataDto {
  workCenterId?: string;
  recordTimestamp?: string;
  workOrder?: string;
  productId?: string;
  productName?: string;
  workCenterName?: string;
  plannedQty?: number;
  baseQty?: number;
  producedQty: number;
  refSourceId?: string;
  tenantId?: string;
  operation?: string;
}

export interface CreateUpdateReworkDataDto {
  workCenterId?: string;
  recordTimestamp?: string;
  workOrder?: string;
  productId?: string;
  reworkQty?: number;
  refSourceId?: string;
  tenantId?: string;
  productName?: string;
  workCenterName?: string;
  operation?: string;
}

export interface CreateUpdateScrapDataByRangeDto {
  productId?: string;
  workCenterId?: string;
  recordTimestamp?: string;
  workOrder?: string;
  productName?: string;
  workCenterName?: string;
  scrapDataList: ScrapDataByRangeDto[];
  refSourceId?: string;
  tenantId?: string;
  operation?: string;
}

export interface CreateUpdateScrapDataDto {
  workCenterId?: string;
  recordTimestamp?: string;
  workOrder?: string;
  productId?: string;
  scrapQty?: number;
  globalScrapCodeId?: string;
  localScrapReasonId?: string;
  localScrapReason?: string;
  globalScrapCode?: string;
  productName?: string;
  workCenterName?: string;
  refSourceId?: string;
  tenantId?: string;
  operation?: string;
}

export interface CreateUpdateWorkCenterSettingDto extends CreateUpdateNameObjectDto {
  workCenterId?: string;
  workCenterName?: string;
  dataIntegrationSettingId?: string;
  dataIntegrationSettingName?: string;
  kpi?: string;
  goodQtyOption?: string;
  scrapQtyOption?: string;
  fpyTarget?: number;
  sppmTarget?: number;
  performanceTarget?: number;
  upphTarget?: number;
  udtTarget?: number;
}

export interface CreateUpdateWorkOrderDataDto {
  workCenterId?: string;
  recordTimestamp?: string;
  workOrder?: string;
  workOrderQty?: number;
  productId?: string;
  productName?: string;
  workCenterName?: string;
  uph?: number;
  staffNeeded?: number;
  tenantId?: string;
  baseQty?: number;
  operation?: string;
}

export interface DataIntegrationSettingDto extends NameObjectDto<string> {
  databaseName?: string;
  goodQtyStoredProc?: string;
  scrapQtyStoredProc?: string;
  reworkQtyStoredProc?: string;
  downtimeStoredProc?: string;
  breaktimeStoredProc?: string;
  laborStoredProc?: string;
  productionQtyDataMethod?: string;
  scrapQtyDataMethod?: string;
  reworkQtyDataMethod?: string;
  downtimeDataMethod?: string;
  breaktimeDataMethod?: string;
  laborDataMethod?: string;
}

export interface DataIntegrationSettingGetListInput extends GetNameObjectInput {
  databaseName?: string;
  goodQtyStoredProc?: string;
  scrapQtyStoredProc?: string;
  reworkQtyStoredProc?: string;
  downtimeStoredProc?: string;
  breaktimeStoredProc?: string;
  laborStoredProc?: string;
  productionQtyDataMethod?: string;
  scrapQtyDataMethod?: string;
  reworkQtyDataMethod?: string;
  downtimeDataMethod?: string;
  breaktimeDataMethod?: string;
  laborDataMethod?: string;
}

export interface DowntimeDataDto extends AuditedEntityDto<string> {
  workCenterId?: string;
  productName?: string;
  workCenterName?: string;
  recordTimestamp?: string;
  downtime?: number;
  workOrder?: string;
  productId?: string;
  globalDowntimeCodeId?: string;
  localDowntimeReasonId?: string;
  localDowntimeReason?: string;
  localDowntimeReasonDisplayName?: string;
  globalDowntimeCode?: string;
  refSourceId?: string;
  tenantId?: string;
  createBy?: string;
  lastModifiedBy?: string;
  isPlanned?: string;
  isCosted?: string;
  operation?: string;
  productFamilyId?: string;
  productSerieId?: string;
}

export interface DowntimeDataGetListInput extends PagedAndSortedResultRequestDto {
  areas: string[];
  cells: string[];
  workCenters: string[];
  recordStartTimestamp?: string;
  recordEndTimestamp?: string;
  downtime?: number;
  workOrder?: string;
  productId?: string;
  globalDowntimeCodeId?: string;
  localDowntimeReasonId?: string;
  refSourceId?: string;
}

export interface ExportAreaSettingDto {
  area?: string;
  displayName?: string;
  yearlyInternalQNsTarget?: number;
  yearlyExternalQNsTarget?: number;
  unsafeConditionTarget?: number;
  planActualDiffTol?: number;
  fpyTargetTol?: number;
  sppmTargetTol?: number;
  machineCOPQTarget?: number;
  machineCOPQTargetTol?: number;
  poeeTarget?: number;
  poeeTargetTol?: number;
  performanceTargetTol?: number;
  udtTargetTol?: number;
  laborCOPQTarget?: number;
  laborCOPQTargetTol?: number;
  oleTarget?: number;
  oleTargetTol?: number;
  upphTargetTol?: number;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
  costCenter?: string;
  kpiReviewType?: string;
}

export interface ExportCellSettingDto {
  cell?: string;
  displayName?: string;
  kpiReviewType?: string;
  qualityReviewType?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportIntegrationSettingDto {
  name?: string;
  displayName?: string;
  description?: string;
  databaseName?: string;
  productionQtyDataMethod?: string;
  goodQtyStoredProc?: string;
  scrapQtyDataMethod?: string;
  scrapQtyStoredProc?: string;
  reworkQtyDataMethod?: string;
  reworkQtyStoredProc?: string;
  downtimeDataMethod?: string;
  downtimeStoredProc?: string;
  breaktimeDataMethod?: string;
  breaktimeStoredProc?: string;
  laborStoredProc?: string;
  laborDataMethod?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportProductDto {
  name: string;
  displayName?: string;
  description?: string;
  productFamily?: string;
  productSeries?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface ExportWorkCenterSettingDto {
  workCenter?: string;
  displayName?: string;
  description?: string;
  dataIntegrationSetting?: string;
  kpi?: string;
  goodQtyOption?: string;
  scrapQtyOption?: string;
  fpyTarget?: number;
  sppmTarget?: number;
  performanceTarget?: number;
  upphTarget?: number;
  udtTarget?: number;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface GlobalScrapCodeDto extends NameObjectDto<string> {
}

export interface GlobalScrapCodeGetListInput extends GetNameObjectInput {
}

export interface LaborDataDto extends AuditedEntityDto<string> {
  workCenterId?: string;
  productName?: string;
  workCenterName?: string;
  recordTimestamp?: string;
  workOrder?: string;
  productId?: string;
  staffNeeded?: number;
  staffActual?: number;
  refSourceId?: string;
  tenantId?: string;
  createBy?: string;
  lastModifiedBy?: string;
  operation?: string;
  productFamilyId?: string;
  productSerieId?: string;
}

export interface LaborDataGetListInput extends PagedAndSortedResultRequestDto {
  areas: string[];
  cells: string[];
  workCenters: string[];
  recordStartTimestamp?: string;
  recordEndTimestamp?: string;
  workOrder?: string;
  productId?: string;
  staffNeeded?: number;
  staffActual?: number;
  refSourceId?: string;
}

export interface ProductDto extends NameObjectDto<string> {
  productFamilyId?: string;
  productFamilyName?: string;
  productSerieId?: string;
  productSerieName?: string;
}

export interface ProductFamilyDto extends NameObjectDto<string> {
}

export interface ProductFamilyGetListInput extends GetNameObjectInput {
  ids: string[];
}

export interface ProductGetListInput extends GetNameObjectInput {
  productFamilyId?: string;
}

export interface ProductSerieDto extends NameObjectDto<string> {
}

export interface ProductSerieGetListInput extends GetNameObjectInput {
  ids: string[];
}

export interface ProductionDataDto extends AuditedEntityDto<string> {
  workCenterId?: string;
  productName?: string;
  productDisplayName?: string;
  workCenterName?: string;
  recordTimestamp?: string;
  workOrder?: string;
  productId?: string;
  plannedQty?: number;
  baseQty?: number;
  producedQty?: number;
  refSourceId?: string;
  tenantId?: string;
  createBy?: string;
  lastModifiedBy?: string;
  productFamilyId?: string;
  productFamilyName?: string;
  productSerieId?: string;
  productSerieName?: string;
  operation?: string;
}

export interface ProductionDataGetListInput extends PagedAndSortedResultRequestDto {
  areas: string[];
  cells: string[];
  workCenters: string[];
  recordStartTimestamp?: string;
  recordEndTimestamp?: string;
  workOrder?: string;
  productId?: string;
  plannedQty?: number;
  baseQty?: number;
  producedQty?: number;
  refSourceId?: string;
}

export interface ReworkDataDto extends AuditedEntityDto<string> {
  workCenterId?: string;
  recordTimestamp?: string;
  productName?: string;
  workCenterName?: string;
  workOrder?: string;
  productId?: string;
  reworkQty?: number;
  refSourceId?: string;
  tenantId?: string;
  createBy?: string;
  lastModifiedBy?: string;
  operation?: string;
  productFamilyId?: string;
  productSerieId?: string;
}

export interface ReworkDataGetListInput extends PagedAndSortedResultRequestDto {
  areas: string[];
  cells: string[];
  workCenters: string[];
  recordStartTimestamp?: string;
  recordEndTimestamp?: string;
  workOrder?: string;
  productId?: string;
  reworkQty?: number;
  refSourceId?: string;
}

export interface ScrapDataByRangeDto {
  scrapQty?: number;
  globalScrapCodeId?: string;
  localScrapReasonId?: string;
  localScrapReason?: string;
  globalScrapCode?: string;
}

export interface ScrapDataDto extends AuditedEntityDto<string> {
  workCenterId?: string;
  productName?: string;
  workCenterName?: string;
  recordTimestamp?: string;
  workOrder?: string;
  productId?: string;
  scrapQty?: number;
  globalScrapCodeId?: string;
  localScrapReasonId?: string;
  localScrapReason?: string;
  globalScrapCode?: string;
  refSourceId?: string;
  tenantId?: string;
  createBy?: string;
  lastModifiedBy?: string;
  operation?: string;
  productFamilyId?: string;
  productSerieId?: string;
}

export interface ScrapDataGetListInput extends PagedAndSortedResultRequestDto {
  areas: string[];
  cells: string[];
  workCenters: string[];
  recordStartTimestamp?: string;
  recordEndTimestamp?: string;
  workOrder?: string;
  productId?: string;
  scrapQty?: number;
  globalScrapCodeId?: string;
  localScrapReasonId?: string;
  refSourceId?: string;
}

export interface WorkCenterListDto {
  method?: string;
  type?: string;
  databaseName?: string;
  storedProcName?: string;
  workCenterList: string[];
}

export interface WorkCenterListGetInputDto {
  method?: string;
  type?: string;
  databaseName?: string;
  site?: string;
}

export interface WorkCenterSettingDto extends NameObjectDto<string> {
  workCenterId?: string;
  workCenterName?: string;
  workCenterDisplayName?: string;
  dataIntegrationSettingId?: string;
  dataIntegrationSettingName?: string;
  kpi?: string;
  goodQtyOption?: string;
  scrapQtyOption?: string;
  fpyTarget?: number;
  sppmTarget?: number;
  performanceTarget?: number;
  upphTarget?: number;
  udtTarget?: number;
}

export interface WorkCenterSettingGetListInput extends GetNameObjectInput {
  workCenterId?: string;
  dataIntegrationSettingId?: string;
  kpi?: string;
  goodQtyOption?: string;
  scrapQtyOption?: string;
  fpyTarget?: number;
  sppmTarget?: number;
  performanceTarget?: number;
  upphTarget?: number;
  udtTarget?: number;
}

export interface WorkOrderDataDto extends AuditedEntityDto<string> {
  workCenterId?: string;
  recordTimestamp?: string;
  workOrder?: string;
  workOrderQty?: number;
  productId?: string;
  productName?: string;
  workCenterName?: string;
  uph?: number;
  staffNeeded?: number;
  tenantId?: string;
  baseQty?: number;
  operation?: string;
}

export interface WorkOrderDataGetListInput extends PagedAndSortedResultRequestDto {
  workCenterId?: string;
  recordTimestamp?: string;
  workOrder?: string;
  workOrderQty?: number;
  productId?: string;
  uph?: number;
  staffNeeded?: number;
}
