
export interface AreaAvailabilityDto {
  date?: string;
  area?: string;
  cell?: string;
  dailyAvailability?: number;
  dailyAvailabilityTarget?: number;
  dailyAvailabilityTolerance?: number;
}

export interface AreaAvailabilityEnhancedDto extends AreaAvailabilityDto {
  dailyAvailabilityKpi?: number;
}

export interface AreaFPYDto {
  date?: string;
  area?: string;
  cell?: string;
  dailyFPY?: number;
  dailyFPYTarget?: number;
  dailyFPYTolerance?: number;
}

export interface AreaFPYEnhancedDto extends AreaFPYDto {
  dailyFPYKPI: number;
}

export interface AreaHuddleByCellGetEnhancedInput extends AreaHuddleEnhancedGetInput {
  isByCell: boolean;
}

export interface AreaHuddleByCellGetInput {
  area: string;
  startDate: string;
  endDate: string;
  isByCell: boolean;
}

export interface AreaHuddleEnhancedGetInput {
  areas: string[];
  cells: string[];
  startDate: string;
  endDate: string;
}

export interface AreaHuddleGetInput {
  area: string;
  startDate: string;
  endDate: string;
}

export interface AreaPerformanceDto {
  date?: string;
  area?: string;
  cell?: string;
  dailyPerformance?: number;
  dailyPerformanceTarget?: number;
  dailyPerformanceTolerance?: number;
}

export interface AreaPerformanceEnhancedDto extends AreaPerformanceDto {
  dailyPerformanceKpi?: number;
}

export interface AreaSPPMDto {
  date?: string;
  area?: string;
  cell?: string;
  dailySPPM?: number;
  dailySPPMTarget?: number;
  dailySPPMTolerance?: number;
}

export interface AreaSPPMEhnancedDto extends AreaSPPMDto {
  dailySPPMKpi?: number;
}

export interface AreaUPPHDto {
  date?: string;
  area?: string;
  cell?: string;
  dailyUPPH?: number;
  dailyUPPHTarget?: number;
  dailyUPPHTolerance?: number;
}

export interface AreaUPPHEnhancedDto extends AreaUPPHDto {
  dailyUPPHKpi?: number;
}

export interface COPQDto {
  date?: string;
  area?: string;
  dailyCOPQ?: number;
  dailyCOPQPerHour?: number;
  dailyCOPQTarget?: number;
  dailyCOPQTolerance?: number;
}

export interface COPQEnhancedDto {
  date?: string;
  kpiReviewType?: string;
  dailyCOPQ?: number;
  dailyCOPQPerHour?: number;
  dailyCOPQTarget?: number;
  dailyCOPQKPI: number;
}

export interface POEEDto {
  date?: string;
  area?: string;
  cell?: string;
  dailyPOEE?: number;
  dailyPOEETarget?: number;
  dailyPOEETargetTol?: number;
}

export interface POEEEnhancedDto {
  date?: string;
  area?: string;
  cell?: string;
  dailyPOEE?: number;
  dailyPOEETarget?: number;
  dailyPOEETargetTol?: number;
  dailyPOEEKpi: number;
}

export interface QNDto {
  qnType?: string;
  yearlyTarget?: number;
  yearToDateTotal: number;
  monthToDateTotal?: number;
  openCount?: number;
}

export interface SafetyIncidentDto {
  noOfYTDIncidents?: number;
  noOfDaysSinceLastIncidents?: number;
}

export interface UnsafeConditionDto {
  date?: string;
  area?: string;
  cell?: string;
  targetCount?: number;
  toleranceCount?: number;
}
