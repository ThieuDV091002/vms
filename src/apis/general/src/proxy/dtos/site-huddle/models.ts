
export interface COPQByReasonDto {
  reason?: string;
  copq: number;
}

export interface GetCOPQByReasonsInput {
  siteId: string;
  startDate: string;
  endDate: string;
  areaIds: string[];
}

export interface GetCOPQByReasonsOutput {
  copqList: COPQByReasonDto[];
}

export interface MonthlyTargetDto {
  year: number;
  month: number;
  monthlyTarget: number;
}

export interface SafetyIncidentDailyDto {
  currentMonthTarget?: number;
  mtdActual?: number;
  last24Hours?: number;
  dailyList: SafetyIncidentDailyItemDto[];
}

export interface SafetyIncidentDailyItemDto {
  date?: string;
  dailyIncidents?: number;
}

export interface SafetyIncidentMonthlyItemDto {
  year: number;
  month: number;
  monthlyIncidents?: number;
  monthlyTarget?: number;
}

export interface SiteAssetProdMonthlyDto {
  ytdActual?: number;
  ytdTarget?: number;
  assetProdList: SiteAssetProdMonthlyItemDto[];
}

export interface SiteAssetProdMonthlyItemDto {
  date?: string;
  monthlyAssetProd?: number;
  monthlyTarget?: number;
}

export interface SiteCOPQMonthlyDto {
  ytdTarget?: number;
  ytdActual?: number;
  copqList: SiteCOPQMonthlyItemDto[];
}

export interface SiteCOPQMonthlyItemDto {
  year: number;
  month: number;
  monthlyCOPQ?: number;
  monthlyCOPQPerCOGS?: number;
  monthlyTarget?: number;
  monthlyCOPQPerCOGSTarget?: number;
  monthlyCOGS?: number;
}

export interface SiteCopqDailyDto {
  date?: string;
  area?: string;
  areaDisplayName?: string;
  areaKPIReviewType?: string;
  dailyCOPQ?: number;
  dailyCOPQPerHour?: number;
}

export interface SiteCopqDto {
  currentMonthTarget?: number;
  mtdActual?: number;
  dailyList: SiteCopqDailyDto[];
}

export interface SiteHuddleAssetProdGetInput {
  siteId: string;
  startDate: string;
  endDate: string;
}

export interface SiteHuddleCOPQMonthlyGetInput {
  siteId: string;
  areaIds: string[];
  startDate: string;
  endDate: string;
}

export interface SiteHuddleGetInput {
  siteId: string;
  areaId?: string;
  startDate: string;
  endDate: string;
}

export interface SiteHuddleOEEGetInput {
  siteId: string;
  startDate: string;
  endDate: string;
}

export interface SiteHuddlePOEEGetInput {
  siteId: string;
  startDate: string;
  endDate: string;
}

export interface SiteHuddlePeopleProdGetInput {
  siteId: string;
  startDate: string;
  endDate: string;
}

export interface SiteHuddleQNGetInput {
  siteId: string;
  areaId?: string;
  startDate: string;
  endDate: string;
  type: string;
}

export interface SiteHuddleQNWithoutAreaGetInput {
  siteId: string;
  startDate: string;
  endDate: string;
  type: string;
}

export interface SiteHuddleWithWorkCenterGetInput {
  workCenterId: string;
  startDate: string;
  endDate: string;
}

export interface SiteHuddleWithoutAreaGetInput {
  siteId: string;
  startDate: string;
  endDate: string;
}

export interface SiteMonthlyTargetDto {
  ytdTarget: number;
  targetList: MonthlyTargetDto[];
}

export interface SiteMonthlyTargetGetInput {
  siteId: string;
  targetType: string;
  startDate: string;
  endDate: string;
}

export interface SiteOEEMonthlyDto {
  ytdActual?: number;
  ytdTarget?: number;
  oeeList: SiteOEEMonthlyItemDto[];
}

export interface SiteOEEMonthlyItemDto {
  year: number;
  month: number;
  monthlyOEE?: number;
  monthlyTarget?: number;
  goodQty?: number;
  scrapQty?: number;
  planRunHours?: number;
  actualRunHours?: number;
  monthCalHours?: number;
  workCenterCount?: number;
}

export interface SitePOEEMonthlyDto {
  ytdActual?: number;
  ytdTarget?: number;
  poeeList: SitePOEEMonthlyItemDto[];
}

export interface SitePOEEMonthlyItemDto {
  date?: string;
  monthlyPOEE?: number;
  monthlyTarget?: number;
  goodQty?: number;
  scrapQty?: number;
  planRunHours?: number;
  actualRunHours?: number;
  downtimeHours?: number;
}

export interface SitePeopleProdMonthlyDto {
  ytdActual?: number;
  ytdTarget?: number;
  peopleProdList: SitePeopleProdMonthlyItemDto[];
}

export interface SitePeopleProdMonthlyItemDto {
  year: number;
  month: number;
  monthlyPeopleProd?: number;
  monthlyTarget?: number;
}

export interface SitePoeeDailyDto {
  date?: string;
  dailyPOEE?: number;
  target?: number;
}

export interface SiteQNDailyDto {
  currentMonthTarget?: number;
  mtdActual?: number;
  last24Hours?: number;
  dailyList: SiteQNDailyItemDto[];
}

export interface SiteQNDailyItemDto {
  date?: string;
  areaName?: string;
  areaDisplayName?: string;
  workCenterName?: string;
  dailyQN?: number;
}

export interface SiteQNMonthlyDto {
  ytdTarget?: number;
  ytdActual?: number;
  last30Days?: number;
  dailyList: SiteQNMonthlyItemDto[];
}

export interface SiteQNMonthlyItemDto {
  year: number;
  month: number;
  monthlyQN?: number;
  monthlyTarget?: number;
}

export interface SiteSafetyIncidenMonthlytDto {
  ytdTarget?: number;
  ytdActual?: number;
  last30Days?: number;
  dailyList: SafetyIncidentMonthlyItemDto[];
}
