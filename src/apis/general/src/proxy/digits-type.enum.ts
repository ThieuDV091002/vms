import { mapEnumToOptions } from '@abp/ng.core';

export enum DigitsType {
  Decimalism = 0,
  Hexadecimal = 1,
  Base34 = 2,
  Base36 = 3,
}

export const digitsTypeOptions = mapEnumToOptions(DigitsType);
