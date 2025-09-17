import { mapEnumToOptions } from '@abp/ng.core';

export enum FileType {
    Json = 0,
    Excel = 1,
}

export const fileTypeOptions = mapEnumToOptions(FileType);
