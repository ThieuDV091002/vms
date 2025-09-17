import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShiftService } from '@apis/general';
import { ShiftPatternByDateDto } from '@apis/general/dtos';
import { ProductFamilyService, ProductSerieService, ProductService } from '@apis/general/production-review';
import { ProductDto, ProductFamilyDto, ProductSerieDto } from '@apis/general/production-review/dtos';
import { ActivityCardDto } from '@apis/ticket/dtos';
enum mode {
  ProductFamily = 'ProductFamily',
  ProductSeries = 'ProductSeries',
}
enum DataType {
  WorkOrder = 'WorkOrder',
  Labor = 'Labor',
  BreakTime = 'BreakTime',
  Downtime = 'Downtime',
  ProductQty = 'ProductQty',
  ScrapQty = 'ScrapQty',
  ReworkQty = 'ReworkQty',
}

@Component({
  selector: 'app-production-review-board',
  templateUrl: './production-review-board.component.html',
  styleUrl: './production-review-board.component.scss'
})
export class ProductionReviewBoardComponent implements OnInit {

  @Input() widgets: any;
  @Input() haveAccessTreeNode: any;
  @Input() selectedDataTier: any;
  @Input() assignedAndDefaultDataTiers: any;
  @Input() queryId: boolean;
  @Input() homepage: boolean;
  @Output() addWidgetEvent = new EventEmitter<number>();
  @Output() updateWidgetEvent = new EventEmitter<any>();

  readonly DataType = DataType;
  addDataType: DataType;
  openAddData = false;
  isModalVisible = false;

  isYesterday = false;
  updatedMins: number;
  manualRefresh = false;
  isSettingsModalVisible = false;
  showAdvancedFilter = false;
  filterSearchHasValue = false;
  isViewCommentVisible = false;
  isAddCommentModalVisible = false;

  commentViewType = 'commentPage';

  editSettings: any;
  settings = {
    name: 'Production Review - Labor Focus',
    hideTitle: false,
    refreshRate: 1,
    autoResetIdleTime: 30,
    isProductSeries: false,
    productFamilies: [],
    productSeries: [],
    products: []
  };

  selectedAreas: string[] = [];
  selectedCells: string[] = [];
  selectedWorkCenters: string[] = [];
  selectedProductFamilies: string[] = [];
  selectedProductSeries: string[] = [];
  selectedProducts: string[] = [];
  startTime: string;
  endTime: string;
  shiftPatternId: string;
  currentShift: ShiftPatternByDateDto;
  card: ActivityCardDto;
  selectedComment: any;

  productFamilies: ProductFamilyDto[] = [];
  productSeries: ProductSerieDto[] = [];
  products: ProductDto[] = [];
  productionDataParams = {
    startDate: '',
    endDate: '',
    productSerieIds: [],
    productFamilyIds: [],
    productIds: [],
    isProductSeries: false
  };

  constructor(private shiftService: ShiftService,
    private productFamilyService: ProductFamilyService,
    private productService: ProductService,
    private productSeriesService: ProductSerieService,
  ) {

  }

  ngOnInit(): void {
    this.getProductFamilies();
    this.getProducts();
    this.getPorductSeries();
    this.getStartTime();
  }

  getProductFamilies() {
    this.productFamilyService.getAllInstances().subscribe(data => {
      this.productFamilies = data;
    });
  }

  getProducts() {
    this.productService.getAllInstances().subscribe(data => {
      this.products = data;
    });
  }

  getPorductSeries() {
    this.productSeriesService.getAllInstances().subscribe(data => {
      this.productSeries = data
    })
  }

  getStartTime() {
    const date = new Date();
    if (this.isYesterday) {
      date.setDate(date.getDate() - 1);
    }
    this.shiftService.getShiftByDate(date.toISOString(),
      {
        areaIds: this.selectedAreas,
        cellIds: this.selectedCells,
        wrokCenterIds: this.selectedWorkCenters
      }).subscribe(res => {
        this.timeConvert(res.firstShiftStartDateTimeUtc);
        this.shiftPatternId = res.shiftPatternId;
        this.currentShift = res;
        this.productionDataParams = {
          startDate: this.startTime,
          endDate: this.endTime,
          productSerieIds: this.selectedProductSeries,
          productFamilyIds: this.selectedProductFamilies,
          productIds: this.selectedProducts,
          isProductSeries: this.settings.isProductSeries
        };
      })
    
  }

  timeConvert(startTime: string) {
    this.startTime = startTime;
    if (this.isYesterday) {
      const endDate = new Date(startTime);
      endDate.setDate(endDate.getDate() + 1);
      this.endTime = endDate.toISOString();
    } else {
      // if current time is less than start time, set use yesterday's start time
      if (+new Date(startTime) > +new Date()) {
        const startDate = new Date(startTime);
        startDate.setDate(startDate.getDate() - 1);
        this.startTime = startDate.toISOString();
      }
      this.endTime = new Date().toISOString();
    }
  }

  clearFilters() {
    this.filterSearchHasValue = false;
    this.settings.productFamilies = [];
    this.settings.productSeries = [];
    this.settings.products = [];
    this.selectedProductFamilies = [];
    this.selectedProductSeries = [];
    this.selectedProducts = [];
    localStorage.setItem('machineFocusSettings', JSON.stringify(this.settings));
  }

  applyFilters() {
    if (this.settings.isProductSeries) {
      this.settings.productFamilies = [];
    } else {
      this.settings.productSeries = [];
    }
    this.selectedProductFamilies = this.settings.productFamilies;
    this.selectedProductSeries = this.settings.productSeries;
    this.selectedProducts = this.settings.products;
    this.productionDataParams = {
      startDate: this.startTime,
      endDate: this.endTime,
      productSerieIds: this.selectedProductSeries,
      productFamilyIds: this.selectedProductFamilies,
      productIds: this.selectedProducts,
      isProductSeries: this.settings.isProductSeries
    };
    if (this.selectedProductFamilies.length > 0 || this.selectedProductSeries.length > 0 || this.selectedProducts.length > 0) {
      this.filterSearchHasValue = true;
    } else {
      this.filterSearchHasValue = false;
    }
  }

  refreshChange() {
    this.manualRefresh = !this.manualRefresh;
  }

  openEditSettings() {
    this.editSettings = { ...this.settings };
    this.isSettingsModalVisible = true;
  }

  addData(type: DataType) {
    this.addDataType = type;
    this.openAddData = true;
  }

  showComments() {
    this.commentViewType = 'commentPage';
    this.isViewCommentVisible = true;
  }

  addComment() {
    this.selectedComment = {};
    this.isAddCommentModalVisible = true;
  }

  createCard() {
    this.card = {} as ActivityCardDto;
    this.isModalVisible = true;
  }

  handleCommentWidgetUpdate(event) {
    if (event.type === 'update' && (event.widget?._isToggleViewAction || event._isToggleViewAction)) {
      this.commentViewType = event.widget.widgetName;
      const isVisible = this.isViewCommentVisible;
      if (isVisible) {
        this.isViewCommentVisible = false;
        setTimeout(() => {
          this.isViewCommentVisible = true;
        }, 100);
      }
    }
  }

  findWidgetBySeq(seq: number) {
    return this.widgets.find(widget => widget.seq === seq);
  }

  addWidget(index: number) {
    this.addWidgetEvent.emit(index);
  }

  widgetUpdate(event: any) {
    if (event.type === 'manualRefreshChange') {
      // Update parent's manualRefresh based on child's change
      this.manualRefresh = event.manualRefresh;
    } else {
      // Handle other widget update events
      this.updateWidgetEvent.emit(event);
    }
  }

  updateDateTime() {
    this.getStartTime();
  }

  changeFamilySerial() {
    this.settings.isProductSeries = !this.settings.isProductSeries;
    this.productionDataParams = {
      startDate: this.startTime,
      endDate: this.endTime,
      productSerieIds: this.selectedProductSeries,
      productFamilyIds: this.selectedProductFamilies,
      productIds: this.selectedProducts,
      isProductSeries: this.settings.isProductSeries
    };
  }
}
