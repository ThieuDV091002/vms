
export interface RoleAppService_CompareRolePermissionDto {
  roleName?: string;
  missingPermissions: string[];
  extraPermissions: string[];
}
