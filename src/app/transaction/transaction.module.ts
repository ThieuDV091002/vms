import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import { ExtensibleModule } from '@abp/ng.components/extensible';
import { PageModule } from '@abp/ng.components/page';
import { SharedModule } from '../shared/shared.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { PermissionManagementModule } from '@abp/ng.permission-management';
import { FeatureManagementModule } from '@abp/ng.feature-management';
import { IdentityModule } from '@abp/ng.identity';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxValidateCoreModule } from '@ngx-validate/core';






@NgModule({
  declarations: [

  ],
  imports: [
    SharedModule,
    CommonModule,
    ThemeSharedModule,
    ExtensibleModule,
    PageModule,
    NgApexchartsModule,
    PermissionManagementModule,
    FeatureManagementModule,
    IdentityModule,
    NgxValidateCoreModule,
    NgModule,
    NgbDropdownModule,
    NgbTooltipModule
  ],
  exports: [

  ]
})
export class TransactionModule { }
