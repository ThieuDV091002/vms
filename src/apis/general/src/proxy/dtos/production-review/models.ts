import type { KpiApiFilterBase, KpiFilterBase } from '../kpi/models';

export interface GroupKey {
  keyName?: string;
  keyValue?: string;
  isFilterNull: boolean;
}

export interface LaborFocusBaseDto {
  data: LaborFocusDto[];
}

export interface LaborFocusDto {
  productGroupingName?: string;
  productGroupingId?: string;
  productName?: string;
  productId?: string;
  workOrder?: string;
  operation?: string;
  workCenterName?: string;
  workCenterDisplayName?: string;
  workCenterId?: string;
  incrementStartTime?: string;
  incrementEndTime?: string;
  shiftName?: string;
  shiftDisplayName?: string;
  isShiftInfoOnly: boolean;
  isNoOrder: boolean;
  staffNeeded?: number;
  staffActual?: number;
  plannedQty?: number;
  producedQty?: number;
  differenceQty?: number;
  cumulativeDifferenceQty?: number;
  scrapQty?: number;
  reworkQty?: number;
  upph?: number;
  upphKpi?: string;
  plannedDowntimeMinutes?: number;
  unplannedDowntimeMinutes?: number;
  unplannedDowntimeKpi?: string;
  unplannedDowntimePercentage?: number;
}

export interface LaborFocusL1Dto extends LaborFocusBaseDto {
  total: LaborFocusDto;
}

export interface LaborFocusL1Filter extends KpiApiFilterBase {
  shiftPatternId?: string;
  mode?: string;
}

export interface LaborFocusL2Dto extends LaborFocusBaseDto {
  productGroupingName?: string;
}

export interface LaborFocusL2Filter extends KpiApiFilterBase {
  mode?: string;
  productGroupingId?: string;
  incrementStartTime?: string;
  incrementEndTime?: string;
  referenceId?: string;
  isNoOrder: boolean;
}

export interface LaborFocusL3Dto extends LaborFocusBaseDto {
  productGroupingName?: string;
  workCenterName?: string;
}

export interface LaborFocusL3Filter extends KpiApiFilterBase {
  incrementStartTime?: string;
  incrementEndTime?: string;
  productGroupingId?: string;
  mode?: string;
  productId?: string;
  hasWorkOrderFilter: boolean;
  workOrder?: string;
  operation?: string;
  referenceId?: string;
  isNoOrder: boolean;
}

export interface MachineFocusDto {
  productGroupingName?: string;
  productGroupingId?: string;
  workCenterName?: string;
  workCenterDisplayName?: string;
  workCenterId?: string;
  productName?: string;
  workOrder?: string;
  operation?: string;
  isNoOrder: boolean;
  plannedQty?: number;
  actualQty?: number;
  differenceQty?: number;
  performancePercentage?: number;
  performanceKpi?: string;
  plannedDowntimeHours?: number;
  unplannedDowntimeHours?: number;
  breakTimeHours?: number;
  unplannedDowntimePercentage?: number;
  downtimePercentage?: number;
  udtKpi?: string;
  availabilityPercentage?: number;
  scrapQty?: number;
  scrapPPM?: number;
  scrapPPMKpi?: string;
  qualityPercentage?: number;
  qualityKpi?: string;
  poee?: number;
  poeeKpi?: string;
  baseQty?: number;
  availableHours?: number;
  actualRunHours?: number;
  cycleTime?: number;
  plannedRunHours?: number;
}

export interface MachineFocusL1Dto {
  data: MachineFocusDto[];
  total: MachineFocusDto;
}

export interface MachineFocusL1Filter extends KpiApiFilterBase {
  mode?: string;
}

export interface MachineFocusL2Dto {
  productGroupingName?: string;
  data: MachineFocusDto[];
}

export interface MachineFocusL2Filter extends KpiApiFilterBase {
  mode?: string;
  productGroupingId?: string;
  referenceId?: string;
  isNoOrder: boolean;
}

export interface MachineFocusL3Dto {
  productGroupingName?: string;
  workCenterName?: string;
  data: MachineFocusDto[];
}

export interface MachineFocusL3Filter extends KpiApiFilterBase {
  productGroupingId?: string;
  mode?: string;
  workCenterId?: string;
  referenceId?: string;
  isNoOrder: boolean;
}

export interface ProductionReviewDetailDataDto {
  productId?: string;
  productName?: string;
  workCenterId?: string;
  workCenterName?: string;
  familySerialId?: string;
  familySerialName?: string;
  workOrder?: string;
  operation?: string;
  staffNeeded: number;
  staffActual: number;
  plannedQty: number;
  actualQty: number;
  scrapQty: number;
  reworkQty: number;
  plannedDowntimeHours: number;
  unplannedDowntimeHours: number;
  breakTimeHours: number;
  actualRunHours: number;
  plannedRunHours: number;
  workHours?: number;
  workCenterQty: number;
  startTime?: string;
  endTime?: string;
  difference?: number;
  cumulativeDifferenceQty?: number;
  performancePercentage?: number;
  downtimePercentage?: number;
  periodHours?: number;
  unplannedDowntimePercentage?: number;
  availabilityPercentage?: number;
  sppm?: number;
  qualityPercentage?: number;
  poee?: number;
  upph?: number;
  performanceTarget?: number;
  performanceTargetTol?: number;
  fpyTarget?: number;
  fpyTargetTol?: number;
  udtTargetTol?: number;
  udtTarget?: number;
  poeeTargetTol?: number;
  sppmTargetTol?: number;
  poeeTarget?: number;
  sppmTarget?: number;
  upphTarget?: number;
  performanceKpi?: string;
  udtKpi?: string;
  sppmKpi?: string;
  qualityKpi?: string;
  poeeKpi?: string;
}

export interface ProductionReviewDetailItemDto extends ProductionReviewDetailDataDto {
  groupKeys: Record<string, string>;
}

export interface ProductionReviewGeneralDataDto {
  productionReviewDetailItems: ProductionReviewDetailItemDto[];
  total: ProductionReviewDetailDataDto;
  workCenters: string[];
}

export interface ProductionReviewGeneralDataInput extends KpiFilterBase {
  shiftPatternId?: string;
  mode?: string;
  areaIds: string[];
  cellIds: string[];
  reviewType?: string;
  groupKeys: GroupKey[];
  shiftInterval: ShiftIntervalDto;
  isCalculateTotal: boolean;
}

export interface ShiftIntervalDto {
  startTime?: string;
  endTime?: string;
  shiftId?: string;
  shiftDisplayName?: string;
}
