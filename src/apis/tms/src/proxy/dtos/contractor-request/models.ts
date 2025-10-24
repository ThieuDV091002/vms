import type { EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { DateTimeAdapter } from '@abp/ng.theme.shared';

export interface ContractorRequestDto extends ExtensibleAuditedEntityDto<string> {
    molexSupervisorName: string;
    contractorName: string;
    contractorSupervisorPhone: string;
    contractorSupervisorName: string;
    workingArea: string;
    startDate: string;
    endDate: string;
    employeeNumber: number;
    workDescription: string;
    oldWorkPermitCode: string;
    workPermitCode: string;
    molexSupervisorEmail: string;
    contractorEmail: string;
    requestType: number;
    molexSupervisorApproveStatus: number;
    ehsApproveStatus: number;
    employeeLists: EmployeeListDto[];
    files: ContarctorRequestFileDto[];
    selections: RequestSelectionDto[];
    textFieldValues: JobTextFieldValueDto[];
    tenantId?: string;
    tenantName?: string;
    creator?: string;
    lastModifier?: string;
}

export interface ContractorRequestListDto {
  contractorRequestId: string;
  contractorName: string;
  workPermitCode?: string;
  workingArea?: string;
  startDate?: DateTimeAdapter;
  endDate?: DateTimeAdapter;
  contractorRequestType: number;
  molexSupervisorApproveStatus: number;
  ehsApproveStatus: number
}

export interface RequestSelectionDto extends EntityDto<string> {
  contractorRequestId: string;
  jobTypeId: string;
  jobTypeName: string;
  jobSectionId: string;
  jobSectionName: string;
  jobOptionId: string;
  jobOptionName: string;
}

export interface JobTextFieldValueDto extends EntityDto<string> {
  contractorRequestId: string;
  jobTypeId: string;
  jobTypeName: string;
  jobTextFieldId: string;
  textField: string;
  value: string;
}

export interface EmployeeListDto {
  id: string;
  contractorRequestId: string;
  fullName: string;
  dateOfBirth: string;
  company: string;
  passport: string;
  managementDepartment: string;
  molexSupervisor: string;
}

export interface ContarctorRequestFileDto {
  id: string;
  contractorRequestId: string;
  fileName: string;
  fileUrl: string;
  fileType: number;
}

export interface CreateContractorRequestDto {
  tenantId?: string;
  requestType: number;
  molexSupervisorName?: string;
  contractorName: string;
  contractorSupervisorPhone?: string;
  contractorSupervisorName?: string;
  workingArea?: string;
  startDate?: string;
  endDate: string;
  employeeNumber?: number;
  workDescription?: string;
  oldWorkPermitCode?: string;
  molexSupervisorEmail: string;
  contractorEmail: string;
  selectionsJson?: string;
  selections?: CreateSelectionsDto;
  textFieldValuesJson?: string;
  textFieldValues?: CreateJobTextFieldValueDto[];
  employeeListsJson?: string;
  employeeLists?: CreateEmployeeListDto[];
  employeeListFile?: File;
  documentFiles?: File[];
}

export interface CreateJobTextFieldValueDto {
  jobTypeId: string;
  jobTypeName: string;
  jobTextFieldId: string;
  textField: string;
  value: string;
}

export interface CreateSelectionsDto {
  jobTypeId?: string;
  jobTypeName?: string;
  sections: SectionSelectionDto[];
}

export interface SectionSelectionDto {
  jobSectionId: string;
  jobSectionName: string;
  options: OptionSelectionDto[];
}

export interface OptionSelectionDto {
  jobOptionId: string;
  jobOptionName: string;
}

export interface CreateEmployeeListDto {
  fullName: string;
  dateOfBirth: string;
  company: string;
  passport: string;
  managementDepartment: string;
  molexSupervisor: string;
}

export interface ContractorRequestGetListInput extends PagedAndSortedResultRequestDto{
    contractorName?: string;
}