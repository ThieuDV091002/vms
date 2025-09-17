import { mapEnumToOptions } from '@abp/ng.core';

export enum SiteSettingTargetType {
  SafetyIncidents = 0,
  NearMisses = 1,
  ExternalQNs = 2,
  InternalQNs = 3,
  COPQ = 4,
  COPQCOGS = 5,
  PeopleProd = 6,
  AssetProd = 7,
  OEE = 8,
  POEE = 9,
}

export const siteSettingTargetTypeOptions = mapEnumToOptions(SiteSettingTargetType);
