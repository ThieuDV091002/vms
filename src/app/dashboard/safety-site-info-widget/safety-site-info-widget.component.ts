import { ConfigStateService, LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AreaHuddleWithSnowflakeService } from '@apis/general';
import { SafetyIncidentDto } from '@apis/general/dtos/area-huddle';
import { ActivityCardService } from '@apis/ticket';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-safety-site-info-widget',
  templateUrl: './safety-site-info-widget.component.html',
  styleUrl: './safety-site-info-widget.component.scss'
})
export class SafetySiteInfoWidgetComponent implements OnInit, OnDestroy {
  @Input() selected: any = { title: '', url: '', hideTitle: false };
  @Input() index = -1;
  @Input() type: string;
  @Input() selectedDataTier;
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() queryId;
  @Input() expandChart = false;

  isSettingsModalVisible = false;
  widget: string;
  form: FormGroup;
  subscription: Subscription;
  YTDAndSinceLastIncidentsubScription: Subscription;
  dataTier: any;
  siteInfo: any;
  YTDAndSinceLastIncident: SafetyIncidentDto;

  constructor(private confirmation: ConfirmationService,
    private localizationService: LocalizationService,
    private fb: FormBuilder,
    private activityCardService: ActivityCardService,
    private areaHuddleService: AreaHuddleWithSnowflakeService,
    private configService: ConfigStateService,
  ) { }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.YTDAndSinceLastIncidentsubScription) {
      this.YTDAndSinceLastIncidentsubScription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.getSiteInfo();
    this.getYTDAndSinceLastIncident();
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widget = data;
    });
  }

  getYTDAndSinceLastIncident() {
    const currentTenant: any = this.configService.getOne('extraProperties');
    if (currentTenant.DataTierType && currentTenant.DataTierType === 'Site') {
      this.YTDAndSinceLastIncidentsubScription = this.areaHuddleService.getSafetyIncidentBySiteId(currentTenant.DataTierId).subscribe(data => {
        this.YTDAndSinceLastIncident = data;
      });
    }
  }

  getSiteInfo() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.activityCardService.getSafetyInfo().subscribe(data => {
      this.siteInfo = data;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      title: [this.selected.name],
      hideTitle: [this.selected.extraProperties.hideTitle],
      refreshRate: [this.selected.extraProperties.refreshRate, [this.integerValidator(), this.qtyGreaterThanZeroValidator()]],
    });
  }

  deleteWidget() {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.widget, this.selected.name]
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.updateChange.emit({ type: 'delete', widget: this.selected });
      }
    });
  }

  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
  }

  openSettings() {
    this.buildForm();
    this.isSettingsModalVisible = true;
  }

  saveSettings() {
    if (this.form.invalid) {
      return;
    }
    const requestBody: any = {
      dashboardId: this.selected.dashboardId,
      seq: this.selected.seq,
      widgetName: this.selected.widgetName,
      name: this.form.value.title,
      description: this.selected.description,
      tenantId: this.selected.tenantId,
      displayName: this.selected.displayName,
      id: this.selected.id,
      extraProperties: {
        refreshRate: this.form.value.refreshRate,
        hideTitle: this.form.value.hideTitle,
      }
    }

    this.updateChange.emit({ type: 'update', widget: requestBody });
    this.isSettingsModalVisible = false;
    this.selected = requestBody;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  qtyGreaterThanZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value > 0;
      return isValid ? null : { qtyGreaterThanZero: { value: control.value } };
    };
  }

  integerValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isInteger = Number.isInteger(control.value);
      return isInteger ? null : { 'notInteger': { value: control.value } };
    };
  }

}
