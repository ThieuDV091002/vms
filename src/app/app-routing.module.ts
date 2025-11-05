import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserMenusComponent } from './modeling/user-menus/user-menus.component';
import { WebViewComponent } from './shared/components/web-view/web-view.component';
import { TextTemplateComponent } from './modeling/text-template/text-template.component';
import { LanguagesComponent } from './modeling/languages/languages.component';
import { CorporatesComponent } from './modeling/corporates/corporates.component';
import { DivisionsComponent } from './modeling/divisions/divisions.component';
import { CellsComponent } from './modeling/cells/cells.component';
import { AreasComponent } from './modeling/areas/areas.component';
import { WorkCentersComponent } from './modeling/work-centers/work-centers.component';
import { ContainerLevelsComponent } from './modeling/container-levels/container-levels.component';
import { StatesComponent } from './modeling/states/states.component';
import { JobFunctionsComponent } from './modeling/job-functions/job-functions.component';
import { SupportShiftsComponent } from './modeling/support-shifts/support-shifts.component';
import { UserQueriesComponent } from './modeling/user-queries/user-queries.component';
import { LabelCategoriesComponent } from './modeling/label-categories/label-categories.component';
import { UserLabelsComponent } from './modeling/user-labels/user-labels.component';
import { SitesComponent } from './modeling/sites/sites.component';
import { UserGroupsComponent } from './modeling/user-groups/user-groups.component';
import { StandardCategoriesComponent } from './modeling/standard-categories/standard-categories.component';
import { LinkCategoriesComponent } from './modeling/link-categories/link-categories.component';
import { LinksComponent } from './modeling/links/links.component';
import { ApplicationsComponent } from './modeling/applications/applications.component';
import { CentralizedUsersComponent } from './modeling/centralized-users/centralized-users.component';
import { RoleBoardTaskTypesComponent } from './modeling/role-board-task-types/role-board-task-types.component';
import { StateModelsComponent } from './modeling/state-models/state-models.component';
import { RoleBoardComponent } from './dashboard/role-board/role-board.component';
import { ShiftsComponent } from './modeling/shifts/shifts.component';
import { GlobalDowntimeCodesComponent } from './modeling/global-downtime-codes/global-downtime-codes.component';
import { LocalDowntimeReasonsComponent } from './modeling/local-downtime-reasons/local-downtime-reasons.component';
import { RoleBoardSettingsComponent } from './modeling/role-board-settings/role-board-settings.component';
import { FocusedItemsComponent } from './modeling/focused-items/focused-tiems.component';
import { ActivityCardTypesComponent } from './modeling/activity-card-types/activity-card-types.component';
import { ActivityCardCategoriesComponent } from './modeling/activity-card-categories/activity-card-categories.component';
import { ActivityCardReasonsComponent } from './modeling/activity-card-reasons/activity-card-reasons.component';
import { ActivityCardPrioritiesComponent } from './modeling/activity-card-priorities/activity-card-priorities.component';
import { ActivityCardSettingsComponent } from './modeling/activity-card-settings/activity-card-settings.component';
import { DataIntegrationSettingsComponent } from './modeling/data-integration-settings/data-integration-settings.component';
import { WorkCenterSettingsComponent } from './modeling/work-center-settings/work-center-settings.component';
import { GlobalScrapCodesComponent } from './modeling/global-scrap-codes/global-scrap-codes.component';
import { LocalScrapReasonsComponent } from './modeling/local-scrap-reasons/local-scrap-reasons.component';
import { LocalBreaktimeReasonsComponent } from './modeling/local-breaktime-reasons/local-breaktime-reasons.component';
import { ProductFamiliesComponent } from './modeling/product-families/product-families.component';
import { ProductsComponent } from './modeling/products/products.component';
import { AreaSettingsComponent } from './modeling/area-settings/area-settings.component';
import { CellSettingsComponent } from './modeling/cell-settings/cell-settings.component';
import { ShiftPatternsComponent } from './modeling/shift-patterns/shift-patterns.component';
import { ProductSeriesComponent } from './modeling/product-series/product-series.component';
import { AssessmentTypeGlobalComponent } from './modeling/assessment-type-global/assessment-type-global.component';
import { AssessmentTypeLocalComponent } from './modeling/assessment-type-local/assessment-type-local.component';
import { AssessmentSchedulingRuleComponent } from './modeling/assessment-scheduling-rule/assessment-scheduling-rule.component';
import { FiveSTaskSetupComponent } from './modeling/five-s-task-setup/five-s-task-setup.component';
import { ToDoTypesComponent } from './modeling/to-do-types/to-do-types.component';
import { MessageCategoriesComponent } from './modeling/message-categories/message-categories.component';
import { ContentTemplateComponent } from './modeling/content-template/content-template.component';
import { NotificationSettingsComponent } from './modeling/notification-settings/notification-settings.component';
import { SchedulerSettingsComponent } from './modeling/scheduler-settings/scheduler-settings.component';
import { PrivateMessagesComponent } from './modeling/private-messages/private-messages.component';
import { AssessmentManageComponent } from './modeling/assessment-manage/assessment-manage.component';
import { SiteSettingsComponent } from './modeling/site-settings/site-settings.component';
import { ProductionReviewBoardSettingComponent } from './modeling/production-review-board-setting/production-review-board-setting.component';
import { HotelComponent } from './modeling/hotel/hotel.component';
import { TextComponent } from './modeling/text/text.component';
import { AttractionComponent } from './modeling/attraction/attraction.component';
import { FoodComponent } from './modeling/food/food.component';
import { ImageComponent } from './modeling/image/image.component';
import { ImageLinkComponent } from './modeling/imagelink/imagelink.component';
import { LocalAdminComponent } from './modeling/localadmin/localadmin.component';
import { MedicalCareCenterComponent } from './modeling/medical-care-center/medical-care-center.component';
import { TravelToolComponent } from './modeling/travel-tool/travel-tool.component';
import { TransportationAppComponent } from './modeling/transportation-app/transportation-app.component';
import { GuestInformationComponent } from './modeling/guest-information/guest-information.component';
import { MyRequestComponent } from './modeling/my-request/my-request.component';
import { ContractorRequestComponent } from './modeling/contractor-request/contractor-request.component';
import { TravelGuidePageComponent } from './modeling/travel-guide-page/travel-guide-page.component';
import { GuestFormComponent } from './modeling/guest-form/guest-form.component';
import { ContractorFormComponent } from './modeling/contractor-form/contractor-form.component';
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'account',
    loadChildren: () => import('@abp/ng.account').then(m => m.AccountModule.forLazy()),
  },
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(m => m.IdentityModule.forLazy()),
  },
  {
    path: 'tenant-management',
    loadChildren: () =>
      import('@abp/ng.tenant-management').then(m => m.TenantManagementModule.forLazy()),
  },
  {
    path: 'setting-management',
    loadChildren: () =>
      import('@abp/ng.setting-management').then(m => m.SettingManagementModule.forLazy()),
  },
  {
    path: 'setting-management',
    loadChildren: () =>
      import('@abp/ng.setting-management').then(m => m.SettingManagementModule.forLazy()),
  },
  //modeling routers
  {
    path: 'modeling/user-queries',
    component: UserQueriesComponent,
    title: "User Queries"
  },
  {
    path: 'modeling/container-levels',
    component: ContainerLevelsComponent,
    title: "Container Levels"
  },
  {
    path: 'modeling/user-menus',
    component: UserMenusComponent,
    title: "User Menus"
  },
  {
    path: 'modeling/text-templates',
    component: TextTemplateComponent,
    title: "Text Templates"
  },
  {
    path: 'modeling/languages',
    component: LanguagesComponent,
    title: "Languages"
  },
  {
    path: 'device-test',
    loadChildren: () =>
      import('./device-test/device-test.module').then(m => m.DeviceTestModule),
  },
  {
    path: 'modeling/corporates',
    component: CorporatesComponent,
    title: "Corporates"
  },
  {
    path: 'modeling/divisions',
    component: DivisionsComponent,
    title: "Divisions"
  },
  {
    path: 'modeling/cells',
    component: CellsComponent,
    title: "Cells"
  },
  {
    path: 'modeling/areas',
    component: AreasComponent,
    title: "Areas"
  },
  {
    path: 'modeling/work-centers',
    component: WorkCentersComponent,
    title: "Work Centers"
  },
  {
    path: 'modeling/states',
    component: StatesComponent,
    title: "States"
  },
  {
    path: 'modeling/job-functions',
    component: JobFunctionsComponent,
    title: "Job Functions"
  },
  {
    path: 'modeling/support-shifts',
    component: SupportShiftsComponent,
    title: "Support Shifts"
  },
  {
    path: 'modeling/sites',
    component: SitesComponent,
    title: "Sites"
  },
  {
    path: 'modeling/user-groups',
    component: UserGroupsComponent,
    title: "User Group"
  },
  {
    path: 'modeling/link-categories',
    component: LinkCategoriesComponent,
    title: "Link Categories"
  },
  {
    path: 'modeling/links',
    component: LinksComponent,
    title: "Links"
  },
  {
    path: 'modeling/centralized-users',
    component: CentralizedUsersComponent,
    title: "Centrailzed Users"
  },
  {
    path: 'modeling/applications',
    component: ApplicationsComponent,
    title: "Applications"
  },

  {
    path: 'modeling/activity-card-types',
    component: ActivityCardTypesComponent,
    title: "ActivityCardTypes"
  },
  {
    path: 'modeling/activity-card-categories',
    component: ActivityCardCategoriesComponent,
    title: "ActivityCardCategories"
  },
  {
    path: 'modeling/activity-card-reasons',
    component: ActivityCardReasonsComponent,
    title: "ActivityCardReasons"
  },
  {
    path: 'modeling/activity-card-priorities',
    component: ActivityCardPrioritiesComponent,
    title: "Activity Card Priorities"
  },
  {
    path: 'modeling/activity-card-settings',
    component: ActivityCardSettingsComponent,
    title: "Activity Card Settings"
  },
  {
    path: 'modeling/data-integration-settings',
    component: DataIntegrationSettingsComponent,
    title: "Data Integration Settings"
  },
  {
    path: 'modeling/work-center-settings',
    component: WorkCenterSettingsComponent,
    title: "Work Center Settings"
  },
  {
    path: 'modeling/site-settings',
    component: SiteSettingsComponent,
    title: "Site Settings"
  },
  {
    path: 'modeling/area-settings',
    component: AreaSettingsComponent,
    title: "Area Settings"
  },
  {
    path: 'modeling/cell-settings',
    component: CellSettingsComponent,
    title: "Cell Settings"
  },
  //transaction


  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'mobile',
    loadChildren: () =>
      import('./mobile/mobile.module').then(m => m.MobileModule),
  },

  {
    path: 'modeling/label-categories',
    component: LabelCategoriesComponent,
    title: "Label Categories"
  },
  {
    path: 'modeling/user-labels',
    component: UserLabelsComponent,
    title: "User Labels"
  },
  {
    path: 'guest-info/hotel',
    component: HotelComponent,
    title: "Hotel"
  },
  {
    path: 'guest-info/guest-information',
    component: GuestInformationComponent,
    title: "Guest Information"
  },
  {
    path: 'contractor-request/my-requests',
    component: MyRequestComponent,
    title: "My Request"
  },
  {
    path: 'contractor-request/approved-request',
    component: ContractorRequestComponent,
    title: "Approved By PIC"
  },
  {
    path: 'traveling-guide',
    component: TravelGuidePageComponent,
    title: "Travel Guide"
  },
  {
    path: 'guest-form',
    component: GuestFormComponent,
    title: "Guest Form"
  },
  {
    path: 'contractor-form',
    component: ContractorFormComponent,
    title: "Contractor Form"
  },
  {
    path: 'travel-guide/text',
    component: TextComponent,
    title: "Text"
  },
  {
    path: 'travel-guide/attraction',
    component: AttractionComponent,
    title: "Attraction"
  },
  {
    path: 'travel-guide/food',
    component: FoodComponent,
    title: "Food"
  },
  {
    path: 'travel-guide/image',
    component: ImageComponent,
    title: "Image"
  },
  {
    path: 'travel-guide/image-link',
    component: ImageLinkComponent,
    title: "Image Link"
  },
  {
    path: 'travel-guide/local-admin',
    component: LocalAdminComponent,
    title: "Local Admin"
  },
  {
    path: 'travel-guide/medical-care-center',
    component: MedicalCareCenterComponent,
    title: "Medical Care Center"
  },
  {
    path: 'travel-guide/tool',
    component: TravelToolComponent,
    title: "Tool"
  },
  {
    path: 'travel-guide/transport-app',
    component: TransportationAppComponent,
    title: "Transportation App"
  },
  {
    
    path: 'modeling/standard-categories',
    component: StandardCategoriesComponent,
    title: "Standard Categories"
  },
  {
    path: 'modeling/state-models',
    component: StateModelsComponent,
    title: "State Models"
  },
  {
    path: 'modeling/role-board-task-types',
    component: RoleBoardTaskTypesComponent,
    title: "Role Board Task Types"
  },
  {
    path: 'modeling/role-boards',
    component: RoleBoardComponent,
    title: "Role Boards"
  },
  {
    path: 'modeling/shifts',
    component: ShiftsComponent,
    title: "Shifts"
  },
  {
    path: 'modeling/global-downtime-codes',
    component: GlobalDowntimeCodesComponent,
    title: "Global Downtime Codes"
  },
  {
    path: 'modeling/local-downtime-reasons',
    component: LocalDowntimeReasonsComponent,
    title: "Local Downtime Reasons"
  },
  {
    path: 'modeling/global-scrap-codes',
    component: GlobalScrapCodesComponent,
    title: "Global Scrap Codes"
  },
  {
    path: 'modeling/local-scrap-reasons',
    component: LocalScrapReasonsComponent,
    title: "Local Scrap Reasons"
  },
  {
    path: 'modeling/local-breaktime-reasons',
    component: LocalBreaktimeReasonsComponent,
    title: "Local Breaktime Reasons"
  },
  {
    path: 'modeling/product-families',
    component: ProductFamiliesComponent,
    title: "Product Families"
  },
  {
    path: 'modeling/products',
    component: ProductsComponent,
    title: "Products"
  },
  {
    path: 'modeling/product-series',
    component: ProductSeriesComponent,
    title: "Product Series"
  },
  {
    path: 'modeling/role-board-settings',
    component: RoleBoardSettingsComponent,
    title: "Role Board Settings"
  },
  {
    path: 'modeling/focused-items',
    component: FocusedItemsComponent,
    title: "Focused Items"
  },
  {
    path: 'modeling/shift-patterns',
    component: ShiftPatternsComponent,
    title: "Shift Patterns"
  },
  {
    path: 'modeling/assessment-types-global',
    component: AssessmentTypeGlobalComponent,
    title: "Assessment Type(Global)"
  },
  {
    path: 'modeling/assessment-types-local',
    component: AssessmentTypeLocalComponent,
    title: "Assessment Type(Local)"
  },
  {
    path: 'modeling/assessment-scheduling-rule',
    component: AssessmentSchedulingRuleComponent,
    title: "Assessment Scheduling Rule"
  },
  {
    path: 'modeling/to-do-setups',
    component: FiveSTaskSetupComponent,
    title: "5S Task Setup"
  },
  {
    path: 'modeling/to-do-types',
    component: ToDoTypesComponent,
    title: "5S Task Type"
  },
  {
    path: 'modeling/message-categories',
    component: MessageCategoriesComponent,
    title: "Message Categories"
  },
  {
    path: 'modeling/content-templates',
    component: ContentTemplateComponent,
    title: "Content Templates"
  },
  {
    path: 'modeling/notification-settings',
    component: NotificationSettingsComponent,
    title: "Notification Settings"
  },
  {
    path: 'modeling/scheduler-settings',
    component: SchedulerSettingsComponent,
    title: "Scheduler Settings"
  },
  {
    path: 'modeling/private-messages',
    component: PrivateMessagesComponent,
    title: "Private Messages"
  },
  {
    path: 'modeling/manage-assessment',
    component: AssessmentManageComponent,
    title: "Manage Assessment"
  },
  {
    path: 'modeling/production-review-board-settings',
    component: ProductionReviewBoardSettingComponent,
    title: "Production Review Board Settings"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
