import { ConfigStateService, CurrentUserDto, ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AssessmentDto, AssessmentGetListInput, AssessmentTypeDto } from '@apis/ticket/assessment-management/dtos';
import { AssessmentService, AssessmentTypeService } from '@apis/ticket/assessment-management';
import { DashboardDto } from '@apis/dashboard/dtos';
import { DashboardService } from '@apis/dashboard/services';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-assessment-widget',
  templateUrl: './assessment-widget.component.html',
  providers: [
    ListService
  ],
  styleUrl: './assessment-widget.component.scss'
})
export class AssessmentWidgetComponent implements OnInit {
  @Input() selectedWidget: any;
  @Input() index = -1;
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('myTable') table: DatatableComponent;
  @Input() expandChart = false;
  @Input() viewMode = false;

  isSettingsModalVisible = false;
  data: AssessmentDto[] = [];
  assessmentData: PagedResultDto<AssessmentDto> = { items: [], totalCount: 0 };
  dashboards: DashboardDto[] = [];
  widgetTitle: string;
  pageSize: number;
  assessmentTypes: AssessmentTypeDto[] = [];
  currentUser: CurrentUserDto;
  widgetInfo: string;
  assessment: AssessmentDto;
  currentOwnerId: string;
  currentUserGroupId: string;
  currentFilterAssessmentType: string[] = [];
  isOwnerFilterActive: boolean = true;
  isTeamMemberFilterActive: boolean = false;
  isAssessmentCardVisible = false;
  selectedAssessment: AssessmentDto;
  selected: [];
  currentUserId: string;

  constructor(
    private localizationService: LocalizationService,
    private confirmation: ConfirmationService,
    public list: ListService<AssessmentGetListInput>,
    public assessmentService: AssessmentService,
    public assessmentTypeService: AssessmentTypeService,
    public dashboardService: DashboardService,
    public configService: ConfigStateService,
    private datePipe: DatePipe
  ) {
    this.currentUser = this.configService.getOne('currentUser');
  }

  ngOnInit(): void {
    this.currentUserId = this.configService.getOne('currentUser').id;
    this.getAssessmentTypes();
    this.hookToQuery();
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widgetInfo = data;
    });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => this.assessmentService.getList({
        ...query,
        userId: this.currentUserId,
        isOwner: this.isOwnerFilterActive,
        isTeamMember: this.isTeamMemberFilterActive,
        assessmentTypeIds: this.currentFilterAssessmentType,
        maxResultCount: this.pageSize,
        sorting: "assessmentdate asc"
      }))
      .subscribe(res => {
        this.assessmentData = res;
      });
  }

  convertTimeFormat(time: string): string {
    const [hours, minutes, seconds] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
    return this.datePipe.transform(date, 'hh:mm a');
  }

  getAssessmentTypes() {
    this.assessmentTypeService.getList({ maxResultCount: 10 })
      .subscribe(res =>
        this.assessmentTypes = res.items
      );
  }

  dateComparator(a, b) {
    a = a ? a : '9999-12-31';
    b = b ? b : '9999-12-31';
    return new Date(a).getTime() - new Date(b).getTime();
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
    this.widgetTitle = this.selectedWidget.name;
    this.pageSize = this.selectedWidget.extraProperties.pageSize;
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

  filterByAssessmentType(assessmentTypeId: string) {
    if (this.currentFilterAssessmentType.includes(assessmentTypeId)) {
      this.currentFilterAssessmentType = this.currentFilterAssessmentType.filter(item => item !== assessmentTypeId);
    } else {
      this.currentFilterAssessmentType.push(assessmentTypeId);
    }
    this.list.get();
  }

  isAssessmentTypeSelect(assessmentTypeId: string) {
    return this.currentFilterAssessmentType.includes(assessmentTypeId);
  }

  filterByOwner() {
    if(this.isOwnerFilterActive) {
      return;
    }

    this.isOwnerFilterActive = true;
    this.isTeamMemberFilterActive = false;
    this.list.get();
  }

  filterByTeamMember() {
    if(this.isTeamMemberFilterActive) {
      return;
    }

    this.isOwnerFilterActive = false;
    this.isTeamMemberFilterActive = true;
    this.list.get();
  }
  
  onPerform(assessment: AssessmentDto) {
    this.selectedAssessment = assessment;
    this.isAssessmentCardVisible = true;
  }

  closeAssessmentCard() {
    this.isAssessmentCardVisible = false;
    this.ngOnInit();
  }
}
