import { mapEnumToOptions } from '@abp/ng.core';

export enum ActivityCardSummaryFilterType {
  NoUpdate = 0,
  Open21Days = 1,
  TaskOverdue = 2,
  UnassignedTasks = 3,
  MissingDueDate = 4,
}

export const activityCardSummaryFilterTypeOptions = mapEnumToOptions(ActivityCardSummaryFilterType);
