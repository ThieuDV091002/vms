import { Component, OnInit } from '@angular/core';
import { IdentityUserService, IdentityRoleDto } from '@abp/ng.identity/proxy';
import { ConfigStateService, ListResultDto } from '@abp/ng.core';

@Component({
  selector: 'app-assigned-roles',
  templateUrl: './assigned-roles.component.html',
  styleUrls: ['./assigned-roles.component.scss'],
})
export class AssignedRolesComponent implements OnInit {
  roles: string[] = [];
  tenantInfo: any;

  constructor(
    private rolesService: IdentityUserService,
    private configService: ConfigStateService,
  ) {
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit(): void {
    this.loadUserRoles();
  }

  loadUserRoles(): void {
    const userId = this.configService.getOne('currentUser').id;
    this.rolesService.getRoles(userId).subscribe((result: ListResultDto<IdentityRoleDto>) => {
      this.roles = result.items.map(role => role.name).filter(name => name);
    });
  }
}
