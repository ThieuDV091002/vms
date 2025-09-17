import { mapEnumToOptions } from '@abp/ng.core';

export enum AccessLevelType {
  GeneralUser = 1,
  Operator = 2,
  CellSupervisor = 3,
  AreaSupervisor = 4,
  DepartmentOperations = 5,
  SiteOperations = 6,
  SiteAdmin = 7,
  DivisionAccess = 8,
  CorporateAccess = 9,
  SystemAdministrator = 10,
}

export const accessLevelTypeOptions = mapEnumToOptions(AccessLevelType);
