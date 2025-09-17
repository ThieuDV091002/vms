import { ConfigStateService, LocalizationService } from '@abp/ng.core';
import { ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { LocalBreaktimeReasonService } from '@apis/general';
import { LocalBreaktimeReasonDto } from '@apis/general/dtos';
import { WorkOrderDataService, ProductService, BreaktimeDataService } from '@apis/general/production-review';
import { ProductDto } from '@apis/general/production-review/dtos';
import { debounceTime, finalize, Subject } from 'rxjs';
import { AppUtils } from 'src/app/modeling/utils/app.utils';

@Component({
  selector: 'app-breaktime-data',
  templateUrl: './breaktime-data.component.html',
  styleUrl: './breaktime-data.component.scss'
})
export class BreaktimeDataComponent implements OnInit, OnChanges {
  @Input() openAddBreaktimeData: false;
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
  breaktimeReasonData: LocalBreaktimeReasonDto[] = [];
  recordedMins = 0;
  breaktimeStartLabel: string;
  breaktimeEndLabel: string;
  productInput$ = new Subject<string | null>();
  debounceTime = 500;

  constructor(private fb: FormBuilder,
    private workOrderDataService: WorkOrderDataService,
    private configService: ConfigStateService,
    private productService: ProductService,
    private datePipe: DatePipe,
    private toasterService: ToasterService,
    private localizationService: LocalizationService,
    private breaktimeDataService: BreaktimeDataService,
    private localBreaktimeReasonService: LocalBreaktimeReasonService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) {
      this.buildForm();
    }

    if (changes.openAddBreaktimeData && changes.openAddBreaktimeData.currentValue) {
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
    this.getBreaktimeReasonData();
    // label need to update
    this.localizationService.get('::BreaktimeData').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::Label_BreaktimeStart').subscribe(data => {
      this.breaktimeStartLabel = data
    });
    this.localizationService.get('::Label_BreaktimeEnd').subscribe(data => {
      this.breaktimeEndLabel = data
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

  getBreaktimeReasonData() {
    this.localBreaktimeReasonService.getAllInstances().subscribe(res => {
      this.breaktimeReasonData = res;
    })
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
      breaktimeStart: [new Date(), Validators.required],
      breaktimeEnd: [new Date(), [Validators.required]],
      breaktimeReason: [undefined],
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
      this.form.controls['productName'].setValue(undefined);
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
      this.form.controls['productName'].setValue(undefined);
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
            this.form.controls['operation'].setValue(workCenterOrderData.operation);

            const product = this.productData.find(x => x.id === workCenterOrderData.productId);
            this.form.controls['productName'].setValue(product?.displayName);
            this.getProductData(product?.displayName);
          } else {
            this.form.controls['workOrder'].setValue(undefined);
            this.form.controls['workOrderQty'].setValue(0);
            this.form.controls['product'].setValue(undefined);
            this.form.controls['operation'].setValue(undefined);
          }
        });
      } else {
        this.form.controls['workOrder'].setValue(undefined);
        this.form.controls['workOrderQty'].setValue(0);
        this.form.controls['product'].setValue(undefined);
        this.form.controls['operation'].setValue(undefined);
      }
    });

    // listen to changes in breaktime start and end time
    this.form.controls['breaktimeStart'].valueChanges.subscribe(() => {
      this.calculateRecordedMins();
    });

    this.form.controls['breaktimeEnd'].valueChanges.subscribe(() => {
      this.calculateRecordedMins();
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

  // calculate recorded minutes
  calculateRecordedMins() {
    const start = this.form.controls['breaktimeStart'].value;
    const end = this.form.controls['breaktimeEnd'].value;

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

  open() {
    this.isModalVisible = true;
  }

  close(event?: any) {
    if (!event) {
      this.isModalVisible = false;
      this.form.reset();
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

  save() {
    if (this.form.invalid || this.modalBusy) {
      return;
    }

    if (this.recordedMins === 0) {
      this.confirmationService.warn('::LABEL_EndtimeLaterThanStartTime', '', {
        messageLocalizationParams: [this.breaktimeEndLabel, this.breaktimeStartLabel],
        hideCancelBtn: true,
        yesText: 'AbpAccount::Close',
      });
      return;
    }

    const requestBody = {
      workCenterId: this.form.controls['workCenter'].value,
      recordTimestamp: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      workOrder: this.form.controls['workOrder'].value,
      productId: this.form.controls['product'].value,
      localBreaktimeReasonId: this.form.controls['breaktimeReason'].value,
      refSourceId: '',
      tenantId: this.configService.getOne('currentUser').tenantId,
      startTime: new Date(this.form.controls['breaktimeStart'].value).toISOString(),
      endTime: new Date(this.form.controls['breaktimeEnd'].value).toISOString(),
      localBreaktimeReason: this.form.controls['breaktimeReason'].value ? this.breaktimeReasonData.find(x => x.id === this.form.controls['breaktimeReason'].value).name : '',
      workCenterName: this.workCenterData.find(x => x.id === this.form.controls['workCenter'].value).displayName,
      productName: this.form.controls['productName'].value,
      operation: this.form.controls['operation'].value
    }

    this.modalBusy = true;
    this.breaktimeDataService.insertBreaktimeDataByRangeByInput(requestBody).pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      const workCenterName = this.workCenterData.filter(x => x.id === this.form.controls['workCenter'].value).map(x => x.name)[0];
      this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
        messageLocalizationParams: [this.info, workCenterName],
      });
      this.refreshList.emit(true);
      this.close();
    });
  }
}
