import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto, PermissionService, SessionStateService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CellDto } from '@apis/corporate/dtos';
import { CommentService, ShiftService } from '@apis/general';
import { CommentDto, CommentGetListInput, ShiftPatternByDateDto, ShiftDto, ShiftByDataTierItemDto } from '@apis/general/dtos';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { AppUtils } from 'src/app/modeling/utils/app.utils';
import { saveAs } from 'file-saver';
import { FileType } from '@apis/dashboard';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-comment-display-widget',
  templateUrl: './comment-display-widget.component.html',
  styleUrl: './comment-display-widget.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'CommentDisplayWidgetComponent',
    },
  ],
})
export class CommentDisplayWidgetComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  listView = false;
  @Input() selected;
  @Input() index = -1;
  @Input() filter;
  @Input() selectedDataTier;
  private _dataTierTreeNode: any[] = [];
  @Input()
  set dataTierTreeNode(value: any[]) {
    this._dataTierTreeNode = value;
    const userAssignedDataTier = JSON.parse(JSON.stringify(AppUtils.getAccessTreNode(value)));
    userAssignedDataTier.forEach(element => {
      if (element.disabled) {
        element.disabled = false;
      }
      element.children = element.children.filter(x => !x.disabled);
      this.haveAccessCellData = this.haveAccessCellData.concat(element.children);
    });
    this.areaData = userAssignedDataTier.filter(x => x.children.length > 0);
  }

  get dataTierTreeNode(): any[] {
    return this._dataTierTreeNode;
  }
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() expandChart = false;
  @Input() queryId;
  isSettingsModalVisible = false;
  form: FormGroup;
  filterForm: FormGroup;
  areaData: any[] = [];
  cellData: CellDto[] = [];
  haveAccessCellData: CellDto[] = [];
  shiftData: ShiftByDataTierItemDto[] = [];
  shiftIntervaltData: string[] = [];
  currentShift: ShiftPatternByDateDto;
  searchKeyword = '';
  isModalVisible = false;
  modalBusy = false;
  isCollapse = false;
  data: PagedResultDto<CommentDto> = { totalCount: 0, items: [] };
  @ViewChild('myTable') table: DatatableComponent;
  subscription: Subscription;
  navigationSubscription: Subscription;
  selectedComment: any;
  info: string;

  hideTitle = false;
  pageSize: number;
  widgetTitle: string;
  language: string
  dataTier: any;
  widget: string;
  showAdvancedFilter: boolean = false;
  filterSearchHasValue: boolean = false;
  originalWidgetType: string;
  isRealNavigationEvent: boolean = false;

  constructor(private confirmation: ConfirmationService,
    private shiftService: ShiftService,
    private fb: FormBuilder,
    public list: ListService<CommentGetListInput>,
    public service: CommentService,
    private datePipe: DatePipe,
    private toasterService: ToasterService,
    private localizationService: LocalizationService,
    private session: SessionStateService,
    private permissionService: PermissionService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.language = session.getLanguage();

    this.navigationSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        this.isRealNavigationEvent = true;
      });
  }

  ngAfterViewInit(): void {
    this.table.limit = this.pageSize;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.filterForm) {
      this.buildFilterForm();
    }
    if (changes.selected?.currentValue) {
      this.widgetTitle = this.selected.name;
      this.pageSize = this.selected.extraProperties?.pageSize;
      this.hideTitle = this.selected.extraProperties?.hideTitle;
      this.hookToQuery();
    }
    if (changes.selectedDataTier) {
      this.dataTier = {
        workCenters: [],
        cells: [],
        areas: []
      };
      if (changes.selectedDataTier.currentValue) {
        const selectedDataTier = changes.selectedDataTier.currentValue;
        if (selectedDataTier.workCenters?.length > 0) {
          this.dataTier.workCenters = selectedDataTier.workCenters.map(x => x.id);
        }
        if (selectedDataTier.cells?.length > 0) {
          this.dataTier.cells = selectedDataTier.cells.map(x => x.id);
        }
        if (selectedDataTier.areas?.length > 0) {
          this.dataTier.areas = selectedDataTier.areas.map(x => x.id);
        }

        if (selectedDataTier.cell) {
          this.filterForm.controls['cell'].setValue(selectedDataTier.cell.id);
        } else {
          this.filterForm.controls['cell'].setValue(undefined);
        }
      }
      this.shiftData = [];
      this.filterForm?.controls['shift'].setValue(undefined);
      this.getShiftData();
      this.getCurrentShift();
      this.hookToQuery();
    }
  }

  ngOnInit(): void {
    this.originalWidgetType = this.selected?.widgetName;

    if (this.selected?.id) {
      const savedType = localStorage.getItem(`widget_${this.selected.id}_type`);
      if (savedType) {
        this.originalWidgetType = savedType;
      }

      localStorage.setItem(`widget_${this.selected.id}_type`, this.originalWidgetType);
    }

    this.hookToQuery();
    this.localizationService.get('::Comment').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widget = data;
    });
  }

  hookToQuery() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.list.hookToQuery((query) => {
      return this.service.getList(
        {
          ...query,
          productionDate: this.datePipe.transform(this.filterForm?.value.productionDate, 'yyyy-MM-dd'),
          shiftId: this.filterForm?.value.shift,
          shiftIntervals: this.filterForm?.value.shiftInterval,
          cellId: this.filterForm?.value.cell,
          areaId: this.filterForm?.value.cell ? '' : this.dataTier?.area?.id,
          commentText: this.filterForm?.value.comment,
          location: this.filterForm?.value.location,
          isShiftCommentOnly: false,
          maxResultCount: this.selected.extraProperties?.pageSize,
          skipCount: this.table.offset * this.pageSize,
        }
      )
    }).subscribe(res => {
      this.data = res;
    });
  }

  getShiftData() {
    this.shiftService.getShiftByDataTier({areaIds: this.dataTier.areas, cellIds: this.dataTier.cells, wrokCenterIds: this.dataTier.workCenters}).subscribe((res) => {
      this.shiftData = res.items;
    });
  }

  getCurrentShift() {
    this.shiftService.getShiftByDate(new Date().toISOString(), {
      areaIds: this.dataTier.areas,
      cellIds: this.dataTier.cells,
      wrokCenterIds: this.dataTier.workCenters
    }).subscribe((res) => {
      this.currentShift = res;
    });
  }

  deleteCommentWidget() {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.widget, this.selected.name]
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.updateChange.emit({ type: 'delete', widget: this.selected });
      }
    });
  }

  closeAddModal() {
    this.isModalVisible = false;
  }

  refreshTableList() {
    this.list.get();
  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      productionDate: [''],
      shift: [''],
      shiftInterval: [''],
      cell: [undefined],
      comment: [''],
      location: ['']
    });

    this.filterForm.controls['shift'].valueChanges.subscribe(value => {
      if (value) {
        this.shiftIntervaltData = this.shiftData.find(x => x.shiftId === value).shiftIncrementList;
      } else {
        this.shiftIntervaltData = [];
      }
      this.filterForm.controls['shiftInterval'].setValue(undefined);
    });
  }

  filterSelectChange(event, type) {
    if (type === 'shift') {
      if (event?.shiftId) {
        this.filterForm.controls['shift'].setValue(event.shiftId);
      }
      else {
        this.filterForm.controls['shift'].setValue(undefined);
      }
    }

    if (type === 'shiftInterval') {
      if (event) {
        this.filterForm.controls['shiftInterval'].setValue(event);
      }
      else {
        this.filterForm.controls['shiftInterval'].setValue(undefined);
      }
    }

    if (type === 'cell') {
      if (event?.id) {
        this.filterForm.controls['cell'].setValue(event.id);
      }
      else {
        this.filterForm.controls['cell'].setValue(undefined);
      }
    }
  }

  add() {
    this.selectedComment = {};
    this.isModalVisible = true;
  }

  editOrDelete(event) {
    if (event.action === 'edit') {
      this.service.get(event.id).subscribe(res => {
        this.selectedComment = res;
        this.isModalVisible = true;
      })
    } else {
      this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info, event.comment]
      }).subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service.delete(event.id).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
              messageLocalizationParams: [this.info, event.comment],
            });
            this.list.get();
          });
        }
      });
    }
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


  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
    setTimeout(() => {
      this.table.recalculate();
    }, 0);
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

  download() {
    this.service.exportByFilterByInput(
      {
        productionDate: this.datePipe.transform(this.filterForm?.value.productionDate, 'yyyy-MM-dd'),
        shiftId: this.filterForm?.value.shift,
        shiftIntervals: this.filterForm?.value.shiftInterval,
        cellId: this.filterForm?.value.cell,
        areaId: this.filterForm?.value.cell ? '' : this.dataTier?.area?.id,
        commentText: this.filterForm?.value.comment,
        location: this.filterForm?.value.location,
        isShiftCommentOnly: false,
        skipCount: 0,
        maxResultCount: 1000
      }
    ).subscribe({
      next: (res: any) => {
        saveAs(
          this.base64ToBlob(res, AppUtils.generateFileName('Comment', FileType.Excel)),
          AppUtils.generateFileName('Comment', FileType.Excel)
        );
      },
      error: error => {
        this.confirmationService.error(error.error.message, 'An error has occurred!', {
          hideCancelBtn: true,
          yesText: 'AbpAccount::Close',
        });
      },
    })
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

  formatDate(date: any) {
    return new Date(date?.toString() + '+00:00').toLocaleString();
  }

  hasEditOrDeletePermission() {
    return this.permissionService.getGrantedPolicy('Comment.Edit') || this.permissionService.getGrantedPolicy('Comment.Delete')
  }

  filterData() {
    const { productionDate,shift,shiftInterval,cell,comment,location } = this.filterForm.value;
    this.filterSearchHasValue = !!( productionDate || shift || shiftInterval || cell || comment || location);
    this.list.get();
  }

  clearFilterData() {
    this.filterSearchHasValue = false;
    this.filterForm.reset();
  }

  toggleView() {

    const currentWidgetName = this.selected.widgetName;
    const isComment = currentWidgetName === 'commentPage';

    sessionStorage.setItem('commentWidgetName', this.selected.name);

    const rawName = sessionStorage.getItem('shiftCommentWidgetName');
    const shiftCommentName = (!rawName || rawName === 'null') ? 'Shift Comments' : rawName;

    const newWidget = {
      ...this.selected,
      widgetName: isComment ? 'shiftComment' : 'commentPage',
      name: isComment ? shiftCommentName : 'Comments',
      displayName: isComment ? 'Shift Comments' : 'Comments',
      _isToggleViewAction: true
    };


    this.selected = newWidget;
    this.listView = newWidget.widgetName === 'shiftComment';

    this.updateChange.emit({
      type: 'update',
      widget: newWidget,
      _isToggleViewAction: true,
      skipNotification: true
    });

    setTimeout(() => {
      this.hookToQuery();
    }, 100);


    this.isRealNavigationEvent = false;
  }

  ngOnDestroy() {
    if (this.isRealNavigationEvent && this.selected && this.selected.widgetName !== this.originalWidgetType) {
      if (this.selected?.id) {
        const savedType = localStorage.getItem(`widget_${this.selected.id}_type`);
        if (savedType) {
          this.originalWidgetType = savedType;
        }
      }

      const restoredWidget = {
        ...this.selected,
        widgetName: this.originalWidgetType,
        name: this.originalWidgetType === 'shiftComment' ? 'Shift Comments' : 'Comments',
        displayName: this.originalWidgetType === 'shiftComment' ? 'Shift Comments' : 'Comments',
        _isRestoringAction: true
      };

      this.updateChange.emit({
        type: 'update',
        widget: restoredWidget,
        skipNotification: true,
        isRestoring: true
      });

      if (this.selected?.id) {
        localStorage.removeItem(`widget_${this.selected.id}_type`);
      }
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
