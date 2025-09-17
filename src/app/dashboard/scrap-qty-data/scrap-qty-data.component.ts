import { ConfigStateService, LocalizationService } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { LocalScrapReasonService } from '@apis/general';
import { LocalScrapReasonDto } from '@apis/general/dtos';
import { ProductService, ScrapDataService, WorkOrderDataService } from '@apis/general/production-review';
import { ProductDto } from '@apis/general/production-review/dtos';
import { debounceTime, finalize, Subject } from 'rxjs';
import { AppUtils } from 'src/app/modeling/utils/app.utils';

interface ScrapData {
  scrapReason: string;
  scrapQty: number;
}

@Component({
  selector: 'app-scrap-qty-data',
  templateUrl: './scrap-qty-data.component.html',
  styleUrl: './scrap-qty-data.component.scss'
})
export class ScrapQtyDataComponent implements OnChanges, OnInit {
  @Input() openAddScrapData: false;
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
  scrapReasonData: LocalScrapReasonDto[] = [];
  scrapList: ScrapData[] = [
    {
      scrapReason: undefined,
      scrapQty: 0
    }
  ];
  selectedScrap: ScrapData[] = [];
  scrapResonVaild = true;
  productInput$ = new Subject<string | null>();
  debounceTime = 500;

  constructor(private fb: FormBuilder,
    private workOrderDataService: WorkOrderDataService,
    private configService: ConfigStateService,
    private productService: ProductService,
    private datePipe: DatePipe,
    private toasterService: ToasterService,
    private localizationService: LocalizationService,
    private scrapDataService: ScrapDataService,
    private localScrapReasonService: LocalScrapReasonService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) {
      this.buildForm();
    }

    if (changes.openAddScrapData && changes.openAddScrapData.currentValue) {
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
    this.getScrapReasonData();
    this.localizationService.get('::ScrapData').subscribe(data => {
      this.info = data
    });
  }

  getScrapReasonData() {
    this.localScrapReasonService.getList({ maxResultCount: 100 }).subscribe(data => {
      this.scrapReasonData = data.items;
    }
    );
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
      recordTimestamp: [this.roundDownToNearestFiveMinutes(new Date()), Validators.required],
      totalScrapQty: [{ value: 0, disabled: true }],
      operation: [undefined]
    });

    this.form.controls['area'].valueChanges.subscribe(value => {
      if (value) {
        this.cellData = this.areaData.find(x => x.id === value).children;
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
        this.workCenterData = this.cellData.find(x => x.id === value).children;
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
            this.form.controls['workOrder'].setValue(workCenterOrderData.workOrder);
            this.form.controls['workOrderQty'].setValue(workCenterOrderData.workOrderQty);
            this.form.controls['product'].setValue(workCenterOrderData.productId);
            this.form.controls['productName'].setValue(workCenterOrderData.productName);
            this.form.controls['operation'].setValue(workCenterOrderData.operation);
            this.getProductData(workCenterOrderData.productName);
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

  roundDownToNearestFiveMinutes(date: Date): Date {
    const ms = 1000 * 60 * 5;
    return new Date(Math.floor(date.getTime() / ms) * ms);
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

  create() {
    this.scrapList = [...this.scrapList, {
      scrapReason: undefined,
      scrapQty: 0
    }];
    if (!this.scrapResonVaild) {
      this.scrapResonCheck();
    }
  }

  delete() {
    let sum = 0;
    this.selectedScrap.forEach(item => {
      if (item !== null && item !== undefined) {
        sum += item.scrapQty;
      }
    });
    this.form.controls['totalScrapQty'].setValue(this.form.controls['totalScrapQty'].value - sum);
    this.scrapList = this.scrapList.filter(x => !this.selectedScrap.includes(x));
    this.selectedScrap = [];
    this.scrapResonCheck();
  }

  scrapResonCheck() {
    if (this.scrapList.length > 0) {
      setTimeout(() => {
        const allValid = this.scrapList.every(item => item.scrapReason && Number(item.scrapQty) > 0);
        if (allValid) {
          this.scrapResonVaild = false;
        } else {
          this.scrapResonVaild = true;
        }
      }, 0);
    } else {
      this.scrapResonVaild = true;
    }
  }

  sumScrapQty() {
    this.scrapResonCheck();
    setTimeout(() => {
      let sum = 0;
      this.scrapList.forEach(item => {
        if (item !== null && item !== undefined) {
          sum += item.scrapQty;
        }
      });
      this.form.controls['totalScrapQty'].setValue(sum);
    }, 0);
  }

  save() {
    if (this.form.invalid || this.modalBusy || this.scrapResonVaild) {
      return;
    }

    const requestBody = {
      workCenterId: this.form.controls['workCenter'].value,
      recordTimestamp: new Date(this.form.controls['recordTimestamp'].value).toISOString(),
      workOrder: this.form.controls['workOrder'].value,
      productId: this.form.controls['product'].value,
      scrapDataList: this.scrapList.map(x => { return { localScrapReasonId: x.scrapReason, localScrapReason: this.scrapReasonData.find(s => s.id === x.scrapReason).name, scrapQty: x.scrapQty, globalScrapCodeId: '' } }),
      refSourceId: '',
      tenantId: this.configService.getOne('currentUser').tenantId,
      workCenterName: this.workCenterData.find(x => x.id === this.form.controls['workCenter'].value).displayName,
      productName: this.form.controls['productName'].value,
      operation: this.form.controls['operation'].value
    }

    this.modalBusy = true;
    this.scrapDataService.insertScrapDataByRangeByInput(requestBody).pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      const workCenterName = this.workCenterData.filter(x => x.id === this.form.controls['workCenter'].value).map(x => x.name)[0];
      this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
        messageLocalizationParams: [this.info, workCenterName],
      });
      this.refreshList.emit(true);
      this.close();
    });
  }

}
