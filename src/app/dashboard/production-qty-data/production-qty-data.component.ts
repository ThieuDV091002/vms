import { ConfigStateService, LocalizationService, SessionStateService } from '@abp/ng.core';
import { ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BreaktimeDataService, DowntimeDataService, ProductionDataService, ProductService, WorkOrderDataService } from '@apis/general/production-review';
import { ProductDto } from '@apis/general/production-review/dtos';
import { debounceTime, distinctUntilChanged, finalize, forkJoin, Subject, Subscription } from 'rxjs';
import { AppUtils } from 'src/app/modeling/utils/app.utils';

@Component({
  selector: 'app-production-qty-data',
  templateUrl: './production-qty-data.component.html',
  styleUrl: './production-qty-data.component.scss'
})
export class ProductionQtyDataComponent implements OnChanges, OnInit {
  @Input() openAddProductionData: false;
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
  language: string;
  recordedMins = 0;
  lastRecordTimestampLabel: string;
  recordTimestampEndLabel: string;
  maxRecordTimeSubscription: Subscription;
  maxLastRecordTimestamp: Date;
  productInput$ = new Subject<string | null>();
  debounceTime = 500;
  showDuplicateWarning = false;

  constructor(private fb: FormBuilder,
    private workOrderDataService: WorkOrderDataService,
    private configService: ConfigStateService,
    private productService: ProductService,
    private datePipe: DatePipe,
    private toasterService: ToasterService,
    private localizationService: LocalizationService,
    private productionDataService: ProductionDataService,
    private session: SessionStateService,
    private confirmationService: ConfirmationService,
    private breaktimeDataService: BreaktimeDataService,
    private downtimeDataService: DowntimeDataService,

  ) {
    this.language = session.getLanguage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) {
      this.buildForm();
    }

    if (changes.openAddProductionData && changes.openAddProductionData.currentValue) {
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
    }
  }

  ngOnInit(): void {
    this.getProductData();
    this.productInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.getProductData(searchItem);
      });
    this.localizationService.get('::ProductionData').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::Label_LastRecordTimestamp').subscribe(data => {
      this.lastRecordTimestampLabel = data
    });
    this.localizationService.get('::Label_RecordTimestamp').subscribe(data => {
      this.recordTimestampEndLabel = data
    });
  }

  getProductData(searchItem = '') {
    this.productService.getList({
      filter: searchItem,
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
      workOrderQty: [0, [Validators.required, this.qtyGreaterThanZeroValidator()]],
      product: [undefined, Validators.required],
      productName: [undefined],
      lastRecordTimestamp: [undefined, Validators.required],
      recordTimestamp: [this.roundDownToNearestFiveMinutes(new Date()), Validators.required],
      producedQty: [0, [Validators.required, this.qtyGreaterThanZeroValidator()]],
      operation: [undefined]
    });

    this.form.controls['area'].valueChanges.subscribe(value => {
      if (value) {
        this.cellData = this.areaData.find(x => x.id === value)?.children;
        this.form.controls['cell'].setValue(undefined, { emitEvent: false });
        this.form.controls['workCenter'].setValue(undefined);
      } else {
        this.cellData = [];
        this.workCenterData = [];
        this.form.controls['cell'].setValue(undefined, { emitEvent: false });
        this.form.controls['workCenter'].setValue(undefined);
      }
      this.form.controls['operation'].setValue(undefined);
    });

    this.form.controls['cell'].valueChanges.subscribe(value => {
      if (value) {
        this.workCenterData = this.cellData.find(x => x.id === value)?.children;
        this.form.controls['workCenter'].setValue(undefined);
      } else {
        this.workCenterData = [];
        this.form.controls['workCenter'].setValue(undefined);
      }
      this.form.controls['operation'].setValue(undefined);
    });

    this.form.controls['workCenter'].valueChanges.subscribe(value => {
      if (value) {
        this.workOrderDataService.getList({ workCenterId: value, maxResultCount: 1 }).subscribe(data => {
          if (data.items.length > 0) {
            const workCenterOrderData = data.items[0];
            this.form.controls['workOrder'].setValue(workCenterOrderData.workOrder, { emitEvent: false });
            this.form.controls['workOrderQty'].setValue(workCenterOrderData.workOrderQty);
            this.form.controls['product'].setValue(workCenterOrderData.productId, { emitEvent: false });
            this.form.controls['productName'].setValue(workCenterOrderData.productName);
            this.form.controls['operation'].setValue(workCenterOrderData.operation);
            this.getProductData(workCenterOrderData.productName);
          } else {
            this.form.controls['workOrder'].setValue(undefined, { emitEvent: false });
            this.form.controls['workOrderQty'].setValue(0);
            this.form.controls['product'].setValue(undefined, { emitEvent: false });
            this.form.controls['operation'].setValue(undefined);
          }
          this.getMaxLastRecordTimestamp(value)
        });

      } else {
        this.form.controls['workOrder'].setValue(undefined, { emitEvent: false });
        this.form.controls['workOrderQty'].setValue(0);
        this.form.controls['product'].setValue(undefined, { emitEvent: false });
        this.form.controls['operation'].setValue(undefined);
      }
    });

    this.form.controls['workOrder'].valueChanges.subscribe(() => {
      this.getMaxLastRecordTimestamp();
    });

    this.form.controls['product'].valueChanges.subscribe((value) => {
      if (value) {
        const product = this.productData.find(x => x.id === value);
        if (product) {
          this.form.controls['productName'].setValue(product.displayName);
        } else {
          this.form.controls['productName'].setValue(undefined);
        }
      }
    });

    // listen to changes in lastRecordTimestamp and recordTimestamp fields
    this.form.controls['lastRecordTimestamp'].valueChanges.subscribe((value) => {
      this.calculateRecordedMins();
      if (value) {
        this.getExistsRecord();
      } else {
        this.showDuplicateWarning = false;
      }
    });

    this.form.controls['recordTimestamp'].valueChanges.subscribe(() => {
      this.calculateRecordedMins();
      if (this.form.controls['lastRecordTimestamp'].value) {
        this.getExistsRecord();
      } else {
        this.showDuplicateWarning = false;
      }
    });
  }

  getMaxLastRecordTimestamp(workCenter?: string) {
    let workCenters: Array<string> = workCenter ? [workCenter] : this.form.controls['workCenter'].value ? [this.form.controls['workCenter'].value] : [];

    if (workCenters.length === 0) {
      return;
    }

    let areas: Array<string> = [];
    let cells: Array<string> = [];
    let workOrder = this.form.controls['workOrder'].value;
    if (this.maxRecordTimeSubscription) {
      this.maxRecordTimeSubscription.unsubscribe();
    }
    this.maxRecordTimeSubscription = forkJoin({
      productData: this.productionDataService.getList({ workCenters: workCenters, areas: areas, cells: cells, workOrder: workOrder, maxResultCount: 1, sorting: 'recordTimestamp desc' }),
      breaktimeData: this.breaktimeDataService.getList({ workCenters: workCenters, areas: areas, cells: cells, workOrder: workOrder, maxResultCount: 1, sorting: 'recordTimestamp desc' }),
      downtimeData: this.downtimeDataService.getList({ workCenters: workCenters, areas: areas, cells: cells, workOrder: workOrder, maxResultCount: 1, sorting: 'recordTimestamp desc' })
    }).subscribe(data => {
      const productLastRecordTimestamp = data.productData.items.length > 0 ? new Date(data.productData.items[0].recordTimestamp) : null;
      const breaktimeLastRecordTimestamp = data.breaktimeData.items.length > 0 ? new Date(data.breaktimeData.items[0].recordTimestamp) : null;
      const downtimeLastRecordTimestamp = data.downtimeData.items.length > 0 ? new Date(data.downtimeData.items[0].recordTimestamp) : null;

      const timestamps = [productLastRecordTimestamp, breaktimeLastRecordTimestamp, downtimeLastRecordTimestamp].filter(timestamp => timestamp !== null);
      const maxTimestamp = timestamps.length > 0 ? new Date(Math.max(...timestamps.map(timestamp => timestamp.getTime()))) : null;

      if (maxTimestamp) {
        this.form.controls['lastRecordTimestamp'].setValue(new Date(this.formatDate(maxTimestamp)));
        this.maxLastRecordTimestamp = new Date(this.formatDate(maxTimestamp));
      } else {
        this.form.controls['lastRecordTimestamp'].setValue(undefined);
        this.maxLastRecordTimestamp = null;
      }
    });
  }

  // calculate recorded minutes
  calculateRecordedMins() {
    const start = this.form.controls['lastRecordTimestamp'].value;
    const end = this.form.controls['recordTimestamp'].value;

    if (start && end) {
      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();

      if (endTime > startTime) {
        this.recordedMins = Math.floor((endTime - startTime) / (1000 * 60));
      } else {
        this.recordedMins = 0;
      }
    } else {
      this.recordedMins = 0;
    }
  }

  formatDate(date: any) {
    return new Date(date?.toString() + '+00:00').toLocaleString();
  }

  qtyGreaterThanZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value > 0;
      return isValid ? null : { qtyGreaterThanZero: { value: control.value } };
    };
  }

  roundDownToNearestFiveMinutes(date: Date): Date {
    const ms = 1000 * 60 * 5;
    return new Date(Math.floor(date.getTime() / ms) * ms);
  }

  getExistsRecord() {
    if (this.recordedMins === 0 || !this.form.controls['workCenter'].value || !this.form.controls['workOrder'].value || !this.form.controls['lastRecordTimestamp'].value || !this.form.controls['recordTimestamp'].value) {
      return false;
    }
    this.productionDataService.getList(
      {
        workCenters: [this.form.controls['workCenter'].value],
        areas: [],
        cells: [],
        workOrder: this.form.controls['workOrder'].value,
        recordStartTimestamp: new Date(this.form.controls['lastRecordTimestamp'].value).toISOString(),
        recordEndTimestamp: new Date(this.form.controls['recordTimestamp'].value).toISOString(),
        maxResultCount: 100
      }).subscribe(data => {
        if (data.items.length > 0) {
          this.showDuplicateWarning = true;
          return true;
        } else {
          this.showDuplicateWarning = false;
          return false;
        }
      });
  }

  save() {
    if (this.form.invalid || this.modalBusy) {
      return;
    }

    if (this.recordedMins === 0) {
      this.confirmationService.warn('::LABEL_EndtimeLaterThanStartTime', '', {
        messageLocalizationParams: [this.recordTimestampEndLabel, this.lastRecordTimestampLabel],
        hideCancelBtn: true,
        yesText: 'AbpAccount::Close',
      });
      return;
    }

    if (this.showDuplicateWarning) {
      this.confirmationService.warn('::LABEL_ProductionDataOverrideConfirmation', '', {
        yesText: 'AbpUi::Yes',
        cancelText: 'AbpUi::No',
      }).subscribe((result) => {
        if (result === 'confirm') {
          this.saveAndClose();
        }
      });
    } else {
      this.saveAndClose();
    }
  }

  saveAndClose() {
    const requestBody = {
      workCenterId: this.form.controls['workCenter'].value,
      recordTimestamp: this.datePipe.transform(this.form.controls['recordTimestamp'].value, 'yyyy-MM-dd HH:mm:ss'),
      workOrder: this.form.controls['workOrder'].value,
      productId: this.form.controls['product'].value,
      plannedQty: 0,
      baseQty: 0,
      producedQty: this.form.controls['producedQty'].value,
      refSourceId: '',
      tenantId: this.configService.getOne('currentUser').tenantId,
      startTime: new Date(this.form.controls['lastRecordTimestamp'].value).toISOString(),
      endTime: new Date(this.form.controls['recordTimestamp'].value).toISOString(),
      workCenterName: this.workCenterData.find(x => x.id === this.form.controls['workCenter'].value).displayName,
      productName: this.form.controls['productName'].value,
      operation: this.form.controls['operation'].value
    }

    this.modalBusy = true;
    this.productionDataService.insertProductionDataByRangeByInput(requestBody).pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      const workCenterName = this.workCenterData.filter(x => x.id === this.form.controls['workCenter'].value).map(x => x.name)[0];
      this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
        messageLocalizationParams: [this.info, workCenterName],
      });
      this.refreshList.emit(true);
      this.close();
    });
  }

  open() {
    this.isModalVisible = true;
  }

  close(event?: any) {
    if (!event) {
      this.isModalVisible = false;
      this.form.reset('', { emitEvent: false });
      this.closeEvent.emit(true);
    }
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
