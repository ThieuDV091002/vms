import { ConfigStateService } from '@abp/ng.core';
import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AreaService } from '@apis/corporate';
import { ShiftService } from '@apis/general';
import { LaborFocusDto } from '@apis/general/dtos/production-review';
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
  selector: 'app-production-review-labor-focus',
  templateUrl: './production-review-labor-focus.component.html',
  styleUrl: './production-review-labor-focus.component.scss'
})
export class ProductionReviewLaborFocusComponent implements OnInit, OnDestroy{
  @ViewChild('myTable') myTable: DatatableComponent;
  @ViewChildren('myProductTable') productTables: QueryList<DatatableComponent>;
  productFamilies: ProductFamilyDto[] = [];
  productSeries: ProductSerieDto[] = [];
  readonly DataType = DataType;
  products: ProductDto[] = [];
  scrapChartOptions: any;
  downtimeReasonChartOptions: any;
  performancePartNumberChartOptions: any;
  laborFocusData: any[] = [];
  workcenterData: any[] = [];
  productData: any[] = [];
  laborFocusSummaryData: LaborFocusDto = {} as LaborFocusDto;
  // mockLaborFocusData: any[] = [
  //   {
  //     incrementStartTime: '2024-12-18 08:30:00 AM',
  //     incrementEndTime: '2024-12-18 10:30:00 AM',
  //     shiftName: 'Morning',
  //     staffNeeded: 3,
  //     staffActual: 3,
  //     productGroupingName: 'TS048EC',
  //     productGroupingId: '3a160ca6-1274-66dd-b041-a19cdd29bda0',
  //     plannedQty: 3386,
  //     producedQty:5373,
  //     differenceQty: 1987,
  //     cumulativeDifferenceQty: 1987,
  //     upph: 896,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 616,
  //     unplannedDowntimeMinutes: 292
  //   },
  //   {
  //     incrementStartTime: '2024-12-18 10:30:00 AM',
  //     incrementEndTime: '2024-12-18 12:30:00 PM',
  //     shiftName: 'Morning',
  //     staffNeeded: 3,
  //     staffActual: 3,
  //     productGroupingName: 'TV034AS',
  //     productGroupingId: '3a165146-1723-1bd0-b7e9-76f9dcf74abd',
  //     plannedQty: 13109,
  //     producedQty:3354,
  //     differenceQty: -9755,
  //     cumulativeDifferenceQty: -7768,
  //     upph: 559,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 689,
  //     unplannedDowntimeMinutes: 138
  //   },
  //   {
  //     incrementStartTime: '2024-12-18 12:30:00 PM',
  //     incrementEndTime: '2024-12-18 02:30:00 PM',
  //     shiftName: 'Afternoon',
  //     staffNeeded: 3,
  //     staffActual: 3,
  //     productGroupingName: 'TA048QE',
  //     productGroupingId: '3a167642-5030-4a6c-f61c-00e22b3359ac',
  //     plannedQty: 10130,
  //     producedQty:2790,
  //     differenceQty: -7340,
  //     cumulativeDifferenceQty: -15108,
  //     upph: 465,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 719,
  //     unplannedDowntimeMinutes: 67
  //   },
  //   {
  //     incrementStartTime: '2024-12-18 02:30:00 PM',
  //     incrementEndTime: '2024-12-18 04:30:00 PM',
  //     shiftName: 'Afternoon',
  //     staffNeeded: 3,
  //     staffActual: 3,
  //     productGroupingName: 'TN048EC',
  //     productGroupingId: '3a178488-32f7-5b0a-aa2f-c00e44b1cdca',
  //     plannedQty: 15872,
  //     producedQty:1713,
  //     differenceQty: -14159,
  //     cumulativeDifferenceQty: -29267,
  //     upph: 286,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 542,
  //     unplannedDowntimeMinutes: 119
  //   },
  //   {
  //     incrementStartTime: '2024-12-18 04:30:00 PM',
  //     incrementEndTime: '2024-12-18 06:30:00 PM',
  //     shiftName: 'Afternoon',
  //     staffNeeded: 3,
  //     staffActual: 3,
  //     productGroupingName: 'TS048EC',
  //     productGroupingId: '3a17848a-f42c-c8a2-de71-ee96e86dc95e',
  //     plannedQty: 10515,
  //     producedQty:7944,
  //     differenceQty: -2571,
  //     cumulativeDifferenceQty: -31838,
  //     upph: 1324,
  //     scrapQty: 1,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 845,
  //     unplannedDowntimeMinutes: 36
  //   },
  //   {
  //     incrementStartTime: '2024-12-18 06:30:00 PM',
  //     incrementEndTime: '2024-12-18 08:30:00 PM',
  //     shiftName: 'Afternoon',
  //     staffNeeded: 4,
  //     staffActual: 4,
  //     productGroupingName: 'TV034AS',
  //     productGroupingId: '3a17857a-2d5a-8bfb-68fb-6e175ef047b7',
  //     plannedQty: 12125,
  //     producedQty: 7690,
  //     differenceQty: -4435,
  //     cumulativeDifferenceQty: -36273,
  //     upph: 961,
  //     scrapQty: 48,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 786,
  //     unplannedDowntimeMinutes: 89
  //   },
  //   {
  //     incrementStartTime: '2024-12-18 08:30:00 PM',
  //     incrementEndTime: '2024-12-18 10:30:00 PM',
  //     shiftName: 'Night',
  //     staffNeeded: 4,
  //     staffActual: 4,
  //     productGroupingName: 'TA048QE',
  //     productGroupingId: '3a16cc7e-667a-efd4-61ac-71c77be26d09',
  //     plannedQty: 0,
  //     producedQty: 0,
  //     differenceQty: 0,
  //     cumulativeDifferenceQty: -36273,
  //     upph: 0,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 1192,
  //     unplannedDowntimeMinutes: null
  //   },
  //   {
  //     incrementStartTime: '2024-12-18 10:30:00 PM',
  //     incrementEndTime: '2024-12-19 12:30:00 AM',
  //     shiftName: 'Night',
  //     staffNeeded: 4,
  //     staffActual: 4,
  //     productGroupingName: 'TA048QE',
  //     productGroupingId: '3a17a4bb-eaa8-ea2c-16b4-d913d4a6ea91',
  //     plannedQty: 714,
  //     producedQty: 239,
  //     differenceQty: -475,
  //     cumulativeDifferenceQty: -36748,
  //     upph: 30,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 1089,
  //     unplannedDowntimeMinutes: 11
  //   },
  //   {
  //     incrementStartTime: '2024-12-19 12:30:00 AM',
  //     incrementEndTime: '2024-12-19 2:30:00 AM',
  //     shiftName: 'Night',
  //     staffNeeded: 4,
  //     staffActual: 4,
  //     productGroupingName: 'TQ048EC',
  //     productGroupingId: '3a18c9b7-396c-952b-ef46-c0d10aa2421f',
  //     plannedQty: 1614,
  //     producedQty: 907,
  //     differenceQty: -707,
  //     cumulativeDifferenceQty: -37455,
  //     upph: 113,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 975,
  //     unplannedDowntimeMinutes: 1
  //   },
  //   {
  //     incrementStartTime: '2024-12-19 2:30:00 AM',
  //     incrementEndTime: '2024-12-19 4:30:00 AM',
  //     shiftName: 'Night',
  //     staffNeeded: 3,
  //     staffActual: 3,
  //     productGroupingName: 'MN048EC',
  //     productGroupingId: '3a18ee06-fb6b-aa37-8856-0983dd0f11e7',
  //     plannedQty: 1360,
  //     producedQty: 738,
  //     differenceQty: -622,
  //     cumulativeDifferenceQty:-38077,
  //     upph: 123,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 960,
  //     unplannedDowntimeMinutes: null
  //   },
  //   {
  //     incrementStartTime: '2024-12-19 4:30:00 AM',
  //     incrementEndTime: '2024-12-19 5:30:00 AM',
  //     shiftName: 'Night',
  //     staffNeeded: 3,
  //     staffActual: 3,
  //     productGroupingName: 'TN048EP',
  //     productGroupingId: '3a190284-1dc1-5be7-3f61-476fea044ff5',
  //     plannedQty: 1360,
  //     producedQty: 738,
  //     differenceQty: -622,
  //     cumulativeDifferenceQty:-38077,
  //     upph: 123,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 960,
  //     unplannedDowntimeMinutes: null
  //   },

  // ];

  // mockWorkcenterData = [
  //   {
  //     incrementStartTime: '2024-12-18 08:30:00 AM',
  //     incrementEndTime: '2024-12-18 10:30:00 AM',
  //     productGroupingId: '3a160ca6-1274-66dd-b041-a19cdd29bda0',
  //     workCenterName: 'ZH001A1A',
  //     workCenterId: '3a164130-6772-59ff-8ec7-db414a88a43b',
  //     plannedQty: 3386,
  //     producedQty: 5373,
  //     differenceQty: 1987,
  //     cumulativeDifferenceQty: 1987,
  //     staffNeeded: 3,
  //     staffActual: 3,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 616,
  //     unplannedDowntimeMinutes: 292,
  //   },
  //   {
  //     incrementStartTime: '2024-12-18 08:30:00 AM',
  //     incrementEndTime: '2024-12-18 10:30:00 AM',
  //     productGroupingId: '3a160ca6-1274-66dd-b041-a19cdd29bda0',
  //     workCenterName: 'ZH002A1B',
  //     workCenterId: '3a164130-6772-59ff-8ec7-db414a88a43b',
  //     plannedQty: 13109,
  //     producedQty: 3354,
  //     differenceQty: -9755,
  //     cumulativeDifferenceQty: -7768,
  //     staffNeeded: 3,
  //     staffActual: 3,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 689,
  //     unplannedDowntimeMinutes: 138,
  //   },
  //   {
  //     incrementStartTime: '2024-12-18 08:30:00 AM',
  //     incrementEndTime: '2024-12-18 10:30:00 AM',
  //     productGroupingId: '3a160ca6-1274-66dd-b041-a19cdd29bda0',
  //     workCenterName: 'ZH003A1C',
  //     workCenterId: '3a164130-6772-59ff-8ec7-db414a88a43b',
  //     plannedQty: 10130,
  //     producedQty: 2790,
  //     differenceQty: -7340,
  //     cumulativeDifferenceQty: -15108,
  //     staffNeeded: 3,
  //     staffActual: 3,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 719,
  //     unplannedDowntimeMinutes: 67,
  //   },
  //   {
  //     incrementStartTime: '2024-12-18 08:30:00 AM',
  //     incrementEndTime: '2024-12-18 10:30:00 AM',
  //     productGroupingId: '3a160ca6-1274-66dd-b041-a19cdd29bda0',
  //     workCenterName: 'ZH004A1T',
  //     workCenterId: '3a164130-6772-59ff-8ec7-db414a88a43b',
  //     plannedQty: 15872,
  //     producedQty: 1713,
  //     staffNeeded: 3,
  //     staffActual: 3,
  //     differenceQty: -14159,
  //     cumulativeDifferenceQty: -29267,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 542,
  //     unplannedDowntimeMinutes: 119,
  //   }
  // ];

  // mockProductData = [
  //   {
  //     productGroupingName: 'TA048QE',
  //     productGroupingId: '3a160ca6-1274-66dd-b041-a19cdd29bda0',
  //     incrementStartTime: '2024-12-19 2:30:00 AM',
  //     incrementEndTime: '2024-12-19 4:30:00 AM',
  //     productId: '3a16cb34-6904-1142-e451-dc51c75eb45c',
  //     productName: 'POD-210',
  //     workOrder: '302307001',
  //     plannedQty: 3386,
  //     producedQty: 5373,
  //     differenceQty: 1987,
  //     cumulativeDifferenceQty: 1987,
  //     staffNeeded: 3,
  //     staffActual: 3,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 616,
  //     unplannedDowntimeMinutes: 292,
  //   },
  //   {
  //     productGroupingName: 'TA048QE',
  //     productGroupingId: '3a160ca6-1274-66dd-b041-a19cdd29bda0',
  //     incrementStartTime: '2024-12-19 2:30:00 AM',
  //     incrementEndTime: '2024-12-19 4:30:00 AM',
  //     productId: '3a160d56-3d41-daa7-a01a-60b9706c4226',
  //     productName: 'POD-211',
  //     workOrder: '302307002',
  //     plannedQty: 13109,
  //     producedQty: 3354,
  //     differenceQty: -9755,
  //     cumulativeDifferenceQty: -7768,
  //     staffNeeded: 3,
  //     staffActual: 3,
  //     scrapQty: 0,
  //     reworkQty: 0,
  //     plannedDowntimeMinutes: 689,
  //     unplannedDowntimeMinutes: 138,
  //   }
  // ];

  editSettings: any;
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
  settings= {
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
  subscription: Subscription;
  startTime: string;
  endTime: string;
  shiftPatternId: string;
  filterSearchHasValue: boolean = false;
  isModalVisible = false;
  card: ActivityCardDto;
  // mockLaborFocusSummaryData: LaborFocusDto = {
  //   productGroupingName: '',
  //   workCenterName: '',
  //   productName: '',
  //   workOrder: '',
  //   incrementStartTime: 'Total',
  //   incrementEndTime: '',
  //   staffNeeded: 4,
  //   staffActual: 4,
  //   plannedQty: 68825,
  //   producedQty: 30748,
  //   differenceQty: -28167,
  //   cumulativeDifferenceQty: -38077,
  //   upph: 4759,
  //   scrapQty: 49,
  //   reworkQty: 0,
  //   plannedDowntimeMinutes: 8413,
  //   unplannedDowntimeMinutes: 753,
  //   isNoOrder: false,
  //   isShiftInfoOnly: false
  // };
  selectedComment: any;
  isAddCommentModalVisible = false;
  currentShift: any;
  areaData: any[] = [];
  isViewCommentVisible = false;
  timer: any;
  commentViewType = 'commentPage';
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
    private shiftService: ShiftService,
    private configStateService: ConfigStateService
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
    this.laborFocusData = this.laborFocusData.map((data, index) => {
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
    this.userService.getTreeviewDataTiersByUser(this.configStateService.getOne('currentUser').id).subscribe(res => {
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

  createCard() {
    this.card = {} as ActivityCardDto;
    this.isModalVisible = true;
  }

  openEditSettings() {
    this.editSettings = { ...this.settings };
    this.isSettingsModalVisible = true;
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
    localStorage.setItem('laborFocusSettings', JSON.stringify(this.settings));
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
    if(this.selectedProductFamilies.length > 0 || this.selectedProductSeries.length > 0 || this.selectedProducts.length > 0) {
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
      this.shiftPatternId = res.shiftPatternId;
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

  initSettings () {
    this.settings = {...this.settings, ...JSON.parse(localStorage.getItem('laborFocusSettings'))};
    this.shiftService.getShiftByDate(new Date().toUTCString(),
    {
      areaIds: this.selectedAreas,
      cellIds: this.selectedCells,
      wrokCenterIds: this.selectedWorkCenters
    }).subscribe(res => {
      this.timeConvert(res.firstShiftStartDateTimeUtc);
      this.shiftPatternId = res.shiftPatternId;
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
    this.manualRefresh = this.laborFocusData.some(data => data.expanded);
    table.rowDetail.toggleExpandRow(row);
    if (this.manualRefresh) {
      clearInterval(this.timer);
    } else {
      // if no row is expanded, reset the timer
      this.getIntervalProductionReviewDataL1();
    }
  }

  toggleExpandProductRow(row, expanded: boolean, table: DatatableComponent) {
    if (!expanded) {
      this.getProductionReviewDataL3(row);
      if (!this.expandedItems[row.productGroupingId]) {
        this.expandedItems[row.productGroupingId] = [];
      }
      this.expandedItems[row.productGroupingId] = this.expandedItems[row.productGroupingId].filter(item => item !== row.productId) || [];
      this.expandedItems[row.productGroupingId].push(row.productId);
    } else {
      if (!this.expandedItems[row.productGroupingId]) {
        this.expandedItems[row.productGroupingId] = [];
      }
      this.expandedItems[row.productGroupingId] = this.expandedItems[row.productGroupingId].filter(item => item !== row.productId);
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
    this.subscription = this.productionReviewDataService.getLaborFocusL1({
      mode: this.settings.isProductSeries ? mode.ProductSeries : mode.ProductFamily,
      areaIds: this.selectedAreas,
      cellIds: this.selectedCells,
      workCenterIds: this.selectedWorkCenters,
      productSerieIds: this.selectedProductSeries,
      productFamilyIds: this.selectedProductFamilies,
      productIds: this.selectedProducts,
      startDate: this.startTime,
      endDate: this.endTime,
      shiftPatternId: this.shiftPatternId,
      workOrders: [],
      operations: [],
    }).subscribe(res => {
      // console.log('L1', res);
      this.updatedTime = new Date();
      this.calUpdatedTime();
      this.laborFocusData = res.data;
      this.laborFocusSummaryData = res.total;
      // this.laborFocusData = JSON.parse(JSON.stringify(this.mockLaborFocusData));
      // add extra expanded property to each machine focus data
      this.laborFocusData.forEach((data: any) => {
        data.expanded = false;
      });
      // this.laborFocusSummaryData = this.mockLaborFocusSummaryData;
      this.initL1ExpandStatus();
    })
  }

  initL1ExpandStatus() {
    // if there are expanded items in current page, expand them
    const expandedRows = Object.keys(this.expandedItems);
    if (expandedRows.length > 0) {
      const startIndex = this.myTable.offset * this.myTable.limit;
      const endIndex = Math.min(startIndex + this.myTable.limit, this.laborFocusData.length);
      // remove expanded items that are not in current page
      const currentpageIds = this.laborFocusData.slice(startIndex, endIndex).map(row => row.productGroupingId);
      expandedRows.forEach(key => {
        if (!currentpageIds.includes(key)) {
          delete this.expandedItems[key];
        }
      });
      for (let i = startIndex; i < endIndex; i++) {
        const row = this.laborFocusData[i];
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
    const expandedProducts = this.expandedItems[row.productGroupingId] || [];
    if (expandedProducts.length > 0) {
      const productTable = this.productTables.find(table => table.element.id === row.productGroupingId);
      // expand all work centers in the current row
      productTable.rows.forEach(productRow => {
        if (expandedProducts.includes(productRow.productId)) {
          productTable.rowDetail.toggleExpandRow(productRow);
          this.getProductionReviewDataL3(productRow);
        }
      });
    }
  }

  getProductionReviewDataL2(row) {
    this.productionReviewDataService.getLaborFocusL2({
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
      incrementStartTime: row.incrementStartTime,
      incrementEndTime: row.incrementEndTime,
      isNoOrder: row.isNoOrder,
      workOrders: [],
      operations: [],
      // referenceId: row.referenceId,
    }).subscribe(res => {
      // console.log('L2',res);
      row.products = res.data;
      // const productData = JSON.parse(JSON.stringify(this.mockProductData));
      // productData.forEach(product => {product.productGroupingId = row.productGroupingId;})
      // row.products = productData;
      setTimeout(() => {
        this.initL2ExpandStatus(row);
      }, 500);
    })
  }

  getProductionReviewDataL3(row) {
    this.productionReviewDataService.getLaborFocusL3({
      mode: this.settings.isProductSeries ? mode.ProductSeries : mode.ProductFamily,
      areaIds: this.selectedAreas,
      cellIds: this.selectedCells,
      workCenterIds: this.selectedWorkCenters,
      productSerieIds: this.selectedProductSeries,
      productFamilyIds: this.selectedProductFamilies,
      productIds: this.selectedProducts,
      startDate: this.startTime,
      endDate: this.endTime,
      incrementStartTime: row.incrementStartTime,
      incrementEndTime: row.incrementEndTime,
      productGroupingId: row.productGroupingId,
      productId: row.productId,
      isNoOrder: row.isNoOrder,
      workOrders: [],
      operations: [],
      workOrder: row.workOrder,
      hasWorkOrderFilter: true,
      operation: row.operation
      // referenceId: row.referenceId,
    }).subscribe(res => {
      // console.log('L3',res);
      row.workcenters = res.data;
      // row.workcenters = this.mockWorkcenterData;
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
}
