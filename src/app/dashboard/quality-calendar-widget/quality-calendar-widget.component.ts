import { LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CellHuddleDailySummaryDataService, ShiftService } from '@apis/general';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarApi, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DashboardUtils } from '../utils';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quality-calendar-widget',
  templateUrl: './quality-calendar-widget.component.html',
  styleUrl: './quality-calendar-widget.component.scss'
})
export class QualityCalendarWidgetComponent implements OnInit, OnChanges {
  @Input() selected: any = { title: '', url: '', hideTitle: false };
  @Input() index = -1;
  @Input() type: string;
  @Input() selectedDataTier;
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('qualityCalendar') calendarComponent: FullCalendarComponent;
  @Input() queryId;
  @Input() expandChart = false;
  @Input() isFPY: any;
  @Input() isUPPH: any;
  @Input() dataTierTreeNode;
  isSettingsModalVisible = false;
  form: FormGroup;
  widget: string;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    themeSystem: 'bootstrap',
    height: '100%',
    contentHeight: '80%',
    fixedWeekCount: false, // Disable fixed week count
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: '',
      center: '',
      right: ''
    },
    // titleFormat: { year: 'numeric', month: 'short' },
    datesSet: this.handleDatesSet.bind(this),
    dayCellClassNames: this.handleDayCellClassNames.bind(this),
    events: [],
    editable: true
  };
  calendarApi: CalendarApi;
  filterCells = [];
  filterAreas = [];
  dateRange = {
    startDate: '',
    endDate: ''
  };
  request: any;
  title = '';
  date = '';
  calendarData: any[] = [];
  subscription: Subscription;

  constructor(private confirmation: ConfirmationService,
    private localizationService: LocalizationService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private kpiDataService: CellHuddleDailySummaryDataService,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
  ) {

  }

  handleDayCellClassNames(arg) {
    if (arg.isToday) {
      return ['fc-day-today-override'];
    }
    return [];
  }

  handleDatesSet(arg) {
    this.calendarApi = this.calendarComponent.getApi();
    const view = this.calendarApi.view;
    const start = view.activeStart;
    let end = view.activeEnd;
    end = new Date(end);
    end.setDate(end.getDate() - 1);
    this.dateRange.startDate = this.datePipe.transform(start, 'yyyy-MM-dd')
    this.dateRange.endDate = this.datePipe.transform(end, 'yyyy-MM-dd')
    this.date = this.datePipe.transform(this.calendarApi.getDate(), 'MMM yyyy');

    this.calendarApi.updateSize();
    if ((this.filterAreas && this.filterAreas.length) > 0 || (this.filterCells && this.filterCells.length > 0)) {
      this.monthChange();
    }
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    DashboardUtils.refreshCalendar.subscribe(() => {
      this.calendarApi?.updateSize();
    });
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widget = data;
    });
    this.themeService.listenToThemeChanges(this.editDateEvent);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected && changes.selected.currentValue) {
      this.selected = changes.selected.currentValue;
    }

    if (changes.isFPY || changes.isUPPH) {
      this.switchTarget();
    }

    if (changes.selectedDataTier && changes.selectedDataTier.currentValue) {
      const selectedCells = changes.selectedDataTier.currentValue.cells ? changes.selectedDataTier.currentValue.cells.map(cell => cell.id) : [];
      this.filterAreas = changes.selectedDataTier.currentValue.areas ?
        changes.selectedDataTier.currentValue.areas.map(area => {
          if (selectedCells.length > 0) {
            const areaTreeNode = this.dataTierTreeNode.find(node => node.id === area.id && node.type === 'Area');
            const cellChildren = areaTreeNode ? areaTreeNode.children.map(child => child.id) : [];
            if (!cellChildren.some(childId => selectedCells.includes(childId))) {
              return area.id;
            };
          } else {
            return area.id;
          }
        }).filter(areaId => areaId !== undefined) :
        [];
      this.filterCells = selectedCells;

      if (((this.filterAreas && this.filterAreas.length) > 0 || (this.filterCells && this.filterCells.length > 0)) && this.dateRange.startDate && this.dateRange.endDate) {
        // Quality Calendar
        if (this.type === 'quality') {
          if (this.isFPY) {
            this.request = this.kpiDataService.getFpyDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
            this.title = '::LABEL_FPYPercentage';
          } else {
            this.request = this.kpiDataService.sppmDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
            this.title = '::LABEL_SPPM';
          }
        }

        // Performance Calendar
        if (this.type === 'performance') {
          if (this.isUPPH) {
            this.request = this.kpiDataService.upphDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
            this.title = '::LABEL_UPPH';
          } else {
            this.request = this.kpiDataService.performanceDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
            this.title = '::LABEL_Eff';
          }
        }

        // Availability Calendar
        if (this.type === 'availability') {
          this.request = this.kpiDataService.udtDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
          this.title = '::LABEL_UDT';
        }

        if (this.subscription) {
          this.subscription.unsubscribe();
        }
        this.subscription = this.request.subscribe((res) => {
          this.calendarData = res;
          this.editDateEvent();
        });
      }
    }
  }

  switchTarget() {
    if ((this.filterAreas && this.filterAreas.length) > 0 || (this.filterCells && this.filterCells.length > 0)) {
      if (this.type === 'quality') {
        if (this.isFPY) {
          this.title = '::LABEL_FPYPercentage';
          this.request = this.kpiDataService.getFpyDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
        } else {
          this.title = '::LABEL_SPPM';
          this.request = this.kpiDataService.sppmDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
        }
      }

      if (this.type === 'performance') {
        if (this.isUPPH) {
          this.title = '::LABEL_UPPH';
          this.request = this.kpiDataService.upphDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
        } else {
          this.title = '::LABEL_Eff';
          this.request = this.kpiDataService.performanceDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
        }
      }

      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.subscription = this.request.subscribe((res) => {
        this.calendarData = res;
        this.editDateEvent();
      });
    }
  }

  monthChange() {
    if (this.type === 'quality') {
      if (this.isFPY) {
        this.title = '::LABEL_FPYPercentage';
        this.request = this.kpiDataService.getFpyDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
      } else {
        this.title = '::LABEL_SPPM';
        this.request = this.kpiDataService.sppmDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
      }
    }

    if (this.type === 'performance') {
      if (this.isUPPH) {
        this.title = '::LABEL_UPPH';
        this.request = this.kpiDataService.upphDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
      } else {
        this.title = '::LABEL_Eff';
        this.request = this.kpiDataService.performanceDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
      }

    }

    if (this.type === 'availability') {
      this.title = '::LABEL_UDT';
      this.request = this.kpiDataService.udtDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.request.subscribe((res) => {
      this.calendarData = res;
      this.editDateEvent();
    });
  }

  editDateEvent = () => {
    const event = this.calendarData.filter(x => {
      if (this.type === 'quality') {
        if (this.isFPY) {
          return x.dailyFPY !== 0;
        } else {
          return x.dailySPPM !== 0;
        }
      }
      if (this.type === 'performance') {
        if (this.isUPPH) {
          return x.dailyUPPH !== 0;
        } else {
          return x.dailyPerformance !== 0;
        }
      }
      if (this.type === 'availability') {
        return x.dailyUnplannedDowntime !== 0;
      }
      return true;
    }).map(x => {
      const eventDate = this.datePipe.transform(x.date.split('T')[0], 'yyyy-MM-dd')
      return {
        start: eventDate,
        end: eventDate,
        display: 'background',
        color: this.setCalendarColor(x)
      }
    });
    this.calendarOptions.events = event;
  }

  setCalendarColor(kpiData) {
    const isDarkTheme = this.themeService.isDarkTheme();
    // Quality Calendar
    if (this.type === 'quality') {
      if (this.isFPY) {
        // if daily FPY over target show red, else show green (FPY)
        if (kpiData.dailyFPYKPI === 3) {
          return isDarkTheme ? '#76021b' : '#ea0437';
        } else if (kpiData.dailyFPYKPI === 1) {
          return isDarkTheme ? '#506d1c' : '#c1e18a';
        }
      } else {
        // if daily SPPM over target show red, else show green (SPPM)
        if (kpiData.dailySPPMKPI === 3) {
          return isDarkTheme ? '#76021b' : '#ea0437';
        } else if (kpiData.dailySPPMKPI === 1) {
          return isDarkTheme ? '#506d1c' : '#c1e18a';
        }
      }
    }

    // Performance Calendar
    if (this.type === 'performance') {
      // if daily UPPH or Performance below target show red, else show green (UPPH or Performance)
      if (this.isUPPH) {
        if (kpiData.dailyUPPHKPI === 1) {
          return isDarkTheme ? '#506d1c' : '#c1e18a';
        } else if (kpiData.dailyUPPHKPI === 3) {
          return isDarkTheme ? '#76021b' : '#ea0437';
        }
      } else {
        if (kpiData.dailyPerformanceKPI === 1) {
          return isDarkTheme ? '#506d1c' : '#c1e18a';
        } else if (kpiData.dailyPerformanceKPI === 3) {
          return isDarkTheme ? '#76021b' : '#ea0437';
        }
      }
    }

    // Availability Calendar
    if (this.type === 'availability') {
      // if daily Unplanned Downtime over target show red, else show green
      if (kpiData.dailyUnplannedDowntimeKPI === 3) {
        return isDarkTheme ? '#76021b' : '#ea0437';
      } else if (kpiData.dailyUnplannedDowntimeKPI === 1) {
        return isDarkTheme ? '#506d1c' : '#c1e18a';
      }
    }
  }

  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
    setTimeout(() => {
      this.calendarApi.updateSize();
    }, 0);
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

  buildForm() {
    this.form = this.fb.group({
      title: [this.selected.name],
      hideTitle: [this.selected.extraProperties.hideTitle],
      refreshRate: [this.selected.extraProperties.refreshRate, [this.integerValidator(), this.qtyGreaterThanZeroValidator()]],
    });
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

  // saveSettings() {
  //   if (this.form.invalid) {
  //     return;
  //   }
  //   const requestBody: any = {
  //     dashboardId: this.selected.dashboardId,
  //     seq: this.selected.seq,
  //     widgetName: this.selected.widgetName,
  //     name: this.form.value.title,
  //     description: this.selected.description,
  //     tenantId: this.selected.tenantId,
  //     displayName: this.selected.displayName,
  //     id: this.selected.id,
  //     extraProperties: {
  //       refreshRate: this.form.value.refreshRate,
  //       hideTitle: this.form.value.hideTitle,
  //     }
  //   }

  //   this.updateChange.emit({ type: 'update', widget: requestBody });
  //   this.isSettingsModalVisible = false;
  //   this.selected = requestBody;
  // }

}
