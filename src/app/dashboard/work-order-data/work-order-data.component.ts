import { ConfigStateService, LocalizationService } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ProductService, WorkOrderDataService } from '@apis/general/production-review';
import { ProductDto, ProductionDataDto } from '@apis/general/production-review/dtos';
import { debounceTime, finalize, Subject } from 'rxjs';
import { AppUtils } from 'src/app/modeling/utils/app.utils';

@Component({
  selector: 'app-work-order-data',
  templateUrl: './work-order-data.component.html',
  styleUrl: './work-order-data.component.scss'
})
export class WorkOrderDataComponent implements OnInit, OnChanges {

  @Input() openAddWorkOrderData: false;
  @Input() dataTierTreeNode;
  @Input() selectedDataTier;
  @Input() assignedAndDefaultDataTiers;
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter();
  isModalVisible = false;
  modalBusy = false;
  form: FormGroup;
  info: string;

  areaData = [];
  cellData = [];
  workCenterData = [];
  productData: ProductDto[] = [];
  productInput$ = new Subject<string | null>();
  debounceTime = 500;

  constructor(private fb: FormBuilder,
    private workOrderDataService: WorkOrderDataService,
    private configService: ConfigStateService,
    private productService: ProductService,
    private datePipe: DatePipe,
    private toasterService: ToasterService,
    private localizationService: LocalizationService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) {
      this.buildForm();
    }

    if (changes.openAddWorkOrderData && changes.openAddWorkOrderData.currentValue) {
      this.open();
    }

    // Set Area data
    if (changes.dataTierTreeNode && changes.dataTierTreeNode.currentValue) {
      const assignedDataTiers = JSON.parse(JSON.stringify(AppUtils.getAccessTreNode(this.dataTierTreeNode)));
      assignedDataTiers.forEach(element => {
        if (element.disabled) {
          element.disabled = false;
        }
        element.children = element.children.filter(x => !x.disabled);
      });
      this.areaData = assignedDataTiers.filter(x => x.children.length > 0);
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
    this.localizationService.get('::WorkOrderData').subscribe(data => {
      this.info = data
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
      currentRunningOrder: [{ value: undefined, disabled: true }],
      currentRunningOrderQty: [{ value: undefined, disabled: true }],
      currentRunningProduct: [{ value: undefined, disabled: true }],
      currentOrderUPH: [{ value: undefined, disabled: true }],
      currentRunningBaseQty: [{ value: undefined, disabled: true }],
      currentStaffNeeded: [{ value: undefined, disabled: true }],
      currentWorkOrderId: [undefined],
      workOrder: [undefined, Validators.required],
      workOrderQty: [0, [Validators.required, this.qtyGreaterThanZeroValidator()]],
      product: [undefined, Validators.required],
      productName: [undefined],
      UPH: [0, [Validators.required, this.qtyGreaterThanZeroValidator()]],
      staffNeeded: [0],
      baseQty: [0, [Validators.required,this.qtyGreaterThanZeroValidator()]],
      recordTimestamp: [new Date(), Validators.required],
      currentOperation: [{ value: undefined, disabled: true }], 
      operation: [undefined],
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
    });

    this.form.controls['cell'].valueChanges.subscribe(value => {
      if (value) {
        this.workCenterData = this.cellData.find(x => x.id === value)?.children;
        this.form.controls['workCenter'].setValue(undefined);
      } else {
        this.workCenterData = [];
        this.form.controls['workCenter'].setValue(undefined);
      }
    });

    this.form.controls['workCenter'].valueChanges.subscribe(value => {
      if (value) {
        this.workOrderDataService.getList({ workCenterId: value, maxResultCount: 1 }).subscribe(data => {
          if (data.items.length > 0) {
            const workCenterOrderData = data.items[0];
            this.form.controls['currentRunningOrder'].setValue(workCenterOrderData.workOrder);
            this.form.controls['currentRunningOrderQty'].setValue(workCenterOrderData.workOrderQty);
            this.form.controls['currentRunningProduct'].setValue(workCenterOrderData.productName);
            this.form.controls['currentOrderUPH'].setValue(workCenterOrderData.uph);
            this.form.controls['currentRunningBaseQty'].setValue(workCenterOrderData.baseQty);
            this.form.controls['currentStaffNeeded'].setValue(workCenterOrderData.staffNeeded);
            this.form.controls['currentWorkOrderId'].setValue(workCenterOrderData.id);
            this.form.controls['currentOperation'].setValue(workCenterOrderData.operation);
          } else {
            this.form.controls['currentRunningOrder'].setValue(undefined);
            this.form.controls['currentRunningOrderQty'].setValue(undefined);
            this.form.controls['currentRunningProduct'].setValue(undefined);
            this.form.controls['currentOrderUPH'].setValue(undefined);
            this.form.controls['currentRunningBaseQty'].setValue(undefined);
            this.form.controls['currentStaffNeeded'].setValue(undefined);
            this.form.controls['currentWorkOrderId'].setValue(undefined);
            this.form.controls['currentOperation'].setValue(undefined);
          }
        });
      } else {
        this.form.controls['currentRunningOrder'].setValue(undefined);
        this.form.controls['currentRunningOrderQty'].setValue(undefined);
        this.form.controls['currentRunningProduct'].setValue(undefined);
        this.form.controls['currentOrderUPH'].setValue(undefined);
        this.form.controls['currentRunningBaseQty'].setValue(undefined);
        this.form.controls['currentStaffNeeded'].setValue(undefined);
        this.form.controls['currentWorkOrderId'].setValue(undefined);
        this.form.controls['currentOperation'].setValue(undefined);
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

  save() {
    if (this.form.invalid || this.modalBusy) {
      return;
    }

    const requestBody = {
      workCenterId: this.form.controls['workCenter'].value,
      recordTimestamp: new Date(this.form.controls['recordTimestamp'].value).toISOString(),
      workOrder: this.form.controls['workOrder'].value,
      workOrderQty: this.form.controls['workOrderQty'].value,
      productId: this.form.controls['product'].value,
      uph: this.form.controls['UPH'].value,
      staffNeeded: this.form.controls['staffNeeded'].value,
      baseQty: this.form.controls['baseQty'].value,
      tenantId: this.configService.getOne('currentUser').tenantId,
      workCenterName: this.workCenterData.find(x => x.id === this.form.controls['workCenter'].value).displayName,
      productName: this.form.controls['productName'].value,
      operation: this.form.controls['operation'].value,
    }

    this.modalBusy = true;
    const request = this.form.controls['currentWorkOrderId'].value ?
      this.workOrderDataService.update(this.form.controls['currentWorkOrderId'].value, requestBody) :
      this.workOrderDataService.create(requestBody);
    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      const workCenterName = this.workCenterData.filter(x => x.id === this.form.controls['workCenter'].value).map(x => x.name)[0];
      if (!this.form.controls['currentWorkOrderId'].value) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, workCenterName],
        });
      } else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, workCenterName],
        });
      }
      this.close();
    });
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
