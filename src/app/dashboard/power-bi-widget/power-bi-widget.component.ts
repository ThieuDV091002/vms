import {
  Component,
  ViewChild,
  Input,
  OnInit,
  ViewEncapsulation,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { PowerBIReportEmbedComponent } from 'powerbi-client-angular';
import { models, service, Report, Embed, IReportEmbedConfiguration } from 'powerbi-client';
import { IHttpPostMessageResponse } from 'http-post-message';
import * as pbi from 'powerbi-client';
import { PowerBiService } from 'src/app/shared/services/power-bi.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ConfigStateService, LocalizationService } from '@abp/ng.core';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';
import { SiteService } from '@apis/corporate';
import { TenantService } from '@proxy/services';
import { OnLoadFilters, ReportLevelFilters } from 'powerbi-models';
//test url  http://localhost:4200/#/dashboard/powerbi/groups/4890752a-6318-41e2-b600-683960332dec/reports/d7694d65-2691-4300-b3c0-36025c789c44
@Component({
  selector: 'app-power-bi-widget',
  templateUrl: './power-bi-widget.component.html',
  styleUrls: ['./power-bi-widget.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PowerBiWidgetComponent implements OnInit, OnChanges {
  @Input() selected: any = { title: '', url: '', hideTitle: false };
  @Input() index = -1;
  @Input() selectedDataTier;
  @Input() queryId;
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  edit = false;
  form: FormGroup;
  safeUrl: SafeResourceUrl;
  @Input() expandChart = false;
  tenantInfo: any;
  currentDatatier: any;
  currentSiteTenant: any;
  widgetInfo: string;
  previousUrl: string;
  @Input() isWidget = false;
  @Input() reportId: string = '';
  @Input() groupId: string = '';
  embedUrl: string = `https://app.powerbi.com/reportEmbed?reportId=${this.reportId}&groupId=${this.groupId}`;
  // Wrapper object to access report properties
  @ViewChild(PowerBIReportEmbedComponent) public reportObj!: PowerBIReportEmbedComponent;

  // Track Report embedding status
  public isEmbedded = false;
  token: string = '';
  // Overall status message of embedding
  public displayMessage =
    'The report is bootstrapped. Click the Embed Report button to set the access token.';

  // CSS Class to be passed to the wrapper
  public reportClass = 'report-container';

  // Flag which specify the type of embedding
  public phasedEmbeddingFlag = false;

  // Flag for button toggles
  private isFilterPaneVisible: boolean = true;
  private isThemeApplied: boolean = false;
  private isZoomedOut: boolean = false;
  private isDataSelectedEvent = false;

  // Constants for zoom levels
  private zoomOutLevel = 0.5;
  private zoomInLevel = 0.9;

  // Button text
  public filterPaneBtnText: string = 'Hide filter pane';
  public themeBtnText: string = 'Set theme';
  public zoomBtnText: string = 'Zoom out';
  public dataSelectedBtnText = 'Show dataSelected event in dialog';

  // Flag to display the embed config dialog
  public isEmbedConfigDialogVisible = false;

  // Flag to display the data selected event details dialog
  public isEventDetailsDialogVisible = false;
  public dataSelectedEventDetails: any;

  // Pass the basic embed configurations to the wrapper to bootstrap the report on first load
  // Values for properties like embedUrl, accessToken and settings will be set on click of button
  public reportConfig: IReportEmbedConfiguration = {
    type: 'report',
    id: this.reportId,
    embedUrl: ``,
    tokenType: pbi.models.TokenType.Aad,
    accessToken: this.token,
    settings: {
      filterPaneEnabled: true,
      navContentPaneEnabled: true,
      panes: {
        filters: {
          expanded: false,
          visible: true,
        },
      },
    },
  };

  /**
   * Map of event handlers to be applied to the embedded report
   */
  // Update event handlers for the report by redefining the map using this.eventHandlersMap
  // Set event handler to null if event needs to be removed
  // More events can be provided from here
  // https://docs.microsoft.com/en-us/javascript/api/overview/powerbi/handle-events#report-events
  public eventHandlersMap = new Map([
    [
      'loaded',
      () => {
        const report = this.reportObj.getReport();
        report.getFilters().then(filters => {
          const prevFilters = this.selected.extraProperties.filter || [];
          const mergedFilters =this.mergeFilters(filters, prevFilters);
          const filtersString = JSON.stringify(mergedFilters);
          const prevFiltersString = JSON.stringify(prevFilters);
          if (filtersString !== prevFiltersString) {
            this.selected.extraProperties.filter = mergedFilters;
            this.save();
          }
          report.setFilters(mergedFilters); // Set the filters to the report
        });

        report.setComponentTitle('Embedded report');
        console.log('Report has loaded');
      },
    ],
    ['rendered', () =>{
       const report = this.reportObj.getReport();
        report.getFilters().then(filters => {
          console.log('Filters applied to the report:', filters);

        });
    }],
    [
      'error',
      (event?: service.ICustomEvent<any>) => {
        if (event) {
          console.error(event.detail);
        }
      },
    ],
    ['visualClicked', () => console.log('visual clicked')],
    ['pageChanged', event => console.log(event)],
  ]) as Map<string, (event?: service.ICustomEvent<any>, embeddedEntity?: Embed) => void | null>;

  constructor(
    private powerBiService: PowerBiService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private configService: ConfigStateService,
    private tenantService: TenantService,
    private localizationService: LocalizationService,
    public siteService: SiteService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDataTier?.currentValue) {
      this.currentDatatier = changes.selectedDataTier?.currentValue;
      this.buildForm();
      this.editSiteFilter();
      this.editUrlFilter();
      this.embedReport(this.token, this.embedUrl);
    }
  }

  ngOnInit(): void {
    this.tenantService.apiName = 'corporate';
    this.reportId = this.selected?.extraProperties?.reportId;
    this.groupId = this.selected?.extraProperties?.groupId;
    this.buildForm();
    this.getCurrentTenant();
    this.editUrlFilter();
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widgetInfo = data;
    });

    this.route.params.subscribe(params => {
      this.groupId = params['groupId'] ?? this.groupId;
      this.reportId = params['reportId'] ?? this.reportId;
      if (params['reportId']) this.isWidget = false;
      this.embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${this.reportId}&groupId=${this.groupId}`;
      this.powerBiService.getToken().then(token => {
        this.token = token;
        this.embedReport(token, this.embedUrl);
      });
    });
  }
  expand() {
    // const element = document.querySelector('app-power-bi-widget');
    // if (this.expandChart) {
    //   element.classList.remove('fullscreen');
    // } else {
    //   element.classList.add('fullscreen');
    // }
    this.enableFullScreen();
  }

  buildForm() {
    this.form = this.fb.group({
      title: [this.selected.name || '', ''],
      hideTitle: [this.selected.extraProperties?.hideTitle || false],
      reportId: [this.selected.extraProperties?.reportId || '', Validators.required],
      groupId: [this.selected.extraProperties?.groupId || '', Validators.required],
      site: [this.selected.extraProperties?.site || ''],
      area: [this.selected.extraProperties?.area || ''],
      cell: [this.selected.extraProperties?.cell || ''],
      workCenter: [this.selected.extraProperties?.workCenter || ''],
    });
  }

  save() {
    const requestBody: any = {
      dashboardId: this.selected.dashboardId,
      seq: this.selected.seq,
      widgetName: this.selected.widgetName,
      name: this.form.controls['title'].value,
      description: this.selected.description,
      tenantId: this.selected.tenantId,
      displayName: this.selected.displayName,
      id: this.selected.id,
      extraProperties: {
        hideTitle: this.form.controls['hideTitle'].value,
        groupId: this.form.controls['groupId'].value,
        reportId: this.form.controls['reportId'].value,
        site: this.form.controls['site'].value,
        area: this.form.controls['area'].value,
        cell: this.form.controls['cell'].value,
        workCenter: this.form.controls['workCenter'].value,
        filter: this.selected.extraProperties?.filter || [],
      },
    };
    this.updateChange.emit({ type: 'update', widget: requestBody });
    this.reportId = this.form.controls['reportId'].value;
    this.groupId = this.form.controls['groupId'].value;
    this.selected = requestBody;
    this.editSiteFilter();
    this.editUrlFilter();
    this.edit = false;
    this.embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${this.reportId}&groupId=${this.groupId}`;
    this.embedReport(this.token, this.embedUrl);
  }

  getCurrentTenant() {
    if (this.tenantInfo) {
      if (this.tenantInfo.DataTierType === 'Site' && this.form.controls['site'].value) {
        this.siteService
          .get(this.tenantInfo.DataTierId, { skipHandleError: true })
          .subscribe(res => {
            if (res.name) {
              this.currentSiteTenant = res.name;
            }
            this.editSiteFilter();
          });
      }
    } else {
    }
  }

  editSiteFilter() {
    if (this.form.controls['site'].value && this.currentSiteTenant) {
      if (this.embedUrl.includes('filter')) {
        this.embedUrl =
          this.embedUrl + ` and ${this.form.controls['site'].value} eq '${this.currentSiteTenant}'`;
      } else {
        this.embedUrl =
          this.embedUrl +
          `&filter=${this.form.controls['site'].value} eq '${this.currentSiteTenant}'`;
      }
    }
  }

  editUrlFilter() {
    const params = {
      area: this.currentDatatier?.area?.id,
      cell: this.currentDatatier?.cell?.id,
      workCenter: this.currentDatatier?.workCenter?.id,
    };
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        if (this.form.controls[key].value) {
          if (this.embedUrl.includes('filter')) {
            this.embedUrl =
              this.embedUrl +
              ` and ${this.form.controls[key].value} eq '${this.currentDatatier[key]?.name}'`;
          } else {
            this.embedUrl =
              this.embedUrl +
              `&filter=${this.form.controls[key].value} eq '${this.currentDatatier[key]?.name}'`;
          }
        }
      }
    });
    if (this.previousUrl !== this.embedUrl) {
      this.previousUrl = this.embedUrl;
    }
  }

  cancel() {
    this.edit = false;
  }

  deletePowerBIWidget() {
    this.confirmationService
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.widgetInfo, this.selected.name],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.updateChange.emit({ type: 'delete', widget: this.selected });
        }
      });
  }
  /**
   * Show the dailog for Embed Config input
   */
  public openEmbedConfigDialog(): void {
    this.isEmbedConfigDialogVisible = true;
  }

  public hideEmbedConfigDialog(): void {
    this.isEmbedConfigDialogVisible = false;
  }

  public handleEmbedConfigEventReceived(event: { aadToken: string; embedUrl: string }): void {
    this.embedReport(event.aadToken, event.embedUrl);
    this.hideEmbedConfigDialog();
  }

  /**
   * Embeds report
   */
  public embedReport(accessToken: string, embedUrl: string): void {
    if(!accessToken){
      console.error('No access token provided');
      return
    }
    let filters = [];
    try {
      const extraProps = this.selected?.extraProperties;
      if (extraProps?.filter) {

        if (typeof extraProps.filter === 'string') {
          filters = JSON.parse(extraProps.filter);
        } else if (Array.isArray(extraProps.filter)) {
          filters = extraProps.filter;
        }

      }
    } catch (e) {
      console.error('Filter error:', e);
      filters = [];
    }
    filters.forEach((filter) => {
      if (filter.target?.column=== this.selected?.extraProperties?.site&& this.currentDatatier?.sites&&this.currentDatatier?.sites.length>0) {
         filter.operator='In'
        filter.values=[...this.currentDatatier?.sites.map(site => site.name)];
      }
      if (filter.target?.column=== this.selected?.extraProperties?.area&& this.currentDatatier?.areas&&this.currentDatatier?.areas.length>0) {
        filter.operator='In'
        filter.values=[ ...this.currentDatatier?.areas.map(area => area.name)];
      }
      if (filter.target?.column=== this.selected?.extraProperties?.cell&& this.currentDatatier?.cells&&this.currentDatatier?.cells.length>0) {
         filter.operator='In'
        filter.values=[...this.currentDatatier?.cells.map(cell => cell.name)];
      }
      if (filter.target?.column=== this.selected?.extraProperties?.workCenter&& this.currentDatatier?.workCenters&&this.currentDatatier?.workCenters.length>0) {
        filter.operator='In'
        filter.values=[...this.currentDatatier?.workCenters.map(workCenter => workCenter.name)];
      }
    });
    this.reportConfig = {
      ...this.reportConfig,
      embedUrl,
      accessToken,
      filters,
    };

    // Update embed status
    this.isEmbedded = true;

    // Update the display message
    this.displayMessage =
      'Use the buttons above to interact with the report using Power BI Client APIs.';
  }

  /**
   * Toggle Filter Pane
   *
   * @returns Promise<IHttpPostMessageResponse<void> | undefined>
   */
  public async toggleFilterPane(): Promise<IHttpPostMessageResponse<void> | undefined> {
    // Get report from the wrapper component
    const report: Report = this.reportObj.getReport();

    if (!report) {
      this.displayMessage = 'Report not available.';
      console.log(this.displayMessage);
      return;
    }

    this.isFilterPaneVisible = !this.isFilterPaneVisible;

    // Update the settings to show/hide the filter pane
    const settings = {
      panes: {
        filters: {
          expanded: this.isFilterPaneVisible,
          visible: this.isFilterPaneVisible,
        },
      },
    };

    try {
      const response = await report.updateSettings(settings);

      this.filterPaneBtnText = this.isFilterPaneVisible ? 'Hide filter pane' : 'Show filter pane';
      this.displayMessage = this.isFilterPaneVisible
        ? 'Filter pane is visible'
        : 'Filter pane is hidden';

      return response;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  /**
   * Set data selected event
   */
  public setDataSelectedEvent(): void {
    const report: Report = this.reportObj.getReport();
    this.isDataSelectedEvent = !this.isDataSelectedEvent;

    if (this.isDataSelectedEvent) {
      // Adding dataSelected event handler to the report
      report.on('dataSelected', (event: service.ICustomEvent<any>) => {
        if (event?.detail.dataPoints.length) {
          this.dataSelectedEventDetailsDialog(event.detail);
        }
      });
    } else {
      report.off('dataSelected');
    }

    this.dataSelectedBtnText = this.isDataSelectedEvent
      ? 'Hide dataSelected event in dialog'
      : 'Show dataSelected event in dialog';
    this.displayMessage = this.isDataSelectedEvent
      ? 'Data Selected event has been successfully set. Click on a data point to see the details.'
      : 'Data Selected event has been successfully unset.';
  }

  dataSelectedEventDetailsDialog(dataSelectedEventDetails: any): void {
    this.dataSelectedEventDetails = dataSelectedEventDetails;
    this.isEventDetailsDialogVisible = true;
  }

  closeDataSelectedEventDetailsDialog() {
    this.isEventDetailsDialogVisible = false;
  }

  /**
   * Toggle theme
   */
  public async toggleTheme(): Promise<void> {
    const report: Report = this.reportObj.getReport();

    if (!report) {
      this.displayMessage = 'Report not available.';
      console.log(this.displayMessage);
      return;
    }

    // Update the theme by passing in the custom theme.
    // Some theme properties might not be applied if your report has custom colors set.
    try {
      if (this.isThemeApplied) {
        await report.resetTheme();
      } else {
        await report.applyTheme({ themeJson: sampletheme });
      }

      this.isThemeApplied = !this.isThemeApplied;

      this.themeBtnText = this.isThemeApplied ? 'Reset theme' : 'Set theme';
      this.displayMessage = this.isThemeApplied
        ? 'Theme has been applied'
        : 'Theme has been reset to default';
    } catch (error) {
      this.displayMessage = `Failed to apply theme: ${error}`;
      console.log(this.displayMessage);
    }
  }

  /**
   * Toggle zoom
   */
  public async toggleZoom(): Promise<void> {
    const report: Report = this.reportObj.getReport();

    if (!report) {
      this.displayMessage = 'Report not available.';
      console.log(this.displayMessage);
      return;
    }

    try {
      const newZoomLevel = this.isZoomedOut ? this.zoomInLevel : this.zoomOutLevel;
      this.isZoomedOut = !this.isZoomedOut;
      this.zoomBtnText = this.isZoomedOut ? 'Zoom in' : 'Zoom out';
      await report.setZoom(newZoomLevel);
    } catch (errors) {
      console.log(errors);
    }
  }

  /**
   * Refresh report event
   */
  public async refreshReport(): Promise<void> {
    const report: Report = this.reportObj.getReport();

    if (!report) {
      this.displayMessage = 'Report not available.';
      console.log(this.displayMessage);
      return;
    }

    try {
      await report.refresh();
      this.displayMessage = 'The report has been refreshed successfully.';
    } catch (errors: any) {
      this.displayMessage = errors.detailedMessage;
      console.log(errors);
    }
  }

  /**
   * Full screen event
   */
  public enableFullScreen(): void {
    const report: Report = this.reportObj.getReport();

    if (!report) {
      this.displayMessage = 'Report not available.';
      console.log(this.displayMessage);
      return;
    }

    report.fullscreen();
  }


  mergeFilters(existingFilters: any[], customFilters: any[]): any[] {
    const key = (f: any) => `${f.target?.table || ''}.${f.target?.column || ''}`;
    const map = new Map<string, any>();
    existingFilters.forEach(f => map.set(key(f), f));
    customFilters.forEach(f => map.set(key(f), f));
    return Array.from(map.values());
  }
}
export const sampletheme = {
  name: 'Sample Theme',
  dataColors: [
    '#990011',
    '#CC1144',
    '#EE7799',
    '#EEBBCC',
    '#CC4477',
    '#CC5555',
    '#882222',
    '#A30E33',
  ],
  background: '#FFFFFF',
  foreground: '#007799',
  tableAccent: '#990011',
};
