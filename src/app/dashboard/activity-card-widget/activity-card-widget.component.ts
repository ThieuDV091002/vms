import { ConfigStateService, CurrentUserDto, ListService, LocalizationService, PermissionService } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivityCardService, ActivityCardTypeService, FileType } from '@apis/ticket';
import { ActivityCardDto, ActivityCardTypeDto, GetActivityCardTaskListDto } from '@apis/ticket/dtos';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { of } from 'rxjs';
import { utils, writeFile } from 'xlsx-js-style';
import { AppUtils } from 'src/app/modeling/utils/app.utils';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { Router } from '@angular/router';
enum CardTypes {
  Action = 'Action',
  Idea = 'Idea',
  RedTag = 'Red Tag',
  Support = 'Support',
}
enum CardPriority {
  High,
  Medium,
  Low,
}
@Component({
  selector: 'app-activity-card-widget',
  templateUrl: './activity-card-widget.component.html',
  providers: [
    ListService
  ],
  styleUrl: './activity-card-widget.component.scss'
})
export class ActivityCardWidgetComponent implements OnInit {
  @Input() selectedWidget: any;
  @Input() index = -1;
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('myTable') table: DatatableComponent;
  readonly CardTypes = CardTypes;
  @Input() expandChart = false;
  @Input() viewMode = false;

  isSettingsModalVisible = false;
  data: GetActivityCardTaskListDto[] = [];
  widgetTitle: string;
  pageSize: number;
  isModalVisible = false;
  quickFilters = { 'cardType': [], 'ownerType': [] };
  activityCardTypes: ActivityCardTypeDto[] = [];
  currentUser: CurrentUserDto;
  widgetInfo: string;
  selectedCardType: ActivityCardTypeDto;
  card: ActivityCardDto;

  constructor(
    private localizationService: LocalizationService,
    private confirmation: ConfirmationService,
    public list: ListService<any>,
    public activityCardService: ActivityCardService,
    public activityCardTypeService: ActivityCardTypeService,
    public configService: ConfigStateService,
    private platformService: PlatformService,
    private router: Router,
    private permissionService: PermissionService,

  ) {
    this.currentUser = this.configService.getOne('currentUser');

  }

  ngOnInit(): void {
    this.getActivityCardTypes();
    this.hookToQuery();
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widgetInfo = data;
    });
  }

  getActivityCardTypes() {
    this.activityCardTypeService.getList({ maxResultCount: 10 })
      .subscribe(res =>
        this.activityCardTypes = res.items
      );
  }

  quickFilterActive(type, value) {
    return this.quickFilters[type].includes(value);
  }

  dateComparator(a, b) {
    a = a ? a : '2050-12-31';
    b = b ? b : '2050-12-31';
    return new Date(a).getTime() - new Date(b).getTime();
  }

  priorityComparator(a: string, b: string) {
    a = a ? a : 'Low';
    b = b ? b : 'Low';
    return CardPriority[a] - CardPriority[b];
  }

  hookToQuery() {
    this.list.hookToQuery(query => {
      this.getActivityCardTask(query);
      return of()
    }
    ).subscribe(res => {
    })
  }

  getActivityCardTask(query) {
    this.activityCardService.getActivityCardTaskListByInput({
      ...query,
      cardTypeList: this.quickFilters.cardType,
      ownerTypeList: this.quickFilters.ownerType,
      userId: this.currentUser?.id
    }).subscribe(res => {
      this.data = res;
      this.data.sort((a, b) => {
        if (a.dueDate === b.dueDate) {
          return this.priorityComparator(a.priorityName, b.priorityName);
        }
        return this.dateComparator(a.dueDate, b.dueDate);
      });
    });
  }

  cardChange() {
    // if (type) {
    this.list.get();
    // }
  }

  createCard() {
    if (this.platformService.isMobile) {
      this.router.navigate(['/mobile/card-creator']);
    } else {
      this.card = {} as ActivityCardDto;
      this.isModalVisible = true;
    }
  }

  editCard(card: GetActivityCardTaskListDto) {
    if (this.platformService.isMobile) {
      this.router.navigate(['/mobile/card-creator'], { queryParams: { id: card.id } });
    } else {
      this.selectedCardType = this.activityCardTypes.find(x => x.id === card.cardTypeId);
      this.activityCardService.getActivityCardByInput({
        cardId: card.id,
        includeRootCauseAnalysis: false,
        includeTasks: false,
        includeComments: false
      }).subscribe((res) => {
        this.card = res;
        this.card = { ...res } as unknown as ActivityCardDto;
        this.isModalVisible = true;
      })
    }
  }

  export() {
    // const data = this.table.bodyComponent.temp;
    // change data structure
    const currentData = this.data.map(item => ({
      'ID': item['code'] || '',
      'Card Type': item.cardTypeName,
      'Description': item.instructions,
      'Owner Type': item.ownerType,
      'Task Description': item.taskDescription,
      'Due date': item.dueDate,
      'Priority': item.priorityName

    }));
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(currentData);
    const range = utils.decode_range(worksheet['!ref']);
    // apply style to header
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = utils.encode_cell({ r: 0, c: C }); // Get cell address for the first row
      if (!worksheet[cellAddress]) continue; // Skip if the cell is undefined
      worksheet[cellAddress].s = {
        fill: { fgColor: { rgb: "000000" } },
        font: { color: { rgb: "FFFFFF" } }
      };
    }
    // Append the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate a binary string of the workbook and save it
    writeFile(workbook, AppUtils.generateFileName('activity-cards', FileType.Excel), { bookType: 'xlsx' });
  }

  filterCard(type, value) {
    if (this.quickFilters[type].includes(value)) {
      this.quickFilters[type] = this.quickFilters[type].filter(item => item !== value);
    } else {
      this.quickFilters[type].push(value);
    }
    this.list.get();
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

  getActivityCardExportPermission() {
    return this.permissionService.getGrantedPolicy('ActivityCard.Export')
  }
}
