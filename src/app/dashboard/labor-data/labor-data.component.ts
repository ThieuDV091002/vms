import { ConfigStateService, LocalizationService } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ShiftService } from '@apis/general';
import { ShiftPatternByDateDto, ShiftDto, ShiftByDataTierItemDto } from '@apis/general/dtos';
import { LaborDataService, ProductService, WorkOrderDataService } from '@apis/general/production-review';
import { ProductDto } from '@apis/general/production-review/dtos';
import { debounceTime, finalize, forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { AppUtils } from 'src/app/modeling/utils/app.utils';

@Component({
  selector: 'app-labor-data',
  templateUrl: './labor-data.component.html',
  styleUrl: './labor-data.component.scss'
})
export class LaborDataComponent implements OnInit, OnChanges {
  @Input() openAddLaborData: false;
  @Input() dataTierTreeNode;
  @Input() selectedDataTier;
  @Input() assignedAndDefaultDataTiers;
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshList: EventEmitter<boolean> = new EventEmitter();

  isModalVisible = false;
  modalBusy = false;
  form: FormGroup;
  info: string;

  areaData = [];
  cellData = [];
  workCenterData = [];
  productData: ProductDto[] = [];
  currentShift: ShiftPatternByDateDto;
  shiftData: ShiftByDataTierItemDto[] = [];
  shiftIntervaltData = [];
  subscription: Subscription;
  shiftByDateSubscription: Subscription;
  productInput$ = new Subject<string | null>();
  debounceTime = 500;
  wholeShiftInterval = [];
  wholeShiftIntervalSelected = [];

  constructor(private fb: FormBuilder,
    private workOrderDataService: WorkOrderDataService,
    private configService: ConfigStateService,
    private productService: ProductService,
    private datePipe: DatePipe,
    private toasterService: ToasterService,
    private localizationService: LocalizationService,
    private shiftService: ShiftService,
    private laborDataService: LaborDataService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) {
      this.buildForm();
    }

    if (changes.openAddLaborData && changes.openAddLaborData.currentValue) {
      this.open();
    }

    // Set Area data
    if (changes.dataTierTreeNode && changes.dataTierTreeNode.currentValue) {
      const assignedDataTiers = JSON.parse(JSON.stringify(AppUtils.getAccessTreNode(this.dataTierTreeNode)));
      assignedDataTiers.forEach(element => {
        if (element.disabled) {
          element.disabled = false;
        }
        if (element.children) {
          element.children = element.children.map(cell => {
            if (cell.children) {
              const validWorkCenters = cell.children.filter(wc => !wc.disabled);
              if (validWorkCenters.length > 0) {
                return { ...cell, disabled: false, children: validWorkCenters };
              }
            }
            return null;
          })
            .filter(cell => cell !== null);
        }
      });
      this.areaData = assignedDataTiers.filter(x => x.children && x.children.length > 0);
    }

    if (changes.assignedAndDefaultDataTiers && changes.assignedAndDefaultDataTiers.currentValue) {
      if (changes.selectedDataTier && changes.selectedDataTier.currentValue) {
        if (changes.selectedDataTier.currentValue.area) {
          this.form.controls['area'].setValue(changes.selectedDataTier.currentValue.area.id);
        }
        if (changes.selectedDataTier.currentValue.cell) {
          this.form.controls['cell'].setValue(changes.selectedDataTier.currentValue.cell.id);
        }
        if (changes.selectedDataTier.currentValue.workCenter) {
          this.form.controls['workCenter'].setValue(changes.selectedDataTier.currentValue.workCenter.id);
        }
      } else {
        const defaultDataTier = this.assignedAndDefaultDataTiers?.defaultDataTier;
        if (defaultDataTier?.areaId) {
          this.form.controls['area'].setValue(defaultDataTier?.areaId);
        }
        if (defaultDataTier?.cellId) {
          this.form.controls['cell'].setValue(defaultDataTier?.cellId);
        }
        if (defaultDataTier?.workCenterId) {
          this.form.controls['workCenter'].setValue(defaultDataTier?.workCenterId);
        }
      }
      let dataTier = {
        workCenters: [],
        cells: [],
        areas: []
      };
      if (this.form.controls['area'].value) {
        dataTier.areas = [this.form.controls['area'].value];
      }
      if (this.form.controls['cell'].value) {
        dataTier.cells = [this.form.controls['cell'].value];
      }
      if (this.form.controls['workCenter'].value) {
        dataTier.workCenters = [this.form.controls['workCenter'].value];
      }
      this.getCurrentShift({ areaIds: dataTier.areas, cellIds: dataTier.cells, wrokCenterIds: dataTier.workCenters });
    }
  }

  ngOnInit(): void {
    this.getProductData();
    this.productInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.getProductData(searchItem);
      });
    this.localizationService.get('::LaborData').subscribe(data => {
      this.info = data
    });
  }

  getCurrentShift(dataTier: { areaIds: string[], cellIds: string[], wrokCenterIds: string[] }) {
    if (this.shiftByDateSubscription) {
      this.shiftByDateSubscription.unsubscribe();
    }
    this.shiftByDateSubscription = this.shiftService.getShiftByDate(new Date().toISOString(), {
      areaIds: dataTier.areaIds ? dataTier.areaIds : [],
      cellIds: dataTier.cellIds ? dataTier.cellIds : [],
      wrokCenterIds: dataTier.wrokCenterIds ? dataTier.wrokCenterIds : []
    }).subscribe((res) => {
      this.currentShift = res;
      this.form.controls['productionDate'].setValue(new Date(this.currentShift.productionDate));
      this.shiftIntervaltData = this.shiftData.find(x => x.shiftId === this.currentShift.shiftId)?.shiftIncrementList;
      this.form.controls['shift'].setValue(this.currentShift.shiftId);
      this.getCurrentShiftInterval();
    });
  }

  getShiftByDataTier(dataTier: { areaIds: string[], cellIds: string[], wrokCenterIds: string[] }) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.shiftService.getShiftByDataTier({ areaIds: dataTier.areaIds ?? [], cellIds: dataTier.cellIds ?? [], wrokCenterIds: dataTier.wrokCenterIds ?? [] }).subscribe(res => {
      this.shiftData = res.items;
      this.getCurrentShift(dataTier)
    });
  }

  getCurrentShiftInterval() {
    const currentTime = new Date(this.currentShift.productionDate.substring(0, 19));
    const result = this.currentShift.intervalList.find(range => {
      const [start, end] = range.split(' to ');
      const [startHours, startMinutes] = start.split(':').map(Number);
      const [endHours, endMinutes] = end.split(':').map(Number);

      const startTime = new Date(this.currentShift.productionDate);
      startTime.setHours(startHours, startMinutes, 0, 0);

      const endTime = new Date(this.currentShift.productionDate);
      endTime.setHours(endHours, endMinutes, 0, 0);

      return currentTime >= startTime && currentTime <= endTime;
    });
    this.form.controls['shiftInterval'].setValue([result]);
  }

  getProductData(searchItem = '') {
    this.productService.getList({
      filter: searchItem ?? '',
      maxResultCount: 10
    }).subscribe(data => {
      this.productData = data.items;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      area: [undefined, Validators.required],
      cell: [undefined, Validators.required],
      workCenter: [undefined, Validators.required],
      workOrder: [undefined, Validators.required],
      workOrderQty: [0],
      product: [undefined, Validators.required],
      productName: [undefined],
      productionDate: [undefined, Validators.required],
      shift: [undefined, Validators.required],
      staffNeeded: [0, [Validators.required, this.integerValidator(), this.qtyGreaterThanZeroValidator()]],
      shiftInterval: [[], Validators.required],
      staffActual: [0, [Validators.required, this.integerValidator(), this.qtyGreaterThanZeroValidator()]],
      applyToWholeShift: [false],
      operation: [undefined]
    });

    this.form.controls['area'].valueChanges.subscribe(value => {
      if (value) {
        this.cellData = this.areaData.find(x => x.id === value)?.children;
        this.form.controls['cell'].setValue(undefined, { emitEvent: false });
        this.form.controls['workCenter'].setValue(undefined, { emitEvent: false });
        this.getShiftByDataTier({ areaIds: [value], cellIds: [], wrokCenterIds: [] })
      } else {
        this.cellData = [];
        this.workCenterData = [];
        this.form.controls['cell'].setValue(undefined, { emitEvent: false });
        this.form.controls['workCenter'].setValue(undefined, { emitEvent: false });
      }
      this.form.controls['workOrder'].setValue(undefined);
      this.form.controls['workOrderQty'].setValue(0);
      this.form.controls['product'].setValue(undefined);
      this.form.controls['staffNeeded'].setValue(0);
      this.form.controls['shift'].setValue(undefined);
      this.form.controls['operation'].setValue(undefined);
    });

    this.form.controls['cell'].valueChanges.subscribe(value => {
      if (value) {
        this.workCenterData = this.cellData.find(x => x.id === value)?.children;
        this.getShiftByDataTier({ areaIds: [this.form.controls['area'].value], cellIds: [value], wrokCenterIds: [] })
      } else {
        this.workCenterData = [];
        this.getShiftByDataTier({ areaIds: [this.form.controls['area'].value], cellIds: [], wrokCenterIds: [] })
      }
      this.form.controls['workCenter'].setValue(undefined, { emitEvent: false });
      this.form.controls['workOrder'].setValue(undefined);
      this.form.controls['workOrderQty'].setValue(0);
      this.form.controls['product'].setValue(undefined);
      this.form.controls['staffNeeded'].setValue(0);
      this.form.controls['shift'].setValue(undefined);
      this.form.controls['operation'].setValue(undefined);
    });

    this.form.controls['workCenter'].valueChanges.subscribe(value => {
      if (value) {
        this.workOrderDataService.getList({ workCenterId: value, maxResultCount: 1 }).subscribe(data => {
          if (data.items.length > 0) {
            const workCenterOrderData = data.items[0];
            this.form.controls['workOrder'].setValue(workCenterOrderData.workOrder);
            this.form.controls['workOrderQty'].setValue(workCenterOrderData.workOrderQty);
            this.form.controls['product'].setValue(workCenterOrderData.productId);

            const product = this.productData.find(x => x.id === workCenterOrderData.productId);
            this.form.controls['productName'].setValue(product?.displayName);
            this.getProductData(product?.displayName);

            this.form.controls['staffNeeded'].setValue(workCenterOrderData.staffNeeded);
            this.form.controls['operation'].setValue(workCenterOrderData.operation);
          } else {
            this.form.controls['workOrder'].setValue(undefined);
            this.form.controls['workOrderQty'].setValue(0);
            this.form.controls['product'].setValue(undefined);
            this.form.controls['staffNeeded'].setValue(0);
            this.form.controls['operation'].setValue(undefined);
          }
        });
        this.getShiftByDataTier({ areaIds: this.form.controls['area'].value ? [this.form.controls['area'].value] : [], cellIds: this.form.controls['cell'].value ? [this.form.controls['cell'].value] : [], wrokCenterIds: [value] })
      } else {
        this.form.controls['workOrder'].setValue(undefined);
        this.form.controls['workOrderQty'].setValue(0);
        this.form.controls['product'].setValue(undefined);
        this.form.controls['staffNeeded'].setValue(0);
        this.form.controls['operation'].setValue(undefined);
        this.getShiftByDataTier({ areaIds: this.form.controls['area'].value ? [this.form.controls['area'].value] : [], cellIds: this.form.controls['cell'].value ? [this.form.controls['cell'].value] : [], wrokCenterIds: [] })
      }
      this.form.controls['shift'].setValue(undefined);
    });

    this.form.controls['shift'].valueChanges.subscribe(value => {
      if (value) {
        this.shiftIntervaltData = this.shiftData.find(x => x.shiftId === value)?.shiftIncrementList?.map(x => ({ name: x }));
      } else {
        this.shiftIntervaltData = [];
      }
      this.form.controls['shiftInterval'].setValue([]);
    })

    this.form.controls['applyToWholeShift'].valueChanges.subscribe(value => {
      if (value) {
        this.form.controls['shiftInterval'].setValue(this.shiftIntervaltData.map(x => x.name), { emitEvent: false });
        const parsedIntervals = this.shiftIntervaltData.map(interval => {
          const [start, end] = interval.name.split(' to ');
          return { start, end };
        });

        const earliestStart = parsedIntervals[0].start;
        const latestEnd = parsedIntervals[parsedIntervals.length - 1].end;
        const shiftInterval = `${earliestStart} to ${latestEnd}`;
        this.wholeShiftIntervalSelected = [shiftInterval]
        this.wholeShiftInterval = [{ name: shiftInterval }];
      } else {
        this.form.controls['shiftInterval'].setValue([]);
      }
    });

    this.form.controls['shiftInterval'].valueChanges.subscribe(value => {
      if (value?.length === this.shiftIntervaltData?.length && this.shiftIntervaltData?.length > 0) {
        this.form.controls['applyToWholeShift'].setValue(true);
      } else {
        if (this.form.controls['applyToWholeShift'].value) {
          this.form.controls['applyToWholeShift'].setValue(false, { emitEvent: false });
        }
      }
    });

    this.form.controls['product'].valueChanges.subscribe(value => {
      if (value) {
        const product = this.productData.find(x => x.id === value);
        if (product) {
          this.form.controls['productName'].setValue(product.displayName);
        } else {
          this.form.controls['productName'].setValue(undefined);
        }
      }
    })
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

  close(event?: any) {
    if (!event) {
      this.isModalVisible = false;
      this.form.reset('', { emitEvent: false });
      this.closeEvent.emit(true);
    }
  }

  open() {
    this.isModalVisible = true;
  }

  selectedChanges(event, type) {
    if (type === 'shiftInterval') {
      if (event.length > 0) {
        this.form.controls['shiftInterval'].setValue(event.map(e => e.name));
      } else {
        this.form.controls['shiftInterval'].setValue([]);
      }
    }
  }

  save() {
    if (this.form.invalid || this.modalBusy) {
      return;
    }

    const requestBody = {
      workCenterId: this.form.controls['workCenter'].value,
      recordTimestamp: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      workOrder: this.form.controls['workOrder'].value,
      productId: this.form.controls['product'].value,
      staffActual: this.form.controls['staffActual'].value,
      staffNeeded: this.form.controls['staffNeeded'].value,
      tenantId: this.configService.getOne('currentUser').tenantId,
      workCenterName: this.workCenterData.find(x => x.id === this.form.controls['workCenter'].value).displayName,
      productName: this.form.controls['productName'].value,
      operation: this.form.controls['operation'].value
    }

    let addDataRequestArray: Observable<any>[] = [];
    if (this.form.controls['applyToWholeShift'].value) {
      addDataRequestArray = this.addLabordaData(requestBody, this.shiftIntervaltData.map(x => x.name));
    } else {
      addDataRequestArray = this.addLabordaData(requestBody, this.form.controls['shiftInterval'].value);
    }

    this.modalBusy = true;

    forkJoin(addDataRequestArray).pipe(finalize(() => { this.modalBusy = false; })).subscribe((res) => {
      const workCenterName = this.workCenterData.filter(x => x.id === this.form.controls['workCenter'].value).map(x => x.name)[0];
      this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
        messageLocalizationParams: [this.info, workCenterName],
      });
      this.refreshList.emit(true);
      this.close();
    });

  }

  addLabordaData(requestBody, intervalList) {
    const intervals = this.findContinuousIntervals(intervalList);
    return intervals.map(interval => {
      return this.laborDataService.insertbyShiftIntervalByInput({
        ...requestBody,
        productionDateStartTime: interval.start.toISOString(),
        productionDateEndTime: interval.end.toISOString()
      });
    });
  }

  findContinuousIntervals(intervals: string[]): { start: Date, end: Date }[] {
    const productionDate = new Date(this.form.controls['productionDate'].value);

    const sortedIntervals = intervals.sort((a, b) => {
      const indexA = this.shiftIntervaltData.findIndex(x => x.name === a);
      const indexB = this.shiftIntervaltData.findIndex(x => x.name === b);
      return indexA - indexB;
    });

    let previousEndDate: Date | null = null;

    const parsedIntervals = sortedIntervals.map(interval => {
      const [start, end] = interval.split(' to ');
      const startDate = new Date(productionDate);
      const endDate = new Date(productionDate);

      const [startHours, startMinutes] = start.split(':').map(Number);
      const [endHours, endMinutes] = end.split(':').map(Number);

      startDate.setHours(startHours, startMinutes, 0, 0);
      endDate.setHours(endHours, endMinutes, 0, 0);

      // if the end time is less than the start time, it means it crosses midnight
      if (endDate < startDate) {
        productionDate.setDate(productionDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);
      }

      // if the start time is less than the previous end time, it means it crosses midnight
      if (previousEndDate && startDate < previousEndDate) {
        productionDate.setDate(productionDate.getDate() + 1);
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);
      }

      previousEndDate = endDate;

      return { start: startDate, end: endDate };
    });

    // sort intervals by start time
    parsedIntervals.sort((a, b) => a.start.getTime() - b.start.getTime());

    // merge continuous intervals
    const continuousIntervals: { start: Date, end: Date }[] = [];
    let currentInterval = parsedIntervals[0];

    for (let i = 1; i < parsedIntervals.length; i++) {
      const nextInterval = parsedIntervals[i];

      // if current interval end time is greater than or equal to next interval start time, merge them
      if (currentInterval.end.getTime() >= nextInterval.start.getTime()) {
        currentInterval.end = new Date(Math.max(currentInterval.end.getTime(), nextInterval.end.getTime()));
      } else {
        // if they are not continuous, push the current interval to the result and move to the next one
        continuousIntervals.push(currentInterval);
        currentInterval = nextInterval;
      }
    }

    // save the last interval
    continuousIntervals.push(currentInterval);

    return continuousIntervals;
  }

  selectChange(event, type) {
    if (type === 'area') {
      if (event?.id) {
        this.form.controls['area'].setValue(event.id);
      }
      else {
        this.form.controls['area'].setValue(undefined);
      }
    }

    if (type === 'cell') {
      if (event?.id) {
        this.form.controls['cell'].setValue(event.id);
      }
      else {
        this.form.controls['cell'].setValue(undefined);
      }
    }

    if (type === 'workCenter') {
      if (event?.id) {
        this.form.controls['workCenter'].setValue(event.id);
      }
      else {
        this.form.controls['workCenter'].setValue(undefined);
      }
    }

    if (type === 'product') {
      if (event?.id) {
        this.form.controls['product'].setValue(event.id);
      }
      else {
        this.form.controls['product'].setValue(undefined);
      }
    }
  }


}
