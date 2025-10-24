import type { EntityDto, ExtensibleAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { DateTimeAdapter } from '@abp/ng.theme.shared';

export interface FlightInfoDto extends EntityDto<string>{
    date?: DateTimeAdapter;
    no?: string;
    route?: string;
    time?: DateTimeAdapter;
}

export interface CreateFlightInfoDto{
    date?: DateTimeAdapter;
    no?: string;
    route?: string;
    time?: DateTimeAdapter;
}

export interface TransportInfoDto extends EntityDto<string>{
    isAirportTransport?: boolean;
    isDailyTransport?: boolean;
    time?: DateTimeAdapter;
    route?: string;
    address?: string;
}

export interface CreateTransportInfoDto {
    isAirportTransport?: boolean;
    isDailyTransport?: boolean;
    time?: DateTimeAdapter;
    route?: string;
    address?: string;
}

export interface UniformInfoDto extends EntityDto<string> {
    isVisitFactory?: boolean;
    cameraCover?: number;
    cardType?: number;
    uniformType?: number;
}

export interface CreateUniformInfoDto {
    isVisitFactory?: boolean;
    cameraCover?: number;
    cardType?: number;
    uniformType?: number;
}

export interface GuestInfoDto extends ExtensibleAuditedEntityDto<string> {
    fullName?: string;
    company?: string;
    title?: string;
    purpose?: string;
    workWithWhomInMolex?: string;
    isHotelSupport?: boolean;
    hotelId?: string;
    hotelName?: string;
    roomType?: string;
    isFoodRestrict?: boolean;
    foodRestrictDetail?: string;
    otherRequest?: string;
    flightInfos?: FlightInfoDto[];
    transportInfo?: TransportInfoDto;
    uniformInfo?: UniformInfoDto;
    tenantId?: string;
    tenantName?: string;
    creator?: string;
    lastModifier?: string;
}

export interface CreateGuestInfoDto {
    fullName?: string;
    company?: string;
    title?: string;
    purpose?: string;
    workWithWhomInMolex?: string;
    isHotelSupport?: boolean;
    hotelId?: string;
    hotelName?: string;
    roomType?: string;
    isFoodRestrict?: boolean;
    foodRestrictDetail?: string;
    otherRequest?: string;
    flightInfos?: CreateFlightInfoDto[];
    transportInfo?: CreateTransportInfoDto;
    uniformInfo?: CreateUniformInfoDto;
    tenantId?: string;
    tenantName?: string;
}

export interface GuestInfoListDto extends EntityDto<string> {
    fullName?: string;
    company?: string;
    title?: string;
    purpose?: string;
    workWithWhomInMolex?: string;
}

export interface GuestInfoGetListInput extends PagedAndSortedResultRequestDto{
    keyword?: string;
}