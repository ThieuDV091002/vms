import { LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivityCardService } from '@apis/ticket';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-zero-incident-by-days-widget',
  templateUrl: './zero-incident-by-days-widget.component.html',
  styleUrl: './zero-incident-by-days-widget.component.scss'
})
export class ZeroIncidentByDaysWidgetComponent implements OnInit, OnChanges, OnDestroy {
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
  startDate: string;
  endDate: string;
  dataTier: any;
  dataTierParams = {
    dataTierType: '',
    dataTierIdList: []
  }
  countData = 0;

  constructor(private confirmation: ConfirmationService,
    private localizationService: LocalizationService,
    private fb: FormBuilder,
    private activityCardService: ActivityCardService,
    private datePipe: DatePipe
  ) {


  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected && changes.selected.currentValue) {
      this.selected = changes.selected.currentValue;
    }

    if (changes.selectedDataTier && changes.selectedDataTier.currentValue) {
      this.dataTier = changes.selectedDataTier.currentValue;
      if (this.type === 'unsafe') {
        this.getUnsafeCount();
      } else {
        this.getZeroIncidentDays();
      }
    }

  }

  ngOnInit(): void {
    if (this.type === 'unsafe') {
      this.startDate = this.datePipe.transform(this.getDate30DaysAgo(), 'dd-MMM-yyyy');
      this.endDate = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    }
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widget = data;
    });
  }

  editDatatierList() {
    if (this.dataTier.cells?.length > 0) {
      this.dataTierParams.dataTierType = 'Cell';
      this.dataTierParams.dataTierIdList = this.dataTier.cells.map(x => x.id);
      return;
    }

    if (this.dataTier.areas?.length > 0) {
      this.dataTierParams.dataTierType = 'Area';
      this.dataTierParams.dataTierIdList = this.dataTier.areas.map(x => x.id);
      return;
    }
  }

  getZeroIncidentDays() {
    this.editDatatierList();
    if (this.dataTierParams.dataTierIdList.length > 0) {
      this.activityCardService.getZeroIncidentDaysByInput({ dataTierList: this.dataTierParams.dataTierIdList, dataTierType: this.dataTierParams.dataTierType }).subscribe(data => {
        this.countData = data;
      });
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.subscription = interval(this.selected.extraProperties.refreshRate * 60 * 1000).subscribe(() => {
        this.activityCardService.getZeroIncidentDaysByInput({ dataTierList: this.dataTierParams.dataTierIdList, dataTierType: this.dataTierParams.dataTierType }).subscribe(data => {
          this.countData = data;
        });
      });
    }

  }

  getUnsafeCount() {
    this.editDatatierList();
    if (this.dataTierParams.dataTierIdList.length > 0) {
      const startDate = this.datePipe.transform(this.getDate30DaysAgo(), 'yyyy-MM-dd');
      const endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.activityCardService.getUnsafeConditionCountsByInput({ startDate: startDate, endDate: endDate, dataTierList: this.dataTierParams.dataTierIdList, dataTierType: this.dataTierParams.dataTierType }).subscribe(data => {
        this.countData = data;
      });
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.subscription = interval(this.selected.extraProperties.refreshRate * 60 * 1000).subscribe(() => {
        this.activityCardService.getUnsafeConditionCountsByInput({ startDate: startDate, endDate: endDate, dataTierList: this.dataTierParams.dataTierIdList, dataTierType: this.dataTierParams.dataTierType }).subscribe(data => {
          this.countData = data;
        });
      });
    }
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
    if (this.type === 'unsafe') {
      this.getUnsafeCount();
    } else {
      this.getZeroIncidentDays();
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

  getDate30DaysAgo(): Date {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 30);
    return pastDate;
  }

}
