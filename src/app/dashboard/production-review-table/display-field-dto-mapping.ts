import { ProductionReviewDetailDataDto } from "@apis/general/dtos/production-review";

export interface FieldMapping {
  prop: keyof ProductionReviewDetailDataDto | null;
  dataType: 'number-0' | 'number-1' | 'number-2' | 'percentage-0' | 'percentage-1' | 'text';
}

export const displayFieldDtoMapping: Record<string, FieldMapping> = {
  '::LABEL_StartTime': { prop: 'startTime', dataType: 'text' },
  '::LABEL_EndTime': { prop: 'endTime', dataType: 'text' },
  '::LABEL_Shift': { prop: null, dataType: 'text' },

  '::Label_StaffNeeded': { prop: 'staffNeeded', dataType: 'number-0' },
  '::Label_StaffActual': { prop: 'staffActual', dataType: 'number-0' },

  '::LABEL_WorkCenter': { prop: 'workCenterName', dataType: 'text' },
  '::LABEL_Product': { prop: 'productName', dataType: 'text' },
  '::Label_WorkOrder': { prop: 'workOrder', dataType: 'text' },
  '::LABEL_Operation': { prop: 'operation', dataType: 'text' },

  '::LABEL_Plan': { prop: 'plannedQty', dataType: 'number-0' }, 
  '::LABEL_Actual': { prop: 'actualQty', dataType: 'number-0' },
  '::LABEL_Diff': { prop: 'difference', dataType: 'number-1' }, 
  '::LABEL_CumDiff': { prop: 'cumulativeDifferenceQty', dataType: 'number-1' },
  '::Label_PlannedQty': { prop: 'plannedQty', dataType: 'number-0' },       
  '::LABEL_ActualQty': { prop: 'actualQty', dataType: 'number-0' },         
  '::LABEL_Difference': { prop: 'difference', dataType: 'number-1' },       

  '::LABEL_UPPH': { prop: 'upph', dataType: 'number-0' },       
  '::LABEL_PerformancePercentage': { prop: 'performancePercentage', dataType: 'percentage-0' },
  '::LABEL_POEE': { prop: 'poee', dataType: 'percentage-1' },                

  '::LABEL_PlannedDowntimeMinutes': { prop: null, dataType: 'number-0' },    
  '::LABEL_UnplannedDowntimeMinutes': { prop: null, dataType: 'number-0' },  
  '::LABEL_PlannedDowntimeHours': { prop: 'plannedDowntimeHours', dataType: 'number-1' },    
  '::LABEL_UnplannedDowntimeHours': { prop: 'unplannedDowntimeHours', dataType: 'number-1' },
  '::LABEL_DowntimePercentage': { prop: 'downtimePercentage', dataType: 'percentage-0' },   
  '::LABEL_AvailabilityPercentage': { prop: 'availabilityPercentage', dataType: 'percentage-0' },

  '::LABEL_ScrapQty': { prop: 'scrapQty', dataType: 'number-0' },            
  '::Label_ReworkQty': { prop: 'reworkQty', dataType: 'number-0' },          
  '::LABEL_CellSettingScrapPPM': { prop: 'sppm', dataType: 'number-2' },
  '::LABEL_QualityPercentage': { prop: 'qualityPercentage', dataType: 'percentage-1' },
};