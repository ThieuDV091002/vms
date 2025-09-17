import { ConfigStateService, LocalizationService } from '@abp/ng.core';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AreaHuddleService } from '@apis/general';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { forkJoin, of } from 'rxjs';
import { SiteHuddleService, AreaHuddleService as TiketAreaHuddleService } from '@apis/ticket/services';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { DashboardUtils } from '../utils';


@Component({
  selector: 'app-area-huddle-kpi-table',
  templateUrl: './area-huddle-kpi-table.component.html',
  styleUrl: './area-huddle-kpi-table.component.scss'
})
export class AreaHuddleKpiTableComponent implements OnInit, OnChanges {
  @Input() selectedDataTier;
  @Input() selected: any = { title: '', url: '', hideTitle: false };
  @Input() index = -1;
  @Input() dataTierTreeNode;
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() queryId;
  @Input() expandChart = false;

  isFPY = true;
  isUPPH = true;
  data = [];
  filterAreas = [];
  filterCells = [];
  dateRange = {
    startDate: '',
    endDate: ''
  };
  dateHeaders = [];
  dataMap = new Map<string, any>();
  widget: string;

  @ViewChild('AreaHuddleKpiTable') table: DatatableComponent;

  constructor(private datePipe: DatePipe,
    private configService: ConfigStateService,
    private areaHuddleService: AreaHuddleService,
    private tiketAreaHuddleService: SiteHuddleService,
    private confirmation: ConfirmationService,
    private localizationService: LocalizationService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dateRange.startDate === '' || this.dateRange.endDate === '') {
      this.setDateRange();
    }
    if (changes.selectedDataTier && changes.selectedDataTier.currentValue && this.dataTierTreeNode) {
      this.getTarget();
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
      if ((this.filterAreas && this.filterAreas.length > 0) || (this.filterCells && this.filterCells.length > 0)) {
        this.getAreaHuddleKPIData();
      }
    }
  }

  ngOnInit(): void {
    DashboardUtils.recalculateTableSize.subscribe(res => {
      if (res) {
        if (this.table) {
          this.table.recalculate();
        }
      }
    })
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widget = data;
    });
  }

  getAreaHuddleKPIData() {
    this.dataMap.clear(); // clear previous data
    this.getUnsafeConditionCountData();
    this.getFPYOrSPPMData();
    this.getUPPHOrPerformanceData();
    this.getAvailabilityData();
    this.getPOEEData();
    this.getActionAndPastDueData();
  }

  // get unsafe condition data
  getUnsafeConditionCountData() {
    // forkJoin({
    //   unsafeTotalCount: this.tiketAreaHuddleService.getUnsafeConditions({ area: this.filterAreas, startDate: this.dateRange.startDate, endDate: this.dateRange.endDate }),
    //   unsafeTargetAndToleranceCount: this.areaHuddleService.getUnsafeConditionDataByInput({ area: this.filterAreas, startDate: this.dateRange.startDate, endDate: this.dateRange.endDate })
    // }).subscribe((unsafeDataResponse) => {
    //   const combinedData = [];

    //   unsafeDataResponse.unsafeTotalCount.forEach((item: any) => {
    //     combinedData.push({
    //       date: item.date,
    //       cell: item.cell,
    //       dailyUnsafe: item.totalCount,
    //       dailyUnsafeTarget: 0,
    //       dailyUnsafeTolerance: 0
    //     });
    //   });

    //   unsafeDataResponse.unsafeTargetAndToleranceCount.forEach((item: any) => {
    //     const existingItem = combinedData.find((data) => data.cell === item.cell && data.date === item.date);
    //     if (existingItem) {
    //       existingItem.dailyUnsafeTarget = item.targetCount;
    //       existingItem.dailyUnsafeTolerance = item.toleranceCount;
    //     } else {
    //       combinedData.push({
    //         date: item.date,
    //         cell: item.cell,
    //         dailyUnsafe: 0,
    //         dailyUnsafeTarget: item.targetCount,
    //         dailyUnsafeTolerance: item.toleranceCount
    //       });
    //     }
    //   });

    //   this.updateDataMap(combinedData, 'unsafe');
    // });
    this.tiketAreaHuddleService.getUnsafeConditionsByAreaCellByAreaIdsAndCellIdsAndStartTimeAndEndTime(this.filterAreas, this.filterCells, this.dateRange.startDate, this.dateRange.endDate).subscribe((response) => {
      this.updateDataMap(response, 'unsafe');
    });
  }

  // get fpy or sppm data
  getFPYOrSPPMData() {
    const startDate = this.dateRange.startDate;
    const endDate = this.dateRange.endDate;

    this.dataMap.forEach((value) => {
      value.fpyOrSppm = [];
    });

    if (this.isFPY) {
      this.areaHuddleService.getFpyDataByAreaCellListByInput({ areas: this.filterAreas, cells: this.filterCells, startDate: startDate, endDate: endDate }).subscribe((response) => {
        response.forEach((item) => {
          item.dailyFPY = item.dailyFPY * 100; // convert to percentage
        });
        this.updateDataMap(response, 'dailyFPY');
      });
    } else {
      this.areaHuddleService.getSppmDataByAreaCellListByInput({ areas: this.filterAreas, cells: this.filterCells, startDate: startDate, endDate: endDate }).subscribe((response) => {
        this.updateDataMap(response, 'dailySPPM');
      });
    }
  }

  // get upph or performance data
  getUPPHOrPerformanceData() {
    const startDate = this.dateRange.startDate;
    const endDate = this.dateRange.endDate;

    this.dataMap.forEach((value) => {
      value.upphOrPerformance = [];
    });

    if (this.isUPPH) {
      this.areaHuddleService.getUpphDataByAreaCellListByInput({ areas: this.filterAreas, cells: this.filterCells, startDate: startDate, endDate: endDate }).subscribe((response) => {
        this.updateDataMap(response, 'dailyUPPH');
      });
    } else {
      this.areaHuddleService.getPerformanceDataByAreaCellListByInput({ areas: this.filterAreas, cells: this.filterCells, startDate: startDate, endDate: endDate }).subscribe((response) => {
        response.forEach((item) => {
          item.dailyPerformance = item.dailyPerformance * 100; // convert to percentage
        });
        this.updateDataMap(response, 'dailyPerformance');
      });
    }
  }

  // get availability data
  getAvailabilityData() {
    const startDate = this.dateRange.startDate;
    const endDate = this.dateRange.endDate;
    this.areaHuddleService.getUdtDataByAreaCellListByInput({ areas: this.filterAreas, cells: this.filterCells, startDate: startDate, endDate: endDate }).subscribe((response) => {
      response.forEach((item) => {
        item.dailyAvailability = item.dailyAvailability * 100; // convert to percentage
      });
      this.updateDataMap(response, 'dailyAvailability');
    });
  }

  // get poee data
  getPOEEData() {
    const startDate = this.dateRange.startDate;
    const endDate = this.dateRange.endDate;
    this.areaHuddleService.getPoeeDataByAreaCellListByInput({ areas: this.filterAreas, cells: this.filterCells, startDate: startDate, endDate: endDate, isByCell: true }).subscribe((response) => {
      response.forEach((item) => {
        item.dailyPOEE = item.dailyPOEE * 100; // convert to percentage
      });
      this.updateDataMap(response, 'dailyPOEE');
    });
  }

  // get open action and past due data
  getActionAndPastDueData() {
    this.tiketAreaHuddleService.getActiveActivityCardInfoByAreaCellByAreaIdsAndCellIds(this.filterAreas, this.filterCells).subscribe((response) => {
      this.updateDataMap(response, 'actionAndPastDue');
    });
  }


  updateDataMap(response: any[], key: string) {
    // sort the response by date
    let sortedResponse = response;
    if (key !== 'actionAndPastDue') {
      sortedResponse = response.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    sortedResponse.forEach((item: any) => {
      const cellName = key === 'unsafe' || key === 'actionAndPastDue' ? item.cellDisplayName : item.cell;

      // if the cellName is not in the dataMap, add it
      if (!this.dataMap.has(cellName)) {
        this.dataMap.set(cellName, {
          cell: cellName,
          unsafe: [],
          fpyOrSppm: [],
          upphOrPerformance: [],
          availability: [],
          poee: [],
          actions: {
            totalOpenCount: 0,
            totalPassDueCount: 0
          }
        });
      }

      // get the existing data for the cell
      const existingData = this.dataMap.get(cellName);

      // according to the key, push the item into the corresponding array
      if (key === 'unsafe') {
        existingData.unsafe.push(this.assignColor(item, 'dailyUnsafe'));
      } else if (key === 'dailyFPY' || key === 'dailySPPM') {
        existingData.fpyOrSppm.push(this.assignColor(item, key));
      } else if (key === 'dailyUPPH' || key === 'dailyPerformance') {
        existingData.upphOrPerformance.push(this.assignColor(item, key));
      } else if (key === 'dailyAvailability') {
        existingData.availability.push(this.assignColor(item, key));
      } else if (key === 'dailyPOEE') {
        existingData.poee.push(this.assignColor(item, key));
      } else if (key === 'actionAndPastDue') {
        existingData.actions.totalOpenCount = item.totalOpenCount || 0;
        existingData.actions.totalPassDueCount = item.totalPassDueCount || 0;
      }

      // upate dataMap with the latest data
      this.dataMap.set(cellName, existingData);
    });

    // update the data array with the latest data from dataMap
    this.data = Array.from(this.dataMap.values());
    // console.log('Updated data:', this.data); // Log the updated data array
  }


  assignColor(item: any, type: string) {

    let color = 'green'; // default color

    let kpiValue: number | undefined;

    switch (type) {
      case 'dailySPPM':
        kpiValue = item.dailySPPMKpi;
        break;
      case 'dailyCOPQ':
        kpiValue = item.dailyCOPQKPI;
        break;
      case 'dailyPOEE':
        kpiValue = item.dailyPOEEKpi;
        break;
      case 'dailyPerformance':
        kpiValue = item.dailyPerformanceKpi;
        break;
      case 'dailyFPY':
        kpiValue = item.dailyFPYKPI;
        break;
      case 'dailyUPPH':
        kpiValue = item.dailyUPPHKpi;
        break;
      case 'dailyUnsafe':
        kpiValue = item.kpi;
        break;
      case 'dailyAvailability':
        kpiValue = item.dailyAvailabilityKpi;
        break;
      default:
        kpiValue = undefined;
    }


    if (kpiValue === 2) {
      color = 'orange';
    } else if (kpiValue === 3) {
      color = 'red';
    } else if (kpiValue === 1) {
      color = 'green';
    }

    return { ...item, color };
  }

  toogleTarget(type) {
    if (type === 'FPY') {
      this.isFPY = !this.isFPY;
      const userId = this.configService.getOne('currentUser').id;
      const FPYTargetstorageKey = `areaHuddleIsFPYTarget_${userId}`;
      localStorage.setItem(FPYTargetstorageKey, JSON.stringify(this.isFPY));
      this.getFPYOrSPPMData();
    } else if (type === 'UPPH') {
      this.isUPPH = !this.isUPPH;
      const userId = this.configService.getOne('currentUser').id;
      const UPPHTargetstorageKey = `areaHuddleIsUPPHTarget_${userId}`;
      localStorage.setItem(UPPHTargetstorageKey, JSON.stringify(this.isUPPH));
      this.getUPPHOrPerformanceData();
    }
  }

  getTarget() {
    const userId = this.configService.getOne('currentUser').id;
    const FPYTargetstorageKey = `areaHuddleIsFPYTarget_${userId}`;
    const UPPHTargetstorageKey = `areaHuddleIsUPPHTarget_${userId}`;
    if (localStorage.getItem(FPYTargetstorageKey)) {
      this.isFPY = JSON.parse(localStorage.getItem(FPYTargetstorageKey));
    }

    if (localStorage.getItem(UPPHTargetstorageKey)) {
      this.isUPPH = JSON.parse(localStorage.getItem(UPPHTargetstorageKey));
    }
  }

  // set date range to last 3 days
  setDateRange() {
    const endDate = new Date();
    const midDate = new Date();
    const startDate = new Date();
    endDate.setDate(endDate.getDate() - 1);
    startDate.setDate(endDate.getDate() - 2);
    midDate.setDate(endDate.getDate() - 1);
    this.dateHeaders = [
      this.datePipe.transform(startDate, 'dd MMM'),
      this.datePipe.transform(midDate, 'dd MMM'),
      this.datePipe.transform(endDate, 'dd MMM')
    ];
    this.dateRange = {
      startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd')
    };
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

  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
    setTimeout(() => {
      this.table.recalculate();
    }, 0);
  }
}
