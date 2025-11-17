import { PagedAndSortedResultRequestDto } from "@abp/ng.core";

export interface CreateDomesticGuestDto {
    fullName?: string;
    company?: string;
    department?: string;
    email?: string;
    purpose?: string;
    workDate?: string;
    tenantId?: string;
    tenantName?: string;
}

export interface DomesticGuestDto {
    fullName?: string;
    company?: string;
    department?: string;
    email?: string;
    purpose?: string;
    workDate?: string;
    tenantId?: string;
}

export interface DomesticGuestGetListDto extends PagedAndSortedResultRequestDto {
    fullName?: string;
    company?: string;
    department?: string;
    workDate?: string;
}