
export interface BreaktimeDataKpiFilter extends KpiFilterBase {
}

export interface DowntimeDataKpiApiFilter extends DowntimeDataKpiFilter {
  areaIds: string[];
  cellIds: string[];
}

export interface DowntimeDataKpiFilter extends KpiFilterBase {
  isPlanned?: boolean;
  isCosted?: boolean;
  excludeDowntimeReasonIds: string[];
}

export interface DowntimeMinutesDto {
  downtimeReason?: string;
  isPlanned?: string;
  minutes: number;
}

export interface FPYDto {
  date?: string;
  fpy: number;
  fpyTarget: number;
  fpyTargetTolerance: number;
  kpiResult?: string;
}

export interface KpiFilterBase {
  startDate?: string;
  endDate?: string;
  workCenterIds: string[];
  productSerieIds: string[];
  productFamilyIds: string[];
  productIds: string[];
  workOrders: string[];
  operations: string[];
}

export interface PerformanceDto {
  date?: string;
  performance: number;
  performanceTarget: number;
  performanceTargetTolerance: number;
  kpiResult?: string;
}

export interface ProductPerformanceDto {
  product?: string;
  performance: number;
  performanceGap: number;
}

export interface ProductionDataKpiApiFilter extends ProductionDataKpiFilter {
  areaIds: string[];
  cellIds: string[];
}

export interface ProductionDataKpiFilter extends KpiFilterBase {
}

export interface ReworkDataKpiFilter extends KpiFilterBase {
}

export interface SPPMDto {
  date?: string;
  sppm: number;
  sppmTarget: number;
  sppmTargetTolerance: number;
  kpiResult?: string;
}

export interface ScrapDataKpiApiFilter extends ScrapDataKpiFilter {
  areaIds: string[];
  cellIds: string[];
}

export interface ScrapDataKpiFilter extends KpiFilterBase {
  excludeScrapReasonIds: string[];
}

export interface ScrapQuantityDto {
  scrapReason?: string;
  qty: number;
}

export interface UDTDto {
  date?: string;
  udt: number;
  udtTarget: number;
  udtTargetTolerance: number;
  kpiResult?: string;
}

export interface UPPHDto {
  date?: string;
  upph: number;
  upphTarget: number;
  upphTargetTolerance: number;
  kpiResult?: string;
}

export interface KpiApiFilterBase extends KpiFilterBase {
  areaIds: string[];
  cellIds: string[];
}

export interface ProductionCalendarDto {
  data: ProductionSingleDateTimeDto[];
}

export interface ProductionSingleDateTimeDto {
  productionDateStartTimeLocalString?: string;
  productionDateEndTimeLocalString?: string;
  productionDateStartTimeUtc?: string;
  productionDateEndTimeUtc?: string;
}
