import { CoreModule } from '@abp/ng.core';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import { NgxValidateCoreModule } from '@ngx-validate/core';
import { PageModule } from '@abp/ng.components/page';
import { WebViewComponent } from './components/web-view/web-view.component';
import { IconPickerComponent } from './components/icon-picker/icon-picker.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BytesToHexPipe } from './pipes/bytes-to-hex.pipe';
import { BooleanToTextPipe } from './pipes/boolean-to-text.pipe';
import { RecordLabelPipe } from './pipes/record-label.pipe';
import { RecordPayloadPipe } from './pipes/record-payload.pipe';
import { LpxModule } from '@volosoft/ngx-lepton-x';
import { UserMessagesComponent } from './components/user-messages/user-messages.component';
import { LpxContextMenuModule } from '@volosoft/ngx-lepton-x';
import { LinksComponent } from './components/links/links.component';
import { SuportTeamsComponent } from './components/suport-teams/suport-teams.component';
import { LpxSideMenuLayoutModule } from '@volosoft/ngx-lepton-x/layouts';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LpxIconModule } from '@volo/ngx-lepton-x.core';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { SearchSelectComponent } from './components/search-select/search-select.component';
import { ExtensibleModule } from '@abp/ng.components/extensible';
import { PermissionManagementModule } from '@abp/ng.permission-management';
import { SupportTeamPageComponent } from './components/support-team-page/support-team-page.component';
import { LoadingModalComponent } from './components/loading-modal/loading-modal.component';
import { DatatableFooterComponent } from './components/datatable-footer/datatable-footer.component';
import { MultipleSelectComponent } from './components/multiple-select/multiple-select.component';
import { SystemInfoComponent } from './components/system-info/system-info.component';
import { LogoComponent } from './components/logo/logo.component';
import { LabelSelectorComponent } from './components/label-selector/label-selector.component';
import { DataTierFilterComponent } from './components/data-tier-filter/data-tier-filter.component';
import { InputNumberDirective } from './directives/input-number.directive';
import { TimezoneSettingsComponent } from './components/timezone-settings/timezone-settings.component';
import { BarcodeScanerDirective } from './directives/barcode-scaner.directive';
import { BarcodeScannerComponent } from './components/barcode-scanner/barcode-scanner.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ImportConfirmComponent } from './components/import-confirm/import-confirm.component';
import { GeneralSettingsComponent } from './components/general-settings/general-settings.component';
import { HistoryModalComponent } from './components/history-modal/history-modal.component';
import { CustomErrorComponent } from './components/custom-error/custom-error.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { AssessmentCardComponent } from './components/assessment-card-modal/assessment-card-modal.component';
import { ViewStandardsComponent } from './components/view-standards/view-standards.component';
import { TaskStatusSwitcherComponent } from './components/task-status-switcher/task-status-switcher.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ApplicationSelectorComponent } from './components/application-selector/application-selector.component';

@NgModule({
  declarations: [
    WebViewComponent,
    IconPickerComponent,
    BytesToHexPipe,
    BooleanToTextPipe,
    RecordLabelPipe,
    RecordPayloadPipe,
    UserMessagesComponent,
    LinksComponent,
    SuportTeamsComponent,
    TreeViewComponent,
    SearchSelectComponent,
    SupportTeamPageComponent,
    LoadingModalComponent,
    DatatableFooterComponent,
    MultipleSelectComponent,
    SystemInfoComponent,
    LogoComponent,
    LabelSelectorComponent,
    DataTierFilterComponent,
    InputNumberDirective,
    TimezoneSettingsComponent,
    BarcodeScanerDirective,
    BarcodeScannerComponent,
    ImportConfirmComponent,
    GeneralSettingsComponent,
    HistoryModalComponent,
    CustomErrorComponent,
    TruncatePipe,
    AssessmentCardComponent,
    ViewStandardsComponent,
    TaskStatusSwitcherComponent,
    ApplicationSelectorComponent
  ],
  imports: [
    CoreModule,
    ThemeSharedModule,
    NgbDropdownModule,
    NgxValidateCoreModule,
    PageModule,
    NgSelectModule,
    LpxModule,
    LpxContextMenuModule,
    LpxSideMenuLayoutModule,
    NgbModalModule,
    LpxIconModule,
    ExtensibleModule,
    PermissionManagementModule,
    ZXingScannerModule,
    TooltipModule,
    ModalModule.forRoot(),
    NgbTooltipModule,
    BsDatepickerModule.forRoot(),
    DragDropModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    CoreModule,
    ThemeSharedModule,
    NgbDropdownModule,
    NgxValidateCoreModule,
    WebViewComponent,
    IconPickerComponent,
    BytesToHexPipe,
    BooleanToTextPipe,
    RecordLabelPipe,
    RecordPayloadPipe,
    UserMessagesComponent,
    LinksComponent,
    SuportTeamsComponent,
    TreeViewComponent,
    SearchSelectComponent,
    SupportTeamPageComponent,
    LoadingModalComponent,
    DatatableFooterComponent,
    MultipleSelectComponent,
    SystemInfoComponent,
    LogoComponent,
    LabelSelectorComponent,
    InputNumberDirective,
    TimezoneSettingsComponent,
    BarcodeScanerDirective,
    ImportConfirmComponent,
    HistoryModalComponent,
    TruncatePipe,
    DataTierFilterComponent,
    AssessmentCardComponent,
    TaskStatusSwitcherComponent,
    NgbTooltipModule,
    ApplicationSelectorComponent
  ],
  providers: [],
})
export class SharedModule { }
