import { ConfigStateService } from '@abp/ng.core';
import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AreaService } from '@apis/corporate';
import { ShiftService } from '@apis/general';
import { MachineFocusDto } from '@apis/general/dtos/production-review';
import { ProductFamilyService, ProductSerieService, ProductService } from '@apis/general/production-review';
import { ProductDto, ProductFamilyDto, ProductSerieDto } from '@apis/general/production-review/dtos';
import { ProductionReviewDataService } from '@apis/general/services';
import { ActivityCardDto } from '@apis/ticket/dtos';
import { UserService } from '@proxy/services';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { AppUtils } from 'src/app/modeling/utils/app.utils';
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
  selector: 'app-production-review-machine-focus',
  templateUrl: './production-review-machine-focus.component.html',
  styleUrl: './production-review-machine-focus.component.scss'
})
export class ProductionReviewMachineFocusComponent implements OnInit, OnDestroy {
  @ViewChild('myTable') myTable: DatatableComponent;
  @ViewChildren('myWorkCenterTable') workCenterTables: QueryList<DatatableComponent>;
  productFamilies: ProductFamilyDto[] = [];
  productSeries: ProductSerieDto[] = [];
  readonly DataType = DataType;
  products: ProductDto[] = [];
  machineFocusData: any[] = [];
  workcenterData: any[] = [];
  productData: any[] = [];
  machineFocusSummaryData: MachineFocusDto = {} as MachineFocusDto;
  // mockMachineFocusData: any[] = [
  //   {
  //     productGroupingName: 'TS048EC',
  //     productGroupingId: '3a160ca6-1274-66dd-b041-a19cdd29bda0',
  //     plannedQty: 177500,
  //     actualQty: 177500,
  //     differenceQty: 0,
  //     performancePercentage: 100,
  //     plannedDowntimeHours: null,
  //     unplannedDowntimeHours: 0.3,
  //     downtimePercentage: 3,
  //     availabilityPercentage: 97,
  //     scrapPPM: 2700,
  //     scrapQty: 0,
  //     qualityPercentage: 100,
  //     poee: 97
  //   },
  //   {
  //     productGroupingName: 'TV034AS',
  //     productGroupingId: '3a165146-1723-1bd0-b7e9-76f9dcf74abd',
  //     plannedQty: 320183,
  //     actualQty: 350313,
  //     differenceQty: 30130,
  //     performancePercentage: 109.4,
  //     plannedDowntimeHours: null,
  //     unplannedDowntimeHours: 0.9,
  //     downtimePercentage: 8,
  //     availabilityPercentage: 92,
  //     scrapPPM: 5013,
  //     scrapQty: 3925,
  //     qualityPercentage: 98.9,
  //     poee: 110
  //   },
  //   {
  //     productGroupingName: 'TR033DS',
  //     productGroupingId: '3a167642-5030-4a6c-f61c-00e22b3359ac',
  //     plannedQty: 160000,
  //     actualQty: 177500,
  //     differenceQty: 17500,
  //     performancePercentage: 110.9,
  //     plannedDowntimeHours: 0.3,
  //     unplannedDowntimeHours: null,
  //     downtimePercentage: 10,
  //     availabilityPercentage: 90,
  //     scrapPPM: 3072,
  //     scrapQty: 0,
  //     qualityPercentage: 100,
  //     poee: 110.7
  //   },
  //   {
  //     productGroupingName: 'TR043TH',
  //     productGroupingId: '3a178488-32f7-5b0a-aa2f-c00e44b1cdca',
  //     plannedQty: 177500,
  //     actualQty: 203703,
  //     differenceQty: 26203,
  //     performancePercentage: 114.8,
  //     plannedDowntimeHours: null,
  //     unplannedDowntimeHours: null,
  //     downtimePercentage: 0,
  //     availabilityPercentage: 100,
  //     scrapPPM: 3072,
  //     scrapQty: 3255,
  //     qualityPercentage: 98.4,
  //     poee: 132
  //   },
  //   {
  //     productGroupingName: 'TX043TT',
  //     productGroupingId: '3a17848a-f42c-c8a2-de71-ee96e86dc95e',
  //     plannedQty: 177500,
  //     actualQty: 177500,
  //     differenceQty: 0,
  //     performancePercentage: 100,
  //     plannedDowntimeHours: null,
  //     unplannedDowntimeHours: null,
  //     downtimePercentage: 3,
  //     availabilityPercentage: 97,
  //     scrapPPM: 307,
  //     scrapQty: 0,
  //     qualityPercentage: 100,
  //     poee: 97
  //   },
  //   {
  //     productGroupingName: 'TB144DR',
  //     productGroupingId: '3a17857a-2d5a-8bfb-68fb-6e175ef047b7',
  //     plannedQty: 177500,
  //     actualQty: 197500,
  //     differenceQty: 20000,
  //     performancePercentage: 111.3,
  //     plannedDowntimeHours: 0.3,
  //     unplannedDowntimeHours: null,
  //     downtimePercentage: 10,
  //     availabilityPercentage: 90,
  //     scrapPPM: 23,
  //     scrapQty: 0,
  //     qualityPercentage: 100,
  //     poee: 111
  //   },
  //   {
  //     productGroupingName: 'TM144RS',
  //     productGroupingId: '3a16cc7e-667a-efd4-61ac-71c77be26d09',
  //     plannedQty: 177500,
  //     actualQty: 167500,
  //     differenceQty: -10000,
  //     performancePercentage: 94.4,
  //     plannedDowntimeHours: null,
  //     unplannedDowntimeHours: null,
  //     downtimePercentage: 0,
  //     availabilityPercentage: 100,
  //     scrapPPM: 33,
  //     scrapQty: 333,
  //     qualityPercentage: 99.8,
  //     poee: 89
  //   },
  //   {
  //     productGroupingName: 'TN154TA',
  //     productGroupingId: '3a17a4bb-eaa8-ea2c-16b4-d913d4a6ea91',
  //     plannedQty: 177500,
  //     actualQty: 137500,
  //     differenceQty: -40000,
  //     performancePercentage: 77.5,
  //     plannedDowntimeHours: null,
  //     unplannedDowntimeHours: null,
  //     downtimePercentage: 3,
  //     availabilityPercentage: 97,
  //     scrapPPM: 33,
  //     scrapQty: 55,
  //     qualityPercentage: 100,
  //     poee: 58
  //   },
  //   {
  //     productGroupingName: 'TL14S7D',
  //     productGroupingId: '3a18c9b7-396c-952b-ef46-c0d10aa2421f',
  //     plannedQty: 177500,
  //     actualQty: 167500,
  //     differenceQty: -10000,
  //     performancePercentage: 94.4,
  //     plannedDowntimeHours: 0.3,
  //     unplannedDowntimeHours: null,
  //     downtimePercentage: 10,
  //     availabilityPercentage: 90,
  //     scrapPPM: 23,
  //     scrapQty: 0,
  //     qualityPercentage: 100,
  //     poee: 80
  //   },
  //   {
  //     productGroupingName: 'TM157TQ',
  //     productGroupingId: '3a18ee06-fb6b-aa37-8856-0983dd0f11e7',
  //     plannedQty: 177500,
  //     actualQty: 115500,
  //     differenceQty: -62000,
  //     performancePercentage: 65.1,
  //     plannedDowntimeHours: 0.3,
  //     unplannedDowntimeHours: null,
  //     downtimePercentage: 8,
  //     availabilityPercentage: 92,
  //     scrapPPM: 23,
  //     scrapQty: 35,
  //     qualityPercentage: 100,
  //     poee: 39
  //   },
  //   {
  //     productGroupingName: 'TM157TP',
  //     productGroupingId: '3a190284-1dc1-5be7-3f61-476fea044ff5',
  //     plannedQty: 177500,
  //     actualQty: 115500,
  //     differenceQty: -62000,
  //     performancePercentage: 65.1,
  //     plannedDowntimeHours: 0.3,
  //     unplannedDowntimeHours: null,
  //     downtimePercentage: 8,
  //     availabilityPercentage: 92,
  //     scrapPPM: 23,
  //     scrapQty: 35,
  //     qualityPercentage: 100,
  //     poee: 39
  //   },
  //   {
  //     productGroupingName: 'ZBA144',
  //     productGroupingId: '3a190284-4a9c-0334-924a-2eabbac03224',
  //     plannedQty: 177500,
  //     actualQty: 115500,
  //     differenceQty: -62000,
  //     performancePercentage: 65.1,
  //     plannedDowntimeHours: 0.3,
  //     unplannedDowntimeHours: null,
  //     downtimePercentage: 8,
  //     availabilityPercentage: 92,
  //     scrapPPM: 23,
  //     scrapQty: 35,
  //     qualityPercentage: 100,
  //     poee: 39
  //   }
  // ];
  // mockWorkcenterData: any[] = [
  //   {
  //     workCenterName: 'S020T048',
  //     productGroupingId: '3a160ca6-1274-66dd-b041-a19cdd29bda0',
  //     workCenterId: '3a164130-6772-59ff-8ec7-db414a88a43b',
  //     plannedQty: 3030,
  //     actualQty: 3100,
  //     differenceQty: 70,
  //     performancePercentage: 102.3,
  //     plannedDowntimeHours: null,
  //     unplannedDowntimeHours: 0.3,
  //     downtimePercentage: 3,
  //     availabilityPercentage: 97,
  //     scrapPPM: 2700,
  //     scrapQty: 0,
  //     qualityPercentage: 100,
  //     poee: 102
  //   },
  //   {
  //     workCenterName: 'S020T049',
  //     productGroupingId: '3a160ca6-1274-66dd-b041-a19cdd29bda0',
  //     workCenterId: '3a14cf87-102f-83b7-f7c3-a583f692f24f',
  //     plannedQty: 5001,
  //     actualQty: 5191,
  //     differenceQty: 190,
  //     performancePercentage: 103.8,
  //     plannedDowntimeHours: null,
  //     unplannedDowntimeHours: 0.9,
  //     downtimePercentage: 8,
  //     availabilityPercentage: 92,
  //     scrapPPM: 5013,
  //     scrapQty: 3925,
  //     qualityPercentage: 24.4,
  //     poee: 99
  //   },
  //   {
  //     workCenterName: 'S020T050',
  //     productGroupingId: '3a160ca6-1274-66dd-b041-a19cdd29bda0',
  //     workCenterId: '3a147ac3-335b-0e96-df7c-5d742e2fc7b4',
  //     plannedQty: 5205,
  //     actualQty: 5191,
  //     differenceQty: 1802,
  //     performancePercentage: 134.6,
  //     plannedDowntimeHours: 0.3,
  //     unplannedDowntimeHours: null,
  //     downtimePercentage: 10,
  //     availabilityPercentage: 90,
  //     scrapPPM: 3072,
  //     scrapQty: 0,
  //     qualityPercentage: 100,
  //     poee: 163
  //   }
  // ];
  // mockProductData: any[] = [
  //   {
  //     productName: 'POD-210',
  //     workOrder: '302307001',
  //     plannedQty: 3030,
  //     actualQty: 3100,
  //     differenceQty: 70,
  //     performancePercentage: 102.3,
  //     plannedDowntimeHours: null,
  //     unplannedDowntimeHours: 0.3,
  //     downtimePercentage: 3,
  //     availabilityPercentage: 97,
  //     scrapPPM: 2700,
  //     scrapQty: 0,
  //     qualityPercentage: 100,
  //     poee: 102
  //   },
  //   {
  //     productName: 'POD-211',
  //     workOrder: '302307002',
  //     plannedQty: 5001,
  //     actualQty: 5191,
  //     differenceQty: 190,
  //     performancePercentage: 103.8,
  //     plannedDowntimeHours: null,
  //     unplannedDowntimeHours: 0.9,
  //     downtimePercentage: 8,
  //     availabilityPercentage: 92,
  //     scrapPPM: 5013,
  //     scrapQty: 3925,
  //     qualityPercentage: 24.4,
  //     poee: 99
  //   }
  // ];
  // mockMachineFocusSummaryData: MachineFocusDto = {
  //   productGroupingName: 'Total',
  //   workCenterName: '',
  //   productName: '',
  //   workOrder: '',
  //   plannedQty: 1900183,
  //   actualQty: 1872016,
  //   differenceQty: -28167,
  //   performancePercentage: 97.8,
  //   plannedDowntimeHours: 1.2,
  //   unplannedDowntimeHours: 1.2,
  //   downtimePercentage: 5.5,
  //   availabilityPercentage: 94.5,
  //   scrapPPM: 14299,
  //   scrapQty: 7603,
  //   qualityPercentage: 99.7,
  //   poee: 92.4
  // };
  openAddData = false;
  dataTierTreeNode: any[] = [];
  selectedDataTier: any;
  assignedAndDefaultDataTiers: any;
  haveAccessTreeNode: any[] = [];
  addDataType: DataType;
  tenantInfo: any;
  isYesterday = false;
  showAdvancedFilter = false;
  isSettingsModalVisible = false;
  settings = {
    name: 'Production Review - Machine Focus',
    hideTitle: false,
    refreshRate: 1,
    autoResetIdleTime: 30,
    isProductSeries: false,
    productFamilies: [],
    productSeries: [],
    products: []
  };
  editSettings: any;
  selectedAreas: string[] = [];
  selectedCells: string[] = [];
  selectedWorkCenters: string[] = [];
  selectedProductFamilies: string[] = [];
  selectedProductSeries: string[] = [];
  selectedProducts: string[] = [];
  subscription: Subscription;
  startTime: string;
  endTime: string;
  filterSearchHasValue: boolean = false;
  isModalVisible = false;
  card: ActivityCardDto;
  selectedComment: any;
  isAddCommentModalVisible = false;
  currentShift: any;
  areaData: any[] = [];
  isViewCommentVisible = false;
  commentViewType = 'commentPage';
  timer: any;
  updatedTime: any;
  updatedTimer: any;
  manualRefresh = false;
  updatedMins: number;
  expandedItems: any = {};

  constructor(
    private productFamilyService: ProductFamilyService,
    private productService: ProductService,
    private productSeriesService: ProductSerieService,
    private userService: UserService,
    private areaService: AreaService,
    private configService: ConfigStateService,
    private productionReviewDataService: ProductionReviewDataService,
    private shiftService: ShiftService
  ) {
    // mock
    // add productData to every workcenter data
    this.workcenterData = this.workcenterData.map((data, index) => {
      return {
        ...data,
        products: this.productData
      }
    });
    // add workcenterData to every machine focus data
    this.machineFocusData = this.machineFocusData.map((data, index) => {
      return {
        ...data,
        workCenters: this.workcenterData
      }
    });
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit(): void {
    this.getProductFamilies();
    this.getProducts();
    this.getPorductSeries();
    this.initSettings();
    this.userService.getTreeviewDataTiersByUser(this.configService.getOne('currentUser').id).subscribe(res => {
      if (res && res.assignedDataTiers.length > 0) {
        this.assignedAndDefaultDataTiers = res;
        const areaData = res.assignedDataTiers
          .filter(d => d.areaId)
          .map(d => ({ id: d.areaId, name: d.areaName, type: 'Area' }))
          .filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.id === value.id && t.name === value.name
            ))
          );
        this.areaService.getTreeViewList({ ids: areaData.map(d => d.id), tenantDataTierID: this.tenantInfo?.DataTierId, tenantDataTierType: this.tenantInfo?.DataTierType }).subscribe(response => {
          AppUtils.initTreeData(response);
          this.dataTierTreeNode = response;
          this.initHaveAccessTreeNode(res.assignedDataTiers);
        })
      }
    })
  }

  createCard() {
    this.card = {} as ActivityCardDto;
    this.isModalVisible = true;
  }

  initHaveAccessTreeNode(assignedDataTiers) {
    this.haveAccessTreeNode = AppUtils.initHasAccessTreeNode(
      this.dataTierTreeNode,
      assignedDataTiers
    );
    const userAssignedDataTier = JSON.parse(JSON.stringify(AppUtils.getAccessTreNode(this.haveAccessTreeNode)));
    userAssignedDataTier.forEach(element => {
      if (element.disabled) {
        element.disabled = false;
      }
      element.children = element.children.filter(x => !x.disabled);
    });
    this.areaData = userAssignedDataTier.filter(x => x.children.length > 0);
  }

  openEditSettings() {
    this.editSettings = { ...this.settings };
    this.isSettingsModalVisible = true;
  }

  showComments() {
    this.commentViewType = 'commentPage';
    this.isViewCommentVisible = true;
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

    } else {
    }
  }

  refreshChange() {
    this.manualRefresh = !this.manualRefresh;
    if (this.manualRefresh) {
      // if manual refresh is true, clear the timer
      clearInterval(this.timer);
    } else {
      this.getIntervalProductionReviewDataL1();
    }
  }

  saveSettings() {
    // save settings to localstorage
    this.isSettingsModalVisible = false;
    const intervalChanged = this.editSettings.refreshRate !== this.settings.refreshRate;
    this.settings = {...this.settings, ...this.editSettings };
    if (intervalChanged) {
      this.getIntervalProductionReviewDataL1();
    }
    this.editSettings = {};
    localStorage.setItem('machineFocusSettings', JSON.stringify(this.settings));
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
    localStorage.setItem('machineFocusSettings', JSON.stringify(this.settings));
    this.selectedProductFamilies = this.settings.productFamilies;
    this.selectedProductSeries = this.settings.productSeries;
    this.selectedProducts = this.settings.products;
    if (this.selectedProductFamilies.length > 0 || this.selectedProductSeries.length > 0 || this.selectedProducts.length > 0) {
      this.filterSearchHasValue = true;
    } else {
      this.filterSearchHasValue = false;
    }
    this.getIntervalProductionReviewDataL1();
  }

  addComment() {
    this.selectedComment = {};
    this.isAddCommentModalVisible = true;
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
        this.currentShift = res;
        this.getIntervalProductionReviewDataL1();
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

  initSettings() {
    this.settings = { ...this.settings, ...JSON.parse(localStorage.getItem('machineFocusSettings')) };
    this.shiftService.getShiftByDate(new Date().toISOString(),
      {
        areaIds: this.selectedAreas,
        cellIds: this.selectedCells,
        wrokCenterIds: this.selectedWorkCenters
      }).subscribe(res => {
        this.timeConvert(res.firstShiftStartDateTimeUtc);
        this.selectedProductFamilies = this.settings.productFamilies;
        this.selectedProductSeries = this.settings.productSeries;
        this.selectedProducts = this.settings.products;
        this.getStartTime();
      })
  }

  addData(type: DataType) {
    this.addDataType = type;
    this.openAddData = true;
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

  dataTierChange(event) {
    // if areas exist use areas else use [area.id]
    this.selectedDataTier = event;
    if (event.areas || event.area) {
      this.selectedAreas = event.areas ? event.areas.map(a => a.id) : [event.area.id];
    } else {
      this.selectedAreas = [];
      this.selectedCells = [];
      this.selectedWorkCenters = [];
    }

    if (event.cells || event.cell) {
      this.selectedCells = event.cells ? event.cells.map(c => c.id) : [event.cell.id];
    } else {
      this.selectedCells = [];
      this.selectedWorkCenters = [];
    }

    if (event.workCenters || event.workCenter) {
      this.selectedWorkCenters = event.workCenters ? event.workCenters.map(w => w.id) : [event.workCenter.id];
    } else {
      this.selectedWorkCenters = [];
    }
    this.getStartTime();
  }

  toggleExpandRow(row, expanded: boolean, table: DatatableComponent) {
    row.expanded = !row.expanded;
    if (!expanded) {
      this.getProductionReviewDataL2(row);
      this.expandedItems[row.productGroupingId] = [];
    } else {
      delete this.expandedItems[row.productGroupingId];
    }

    // manual refresh base on L1 expand state， if at least one row is expanded, set manualRefresh to true
    this.manualRefresh = this.machineFocusData.some(data => data.expanded);
    table.rowDetail.toggleExpandRow(row);
    if (this.manualRefresh) {
      clearInterval(this.timer);
    } else {
      // if no row is expanded, reset the timer
      this.getIntervalProductionReviewDataL1();
    }
  }

  toggleExpandWorkCenterRow(row, expanded: boolean, table: DatatableComponent) {
    if (!expanded) {
      this.getProductionReviewDataL3(row);
      this.expandedItems[row.productGroupingId] = this.expandedItems[row.productGroupingId].filter(item => item !== row.workCenterId) || [];
      this.expandedItems[row.productGroupingId].push(row.workCenterId);
    } else {
      this.expandedItems[row.productGroupingId] = this.expandedItems[row.productGroupingId].filter(item => item !== row.workCenterId);
    }
    table.rowDetail.toggleExpandRow(row);
  }

  getIntervalProductionReviewDataL1() {
    this.getProductionReviewDataL1();
    clearInterval(this.timer);
    if (this.settings.refreshRate && this.settings.refreshRate > 0 && !this.manualRefresh) {
      this.timer = setInterval(() => {
        this.getProductionReviewDataL1();
      }, this.settings.refreshRate * 60000);
    }
  }

  calUpdatedTime() {
    clearInterval(this.updatedTimer);
    this.updatedMins = 0;
    this.updatedTimer = setInterval(() => {
      const totalSeconds = Math.floor((new Date().getTime() - new Date(this.updatedTime).getTime()) / 1000);
      this.updatedMins = Math.floor(totalSeconds / 60);
      if (this.updatedMins >= (this.settings.autoResetIdleTime ?? 30)) {
        this.manualRefresh = false;
        this.getIntervalProductionReviewDataL1();
      }
    }, 60000); // Update every minute
  }

  getProductionReviewDataL1() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.productionReviewDataService.getMachineFocusL1({
      mode: this.settings.isProductSeries ? mode.ProductSeries : mode.ProductFamily,
      areaIds: this.selectedAreas,
      cellIds: this.selectedCells,
      workCenterIds: this.selectedWorkCenters,
      productSerieIds: this.selectedProductSeries,
      productFamilyIds: this.selectedProductFamilies,
      productIds: this.selectedProducts,
      startDate: this.startTime,
      endDate: this.endTime,
      workOrders: [],
      operations: [],
    }).subscribe(res => {
      // console.log('L1', res);
      this.updatedTime = new Date();
      this.calUpdatedTime();
      this.machineFocusData = res.data;
      this.machineFocusSummaryData = res.total;
      // this.machineFocusData = JSON.parse(JSON.stringify(this.mockMachineFocusData));
      // add extra expanded property to each machine focus data
      this.machineFocusData.forEach((data: any) => {
        data.expanded = false;
      });
      // this.machineFocusSummaryData = this.mockMachineFocusSummaryData;
      this.initL1ExpandStatus();
    })
  }

  initL1ExpandStatus() {
    // if there are expanded items in current page, expand them
    const expandedRows = Object.keys(this.expandedItems);
    if (expandedRows.length > 0) {
      const startIndex = this.myTable.offset * this.myTable.limit;
      const endIndex = Math.min(startIndex + this.myTable.limit, this.machineFocusData.length);
      // remove expanded items that are not in current page
      const currentpageIds = this.machineFocusData.slice(startIndex, endIndex).map(row => row.productGroupingId);
      expandedRows.forEach(key => {
        if (!currentpageIds.includes(key)) {
          delete this.expandedItems[key];
        }
      });
      for (let i = startIndex; i < endIndex; i++) {
        const row = this.machineFocusData[i];
        if (this.expandedItems[row.productGroupingId]) {
          row.expanded = true;
          this.myTable.rowDetail.toggleExpandRow(row);
          this.getProductionReviewDataL2(row);
        }
      };
    }
  }

  initL2ExpandStatus(row: any) {
    // expand L2 level rows based on expandedItems
    const expandedWorkCenters = this.expandedItems[row.productGroupingId] || [];
    if (expandedWorkCenters.length > 0) {
      const workCenterTable = this.workCenterTables.find(table => table.element.id === row.productGroupingId);
      // expand all work centers in the current row
      workCenterTable.rows.forEach(workCenterRow => {
        if (expandedWorkCenters.includes(workCenterRow.workCenterId)) {
          workCenterTable.rowDetail.toggleExpandRow(workCenterRow);
          this.getProductionReviewDataL3(workCenterRow);
        }
      });
    }
  }

  getProductionReviewDataL2(row: any) {
    this.productionReviewDataService.getMachineFocusL2({
      mode: this.settings.isProductSeries ? mode.ProductSeries : mode.ProductFamily,
      areaIds: this.selectedAreas,
      cellIds: this.selectedCells,
      workCenterIds: this.selectedWorkCenters,
      productSerieIds: this.selectedProductSeries,
      productFamilyIds: this.selectedProductFamilies,
      productIds: this.selectedProducts,
      startDate: this.startTime,
      endDate: this.endTime,
      productGroupingId: row.productGroupingId,
      workOrders: [],
      operations: [],
      isNoOrder: row.isNoOrder,
      // referenceId:this.selectedProductFamilies[0],
    }).subscribe(res => {
      // console.log('L2', res);
      row.workCenters = res.data;
      // const workcenterData = JSON.parse(JSON.stringify(this.mockWorkcenterData));
      // workcenterData.forEach(workCenter => {workCenter.productGroupingId = row.productGroupingId;})
      // row.workCenters = workcenterData;
      // add timeout to make sure the table is rendered before expanding
      setTimeout(() => {
        this.initL2ExpandStatus(row);
      }, 500);
    })
  }

  getProductionReviewDataL3(row: any) {
    this.productionReviewDataService.getMachineFocusL3({
      mode: this.settings.isProductSeries ? mode.ProductSeries : mode.ProductFamily,
      areaIds: this.selectedAreas,
      cellIds: this.selectedCells,
      workCenterIds: this.selectedWorkCenters,
      productSerieIds: this.selectedProductSeries,
      productFamilyIds: this.selectedProductFamilies,
      productIds: this.selectedProducts,
      startDate: this.startTime,
      endDate: this.endTime,
      productGroupingId: row.productGroupingId,
      workCenterId: row.workCenterId,
      workOrders: [],
      operations: [],
      isNoOrder: row.isNoOrder,
      // referenceId: row.workCenterId,
    }).subscribe(res => {
      // console.log('L3', res);
      row.products = res.data;
      // row.products = this.mockProductData;
    })
  }

  isValidValue(value: any) {
    return value !== null && value !== '' && value !== undefined;
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    clearInterval(this.updatedTimer);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
