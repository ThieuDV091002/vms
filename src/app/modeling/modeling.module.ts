import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UserMenusComponent } from './user-menus/user-menus.component';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import { ExtensibleModule } from '@abp/ng.components/extensible';
import { PageModule } from '@abp/ng.components/page';
import { SharedModule } from '../shared/shared.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { RolesManagementComponent } from './roles-management/roles-management.component';
import { PermissionManagementModule } from '@abp/ng.permission-management';
import { PersonalSettingsComponent } from './user-profile/components/personal-settings/personal-settings.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ProfilePictureComponent } from './user-profile/components/profile-picture/profile-picture.component';
import { TextTemplateComponent } from './text-template/text-template.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { FeatureManagementModule } from '@abp/ng.feature-management';
import { IdentityModule } from '@abp/ng.identity';
import { NgbDropdownModule, NgbNavModule, NgbTimepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxValidateCoreModule } from '@ngx-validate/core';
import { ModelingTemplateComponent } from './modeling-template/modeling-template.component';
import { LanguagesComponent } from './languages/languages.component';
import { FormsModule } from '@angular/forms';
import { CorporatesComponent } from './corporates/corporates.component';
import { DivisionsComponent } from './divisions/divisions.component';
import { CellsComponent } from './cells/cells.component';
import { AreasComponent } from './areas/areas.component';
import { WorkCentersComponent } from './work-centers/work-centers.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StatesComponent } from './states/states.component';
import { JobFunctionsComponent } from './job-functions/job-functions.component';
import { SupportShiftsComponent } from './support-shifts/support-shifts.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContainerLevelsComponent } from './container-levels/container-levels.component';
import { UserQueriesComponent } from './user-queries/user-queries.component';
import { LabelCategoriesComponent } from './label-categories/label-categories.component';
import { UserLabelsComponent } from './user-labels/user-labels.component';
import { SitesComponent } from './sites/sites.component';
import { UserGroupsComponent } from './user-groups/user-groups.component';
import { StandardCategoriesComponent } from './standard-categories/standard-categories.component';
import { LinkCategoriesComponent } from './link-categories/link-categories.component';
import { TagInputModule } from 'ngx-chips';
import { LinksComponent } from './links/links.component';
import { PermissionManagementComponent } from './roles-management/components/permission-management/permission-management.component';
import { ImportDetailComponent } from './modeling-template/modeling-import-details.component';
import { ApplicationsComponent } from './applications/applications.component';
import { CentralizedUsersComponent } from './centralized-users/centralized-users.component';
import { RoleBoardTaskTypesComponent } from './role-board-task-types/role-board-task-types.component';
import { StateModelsComponent } from './state-models/state-models.component';
import { StateModelTransitionComponent } from './state-models/state-models-transition.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { GlobalDowntimeCodesComponent } from './global-downtime-codes/global-downtime-codes.component';
import { LocalDowntimeReasonsComponent } from './local-downtime-reasons/local-downtime-reasons.component';
import { RoleBoardSettingsComponent } from './role-board-settings/role-board-settings.component';
import { MachineDowntimeSettingsComponent } from './role-board-settings/machine-downtime-settings.component';
import { OrderChangeSettingsComponent } from './role-board-settings/order-change-settings.component';
import { RoleBoardCellSettingsComponent } from './role-board-settings/role-board-cell-settings.component';
import { FocusedItemsComponent } from './focused-items/focused-tiems.component';
import { ActivityCardTypesComponent } from './activity-card-types/activity-card-types.component';
import { ActivityCardCategoriesComponent } from './activity-card-categories/activity-card-categories.component';
import { ActivityCardReasonsComponent } from './activity-card-reasons/activity-card-reasons.component';
import { ActivityCardPrioritiesComponent } from './activity-card-priorities/activity-card-priorities.component';
import { ActivityCardSettingsComponent } from './activity-card-settings/activity-card-settings.component';
import { SettingsComponent } from './settings/settings.component';
import { DataIntegrationSettingsComponent } from './data-integration-settings/data-integration-settings.component';
import { WorkCenterSettingsComponent } from './work-center-settings/work-center-settings.component';
import { GlobalScrapCodesComponent } from './global-scrap-codes/global-scrap-codes.component';
import { LocalScrapReasonsComponent } from './local-scrap-reasons/local-scrap-reasons.component';
import { LocalBreaktimeReasonsComponent } from './local-breaktime-reasons/local-breaktime-reasons.component';
import { ProductFamiliesComponent } from './product-families/product-families.component';
import { ProductsComponent } from './products/products.component';
import { AreaSettingsComponent } from './area-settings/area-settings.component';
import { CellSettingsComponent } from './cell-settings/cell-settings.component';
import { ShiftPatternsComponent } from './shift-patterns/shift-patterns.component';
import { ShiftPatternDetailsComponent } from './shift-patterns/shift-pattern-details.component';
import { ProductSeriesComponent } from './product-series/product-series.component';
import { AssessmentTypeGlobalComponent } from './assessment-type-global/assessment-type-global.component';
import { ProductionReviewIntegrationComponent } from './settings/components/production-review-integration/production-review-integration.component';
import { RoleBoardIntegrationComponent } from './settings/components/role-board-integration/role-board-integration.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AssessmentTypeLocalComponent } from './assessment-type-local/assessment-type-local.component';
import { AssessmentSchedulingRuleComponent } from './assessment-scheduling-rule/assessment-scheduling-rule.component';
import { AssessmentTeamsComponent } from './assessment-scheduling-rule/assessment-scheduling-rule-teams.component';
import { NamingRulesComponent } from './naming-rules/naming-rules.component';
import { FiveSTaskSetupComponent } from './five-s-task-setup/five-s-task-setup.component';
import { Bs5QuartzCronModule } from '@sbzen/ng-cron';
import { ToDoTypesComponent } from './to-do-types/to-do-types.component';
import { MessageCategoriesComponent } from './message-categories/message-categories.component';
import { ContentTemplateComponent } from './content-template/content-template.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { NotificationSettingDetailsComponent } from './notification-settings/notification-settings-details.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SchedulerSettingsComponent } from './scheduler-settings/scheduler-settings.component';
import { PrivateMessagesComponent } from './private-messages/private-messages.component';
import { AssessmentManageComponent } from './assessment-manage/assessment-manage.component';
import { ExecutionHistoryModalComponent } from './scheduler-settings/execution-history-modal/execution-history-modal.component';
import { DefaultSettingsComponent } from './user-profile/components/default-settings/default-settings.component';
import { AssignedRolesComponent } from './user-profile/components/assigned-roles/assigned-roles.component';
import { SiteSettingsComponent } from './site-settings/site-settings.component';
import { MonthlyTargetSettingComponent } from './site-settings/monthly-target-setting.component';
import { ProductionReviewBoardSettingComponent } from './production-review-board-setting/production-review-board-setting.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HotelComponent } from './hotel/hotel.component';

@NgModule({
  declarations: [
    UserMenusComponent,
    RolesManagementComponent,
    PersonalSettingsComponent,
    UserProfileComponent,
    ProfilePictureComponent,
    TextTemplateComponent,
    UsersComponent,
    TenantsComponent,
    ModelingTemplateComponent,
    LanguagesComponent,
    CorporatesComponent,
    DivisionsComponent,
    CellsComponent,
    AreasComponent,
    WorkCentersComponent,
    StatesComponent,
    ContainerLevelsComponent,
    LanguagesComponent,
    JobFunctionsComponent,
    SupportShiftsComponent,
    UserQueriesComponent,
    LabelCategoriesComponent,
    UserLabelsComponent,
    SitesComponent,
    UserGroupsComponent,
    StandardCategoriesComponent,
    LinkCategoriesComponent,
    LinksComponent,
    HotelComponent,
    PermissionManagementComponent,
    ImportDetailComponent,
    CentralizedUsersComponent,
    ApplicationsComponent,
    StateModelsComponent,
    StateModelTransitionComponent,
    RoleBoardTaskTypesComponent,
    ShiftsComponent,
    GlobalDowntimeCodesComponent,
    LocalDowntimeReasonsComponent,
    RoleBoardSettingsComponent,
    MachineDowntimeSettingsComponent,
    OrderChangeSettingsComponent,
    RoleBoardCellSettingsComponent,
    FocusedItemsComponent,    FocusedItemsComponent,
    ActivityCardTypesComponent,
    ActivityCardCategoriesComponent,
    ActivityCardReasonsComponent,
    ActivityCardPrioritiesComponent,
    ActivityCardSettingsComponent,
    SettingsComponent,
    DataIntegrationSettingsComponent,
    WorkCenterSettingsComponent,
    GlobalScrapCodesComponent,
    LocalScrapReasonsComponent,
    LocalBreaktimeReasonsComponent,
    ProductFamiliesComponent,
    ProductsComponent,
    ProductSeriesComponent,
    AreaSettingsComponent,
    CellSettingsComponent,
    ShiftPatternsComponent,
    ShiftPatternDetailsComponent,
    AssessmentTypeGlobalComponent,
    ProductionReviewIntegrationComponent,
    RoleBoardIntegrationComponent,
    AssessmentTypeLocalComponent,
    AssessmentSchedulingRuleComponent,
    AssessmentTeamsComponent,
    NamingRulesComponent,
    FiveSTaskSetupComponent,
    ToDoTypesComponent,
    MessageCategoriesComponent,
    ContentTemplateComponent,
    NotificationSettingsComponent,
    NotificationSettingDetailsComponent,
    SchedulerSettingsComponent,
    PrivateMessagesComponent,
    AssessmentManageComponent,
    ExecutionHistoryModalComponent,
    DefaultSettingsComponent,
    AssignedRolesComponent,
    SiteSettingsComponent,
    MonthlyTargetSettingComponent,
    ProductionReviewBoardSettingComponent
  ],
  exports: [UserMenusComponent, RolesManagementComponent, TextTemplateComponent],
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
    NgbNavModule,
    NgbDropdownModule,
    NgbTooltipModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    TagInputModule,
    NgxDatatableModule,
    TooltipModule,
    NgbTimepickerModule,
    Bs5QuartzCronModule,
    TimepickerModule,
    DragDropModule
  ],
})
export class ModelingModule { }
