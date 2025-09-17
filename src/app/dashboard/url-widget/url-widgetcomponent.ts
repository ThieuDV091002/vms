import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { ConfigStateService, LocalizationService } from '@abp/ng.core';
import { TenantService } from '@abp/ng.tenant-management/proxy';
import { SiteService } from '@apis/corporate';

@Component({
  selector: 'app-url-widget',
  templateUrl: './url-widget.component.html',
  styleUrl: './url-widget.component.scss'
})
export class UrlWidgetComponent implements OnInit, OnChanges {
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
  url: string;
  currentDatatier: any;
  currentSiteTenant: any;
  widgetInfo: string;
  previousUrl: string;
  constructor(private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private configService: ConfigStateService,
    private tenantService: TenantService,
    private localizationService: LocalizationService,
    public siteService: SiteService,
  ) {
    this.tenantInfo = this.configService.getOne('extraProperties');

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDataTier?.currentValue) {
      this.currentDatatier = changes.selectedDataTier?.currentValue;
      this.buildForm();
      this.editSiteFilter();
      this.url = this.selected.extraProperties?.url
      this.editUrlFilter();
    }
  }

  ngOnInit(): void {
    this.tenantService.apiName = 'corporate';
    this.url = this.selected?.extraProperties?.url;
    this.buildForm();
    this.getCurrentTenant();
    this.editUrlFilter();
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widgetInfo = data;
    });
  }

  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
  }

  buildForm() {
    this.form = this.fb.group({
      title: [this.selected.name || '', ''],
      hideTitle: [this.selected.extraProperties?.hideTitle || false],
      url: [this.selected.extraProperties?.url || '', Validators.required],
      site: [this.selected.extraProperties?.site || ''],
      area: [this.selected.extraProperties?.area || ''],
      cell: [this.selected.extraProperties?.cell || ''],
      workCenter: [this.selected.extraProperties?.workCenter || '']
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
        url: this.form.controls['url'].value,
        site: this.form.controls['site'].value,
        area: this.form.controls['area'].value,
        cell: this.form.controls['cell'].value,
        workCenter: this.form.controls['workCenter'].value
      }
    }
    this.updateChange.emit({ type: 'update', widget: requestBody });
    this.url = this.selected.extraProperties.url;
    this.selected = requestBody;
    this.editSiteFilter();
    this.editUrlFilter();
    this.edit = false;
  }

  getCurrentTenant() {
    if (this.tenantInfo) {
      if (this.tenantInfo.DataTierType === 'Site' && this.form.controls['site'].value) {
        this.siteService.get(this.tenantInfo.DataTierId, { skipHandleError: true }).subscribe(res => {
          if (res.name) {
            this.currentSiteTenant = res.name;
          }
          this.editSiteFilter();
        })
      }
    } else {
      this.safeUrl = this.getSafeUrl(this.url);
    }
  }

  editSiteFilter() {
    if (this.form.controls['site'].value && this.currentSiteTenant) {
      if (this.url.includes('filter')) {
        this.url = this.url + ` and ${this.form.controls['site'].value} eq '${this.currentSiteTenant}'`
        this.safeUrl = this.getSafeUrl(this.url);
      } else {
        this.url = this.url + `&filter=${this.form.controls['site'].value} eq '${this.currentSiteTenant}'`
        this.safeUrl = this.getSafeUrl(this.url);
      }
    }
  }

  editUrlFilter() {
    const params = {
      area: this.currentDatatier?.area?.id,
      cell: this.currentDatatier?.cell?.id,
      workCenter: this.currentDatatier?.workCenter?.id
    };
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        if (this.form.controls[key].value) {
          if (this.url.includes('filter')) {
            this.url = this.url + ` and ${this.form.controls[key].value} eq '${this.currentDatatier[key]?.name}'`
          } else {
            this.url = this.url + `&filter=${this.form.controls[key].value} eq '${this.currentDatatier[key]?.name}'`
          }
        }
      }
    });
    if (this.previousUrl !== this.url) {
      this.previousUrl = this.url;
      this.safeUrl = this.getSafeUrl(this.url);
    }
  }

  cancel() {
    this.edit = false;
  }

  deletePowerBIWidget() {
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.widgetInfo, this.selected.name],
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.updateChange.emit({ type: 'delete', widget: this.selected });
      }
    });
  }

  getSafeUrl(url: string): SafeResourceUrl {
    if (url) {
      if (url?.includes('&filter')) {
        url = url.substring(0, url.indexOf('&filter') + 8) + encodeURIComponent(url.substring(url.indexOf('&filter') + 8));
      }
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return '';
  }
}
