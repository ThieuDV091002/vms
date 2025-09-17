import type { AccessLevelType } from '../../access-level-type.enum';

export interface ExportRoleModelingDto {
  name?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  menuName?: string;
  accessLevel?: AccessLevelType;
  permissions: string[];
}
