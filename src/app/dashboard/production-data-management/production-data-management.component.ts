import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto, PermissionService } from '@abp/ng.core';
import { ConfirmationService, Confirmation, ToasterService } from '@abp/ng.theme.shared';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FileType, LocalBreaktimeReasonService, LocalDowntimeReasonService, LocalScrapReasonService } from '@apis/general';
import { LocalBreaktimeReasonDto, LocalDowntimeReasonDto, LocalScrapReasonDto } from '@apis/general/dtos';
import { BreaktimeDataService, DowntimeDataService, LaborDataService, ProductionDataService, ProductService, ReworkDataService, ScrapDataService } from '@apis/general/production-review';
import { ProductDto } from '@apis/general/production-review/dtos';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { debounceTime, finalize, Subject, Subscription } from 'rxjs';
import { AppUtils } from 'src/app/modeling/utils/app.utils';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-production-data-management',
  templateUrl: './production-data-management.component.html',
  styleUrl: './production-data-management.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'ProductionDataManagementComponent'
    }
  ],
})
export class ProductionDataManagementComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() selected: any;
  @Input() index = -1;
  @Input() dataTierTreeNode;
  @Input() selectedDataTier;
  @Input() assignedAndDefaultDataTiers;
  @Input() type: string;

  @ViewChild('myTable') table: DatatableComponent;
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();

  isCollapse = false;
  @Input() expandChart = false;
  @Input() queryId;

  isSettingsModalVisible = false;
  isModalVisible = false;
  modalBusy = false;
  openAddData = false;
  hideTitle = false;
  pageSize: number;
  widgetTitle: string;

  form: FormGroup;
  filterForm: FormGroup;
  widget: string;
  info: string;
  productData: ProductDto[] = [];
  scrapReasonData: LocalScrapReasonDto[] = [];
  downtimeReasonData: LocalDowntimeReasonDto[] = [];
  breaktimeReasonData: LocalBreaktimeReasonDto[] = [];
  areaData = [];
  subscription: Subscription;
  data: PagedResultDto<any> = { totalCount: 0, items: [] };
  dataTier = {
    workCenters: [],
    cells: [],
    areas: []
  };
  language: string;
  selectedData: any;
  filterSearchHasValue = false;
  productInput$ = new Subject<string | null>();
  debounceTime = 500;

  constructor(private confirmation: ConfirmationService,
    private localizationService: LocalizationService,
    private productService: ProductService,
    private fb: FormBuilder,
    private laborDataService: LaborDataService,
    private productionDataService: ProductionDataService,
    private scrapDataService: ScrapDataService,
    private reworkDataService: ReworkDataService,
    private downtimeDataService: DowntimeDataService,
    private breaktimeDataService: BreaktimeDataService,
    public list: ListService<any>,
    private permissionService: PermissionService,
    private localScrapReasonService: LocalScrapReasonService,
    private downtimeResonService: LocalDowntimeReasonService,
    private localBreaktimeReasonService: LocalBreaktimeReasonService,
    private toasterService: ToasterService
  ) {

  }

  ngAfterViewInit(): void {
    this.table.limit = this.pageSize;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected && changes.selected.currentValue) {
      this.widgetTitle = this.selected.name;
      this.pageSize = this.selected.extraProperties?.pageSize;
      this.hideTitle = this.selected.extraProperties?.hideTitle;
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

    if (changes.selectedDataTier && changes.selectedDataTier.currentValue) {
      this.dataTier = {
        workCenters: [],
        cells: [],
        areas: []
      };
      const selectedDataTier = changes.selectedDataTier.currentValue;
      if (selectedDataTier.workCenters?.length > 0) {
        this.dataTier.workCenters = selectedDataTier.workCenters.map(x => x.id);
      } else if (selectedDataTier.cells?.length > 0) {
        this.dataTier.cells = selectedDataTier.cells.map(x => x.id);
      } else if (selectedDataTier.areas?.length > 0) {
        this.dataTier.areas = selectedDataTier.areas.map(x => x.id);
      }
      this.lodaDataByType();
    }

  }

  ngOnInit(): void {
    this.buildFilterForm();
    this.lodaDataByType();
    this.getProductData();
    this.productInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.getProductData(searchItem);
      });
    if (this.type === 'scrapQtyData') {
      this.getScrapReasonData();
    }
    if (this.type === 'downtimeData') {
      this.getDowntimeReasonData()
    }
    if (this.type === 'breaktimeData') {
      this.getBreaktimeReasonData()

    }
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widget = data;
    });
  }

  getPermission() {
    let permission = {
      edit: '',
      delete: '',
      create: ''
    };
    switch (this.type) {
      case 'laborData':
        permission = {
          edit: 'LaborData.Edit',
          delete: 'LaborData.Delete',
          create: 'LaborData.Create'
        }
        break;
      case 'productionQtyData':
        permission = {
          edit: 'ProductionData.Edit',
          delete: 'ProductionData.Delete',
          create: 'ProductionData.Create'
        }
        break;
      case 'scrapQtyData':
        permission = {
          edit: 'ScrapData.Edit',
          delete: 'ScrapData.Delete',
          create: 'ScrapData.Create'
        }
        break;
      case 'reworkQtyData':
        permission = {
          edit: 'ReworkData.Edit',
          delete: 'ReworkData.Delete',
          create: 'ReworkData.Create'
        }
        break;
      case 'downtimeData':
        permission = {
          edit: 'DowntimeData.Edit',
          delete: 'DowntimeData.Delete',
          create: 'DowntimeData.Create'
        }
        break;
      case 'breaktimeData':
        permission = {
          edit: 'BreaktimeData.Edit',
          delete: 'BreaktimeData.Delete',
          create: 'BreaktimeData.Create'
        }
        break;
    }
    return permission;
  }

  lodaDataByType() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    let request;
    switch (this.type) {
      case 'laborData':
        request = this.list.hookToQuery((query) => {
          return this.laborDataService.getList(
            {
              ...query,
              workCenters: this.dataTier.workCenters,
              cells: this.dataTier.cells,
              areas: this.dataTier.areas,
              workOrder: this.filterForm.value.workOrder,
              productId: this.filterForm.value.product,
              recordStartTimestamp: this.filterForm.value.startRecordTimestamp?.toISOString(),
              recordEndTimestamp: this.filterForm.value.endRecordTimestamp?.toISOString(),
              maxResultCount: this.selected.extraProperties?.pageSize ? this.selected.extraProperties?.pageSize : 10,
              skipCount: this.table.offset * this.pageSize,
            }
          )
        });
        this.localizationService.get('::LaborData').subscribe(data => {
          this.info = data;
        });
        break;
      case 'productionQtyData':
        request = this.list.hookToQuery((query) => {
          return this.productionDataService.getList(
            {
              ...query,
              workCenters: this.dataTier.workCenters,
              cells: this.dataTier.cells,
              areas: this.dataTier.areas,
              workOrder: this.filterForm.value.workOrder,
              productId: this.filterForm.value.product,
              recordStartTimestamp: this.filterForm.value.startRecordTimestamp?.toISOString(),
              recordEndTimestamp: this.filterForm.value.endRecordTimestamp?.toISOString(),
              maxResultCount: this.selected.extraProperties?.pageSize ? this.selected.extraProperties?.pageSize : 10,
              skipCount: this.table.offset * this.pageSize,
            }
          )
        });
        this.localizationService.get('::ProductionData').subscribe(data => {
          this.info = data;
        });
        break;
      case 'scrapQtyData':
        request = this.list.hookToQuery((query) => {
          return this.scrapDataService.getList(
            {
              ...query,
              workCenters: this.dataTier.workCenters,
              cells: this.dataTier.cells,
              areas: this.dataTier.areas,
              workOrder: this.filterForm.value.workOrder,
              productId: this.filterForm.value.product,
              recordStartTimestamp: this.filterForm.value.startRecordTimestamp?.toISOString(),
              recordEndTimestamp: this.filterForm.value.endRecordTimestamp?.toISOString(),
              maxResultCount: this.selected.extraProperties?.pageSize ? this.selected.extraProperties?.pageSize : 10,
              skipCount: this.table.offset * this.pageSize,
            }
          )
        });
        this.localizationService.get('::ScrapData').subscribe(data => {
          this.info = data;
        });
        break;
      case 'reworkQtyData':
        request = this.list.hookToQuery((query) => {
          return this.reworkDataService.getList(
            {
              ...query,
              workCenters: this.dataTier.workCenters,
              cells: this.dataTier.cells,
              areas: this.dataTier.areas,
              workOrder: this.filterForm.value.workOrder,
              productId: this.filterForm.value.product,
              recordStartTimestamp: this.filterForm.value.startRecordTimestamp?.toISOString(),
              recordEndTimestamp: this.filterForm.value.endRecordTimestamp?.toISOString(),
              maxResultCount: this.selected.extraProperties?.pageSize ? this.selected.extraProperties?.pageSize : 10,
              skipCount: this.table.offset * this.pageSize,
            }
          )
        });
        this.localizationService.get('::LABEL_ReworkData').subscribe(data => {
          this.info = data;
        });
        break;
      case 'downtimeData':
        request = this.list.hookToQuery((query) => {
          return this.downtimeDataService.getList(
            {
              ...query,
              workCenters: this.dataTier.workCenters,
              cells: this.dataTier.cells,
              areas: this.dataTier.areas,
              workOrder: this.filterForm.value.workOrder,
              productId: this.filterForm.value.product,
              recordStartTimestamp: this.filterForm.value.startRecordTimestamp?.toISOString(),
              recordEndTimestamp: this.filterForm.value.endRecordTimestamp?.toISOString(),
              maxResultCount: this.selected.extraProperties?.pageSize ? this.selected.extraProperties?.pageSize : 10,
              skipCount: this.table.offset * this.pageSize,
            }
          )
        });
        this.localizationService.get('::DowntimeData').subscribe(data => {
          this.info = data;
        });
        break;
      case 'breaktimeData':
        request = this.list.hookToQuery((query) => {
          return this.breaktimeDataService.getList(
            {
              ...query,
              workCenters: this.dataTier.workCenters,
              cells: this.dataTier.cells,
              areas: this.dataTier.areas,
              workOrder: this.filterForm.value.workOrder,
              productId: this.filterForm.value.product,
              recordStartTimestamp: this.filterForm.value.startRecordTimestamp?.toISOString(),
              recordEndTimestamp: this.filterForm.value.endRecordTimestamp?.toISOString(),
              maxResultCount: this.selected.extraProperties?.pageSize ? this.selected.extraProperties?.pageSize : 10,
              skipCount: this.table.offset * this.pageSize,
            }
          )
        });
        this.localizationService.get('::BreaktimeData').subscribe(data => {
          this.info = data;
        });
        break;
    }
    this.subscription = request.subscribe(res => {
      this.data = res;
    });
  }

  buildForm() {
    let dataTier = {
      area: '',
      cell: '',
      workCenter: ''
    }
    this.areaData.forEach(area => {
      area.children.forEach(cell => {
        cell.children.forEach(workCenter => {
          if (workCenter.id === this.selectedData.workCenterId) {
            dataTier.area = area.name;
            dataTier.cell = cell.name;
            dataTier.workCenter = workCenter.name;
          }
        });
      });
    })

    this.form = this.fb.group({
      area: [{ value: dataTier.area, disabled: true }, Validators.required],
      cell: [{ value: dataTier.cell, disabled: true }, Validators.required],
      workCenterId: [{ value: dataTier.workCenter, disabled: true }, Validators.required],
      recordTimestamp: [new Date(this.formatDate(this.selectedData.recordTimestamp)), Validators.required],
      workOrder: [this.selectedData.workOrder, Validators.required],
      productId: [this.selectedData.productId, Validators.required],
      productName: [this.selectedData.productName],
      tenantId: [this.selectedData.tenantId || ''],
      operation: [this.selectedData.operation || ''],
    });
    this.getProductData(this.selectedData.productName);
    if (this.type === 'laborData') {
      this.form.addControl('staffNeeded', this.fb.control(this.selectedData.staffNeeded, [Validators.required, this.integerValidator(), this.qtyGreaterThanZeroValidator()]));
      this.form.addControl('staffActual', this.fb.control(this.selectedData.staffActual, [Validators.required, this.integerValidator(), this.qtyGreaterThanZeroValidator()]));
    }
    if (this.type === 'productionQtyData') {
      this.form.addControl('plannedQty', this.fb.control(this.selectedData.plannedQty, [Validators.required, this.qtyGreaterThanZeroValidator()]));
      this.form.addControl('baseQty', this.fb.control(this.selectedData.baseQty, [Validators.required, this.qtyGreaterThanZeroValidator()]));
      this.form.addControl('producedQty', this.fb.control(this.selectedData.producedQty, [Validators.required, this.qtyGreaterThanZeroValidator()]));
    }
    if (this.type === 'scrapQtyData') {
      this.form.addControl('scrapQty', this.fb.control(this.selectedData.scrapQty, [Validators.required, this.qtyGreaterThanZeroValidator()]));
      this.form.addControl('scrapReason', this.fb.control(this.selectedData.localScrapReasonId, Validators.required));
    }
    if (this.type === 'reworkQtyData') {
      this.form.addControl('reworkQty', this.fb.control(this.selectedData.reworkQty, [Validators.required, this.qtyGreaterThanZeroValidator()]));
    }
    if (this.type === 'downtimeData') {
      this.form.addControl('downtime', this.fb.control(this.selectedData.downtime, [Validators.required, this.qtyGreaterThanZeroValidator()]));
      this.form.addControl('downtimeReason', this.fb.control(this.selectedData.localDowntimeReasonId, Validators.required));
    }
    if (this.type === 'breaktimeData') {
      this.form.addControl('breaktime', this.fb.control(this.selectedData.breaktime, [Validators.required, this.qtyGreaterThanZeroValidator()]));
      this.form.addControl('breaktimeReason', this.fb.control(this.selectedData.localBreaktimeReasonId));
    }

    this.form.controls['productId'].valueChanges.subscribe((value) => {
      if (value) {
        const product = this.productData.find(x => x.id === value);
        if (product) {
          this.form.controls['productName'].setValue(product.displayName);
        } else {
          this.form.controls['productName'].setValue(undefined);
        }
      }
    });
  }

  integerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isInteger = Number.isInteger(control.value);
      return isInteger ? null : { notInteger: { value: control.value } };
    };
  }

  qtyGreaterThanZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value > 0;
      return isValid ? null : { qtyGreaterThanZero: { value: control.value } };
    };
  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      startRecordTimestamp: [undefined],
      endRecordTimestamp: [undefined],
      workOrder: [undefined],
      product: [undefined]
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


  getScrapReasonData() {
    this.localScrapReasonService.getList({ maxResultCount: 100 }).subscribe(data => {
      this.scrapReasonData = data.items;
    }
    );
  }

  getDowntimeReasonData() {
    this.downtimeResonService.getAllInstances().subscribe(res => {
      this.downtimeReasonData = res;
    })
  }

  getBreaktimeReasonData() {
    this.localBreaktimeReasonService.getAllInstances().subscribe(res => {
      this.breaktimeReasonData = res;
    })
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  add() {
    this.openAddData = true;
  }

  closeAddModal() {
    this.openAddData = false;
  }

  deleteLaborDataManagementWidget() {
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
    setTimeout(() => {
      this.table.recalculate();
    }, 0);
  }

  openSettings() {
    this.isSettingsModalVisible = true;
  }

  saveSettings() {
    if (this.widgetTitle === '' || [null, 0].includes(this.pageSize)) {
      return;
    }
    const requestBody: any = {
      dashboardId: this.selected.dashboardId,
      seq: this.selected.seq,
      widgetName: this.selected.widgetName,
      name: this.widgetTitle,
      description: this.selected.description,
      tenantId: this.selected.tenantId,
      displayName: this.selected.displayName,
      id: this.selected.id,
      extraProperties: {
        pageSize: this.pageSize.toString(),
        hideTitle: this.hideTitle
      }
    }

    this.updateChange.emit({ type: 'update', widget: requestBody });
    this.isSettingsModalVisible = false;
    this.selected = requestBody;
    this.pageSize = this.selected.extraProperties?.pageSize;
    this.list.get();
  }

  selectChange(event, type) {
    if (type === 'product') {
      if (event?.id) {
        this.filterForm.controls['product'].setValue(event.id);
      }
      else {
        this.filterForm.controls['product'].setValue(undefined);
      }
    }
  }

  hasEditOrDeletePermission() {
    let permission = false;
    switch (this.type) {
      case 'laborData':
        permission = this.permissionService.getGrantedPolicy('LaborData.Edit') || this.permissionService.getGrantedPolicy('LaborData.Delete')
        break;
      case 'productionQtyData':
        permission = this.permissionService.getGrantedPolicy('ProductionData.Edit') || this.permissionService.getGrantedPolicy('ProductionData.Delete')
        break;
      case 'scrapQtyData':
        permission = this.permissionService.getGrantedPolicy('ScrapData.Edit') || this.permissionService.getGrantedPolicy('ScrapData.Delete')
        break;
      case 'reworkQtyData':
        permission = this.permissionService.getGrantedPolicy('ReworkData.Edit') || this.permissionService.getGrantedPolicy('ReworkData.Delete')
        break;
      case 'downtimeData':
        permission = this.permissionService.getGrantedPolicy('DowntimeData.Edit') || this.permissionService.getGrantedPolicy('DowntimeData.Delete')
        break;
      case 'breaktimeData':
        permission = this.permissionService.getGrantedPolicy('BreaktimeData.Edit') || this.permissionService.getGrantedPolicy('BreaktimeData.Delete')
        break;
    }
    return permission;
  }

  formatDate(date: any) {
    return new Date(date?.toString() + '+00:00').toLocaleString();
  }

  edit(row) {
    let request;
    switch (this.type) {
      case 'laborData':
        request = this.laborDataService.get(row.id);
        break;
      case 'productionQtyData':
        request = this.productionDataService.get(row.id);
        break;
      case 'scrapQtyData':
        request = this.scrapDataService.get(row.id);
        break;
      case 'reworkQtyData':
        request = this.reworkDataService.get(row.id);
        break;
      case 'downtimeData':
        request = this.downtimeDataService.get(row.id);
        break;
      case 'breaktimeData':
        request = this.breaktimeDataService.get(row.id);
        break;
    }
    request.subscribe(res => {
      this.form = this.fb.group({});
      this.isModalVisible = true;
      this.selectedData = res;
      this.buildForm();
    });
  }

  save() {
    const formData = this.form.getRawValue();
    const requestBody: any = {
      workCenterId: this.selectedData.workCenterId,
      recordTimestamp: new Date(formData.recordTimestamp).toISOString(),
      workOrder: formData.workOrder,
      productId: formData.productId,
      tenantId: formData.tenantId,
      workCenterName: this.selectedData.workCenterName,
      productName: formData.productName,
      operation: formData.operation
    };
    let request;
    switch (this.type) {
      case 'laborData':
        requestBody['staffNeeded'] = formData.staffNeeded;
        requestBody['staffActual'] = formData.staffActual;
        request = this.laborDataService.update(this.selectedData.id, requestBody);
        break;
      case 'productionQtyData':
        requestBody['plannedQty'] = formData.plannedQty;
        requestBody['baseQty'] = formData.baseQty;
        requestBody['producedQty'] = formData.producedQty;
        request = this.productionDataService.update(this.selectedData.id, requestBody);
        break;
      case 'scrapQtyData':
        requestBody['scrapQty'] = formData.scrapQty;
        requestBody['localScrapReasonId'] = formData.scrapReason;
        requestBody['localScrapReason'] = this.scrapReasonData.find(x => x.id === formData.scrapReason).name;
        request = this.scrapDataService.update(this.selectedData.id, requestBody);
        break;
      case 'reworkQtyData':
        requestBody['reworkQty'] = formData.reworkQty;
        request = this.reworkDataService.update(this.selectedData.id, requestBody);
        break;
      case 'downtimeData':
        requestBody['downtime'] = formData.downtime;
        requestBody['localDowntimeReasonId'] = formData.downtimeReason;
        requestBody['localDowntimeReason'] = this.downtimeReasonData.find(x => x.id === formData.downtimeReason).name;
        request = this.downtimeDataService.update(this.selectedData.id, requestBody);
        break;
      case 'breaktimeData':
        requestBody['breaktime'] = formData.breaktime;
        requestBody['localBreaktimeReasonId'] = formData.breaktimeReason;
        requestBody['localBreaktimeReason'] = formData.breaktimeReason ? this.breaktimeReasonData.find(x => x.id === formData.breaktimeReason).name : '';
        request = this.breaktimeDataService.update(this.selectedData.id, requestBody);
        break;
    }

    this.modalBusy = true;
    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(res => {
      this.isModalVisible = false;
      this.getProductData();
      this.list.get();
      this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
        messageLocalizationParams: [this.info, formData.workCenterId],
      });
    });

  }

  delete(row) {
    let workCenter = '';
    this.areaData.forEach(area => {
      area.children.forEach(cell => {
        cell.children.forEach(wc => {
          if (wc.id === row.workCenterId) {
            workCenter = wc.name
          }
        });
      });
    })
    let request;
    switch (this.type) {
      case 'laborData':
        request = this.laborDataService.delete(row.id);
        break;
      case 'productionQtyData':
        request = this.productionDataService.delete(row.id);
        break;
      case 'scrapQtyData':
        request = this.scrapDataService.delete(row.id);
        break;
      case 'reworkQtyData':
        request = this.reworkDataService.delete(row.id);
        break;
      case 'downtimeData':
        request = this.downtimeDataService.delete(row.id);
        break;
      case 'breaktimeData':
        request = this.breaktimeDataService.delete(row.id);
        break;
    }

    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.info, workCenter]
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        request.subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.info, workCenter],
          });
          this.list.get();
        });
      }
    });
  }

  filterData() {
    const { startRecordTimestamp, endRecordTimestamp, workOrder, product } = this.filterForm.value;
    this.filterSearchHasValue = !!(startRecordTimestamp || endRecordTimestamp || workOrder || product);
    this.list.get();
  }

  ExportData(type: string) {
    const { startRecordTimestamp, endRecordTimestamp, workOrder, product } = this.filterForm.value;
    const requestBody: any = {
      workCenters: this.dataTier.workCenters,
      cells: this.dataTier.cells,
      areas: this.dataTier.areas,
      workOrder: workOrder,
      productId: product,
      recordStartTimestamp: startRecordTimestamp ? new Date(startRecordTimestamp).toISOString() : undefined,
      recordEndTimestamp: endRecordTimestamp ? new Date(endRecordTimestamp).toISOString() : undefined
    };
    switch (type) {
      case 'laborData':
        this.laborDataService.exportByInput(requestBody).subscribe(res => {
          saveAs(this.base64ToBlob(res.toString(), AppUtils.generateFileName('laborData', FileType.Excel)), AppUtils.generateFileName('laborData', FileType.Excel));
        });
        break;
      case 'productionQtyData':
        this.productionDataService.exportByInput(requestBody).subscribe(res => {
          saveAs(this.base64ToBlob(res.toString(), AppUtils.generateFileName('productionQtyData', FileType.Excel)), AppUtils.generateFileName('productionQtyData', FileType.Excel));
        });
        break;
      case 'scrapQtyData':
        this.scrapDataService.exportByInput(requestBody).subscribe(res => {
          saveAs(this.base64ToBlob(res.toString(), AppUtils.generateFileName('scrapQtyData', FileType.Excel)), AppUtils.generateFileName('scrapQtyData', FileType.Excel));
        });
        break;
      case 'reworkQtyData':
        this.reworkDataService.exportByInput(requestBody).subscribe(res => {
          saveAs(this.base64ToBlob(res.toString(), AppUtils.generateFileName('reworkQtyData', FileType.Excel)), AppUtils.generateFileName('reworkQtyData', FileType.Excel));
        });
        break;
      case 'downtimeData':
        this.downtimeDataService.exportByInput(requestBody).subscribe(res => {
          saveAs(this.base64ToBlob(res.toString(), AppUtils.generateFileName('downtimeData', FileType.Excel)), AppUtils.generateFileName('downtimeData', FileType.Excel));
        });
        break;
      case 'breaktimeData':
        this.breaktimeDataService.exportByInput(requestBody).subscribe(res => {
          saveAs(this.base64ToBlob(res.toString(), AppUtils.generateFileName('breaktimeData', FileType.Excel)), AppUtils.generateFileName('breaktimeData', FileType.Excel));
        });
        break;
    }
  }

  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

}
