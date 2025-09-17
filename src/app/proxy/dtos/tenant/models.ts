
export interface CreateUpdateTenantModelingDto {
  name?: string;
  displayName?: string;
  description?: string;
  displayLongText?: string;
  applicationId?: string;
  applicationName?: string;
  dataTierType?: string;
  dataTierId?: string;
  dataTierName?: string;
}

export interface ExportTenantDto {
  name?: string;
  displayName?: string;
  description?: string;
  displayLongText?: string;
  applicationId?: string;
  applicationName?: string;
  dataTierType?: string;
  dataTierId?: string;
  dataTierName?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface UpdateTenantPasswordDto {
  tenantId: string;
  password: string;
}
