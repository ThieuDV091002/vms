import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto, SessionStateService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AssessmentSchedulingRuleService, DataTierInput } from '@apis/ticket';
import { AssessmentService } from '@apis/ticket/assessment-management';
import { AssessmentDto } from '@apis/ticket/assessment-management/dtos';
import { AssessmentSchedulingRuleDto, AssessmentSchedulingRuleGetListInput } from '@apis/ticket/dtos';
import { DatatableComponent } from '@swimlane/ngx-datatable';

interface DataTier {
  dataTierName: string;
  dataTierId: string;
}

interface Owner {
  ownerId: string;
  ownerName: string;
}

interface UserGroup {
  userGroupId: string;
  userGroupName: string;
}


@Component({
  selector: 'app-assessment-rule',
  templateUrl: './assessment-rule.component.html',
  styleUrl: './assessment-rule.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "AssessmentRuleComponent"
    }
  ]
})

export class AssessmentRuleComponent implements OnInit, OnChanges {
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() index = -1;
  @Input() selectedWidget: any;
  @Input() expandChart = false;
  @Input() queryId;
  @Input() dataTierTreeNode;
  @Input() selectedDataTier;
  @ViewChild('myTable') table: DatatableComponent;

  isSettingsModalVisible = false;
  isPreviewModalVisible = false;
  pageSize: number;
  widgetTitle: string;
  form: FormGroup;
  data: PagedResultDto<AssessmentSchedulingRuleDto> = { totalCount: 0, items: [] };
  searchKeyword = '';
  isModalVisible = false;
  modalBusy = false;
  widgetInfo: string;
  currentAssessmentRuleId: string;
  previewData: AssessmentDto[] = [];
  filterPreviewData: AssessmentDto[] = [];
  previewAssessmentSchedulingRuleName: string;
  previewAssessmentTypeName: string;
  previewScheduleTypeName: string;
  previewLastAssessmentDate: string;
  currentAssessmentRuleDates: string[];
  currentAssessmentRuleDataTiers: DataTier[];
  currentAssessmentRuleOwners: Owner[];
  currentAssessmentRuleUserGroups: UserGroup[];
  selectedDate: string = '';
  selectedOwner: string = '';
  selectedUserGroup: string = '';
  language: string
  searchDataTiers: DataTierInput[] = [];

  constructor(
    private confirmation: ConfirmationService,
    private service: AssessmentSchedulingRuleService,
    public list: ListService<AssessmentSchedulingRuleGetListInput>,
    private localizationService: LocalizationService,
    private assessmentService: AssessmentService,
    private toasterService: ToasterService,
    private session: SessionStateService
  ) {
    this.language = session.getLanguage();
  }

  ngOnInit(): void {
    this.localizationService.get('::LABEL_AssessmentSchedulingRule').subscribe(data => {
      this.widgetInfo = data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedWidget && changes.selectedWidget.currentValue) {
      this.pageSize = this.selectedWidget.extraProperties.pageSize;
      this.widgetTitle = this.selectedWidget.name;
      this.hookToQuery();
    }

    if (changes.selectedDataTier) {
      if (changes.selectedDataTier.currentValue && changes.selectedDataTier.currentValue.cells?.length > 0) {
        this.searchDataTiers = changes.selectedDataTier.currentValue.cells.map(cell => {
          return {
            type: 'Cell',
            id: cell.id
          } as DataTierInput;
        });
      } else if (changes.selectedDataTier.currentValue && changes.selectedDataTier.currentValue.areas?.length > 0) {
        this.searchDataTiers = changes.selectedDataTier.currentValue.areas.map(area => {
          return {
            type: 'Area',
            id: area.id
          } as DataTierInput;
        });
      } else {
        this.searchDataTiers = [];
      }

      this.list.get();
    }
  }

  hookToQuery() {
    setTimeout(() => {
      this.table.limit = this.pageSize
    }, 0);
    this.list.hookToQuery(query => {
      return this.service.getList({
        ...query,
        skipCount: this.table.offset * this.pageSize,
        maxResultCount: this.pageSize,
        filter: this.searchKeyword,
        dataTierFilters: this.searchDataTiers
      })
    }).subscribe(res => {
      this.data = res;
    });
  }

   search(filter: string) {
    this.searchKeyword = filter;
    this.list.get();
   }
  deleteWidget() {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.widgetInfo, this.selectedWidget.name],
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.updateChange.emit({ type: 'delete', widget: this.selectedWidget });
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

  saveSettiings() {
    if (this.widgetTitle === '' || [null, 0].includes(this.pageSize)) {
      return;
    }
    const requestBody: any = {
      dashboardId: this.selectedWidget.dashboardId,
      seq: this.selectedWidget.seq,
      widgetName: this.selectedWidget.widgetName,
      name: this.widgetTitle,
      description: this.selectedWidget.description,
      tenantId: this.selectedWidget.tenantId,
      displayName: this.selectedWidget.displayName,
      id: this.selectedWidget.id,
      extraProperties: {
        pageSize: this.pageSize.toString()
      }
    }

    this.updateChange.emit({ type: 'update', widget: requestBody });
    this.isSettingsModalVisible = false;
    this.selectedWidget = requestBody;
    this.list.get();
  }

  formatDate(dateString: string) {
    if(!dateString){
      return '';
    }
    const date = new Date(dateString?.toString() + '+00:00');
    return date.toLocaleDateString();
  }

  onGenerate(row: AssessmentSchedulingRuleDto): void {
    this.previewAssessmentSchedulingRuleName = row.name;
    this.previewAssessmentTypeName = row.assessmentTypeName;
    this.previewScheduleTypeName = row.scheduleType;
    this.currentAssessmentRuleId = row.id;
    this.assessmentService.getPreviewByRuleId(row.id).subscribe(res => {
      res.assessments.forEach(item => {
        item.assessmentDate = this.formatDate(item.assessmentDate);
      });
      this.previewData = res.assessments;
      this.filterPreviewData = res.assessments;
      this.previewLastAssessmentDate = res.lastAssessmentDate ? this.formatDate(res.lastAssessmentDate) : "";
      this.currentAssessmentRuleDates = Array.from(new Set(res.assessments.map(item => item.assessmentDate)));
      this.currentAssessmentRuleDataTiers = Array.from(new Map(res.assessments.map(item => [item.dataTierId, {
        dataTierName: item.datatierName,
        dataTierId: item.dataTierId
      }])).values());
      this.currentAssessmentRuleOwners = Array.from(new Map(res.assessments.map(item => [item.ownerId, {
        ownerId: item.ownerId,
        ownerName: item.ownerName
      }])).values());
      this.currentAssessmentRuleUserGroups = Array.from(new Map(res.assessments.map(item => [item.userGroupId, {
        userGroupId: item.userGroupId,
        userGroupName: item.userGroupName
      }])).values());
      this.isPreviewModalVisible = true;
    });
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    this.updatePreviewData();
  }

  onDataTierChange(event: any) {
    this.selectedDataTier = event.target.value;
    this.updatePreviewData();
  }

  onOwnerChange(event: any) {
    this.selectedOwner = event.target.value;
    this.updatePreviewData();
  }

  onUserGroupChange(event: any) {
    this.selectedUserGroup = event.target.value;
    this.updatePreviewData();
  }

  updatePreviewData() {
    this.filterPreviewData = this.previewData.filter(item => {
      return (!this.selectedDate || item.assessmentDate === this.selectedDate) &&
        (!this.selectedDataTier || item.dataTierId === this.selectedDataTier) &&
        (!this.selectedOwner || item.ownerId === this.selectedOwner) &&
        (!this.selectedUserGroup || item.userGroupId === this.selectedUserGroup);
    });
  }

  confirmGenerate() {
    this.assessmentService.generateByDto({ schedulingRuleId: this.currentAssessmentRuleId }).subscribe(
      () => {
        this.toasterService.success('::LABEL_SuccessfullyGenerated', '', {
          messageLocalizationParams: [this.widgetInfo, this.previewAssessmentSchedulingRuleName],
        });
        this.list.get();
        this.isPreviewModalVisible = false;
      }
    );
  }

  onDelete(row): void {
    this.confirmation
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.widgetInfo, row.name],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service.delete(row.id).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
              messageLocalizationParams: [this.widgetInfo, row.name],
            });
            this.list.get();
          });
        }
      });
  }
}
