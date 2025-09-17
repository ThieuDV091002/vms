import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ConfigStateService, CurrentTenantDto, CurrentUserDto, PagedResultDto, PermissionService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { ActivatedRoute } from '@angular/router';
import { AppUtils } from '../modeling/utils/app.utils';
import { AreaDto } from '@apis/corporate/dtos';
import { LocalizationService } from '@abp/ng.core';
import {
  DashboardDto,
  FailedImportResultItemDto,
  ImportResultDto,
  ModelingHistoryDto,
  ModelingInput,
} from '@apis/dashboard/dtos';
import { DashboardService } from '@apis/dashboard/services';
import { UserService } from '@proxy/services';
import { FileType, OverridingMode } from '@apis/dashboard';
import { read, utils } from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import { AreaService } from '@apis/corporate';
import { TreeviewUserWithAssignedDataTierDto } from '@proxy/dtos/assigned-data-tiers';
import { availableWidgets, widgetConfigurations } from './widget-config';
import { DashboardUtils } from './utils';
import { MessageCategoryDto } from '@apis/general/dtos';
import { BroadcastMessageService, MessageCategoryService } from '@apis/general';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  @ViewChild('actionBar') actionBar: ElementRef;
  @Input() homepage = false;
  widgets: any[] = [];
  hasDataTierWidget = false;
  tenant: CurrentTenantDto;
  currentUser: CurrentUserDto;
  selectedIndex = -1;
  selectedWidgetIndex = -1;
  currentCellHuddleIdx = -1;
  currentAreaHuddleIdx = -1;
  newDashboard;
  selectedDashboard;
  createDashboard = false;
  dashboards: DashboardDto[];
  layoutClass = '';
  layoutItems = Array(4).fill(0);
  layout = '3x1';
  draggedItemIndex: number | null = null;
  addWidget = false;
  editWidget = false;
  queryId: string = null;
  dataTierTreeNode: AreaDto[] = [];
  haveAccessTreeNode: any[] = [];
  selectedDataTier: any;
  isHistoryModalVisible = false;
  historys: PagedResultDto<ModelingHistoryDto>;
  protected readonly FileType = FileType;
  readonly homePageName = 'Home Page';
  private readonly OverridingMode = OverridingMode;
  overridingMode: OverridingMode = OverridingMode.Overwrite;
  isModalOpen = false;
  newData: any = {};
  acceptFileType = {
    [FileType.Json]: '.json',
    [FileType.Excel]: '.xls,.xlsx',
    // [FileType.Csv]: '.csv',
  };
  importData: any = [];
  isImportDetailsVisible = false;
  importResult: FailedImportResultItemDto[] = [];
  allWidgets = availableWidgets;
  widgetTypes = widgetConfigurations;
  info: string;
  widgetInfo: string;
  assignedAndDefaultDataTiers: TreeviewUserWithAssignedDataTierDto;
  datatierFilterShow = false;
  tenantInfo: any;
  isCellHuddleExpandShow: boolean = false;
  cellHuddleSafetyExpand: boolean = false;
  cellHuddleKpiExpand: boolean = false;
  areaHuddleSafetyExpand: boolean = false;
  areaHuddleKpiExpand: boolean = false;
  isAreaHuddleExpandShow: boolean = false;
  dashboardDataTierLevelOptions = [
    { label: 'AbpUi::No', value: 'No' },
    { label: '::Area', value: 'Area' },
    { label: '::Cell', value: 'Cell' },
    { label: '::WorkCenter', value: 'WorkCenter' }
  ];
  currentSiteName: string;
  importConfirmVisible = false;
  existingDashboardData = [];
  newDashboardData = [];
  isFPY = false;
  isUPPH = false;
  hasSafetyAlert = false;
  hasSafetyAlertActivated = false;
  safetyAlertNumber = 0;
  safetyCategory: MessageCategoryDto = null;
  enableEdit = false;
  constructor(
    private dashboardService: DashboardService,
    private toasterService: ToasterService,
    private router: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private areaService: AreaService,
    private userService: UserService,
    private configService: ConfigStateService,
    private localizationService: LocalizationService,
    private messageCategoryService: MessageCategoryService,
    private broadcastMessageService: BroadcastMessageService,
    private permissionService: PermissionService
  ) {
    this.tenantInfo = this.configService.getOne('extraProperties');
    if (this.tenantInfo.DataTierType === 'Site' && this.tenantInfo.TenantDisplayName) {
      this.currentSiteName = this.tenantInfo.TenantDisplayName;
    }
    this.enableEdit = this.permissionService.getGrantedPolicy('Dashboard.Update');
  }

  ngOnInit(): void {
    if (this.homepage) {
      this.getDashboardByName(this.homePageName);
    } else {
      this.router.params.subscribe(res => {
        this.queryId = res?.id;
        if (this.queryId) {
          this.getDashboardByName(this.queryId);
        } else {
          this.getDashboardList();
        }
      });
      this.getTarget();
    }
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
    this.localizationService.get('::Dashboard').subscribe(data => {
      this.info = data;
    });
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widgetInfo = data;
    });
  }

  getSafetyAlertMessage() {
    // if safety category not have id, then no need to request safety alert message
    if (!this.safetyCategory.id) {
      this.safetyAlertNumber = 0;
      this.hasSafetyAlert = false;
      return;
    }
    this.broadcastMessageService.getList({
      userId: this.configService.getOne('currentUser').id,
      categoryId: this.safetyCategory.id,
      areas: this.selectedDataTier?.areas?.map(area => area?.id),
      isExcludeExpiredMessage: true,
      cells: [],
      workCenters: [],
      maxResultCount: 10
    }).subscribe({
      next: (res) => {
        this.safetyAlertNumber = res.totalCount;
        this.hasSafetyAlert = res.totalCount > 0;
        if (this.hasSafetyAlert && !this.hasSafetyAlertActivated) {
          this.hasSafetyAlertActivated = true;
        }
      },
      error: () => {
        this.safetyAlertNumber = 0;
        this.hasSafetyAlert = false;
      }
    });
  }

  getSafetyAlertInfo() {
    // if not select any area, then no need to request safety alert message
    // if (!this.selectedDataTier || !this.selectedDataTier.areas) {
    // this.safetyAlertNumber = 0;
    //   this.hasSafetyAlert = false;
    //   return;
    // }
    // if not have safety category, then no need to request safety alert message
    if (!this.safetyCategory) {
      this.messageCategoryService.getByName('Safety').subscribe(res => {
        this.safetyCategory = res || {};
        this.getSafetyAlertMessage();
      });
    } else {
      this.getSafetyAlertMessage();
    }
  }

  refreshCalendar() {
    DashboardUtils.refreshCalendar.next(true);
  }

  recalculateTableSize() {
    DashboardUtils.recalculateTableSize.next(true);
  }

  getTarget() {
    const userId = this.configService.getOne('currentUser').id;
    const FPYTargetstorageKey = `isFPYTarget_${userId}`;
    const UPPHTargetstorageKey = `isUPPHTarget_${userId}`;
    if (localStorage.getItem(FPYTargetstorageKey)) {
      this.isFPY = JSON.parse(localStorage.getItem(FPYTargetstorageKey));
    }

    if (localStorage.getItem(UPPHTargetstorageKey)) {
      this.isUPPH = JSON.parse(localStorage.getItem(UPPHTargetstorageKey));
    }
  }

  toogleTarget(type) {
    if (type === 'FPY') {
      this.isFPY = !this.isFPY;
      const userId = this.configService.getOne('currentUser').id;
      const FPYTargetstorageKey = `isFPYTarget_${userId}`;
      localStorage.setItem(FPYTargetstorageKey, JSON.stringify(this.isFPY));
    } else if (type === 'UPPH') {
      this.isUPPH = !this.isUPPH;
      const userId = this.configService.getOne('currentUser').id;
      const UPPHTargetstorageKey = `isUPPHTarget_${userId}`;
      localStorage.setItem(UPPHTargetstorageKey, JSON.stringify(this.isUPPH));
    }
  }

  initHaveAccessTreeNode(assignedDataTiers) {
    this.haveAccessTreeNode = AppUtils.initHasAccessTreeNode(
      this.dataTierTreeNode,
      assignedDataTiers
    );
  }

  getDashboardWidget() {
    if (!this.selectedDashboard) { return }

    let widgetLen = 4;
    if (this.selectedDashboard.layout === '1X1') {
      this.layoutClass = 'col-md-12';
      widgetLen = 1;
    } else if (this.selectedDashboard.layout === '2X2') {
      this.layoutClass = 'col-md-6';
      widgetLen = 4;
    } else if (this.selectedDashboard.layout === '1X2') {
      this.layoutClass = 'col-md-6';
      widgetLen = 2;
    } else if (this.selectedDashboard.layout === '3X3') {
      this.layoutClass = 'col-md-4';
      widgetLen = 9;
    } else if (this.selectedDashboard.layout === '2X3') {
      this.layoutClass = 'col-md-6';
      widgetLen = 6;
    } else if (this.selectedDashboard.layout === '2X1') {
      this.layoutClass = 'col-md-12';
      widgetLen = 2;
    } else if (this.selectedDashboard.layout === '3X1') {
      this.layoutClass = 'col-md-12';
      widgetLen = 3;
    } else if (this.selectedDashboard.layout === 'CellHuddle') {
      this.layoutClass = 'col-md-12';
      widgetLen = 14;
      this.getSafetyAlertInfo();
    } else if (this.selectedDashboard.layout === 'AreaHuddle') {
      this.layoutClass = 'col-md-12';
      widgetLen = 10;
      this.getSafetyAlertInfo();
    }
    else {
      this.layoutClass = 'col-md-6';
      widgetLen = 4;
    }

    if (this.selectedDashboard.layout === 'CellHuddle' || this.selectedDashboard.layout === 'AreaHuddle') {
      this.widgets = this.selectedDashboard.dashboardWidgets
        .filter(w => w.widgetName)
        .sort((a, b) => a.seq - b.seq);
    } else {
      this.widgets = this.selectedDashboard.dashboardWidgets
        .filter(w => w.widgetName)
        .sort((a, b) => a.seq - b.seq);

      this.setDefaultWidgetType();

      //
      if (this.widgets.length < widgetLen && this.enableEdit && !this.homepage) {
        for (let item of Array(widgetLen - this.widgets.length).fill(0)) {
          this.widgets.push({});
        }
      }
    }
  }

  isShiftCommentPage(queryId: string): boolean {
    if (!queryId) return false;

    return queryId.toLowerCase().includes('shift') ||
      queryId.toLowerCase().includes('shiftcomment');
  }

  setDefaultWidgetType() {
    if (!this.widgets || !this.widgets.length) return;

    const pageIdentifier = this.getPageIdentifier();
    const isShiftComment = pageIdentifier === 'ShiftComment';

    this.widgets.forEach(widget => {
      if (widget.widgetName === 'commentPage' || widget.widgetName === 'shiftComment') {
        const defaultWidgetType = isShiftComment ? 'shiftComment' : 'commentPage';

        if (widget.widgetName !== defaultWidgetType) {
          widget.widgetName = defaultWidgetType;
          widget.name = isShiftComment ? 'Shift Comments' : 'Comments';
          widget.displayName = isShiftComment ? 'Shift Comments' : 'Comments';

          if (widget.id) {
            localStorage.setItem(`widget_${widget.id}_type`, defaultWidgetType);
          }
        }
      }
    });
  }

  viewHistory() {
    this.isHistoryModalVisible = true;
    let input: ModelingInput<string> = {
      id: this.selectedDashboard.id,
      maxResultCount: 1000,
      skipCount: 0,
      sorting: 'executionTime desc',
    };
    this.dashboardService.getModelingHistoryByInput(input).subscribe(historys => {
      this.historys = historys;
      this.isHistoryModalVisible = true;
    });
  }

  convertExcelFileImportData(data: any) {
    const result = [];
    let importItem: any = {};
    for (let i = 1; i < data.length; i++) {
      const currentRow = data[i];
      const previousRow = data[i - 1];
      if (i > 1 && (currentRow.__EMPTY === previousRow.__EMPTY || currentRow.__EMPTY_1 === previousRow.__EMPTY_1)) {
        if (currentRow.DashboardWidgetItem && currentRow.DashboardWidgetItem_1 && currentRow.DashboardWidgetItem_2) {
          importItem['DashboardWidgets'].push({
            Name: currentRow.DashboardWidgetItem,
            Seq: currentRow.DashboardWidgetItem_1,
            WidgetName: currentRow.DashboardWidgetItem_2,
            ExtraProperties: JSON.parse(currentRow.DashboardWidgetItem_3.replace())
          });
        }
      } else {
        if (importItem && i > 1) {
          result.push(importItem);
        }
        importItem = this.createEmptyImportObject(data[0]);
        importItem.Id = currentRow.__EMPTY;
        importItem.Name = currentRow.__EMPTY_1;
        importItem.DisplayName = currentRow.__EMPTY_2;
        importItem.DateTier = currentRow.__EMPTY_3;
        importItem.Layout = currentRow.__EMPTY_4;
        importItem.ShowTenantDataTier = currentRow.__EMPTY_5 === 'True' || currentRow.__EMPTY_5 === true;
        importItem.CreationTime = currentRow.__EMPTY_6;
        importItem.CreationUser = currentRow.__EMPTY_7;
        importItem.LastModificationTime = currentRow.__EMPTY_8;
        importItem.LastModificationUser = currentRow.__EMPTY_9;
        importItem['DashboardWidgets'] = [];
        if (currentRow.DashboardWidgetItem && currentRow.DashboardWidgetItem_1 && currentRow.DashboardWidgetItem_2) {
          importItem['DashboardWidgets'].push({
            Name: currentRow.DashboardWidgetItem,
            Seq: currentRow.DashboardWidgetItem_1,
            WidgetName: currentRow.DashboardWidgetItem_2,
            ExtraProperties: JSON.parse(currentRow.DashboardWidgetItem_3.replace())
          });
        }
      }
    }

    if (importItem) {
      result.push(importItem);
    }

    return result;
  }

  createEmptyImportObject(data: any) {
    const importItem: { [key: string]: any } = {};
    importItem['DashboardWidgets'] = [];
    Object.values(data).forEach((value: string) => {
      if (!['Seq', 'ExtraProperties', 'WidgetName'].includes(value)) {
        importItem[value] = '';
      }
    });
    return importItem;
  }

  onFileChange(e: Event) {
    const htmlEl = e.target as HTMLInputElement;
    const file = htmlEl.files[0];
    if (file) {
      const acceptedFormats = htmlEl.accept.split(',').map(ext => ext.trim());
      const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!acceptedFormats.includes(fileExtension)) {
        this.confirmationService.error(
          `<b>${this.localizationService.instant('::LABEL_InvalidFileFormat')}</b><br>${this.localizationService.instant('::MSG_InvalidFileFormat').replace('{0}', htmlEl.accept)}`,
          '',
          { hideCancelBtn: true, yesText: 'AbpAccount::Close' });
        return;
      }
      const isJsonFile = fileExtension === '.json' || file.type === 'application/json';
      const reader = new FileReader();
      if (isJsonFile) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
      reader.onload = event => {
        const data = event.target?.result;
        if (isJsonFile) {
          if (typeof data === 'string') {
            this.importData = JSON.parse(data);
          }
        } else {
          const workbook = read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          this.importData = this.convertExcelFileImportData(utils.sheet_to_json(workbook.Sheets[sheetName], { raw: true, defval: '' }));
        }
        if (this.importData.length) {
          this.importFile();
        } else {
          this.toasterService.info('::NoDataAvailableInDatatable');
        }
      };
    } else {
      this.importData = [];
    }
  }

  importFile() {
    // convert json string value to json
    for (let data of this.importData) {
      for (let key in data) {
        try {
          data[key] = JSON.parse(data[key]);
        } catch (e) {
        }
      }
    }
    this.existingDashboardData = [];
    this.newDashboardData = [];
    this.dashboardService.getExistInstances(this.importData).subscribe((res) => {
      // respone is existing instances with all fields, but data from file only has couple of fields
      // and maybe with new values, so filter those data based on API response
      // mostly name can be used for filtering
      // if not existing, then all new data, directly import
      if (res.length === 0) {
        this.importDashboardData(this.importData);
      } else { // if existing, then compare and show to user for confirmation
        this.importData.forEach((model: any) => {
          const existing = res.find((item) => item.name === model.Name);
          if (existing) {
            this.existingDashboardData.push(model);
          } else {
            this.newDashboardData.push(model);
          }
        });
        this.importConfirmVisible = true;
      }
    });
  }

  customeImport(selectedData) {
    this.importConfirmVisible = false;
    this.importDashboardData([...this.newDashboardData, ...selectedData]);
  }

  importDashboardData(data: any) {
    if (data.length === 0) {
      this.toasterService.info('::NoDataAvailableInDatatable');
      return;
    }
    this.dashboardService
      .importByDtosAndMode(data, OverridingMode.Overwrite)
      .subscribe(res => {
        if (res.items?.length > 0) {
          this.importResult = res.items;
          this.isImportDetailsVisible = true;
        } else {
          this.toasterService.success('::LABEL_SuccessfullyImported');
        }
        if (res.items?.length !== this.importData.length) {
          this.getDashboardList();
        }
      });
  }

  exportClick(fileType) {
    this.dashboardService.exportByFileTypeAndIds(fileType, [this.selectedDashboard.id]).subscribe({
      next: (res: any) => {
        saveAs(
          this.base64ToBlob(res, AppUtils.generateFileName('Dashboards', fileType)),
          AppUtils.generateFileName('Dashboards', fileType)
        );
      },
      error: error => {
        this.confirmationService.error(error.error.message, 'An error has occurred!', {
          hideCancelBtn: true,
          yesText: 'AbpAccount::Close',
        });
      },
    });
  }

  exportAllClick(fileType) {
    this.dashboardService.exportAllByFileType(fileType).subscribe({
      next: (res: any) => {
        saveAs(
          this.base64ToBlob(res, AppUtils.generateFileName('Dashboards', fileType)),
          AppUtils.generateFileName('Dashboards', fileType)
        );
      },
      error: error => {
        this.confirmationService.error(error.error.message, 'An error has occurred!', {
          hideCancelBtn: true,
          yesText: 'AbpAccount::Close',
        });
      },
    });
  }

  copyDataClick() {
    this.newData = Object.assign({}, this.selectedDashboard);
    this.isModalOpen = true;
  }

  saveCopyData() {
    this.newData.displayName = this.newData.name;
    this.dashboardService.create(this.newData).subscribe(res => {
      this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
        messageLocalizationParams: [this.info, this.newData.name],
      });
      this.getDashboardList();
    });
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

  getDashboardById(id: string) {
    this.dashboardService.get(id, { skipHandleError: true }).subscribe(res => {
      this.selectedDashboard = res;
      this.getDashboardWidget();
    });
  }

  getDashboardByName(name: string) {
    this.dashboardService.getByName(name, { skipHandleError: true }).subscribe(res => {
      this.selectedDashboard = res;
      this.getDashboardWidget();
    });
  }

  copyId() {
    navigator.clipboard.writeText('dashboard/' + this.selectedDashboard.name).then(() => {
      this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
        messageLocalizationParams: [this.info, this.selectedDashboard.name],
      });
    });
  }

  addNewWidget(type) {
    let newWidget: any;
    if (this.selectedDashboard.layout === 'CellHuddle'
      || this.selectedDashboard.layout === 'AreaHuddle'
      || this.selectedDashboard.layout === 'siteHuddleDaily'
      || this.selectedDashboard.layout === 'siteHuddleMonthly'
      || this.selectedDashboard.layout === 'productionReviewBoard') {
      newWidget = {
        dashboardId: this.selectedDashboard.id,
        seq: this.selectedWidgetIndex,
        ...this.widgetTypes[type],
        widgetName: type
      };
      this.widgets.push(newWidget);
    } else {
      // genaral layout: calculate the next sequence
      let seq = this.selectedWidgetIndex;
      let widgets = this.widgets.slice(0, this.selectedWidgetIndex);
      const originLen = widgets.length;
      widgets = widgets.filter(w => w.widgetName);
      if (widgets.length > 0) {
        const maxSeqWidget = widgets[widgets.length - 1];
        if (maxSeqWidget.seq) {
          seq = maxSeqWidget.seq + (this.selectedWidgetIndex - originLen) + 1;
        }
      }
      let leftWidgets = this.widgets.slice(this.selectedWidgetIndex);
      // remove the empty widget
      leftWidgets = leftWidgets.filter(w => w.widgetName);
      // update the sequence of the widgets after the selected widget
      leftWidgets.forEach((w, index) => {
        w.seq = seq + index + 1;
      });
      newWidget = {
        dashboardId: this.selectedDashboard.id,
        seq: seq,
        ...this.widgetTypes[type],
        widgetName: type
      };
      this.widgets.splice(this.selectedWidgetIndex, 1, newWidget);
    }
    this.dashboardService
      .update(this.selectedDashboard.id, {
        ...this.selectedDashboard,
        dashboardWidgets: this.widgets.filter(widget => widget.widgetName),
      })
      .subscribe(res => {
        this.selectedDashboard = res;
        this.updateWidgets();
        // this.getDashboardWidget();
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.widgetInfo, newWidget.name],
        });
      });
  }

  updateWidgets() {
    // as API should have some issue that when any add/update/delete will cause the widget id changed
    // so need to update the widget id in the local widgets array
    this.widgets = this.widgets.map(w => {
      if (w.widgetName) {
        return this.selectedDashboard.dashboardWidgets.find(widget => widget.seq === w.seq);
      }
      return w;
    });
  }

  dashboardChange(e) {
    // get latest dashboard info in case update from other user
    this.getDashboardById(e.id);
  }

  expandChange(index: number) {
    if (this.selectedDashboard.layout === 'CellHuddle') {
      this.isCellHuddleExpandShow = !this.isCellHuddleExpandShow;
      // if (index != -1) {
      this.currentCellHuddleIdx = index;
      // }
      // if currentCellHuddleIdx is not -1, check safety or kpi expand
      if (this.currentCellHuddleIdx >= 1 && this.currentCellHuddleIdx <= 2) {
        this.cellHuddleSafetyExpand = true;
      } else if (this.currentCellHuddleIdx >= 3 && this.currentCellHuddleIdx <= 14) {
        this.cellHuddleKpiExpand = true;
      } else {
        this.cellHuddleSafetyExpand = false;
        this.cellHuddleKpiExpand = false;
      }
    } else if (this.selectedDashboard.layout === 'AreaHuddle') {
      this.isAreaHuddleExpandShow = !this.isAreaHuddleExpandShow;
      // if (index != -1) {
      this.currentAreaHuddleIdx = index;
      // }
      if (this.currentAreaHuddleIdx >= 1 && this.currentAreaHuddleIdx <= 2) {
        this.areaHuddleSafetyExpand = true;
      } else if (this.currentAreaHuddleIdx >= 3 && this.currentAreaHuddleIdx <= 9) {
        this.areaHuddleKpiExpand = true;
      } else {
        this.areaHuddleSafetyExpand = false;
        this.areaHuddleKpiExpand = false;
      }
    } else {
      this.selectedIndex = index;
      if (index !== -1 && this.actionBar) {
        this.actionBar.nativeElement.scrollIntoView();
      }
    }
  }

  getDashboardList(id = null) {
    this.dashboardService.getList({ maxResultCount: 100 }).subscribe(res => {
      this.dashboards = res.items;
      if (id) {
        this.selectedDashboard = this.dashboards.find(d => d.id == id);
      } else {
        this.selectedDashboard = this.dashboards[0];
      }
      this.getDashboardWidget();
    });
  }

  openCreateDashboard(create = true) {
    this.createDashboard = true;
    if (create) {
      this.newDashboard = {
        name: '',
        description: '',
        layout: '2X2',
        displayName: '',
        hasDataTier: false,
        dataTierLevel: 'No',
        showTenantDataTier: false
      };
    } else {
      this.newDashboard = Object.assign({}, this.selectedDashboard);
      this.newDashboard['dataTierLevel'] = this.selectedDashboard.extraProperties.dataTierLevel;
      this.newDashboard['showTenantDataTier'] = this.selectedDashboard.showTenantDataTier || false;
      if (!this.newDashboard.layout) {
        this.newDashboard.layout = '2X2';
      }
    }
  }

  addDashboard() {
    this.newDashboard['extraProperties'] = {
      dataTierLevel: this.newDashboard.dataTierLevel
    };
    if (!this.newDashboard.id) {
      this.dashboardService.create(this.newDashboard).subscribe(res => {
        this.createDashboard = false;
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.newDashboard.name],
        });
        this.getDashboardList();
      });
    } else {
      this.dashboardService.update(this.newDashboard.id, this.newDashboard).subscribe(res => {
        this.createDashboard = false;
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.newDashboard.name],
        });
        this.getDashboardList(this.newDashboard.id);
      });
    }
  }

  widgetUpdate({ type, widget, skipNotification, isRestoring }) {
    let dashboard;

    if (type === 'update' && widget._isToggleViewAction && !isRestoring) {
      const idx = this.widgets.findIndex(item => item.id === widget.id);
      if (idx >= 0) {
        this.widgets[idx] = widget;
      }
      return;
    }

    if (type === 'update' && isRestoring) {

      dashboard = {
        ...this.selectedDashboard,
        dashboardWidgets: this.selectedDashboard.dashboardWidgets.map(w =>
          w.id === widget.id ? widget : w
        ),
      };

      this.dashboardService.update(dashboard.id, dashboard).subscribe(res => {
        this.selectedDashboard = res;
        this.updateWidgets();
      });
      return;
    }

    if (type === 'delete') {
      dashboard = {
        ...this.selectedDashboard,
        dashboardWidgets: this.selectedDashboard.dashboardWidgets.filter(w => w.id !== widget.id),
      };
      this.widgets = this.widgets.map(w => (w.id === widget.id ? {} : w));
    } else if (type === 'update') {
      dashboard = {
        ...this.selectedDashboard,
        dashboardWidgets: this.selectedDashboard.dashboardWidgets.map(w =>
          w.id === widget.id ? widget : w
        ),
      };
    }

    this.dashboardService.update(dashboard.id, dashboard).subscribe(res => {
      this.selectedDashboard = res;
      this.updateWidgets();
      if (!skipNotification) {
        this.toasterService.success(
          type === 'delete'
            ? '::LABEL_SuccessfullyDeleted'
            : '::LABEL_UpdatedSuccessfully',
          '',
          {
            messageLocalizationParams: [this.widgetInfo, widget.name],
          }
        );
      }
    });
  }

  // refresh data based on area change
  areaChange(e) {
    if (this.selectedDashboard?.extraProperties?.dataTierLevel !== 'No') {
      this.selectedDataTier = e;
      if (this.selectedDashboard?.extraProperties?.dataTierLevel === 'Area') {
        this.selectedDataTier.cells = null;
        this.selectedDataTier.cell = null;
        this.selectedDataTier.workCenters = null;
        this.selectedDataTier.workCenter = null;
      }
      this.getSafetyAlertInfo();
    }
  }

  // refresh data based on cell change
  cellChange(e) {
    if (!this.selectedDashboard?.extraProperties?.dataTierLevel || this.selectedDashboard?.extraProperties?.dataTierLevel === 'WorkCenter' || this.selectedDashboard?.extraProperties?.dataTierLevel === 'Cell') {
      this.selectedDataTier = e;
      if (this.selectedDashboard?.extraProperties?.dataTierLevel === 'Cell') {
        this.selectedDataTier.workCenters = null;
        this.selectedDataTier.workCenter = null;
      }
    }
  }

  // refresh data based on work center change
  workCenterChange(e) {
    if (!this.selectedDashboard?.extraProperties?.dataTierLevel || this.selectedDashboard?.extraProperties?.dataTierLevel === 'WorkCenter') {
      this.selectedDataTier = e;
    }
  }

  deleteDashboard() {
    if (this.selectedDashboard.name === this.homePageName) {
      return;
    }
    this.confirmationService
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info, this.selectedDashboard.name],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.dashboardService.delete(this.selectedDashboard.id).subscribe(res => {
            this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
              messageLocalizationParams: [this.info, this.selectedDashboard.name],
            });
            this.getDashboardList();
          });
        }
      });
  }

  findWidgetBySeq(seq: number) {
    return this.widgets.find(widget => widget.seq === seq);
  }

  getPageIdentifier(): string {
    // Implement the logic to determine the page identifier based on the current page
    // This is a placeholder and should be replaced with the actual implementation
    if (!this.selectedDashboard) return 'Comments';

    if (this.selectedDashboard.extraProperties?.pageType) {
      return this.selectedDashboard.extraProperties.pageType;
    }

    const storageKey = `page_type_${this.selectedDashboard.id}`;
    const savedType = localStorage.getItem(storageKey);
    if (savedType) {
      return savedType;
    }

    const dashboardName = this.selectedDashboard.name?.toLowerCase() || '';

    if (dashboardName.includes('shift') ||
      dashboardName.includes('shiftcomment')) {
      return 'ShiftComment';
    }

    const hasShiftCommentWidget = this.widgets.some(w =>
      w.widgetName === 'shiftComment' ||
      w.name?.toLowerCase()?.includes('shift')
    );

    if (hasShiftCommentWidget) {
      return 'ShiftComment';
    }

    return 'Comments';
  }
}
