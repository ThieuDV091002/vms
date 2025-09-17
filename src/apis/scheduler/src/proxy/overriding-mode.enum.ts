import { mapEnumToOptions } from '@abp/ng.core';

export enum OverridingMode {
  Skip = 0,
  Abort = 1,
  Overwrite = 2,
}

export const overridingModeOptions = mapEnumToOptions(OverridingMode);
