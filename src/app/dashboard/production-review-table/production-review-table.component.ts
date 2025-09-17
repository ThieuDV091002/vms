import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { environment } from '../../../environments/environment';
import { ProductionReviewBoardSettingService } from '@apis/general';
import { ProductionReviewBoardSettingDto } from '@apis/general/dtos';
import { ShiftService } from '@apis/general';
import { ProductionReviewDataService } from '@apis/general/services';
import { ProductionReviewDetailItemDto, ProductionReviewGeneralDataInput, GroupKey, ProductionReviewDetailDataDto } from '@apis/general/dtos/production-review';
import { displayFieldDtoMapping } from './display-field-dto-mapping';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';

interface TableColumn {
  key: string;
  displayName: string;
  prop: string;
  width: number;
  isGroupColumn: boolean;
  dataType?: 'number-0' | 'number-1' | 'number-2' | 'percentage-0' | 'percentage-1' | 'text';
  kpiField?: string;
  isFirstGroupColumn: boolean;
  isLastGroupColumn: boolean;
}

@Component({
  selector: 'app-production-review-table',
  templateUrl: './production-review-table.component.html',
  styleUrl: './production-review-table.component.scss'
})

export class ProductionReviewTableComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('dynamicTable') dynamicTable: DatatableComponent;
  @ViewChild('dynamicTableL2') dynamicTableL2: DatatableComponent;
  @Input() selectedDataTier: any;
  @Input() productionDataParams: any;
  @Input() selected: any;
  @Input() isYesterday: boolean;
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();

  settings = {
    name: 'Production Review Table',
    hideTitle: false,
    refreshRate: 1,
    autoResetIdleTime: 30,
    isProductSeries: false,
    productFamilies: [],
    productSeries: [],
    products: [],
    productionReviewBoardSettingId: '',
    displayColumn: [],
    L1GroupKey: [],
    L2GroupKey: [],
    L3GroupKey: [],
    ReviewType: '',
  };

  expandChart = false;
  widget: string;
  isSettingsModalVisible = false;

  productionReviewBoardSettings: ProductionReviewBoardSettingDto[] = [];
  productionReviewData: any[] = [];
  productionReviewDataL1: ProductionReviewDetailItemDto[] = [];
  totalData: ProductionReviewDetailDataDto = {} as ProductionReviewDetailDataDto;
  editSettings: any;

  timer: any;
  subscription: Subscription;
  manualRefresh = false;
  LOCAL_STORAGE_KEY = 'ProductionReviewTableSetting_';
  filterSearchHasValue: boolean = false;
  selectedProductFamilies: string[] = [];
  selectedProductSeries: string[] = [];
  selectedProducts: string[] = [];
  selectedAreas: string[] = [];
  selectedCells: string[] = [];
  selectedWorkCenters: string[] = [];
  startTime: string;
  endTime: string;
  currentShift: any;
  isProductionReviewSettingsModalVisible = false;
  public modelingSettingUrl = environment.application.baseUrl + '/#/modeling/production-review-board-settings';
  expandedItems: any = {
    l1: {},
    l2: {}
  };

  // New properties for dynamic table
  displayColumns: TableColumn[] = [];
  displayL1Columns: TableColumn[] = [];
  displayL2Columns: TableColumn[] = [];
  displayL3Columns: TableColumn[] = [];
  displayFieldDtoMapping = displayFieldDtoMapping;
  hasMultipleLevels = false;
  baseGroupWidth = 110;


  constructor(
    private productionReviewBoardSettingService: ProductionReviewBoardSettingService,
    private localizationService: LocalizationService,
    private confirmation: ConfirmationService,
    private shiftService: ShiftService,
    private productionReviewDataService: ProductionReviewDataService
  ) {}

  ngOnInit(): void {
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widget = data;
    });
    this.initSettings();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.productionDataParams && !changes.productionDataParams.firstChange) {
      this.productionDataParams = changes.productionDataParams.currentValue;
      // Re-initialize display columns to update display names based on new isProductSeries
      this.initDisplayColumns();
      if (this.currentShift && this.currentShift.shiftPatternId) {
        this.getIntervalProductionReviewDataL1();
      } else {
        this.getStartTime();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    clearInterval(this.timer);
  }

  expand() {
    this.expandChart = !this.expandChart;
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

  initSettings() {
    this.settings = { ...this.settings, ...this.getSettingsFromLocalStorage() };
    this.productionReviewBoardSettingService.getList({
      maxResultCount: 500
    }).subscribe((res) => {
      this.productionReviewBoardSettings = res.items;
      
      if (!this.settings.productionReviewBoardSettingId) {
        this.isProductionReviewSettingsModalVisible = true;
        return;
      }

      this.saveCurrentProductionReviewBoardSetting(false);

      this.shiftService.getShiftByDate(
        new Date().toISOString(),
        {
          areaIds: this.selectedAreas,
          cellIds: this.selectedCells,
          wrokCenterIds: this.selectedWorkCenters
        }).subscribe(res => {
          this.timeConvert(res.firstShiftStartDateTimeUtc);
          this.currentShift = res;
          this.initDisplayColumns();
          this.getIntervalProductionReviewDataL1();
        })
    });
  }

  // Calculate the maximum number of groups across all levels
  getMaxGroupCount(): number {
    const l1Count = this.settings.L1GroupKey?.length || 0;
    const l2Count = this.settings.L2GroupKey?.length || 0;
    const l3Count = this.settings.L3GroupKey?.length || 0;
    return Math.max(l1Count, l2Count, l3Count);
  }

  initDisplayColumns() {
    this.displayColumns = [];
    this.displayL1Columns = [];
    this.displayL2Columns = [];
    this.displayL3Columns = [];
    this.hasMultipleLevels = false;

    // Calculate the maximum group count across all levels for width calculation
    const l1Count = this.settings.L1GroupKey?.length || 0;
    const l2Count = this.settings.L2GroupKey?.length || 0;
    const l3Count = this.settings.L3GroupKey?.length || 0;
    const maxGroupCount = Math.max(l1Count, l2Count, l3Count);

    // First, add group columns based on L1GroupKey
    this.settings.L1GroupKey.forEach((groupKey, index) => {
      this.displayL1Columns.push({
        key: groupKey,
        displayName: this.getGroupKeyDisplayName(groupKey),
        prop: this.getGroupKeyProp(groupKey),
        width: (maxGroupCount * this.baseGroupWidth) / l1Count,
        isGroupColumn: true,
        isFirstGroupColumn: index === 0,
        isLastGroupColumn: index === l1Count - 1
      });
    });

    // Second, add group columns based on L2GroupKey
    this.settings.L2GroupKey.forEach((groupKey, index) => {
      this.displayL2Columns.push({
        key: groupKey,
        displayName: this.getGroupKeyDisplayName(groupKey),
        prop: this.getGroupKeyProp(groupKey),
        width: ((maxGroupCount * this.baseGroupWidth) - 5) / l2Count,
        isGroupColumn: true,
        isFirstGroupColumn: index === 0,
        isLastGroupColumn: index === l2Count - 1
      });
    });

    // Third, add group columns based on L3GroupKey
    this.settings.L3GroupKey.forEach((groupKey, index) => {
      this.displayL3Columns.push({
        key: groupKey,
        displayName: this.getGroupKeyDisplayName(groupKey),
        prop: this.getGroupKeyProp(groupKey),
        width: ((maxGroupCount * this.baseGroupWidth) - 10) / l3Count,
        isGroupColumn: true,
        isFirstGroupColumn: index === 0,
        isLastGroupColumn: index === l3Count - 1
      });
    });

    // Finally, add data columns based on displayColumn setting
    if (this.settings.displayColumn && this.settings.displayColumn.length > 0) {
      this.settings.displayColumn.forEach(columnKey => {
        const mapping = displayFieldDtoMapping[columnKey];
        if (mapping && mapping.prop) {
          this.displayColumns.push({
            key: columnKey,
            displayName: columnKey,
            prop: mapping.prop,
            width: 94,
            isGroupColumn: false,
            dataType: mapping.dataType,
            kpiField: this.getKpiField(columnKey),
            isFirstGroupColumn: false,
            isLastGroupColumn: false
          });
        }
      });
    }

    console.log('Display Columns:', this.displayColumns);
    console.log('L1 Columns:', this.displayL1Columns);
    console.log('L2 Columns:', this.displayL2Columns);
    console.log('L3 Columns:', this.displayL3Columns);
  }

  getGroupKeyDisplayName(groupKey: string): string {
    const mappings = {
      'FamilySerialId': this.productionDataParams?.isProductSeries ? '::LABEL_ProductSerie' : '::LABEL_ProductFamily',
      'WorkCenterId': '::LABEL_WorkCenter',
      'ProductId': '::LABEL_Product',
      'WorkOrder': '::Label_WorkOrder',
      'Operation': '::LABEL_Operation'
    };
    return mappings[groupKey] || groupKey;
  }

  getGroupKeyProp(groupKey: string): string {
    const propMappings = {
      'FamilySerialId': 'familySerialName',
      'WorkCenterId': 'workCenterName', 
      'ProductId': 'productName',
      'WorkOrder': 'workOrder',
      'Operation': 'operation'
    };
    return propMappings[groupKey] || groupKey;
  }

  getKpiField(columnKey: string): string | undefined {
    const kpiMappings = {
      '::LABEL_PerformancePercentage': 'performanceKpi',
      '::LABEL_UnplannedDowntimeHours': 'udtKpi',
      '::LABEL_CellSettingScrapPPM': 'scrapPPMKpi',
      '::LABEL_QualityPercentage': 'qualityKpi',
      '::LABEL_POEE': 'poeeKpi'
    };
    return kpiMappings[columnKey];
  }

  isLastGroupColumn(column: TableColumn): boolean {
    if (!column.isGroupColumn) return false;
    
    // Find all group columns in the current level
    const groupColumns = this.displayColumns.filter(col => col.isGroupColumn);
    const lastGroupColumn = groupColumns[groupColumns.length - 1];
    
    return column.key === lastGroupColumn.key;
  }

  isExpandableLevel(row: any): boolean {
    // Check if current row can be expanded based on level configuration
    return this.hasMultipleLevels && this.getCurrentLevel() < this.getMaxLevel();
  }

  getCurrentLevel(): number {
    return 1; // This is the L1 level
  }

  getMaxLevel(): number {
    if (this.settings.L3GroupKey && this.settings.L3GroupKey.length > 0) return 3;
    if (this.settings.L2GroupKey && this.settings.L2GroupKey.length > 0) return 2;
    return 1;
  }

  getGroupDisplayName(row: any, column: TableColumn): string {
    if (column.isGroupColumn) {
      // For group columns, use the mapped property to get the display name
      const originalGroupKey = column.key.replace('group_', '');
      const prop = this.getGroupKeyProp(originalGroupKey);
      
      if (row.groupKeys && row.groupKeys[prop]) {
        return row.groupKeys[prop];
      }
      return row[prop] || '';
    }
    
    // For non-group columns, use the mapped property
    return row[column.prop] || '';
  }

  getKpiClass(row: any, column: TableColumn): any {
    if (!column.kpiField) return {};
    
    const kpiValue = Number(row[column.kpiField]);
    return {
      'alert-bg': kpiValue === 3,
      'warning-bg': kpiValue === 2
    };
  }

  isNegativeValue(row: any, column: TableColumn): boolean {
    if (column.key === '::LABEL_Difference' || column.key === '::LABEL_Diff') {
      const value = row[column.prop];
      return value !== null && value !== undefined && value < 0;
    }
    return false;
  }

  formatValue(value: any, column: TableColumn): string {
    if (value === null || value === undefined) return '';
    
    switch (column.dataType) {
      case 'number-0':
        return Math.round(value || 0).toString();
      case 'number-1':
        return (value || 0).toFixed(1);
      case 'number-2':
        return (value || 0).toFixed(2);
      case 'percentage-0':
        return `${Math.round(value || 0)}%`;
      case 'percentage-1':
        return `${(value || 0).toFixed(1)}%`;
      case 'text':
      default:
        return value.toString();
    }
  }

  isValidValue(value: any): boolean {
    return value !== null && value !== '' && value !== undefined;
  }

  toggleExpandRow(row: any, expanded: boolean, table: DatatableComponent) {
    const rowKey = this.getL1RowKey(row);

    if (!expanded) {
      this.getProductionReviewDataL2(row);
      this.expandedItems.l1[rowKey] = true;
    } else {
      delete this.expandedItems.l1[rowKey];
      Object.keys(this.expandedItems.l2).forEach(l2Key => {
        if (l2Key.startsWith(rowKey + '_')) {
          delete this.expandedItems.l2[l2Key];
        }
      });
    }

    table.rowDetail.toggleExpandRow(row);
    
    // Manual refresh control
    this.manualRefresh = Object.keys(this.expandedItems.l1).length > 0 || Object.keys(this.expandedItems.l2).length > 0;
    if (this.manualRefresh) {
      clearInterval(this.timer);
    } else {
      this.getIntervalProductionReviewDataL1();
    }

    // Notify parent component of manualRefresh change
    this.updateChange.emit({ type: 'manualRefreshChange', manualRefresh: this.manualRefresh });
  }

  toggleExpandL2Row(row: any, expanded: boolean, table: DatatableComponent) {
    const parentRowKey = this.getL1RowKey(row);
    const rowKey = this.getL2RowKey(row);
    const fullKey = `${parentRowKey}_${rowKey}`;

    if (!expanded) {
      this.getProductionReviewDataL3(row);
      this.expandedItems.l2[fullKey] = true;
    } else {
      delete this.expandedItems.l2[fullKey];
    }

    table.rowDetail.toggleExpandRow(row);

    // Update manual refresh control
    this.manualRefresh = Object.keys(this.expandedItems.l1).length > 0 || Object.keys(this.expandedItems.l2).length > 0;
    if (this.manualRefresh) {
      clearInterval(this.timer);
    } else {
      this.getIntervalProductionReviewDataL1();
    }

    // Notify parent component of manualRefresh change
    this.updateChange.emit({ type: 'manualRefreshChange', manualRefresh: this.manualRefresh });
  }

  getL1RowKey(row: any): string {
    if (this.displayL1Columns.length > 0) {
      const keyParts = this.displayL1Columns.map(col => {
        const prop = this.getGroupKeyProp(col.key);
        return row.groupKeys?.[prop] || row[prop] || '';
      });
      return keyParts.join('|');
    }
    return "";
  }

  getL2RowKey(row: any): string {
    if (this.displayL2Columns.length > 0) {
      const keyParts = this.displayL2Columns.map(col => {
        const prop = this.getGroupKeyProp(col.key);
        return row.groupKeys?.[prop] || row[prop] || '';
      });
      return keyParts.join('|');
    }
    return "";
  }

  getL3RowKey(row: any): string {
    if (this.displayL3Columns.length > 0) {
      const keyParts = this.displayL3Columns.map(col => {
        const prop = this.getGroupKeyProp(col.key);
        return row.groupKeys?.[prop] || row[prop] || '';
      });
      return keyParts.join('|');
    }
    return "";
  }

  openEditSettings() {
    this.editSettings = { ...this.settings };
    this.isSettingsModalVisible = true;
  }

  saveSettings() {
    this.isSettingsModalVisible = false;
    const intervalChanged = this.editSettings.refreshRate !== this.settings.refreshRate;
    const settingIdChanged = this.editSettings.productionReviewBoardSettingId !== this.settings.productionReviewBoardSettingId;
    this.settings = { ...this.settings, ...this.editSettings };
    if (settingIdChanged) {
      this.updateSettingsFromProductionReviewBoardSetting();
      this.initDisplayColumns();
    }
    if (intervalChanged) {
      this.getIntervalProductionReviewDataL1();
    }
    this.editSettings = {};
    this.storeSettingsInLocalStorage();
    this.updateWidgetInfo();
    this.getProductionReviewDataL1();
  }

  updateSettingsFromProductionReviewBoardSetting() {
    const selectedSetting = this.productionReviewBoardSettings.find(
      setting => setting.id === this.settings.productionReviewBoardSettingId
    );

    if (selectedSetting) {
      this.settings.displayColumn = selectedSetting.displayList?.split(';').filter(x => x.trim()) || [];
      this.settings.L1GroupKey = this.mapGroupKeys(selectedSetting.l1GroupList);
      this.settings.L2GroupKey = this.mapGroupKeys(selectedSetting.l2GroupList);
      this.settings.L3GroupKey = this.mapGroupKeys(selectedSetting.l3GroupList);
      this.settings.ReviewType = selectedSetting.reviewType;
    }
  }

  updateWidgetInfo() {
    const requestBody: any = {
      dashboardId: this.selected.dashboardId,
      seq: this.selected.seq,
      widgetName: this.selected.widgetName,
      name: this.settings.name,
      description: this.selected.description,
      tenantId: this.selected.tenantId,
      displayName: this.selected.displayName,
      id: this.selected.id,
      extraProperties: { ...this.settings }
    };
    this.updateChange.emit({ type: 'update', widget: requestBody });
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

  getProductionReviewDataL1() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.productionReviewDataService.getProductionReviewDataByInput({
      shiftPatternId: this.currentShift.shiftPatternId,
      mode: this.productionDataParams.isProductSeries ? 'ProductSeries' : 'ProductFamily',
      areaIds: this.selectedDataTier?.area?.id ? [this.selectedDataTier.area.id] : [],
      cellIds: this.selectedDataTier?.cell?.id ? [this.selectedDataTier?.cell?.id] : [],
      workCenterIds: this.selectedDataTier?.workCenter?.id ? [this.selectedDataTier.workCenter.id] : [],
      reviewType: this.settings.ReviewType,
      groupKeys: this.settings.L1GroupKey.map(key => ({ 
        keyName: key,
        keyValue: '',
        isFilterNull: false
      } as GroupKey)),
      shiftInterval: null,
      isCalculateTotal: true,
      startDate: this.productionDataParams.startDate,
      endDate: this.productionDataParams.endDate,
      productSerieIds: this.productionDataParams.productSerieIds,
      productFamilyIds: this.productionDataParams.productFamilyIds,
      productIds: this.productionDataParams.productIds,
      workOrders: [],
      operations: []
    } as ProductionReviewGeneralDataInput).subscribe(res => {
      this.productionReviewDataL1 = res.productionReviewDetailItems || [];
      this.totalData = res.total || {} as ProductionReviewDetailDataDto;
      this.initExpandStatus();
    });
  }

  getProductionReviewDataL2(row: any): Promise<void> {
    if (!this.settings.L2GroupKey || this.settings.L2GroupKey.length === 0) {
      return Promise.resolve();
    }

    const requestBody = {
      shiftPatternId: this.currentShift.shiftPatternId,
      mode: this.productionDataParams.isProductSeries ? 'ProductSeries' : 'ProductFamily',
      areaIds: this.selectedDataTier?.area?.id ? [this.selectedDataTier.area.id] : [],
      cellIds: this.selectedDataTier?.cell?.id ? [this.selectedDataTier?.cell?.id] : [],
      workCenterIds: this.selectedDataTier?.workCenter?.id ? [this.selectedDataTier.workCenter.id] : [],
      reviewType: this.settings.ReviewType,
      groupKeys: this.settings.L2GroupKey.map(key => ({ 
        keyName: key,
        keyValue: '',
        isFilterNull: false
      } as GroupKey)),
      shiftInterval: null,
      isCalculateTotal: false,
      startDate: this.productionDataParams.startDate,
      endDate: this.productionDataParams.endDate,
      productSerieIds: this.productionDataParams.productSerieIds,
      productFamilyIds: this.productionDataParams.productFamilyIds,
      productIds: this.productionDataParams.productIds,
      workOrders: [],
      operations: []
    } as ProductionReviewGeneralDataInput;

    this.settings.L1GroupKey.forEach(key => {
      const groupKey = {
        keyName: key,
        keyValue: row.groupKeys?.[key] || row[key] || '',
        isFilterNull: false
      } as GroupKey;
      requestBody.groupKeys.push(groupKey);
    });

    return new Promise((resolve) => {
      this.productionReviewDataService.getProductionReviewDataByInput(requestBody).subscribe(res => {
        row.l2Data = res.productionReviewDetailItems || [];
        resolve();
      });
    });
  }

  getProductionReviewDataL3(row: any) {
    if (!this.settings.L3GroupKey || this.settings.L3GroupKey.length === 0) return;

    const requestBody = {
      shiftPatternId: this.currentShift.shiftPatternId,
      mode: this.productionDataParams.isProductSeries ? 'ProductSeries' : 'ProductFamily',
      areaIds: this.selectedDataTier?.area?.id ? [this.selectedDataTier.area.id] : [],
      cellIds: this.selectedDataTier?.cell?.id ? [this.selectedDataTier?.cell?.id] : [],
      workCenterIds: this.selectedDataTier?.workCenter?.id ? [this.selectedDataTier.workCenter.id] : [],
      reviewType: this.settings.ReviewType,
      groupKeys: this.settings.L3GroupKey.map(key => ({ 
        keyName: key,
        keyValue: '',
        isFilterNull: false
      } as GroupKey)),
      shiftInterval: null,
      isCalculateTotal: false,
      startDate: this.productionDataParams.startDate,
      endDate: this.productionDataParams.endDate,
      productSerieIds: this.productionDataParams.productSerieIds,
      productFamilyIds: this.productionDataParams.productFamilyIds,
      productIds: this.productionDataParams.productIds,
      workOrders: [],
      operations: []
    } as ProductionReviewGeneralDataInput;

    this.settings.L1GroupKey.forEach(key => {
      const groupKey = {
        keyName: key,
        keyValue: row.groupKeys?.[key] || row[key] || '',
        isFilterNull: false
      } as GroupKey;
      requestBody.groupKeys.push(groupKey);
    });

    this.settings.L2GroupKey.forEach(key => {
      const groupKey = {
        keyName: key,
        keyValue: row.groupKeys?.[key] || row[key] || '',
        isFilterNull: false
      } as GroupKey;
      requestBody.groupKeys.push(groupKey);
    });

    this.productionReviewDataService.getProductionReviewDataByInput(requestBody).subscribe(res => {
      row.l3Data = res.productionReviewDetailItems || [];
    });
  }

  initExpandStatus() {
    // Restore L1 expanded state for current page
    if (Object.keys(this.expandedItems.l1).length > 0) {
      this.productionReviewDataL1.forEach(row => {
        const rowKey = this.getL1RowKey(row);
        if (this.expandedItems.l1[rowKey]) {
          setTimeout(() => {
            this.dynamicTable.rowDetail.toggleExpandRow(row);
            this.getProductionReviewDataL2(row).then(() => {
              // After L2 data is loaded, restore L2 expanded state
              this.initL2ExpandStatus(row, rowKey);
            });
          }, 100);
        }
      });
    }
  }

  initL2ExpandStatus(parentRow: any, parentRowKey: string) {
    // Restore L2 expanded state for the given parent row
    if (parentRow.l2Data && Object.keys(this.expandedItems.l2).length > 0) {
      parentRow.l2Data.forEach(l2Row => {
        const l2RowKey = this.getL2RowKey(l2Row);
        const fullKey = `${parentRowKey}_${l2RowKey}`;
        if (this.expandedItems.l2[fullKey]) {
          setTimeout(() => {
            this.dynamicTableL2?.rowDetail.toggleExpandRow(l2Row);
            this.getProductionReviewDataL3(l2Row);
          }, 100);
        }
      });
    }
  }

  private storeSettingsInLocalStorage() {
    localStorage.setItem(this.LOCAL_STORAGE_KEY + this.selected.dashboardId, JSON.stringify(this.settings));
  }

  private getSettingsFromLocalStorage() {
    const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY + this.selected.dashboardId);
    return stored ? JSON.parse(stored) : {};
  }

  timeConvert(startTime: string) {
    this.startTime = startTime;
    if (this.isYesterday) {
      const endDate = new Date(startTime);
      endDate.setDate(endDate.getDate() + 1);
      this.endTime = endDate.toISOString();
    } else {
      if (+new Date(startTime) > +new Date()) {
        const startDate = new Date(startTime);
        startDate.setDate(startDate.getDate() - 1);
        this.startTime = startDate.toISOString();
      }
      this.endTime = new Date().toISOString();
    }
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

  saveCurrentProductionReviewBoardSetting(isUpdateWidgetInfo: boolean = true) {
    const selectedSetting = this.productionReviewBoardSettings.find(
      setting => setting.id === this.settings.productionReviewBoardSettingId
    );

    if (selectedSetting) {
      this.updateSettingsFromProductionReviewBoardSetting();
      this.initDisplayColumns();
    }

    this.storeSettingsInLocalStorage();
    if(isUpdateWidgetInfo) {
      this.updateWidgetInfo();
    }
    this.getProductionReviewDataL1();
    this.isProductionReviewSettingsModalVisible = false;
  }

  private mapGroupKeys(groupList: string): string[] {
    if (!groupList) return [];

    const groupKeys = groupList.split(';').map(s => s.trim());
    const mappedKeys: string[] = [];

    groupKeys.forEach(key => {
      switch (key) {
        case 'Product':
          mappedKeys.push('ProductId');
          break;
        case 'Work Center':
          mappedKeys.push('WorkCenterId');
          break;
        case 'Work Order':
          mappedKeys.push('WorkOrder');
          break;
        case 'Operation':
          mappedKeys.push('Operation');
          break;
        case 'Product Series / Product Families':
          mappedKeys.push('FamilySerialId');
          break;
        default:
          break;
      }
    });

    return mappedKeys;
  }
}
