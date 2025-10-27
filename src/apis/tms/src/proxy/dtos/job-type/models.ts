import type { EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface JobTypeDto extends EntityDto<string> {
    jobName?: string;
}

export interface JobTypeDetailDto {
    jobTypeId?: string;
    jobTypeName?: string;
    sections: JobSectionDto[];
    textFields: JobTextFieldDto[];
}

export interface JobSectionDto {
    jobSectionId?: string;
    name?: string;
    options: JobOptionDto[];
}

export interface JobOptionDto {
    jobOptionId?: string;
    name?: string;
}

export interface JobTextFieldDto {
    jobTextFieldId?: string;
    field?: string;
    isRequired: boolean;
}