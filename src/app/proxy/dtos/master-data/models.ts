
export interface AreaDto {
  id?: string;
  name?: string;
  site?: string;
}

export interface CellDto {
  id?: string;
  name?: string;
  area?: string;
}

export interface CorporateDto {
  id?: string;
  name?: string;
}

export interface DivisionDto {
  id?: string;
  name?: string;
  corporate?: string;
}

export interface SiteDto {
  id?: string;
  name?: string;
  division?: string;
}

export interface WorkCenterDto {
  id?: string;
  name?: string;
  cell?: string;
}
