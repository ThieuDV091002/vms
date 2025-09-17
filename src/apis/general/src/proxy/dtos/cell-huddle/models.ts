
export interface CellFPYDto {
  date?: string;
  area?: string;
  cell?: string;
  dailyFPY: number;
  dailyFPYTarget: number;
}

export interface CellFPYEnhancedDto {
  date?: string;
  dailyFPY: number;
  dailyFPYTarget: number;
  dailyFPYKPI: number;
}

export interface CellHuddleEnhancedGetInput {
  areas: string[];
  cells: string[];
  startDate?: string;
  endDate: string;
}

export interface CellHuddleGetInput {
  cell: string;
  startDate: string;
  endDate: string;
}

export interface CellPerformanceDto {
  date?: string;
  area?: string;
  cell?: string;
  dailyPerformance: number;
  dailyPerformanceTarget: number;
}

export interface CellPerformanceEnhancedDto {
  date?: string;
  dailyPerformance: number;
  dailyPerformanceTarget: number;
  dailyPerformanceKPI: number;
}

export interface CellSPPMDto {
  date?: string;
  area?: string;
  cell?: string;
  dailySPPM: number;
  dailySPPMTarget: number;
}

export interface CellSPPMEnhancedDto {
  date?: string;
  dailySPPM: number;
  dailySPPMTarget: number;
  dailySPPMKPI: number;
}

export interface CellUPPHDto {
  date?: string;
  area?: string;
  cell?: string;
  dailyUPPH: number;
  dailyUPPHTarget: number;
}

export interface CellUPPHEnhancedDto {
  date?: string;
  dailyUPPH: number;
  dailyUPPHTarget: number;
  dailyUPPHKPI: number;
}

export interface CellUnplannedDowntimePercentageDto {
  date?: string;
  area?: string;
  cell?: string;
  dailyUnplannedDowntimePercentage: number;
  dailyUnplannedDowntimePercentageTarget: number;
}

export interface CellUnscheduledDowntimeDto {
  date?: string;
  area?: string;
  cell?: string;
  dailyUnplannedDowntime: number;
  dailyUnplannedDowntimeTarget: number;
}

export interface CellUnscheduledDowntimeEnhancedDto {
  date?: string;
  dailyUnplannedDowntime: number;
  dailyUnplannedDowntimeTarget: number;
  dailyUnplannedDowntimeKPI: number;
}
