import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ConfigStateService, ListService, LocalizationService, PagedResultDto, SessionStateService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AreaService } from '@apis/corporate';
import { BroadcastMessageService, MessageCategoryService } from '@apis/general';
import { BroadcastMessageDto, BroadcastMessageGetListInput, MessageCategoryDto } from '@apis/general/dtos';
import { UserService } from '@proxy/services';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { AppUtils } from 'src/app/modeling/utils/app.utils';

@Component({
  selector: 'app-broadcast-message-management',
  templateUrl: './broadcast-message-management.component.html',
  styleUrl: './broadcast-message-management.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'BroadcastMessageManagementComponent'
    }
  ]
})
export class BroadcastMessageManagementComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() selected: any = { title: '', url: '', hideTitle: false };
  @Input() index = -1;
  @Input() type: string;
  @Input() selectedDataTier;
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() queryId;
  @Input() expandChart = false;
  @Input() assignedAndDefaultDataTiers: any

  @ViewChild('broadcastMessageManagementTable') table: DatatableComponent;


  isSettingsModalVisible = false;
  form: FormGroup;
  filterForm: FormGroup;
  widget: string;
  filterSearchHasValue = false;
  messageCategoryData: MessageCategoryDto[] = [];
  areaData: any[] = [];
  allAreaData: any[] = [];
  hideTitle = false;
  pageSize: number;
  widgetTitle: string;
  language: string;
  openModal = false;
  data: PagedResultDto<BroadcastMessageDto> = { totalCount: 0, items: [] };
  isCollapsed = true;
  subscription: Subscription;
  selectedMessage: BroadcastMessageDto;
  info: string;
  tenantInfo: any;

  constructor(
    private confirmation: ConfirmationService,
    private localizationService: LocalizationService,
    private service: BroadcastMessageService,
    public list: ListService<BroadcastMessageGetListInput>,
    private fb: FormBuilder,
    private messageCategoryService: MessageCategoryService,
    private userService: UserService,
    private session: SessionStateService,
    private configService: ConfigStateService,
    private areaSevice: AreaService,
    private toasterService: ToasterService
  ) {
    this.tenantInfo = this.configService.getOne('extraProperties');
    this.language = session.getLanguage();
  }

  ngAfterViewInit(): void {
    this.table.limit = this.pageSize;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.filterForm) {
      this.buildFilterForm();
    }
    if (changes.selected && changes.selected.currentValue) {
      this.widgetTitle = this.selected.name;
      this.pageSize = this.selected.extraProperties?.pageSize;
      this.hideTitle = this.selected.extraProperties?.hideTitle;
      this.hookToQuery();
    }
    if (changes.assignedAndDefaultDataTiers && changes.assignedAndDefaultDataTiers.currentValue) {
      this.allAreaData = changes.assignedAndDefaultDataTiers.currentValue.assignedDataTiers
        // area maybe not have cell, so remove child cell check
        .filter(d => d.areaId && d.areaName)
        .map(d => ({ id: d.areaId, name: d.areaName}))
        .filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.id === value.id && t.name === value.name
            ))
        );
      this.areaData = changes.assignedAndDefaultDataTiers.currentValue.assignedDataTiers.filter(item => item.dataTierType === 'Area').map(a => { return { name: a.areaName, id: a.areaId } });
      // following logic fix following issue
      // when assisn some cells/workcenters under area but not all, then area not checked. when delete unchecked ones. Then area should be checked automatically
      // so for those missed area, we need check them again to make sure display correctly
      const missedAreas = this.allAreaData.filter(area => !this.areaData.some(a => a.id === area.id));
      this.areaSevice.getTreeViewList({
        ids: missedAreas.map(a => a.id),
        tenantDataTierID: this.tenantInfo?.DataTierId,
        tenantDataTierType: this.tenantInfo?.DataTierType
      }).subscribe(res => {
        const missedAreasData: any = res || [];
        AppUtils.initTreeData(missedAreasData);
        AppUtils.initTreeDataState(missedAreasData, changes.assignedAndDefaultDataTiers.currentValue.assignedDataTiers);
        // reset status, if all child checked, then parent should be checked
        // if
        missedAreasData.forEach(area => {
          area.checked = area.children?.every(child => {
            if (!child.checked && child.children && child.children.length > 0) {
              return child.children.every(c => c.checked);
            } else {
              return child.checked;
            }
          });
        });
        // if missedAreasData is empty, then areaData should reset to empty
        if (missedAreas.length === 0) {
          this.areaData = [];
        }
        missedAreasData.filter(area => area.checked).forEach(area => this.areaData = [...this.areaData, { id: area.id, name: area.displayName }]);
      })
    }
    else{
      this.allAreaData = [...this.allAreaData];
    }
    if (this.selectedDataTier) {
      if (this.selectedDataTier.area) {
        this.filterForm.patchValue({ areas: this.selectedDataTier.area.id });
      } else {
        this.filterForm.patchValue({ areas: undefined });
      }
      this.hookToQuery();
    }
  }

  ngOnInit(): void {
    this.getMessageCategoryData();

    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widget = data;
    });
    this.localizationService.get('::LABEL_BroadcastMessage').subscribe(data => {
      this.info = data
    });
  }

  hookToQuery() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    const userId = this.configService.getOne('currentUser')?.id;
    this.subscription = this.list.hookToQuery((query) => {
      let [start, end] = '';
      if (this.filterForm.value.expiryDateTimeRange) {
        start = new Date(this.filterForm.value.expiryDateTimeRange[0]).toISOString();
        end = new Date(this.filterForm.value.expiryDateTimeRange[1]).toISOString();
      }
      return this.service.getList(
        {
          ...query,
          userId: userId,
          areas: this.filterForm.value.areas ? [this.filterForm.value.areas] : [],
          expireStartDate: start,
          expireEndDate: end,
          categoryId: this.filterForm.value.category,
          maxResultCount: this.selected.extraProperties?.pageSize,
          skipCount: this.table.offset * this.pageSize
        }
      )
    }).subscribe(res => {
      this.data = res;
    });
  }

  getMessageCategoryData() {
    this.messageCategoryService.getAllInstances().subscribe(res => {
      this.messageCategoryData = res;
    })
  }


  buildFilterForm() {
    this.filterForm = this.fb.group({
      areas: [undefined],
      category: [undefined],
      expiryDateTimeRange: [undefined],
    });
  }

  filterData() {
    const { areas, category, expiryDateTimeRange } = this.filterForm.value;
    this.filterSearchHasValue = !!(areas || category || expiryDateTimeRange);
    this.list.get();
  }

  deleteBroadcastMessageManagementWidget() {
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

  add() {
    this.selectedMessage = {} as BroadcastMessageDto;
    this.openModal = true;
  }

  edit(row) {
    this.service.get(row.id).subscribe(res => {
      this.selectedMessage = res;
      this.openModal = true;
    });
  }

  delete(row) {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.info, row.message]
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.service.delete(row.id).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.info, row.message],
          });
          this.list.get();
        });
      }
    });
  }

  close() {
    this.openModal = false;
  }

  formatDate(date: any) {
    return new Date(date?.toString() + '+00:00').toLocaleString();
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
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

}
