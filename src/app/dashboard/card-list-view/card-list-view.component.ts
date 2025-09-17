import { ConfigStateService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivityCardService } from '@apis/ticket';
import { GetActivityCardListDto, GetActivityCardListSummaryDto, ModelingHistoryDto, StateDto } from '@apis/ticket/dtos';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { forkJoin } from 'rxjs';
import { AppUtils } from 'src/app/modeling/utils/app.utils';

@Component({
  selector: 'app-card-list-view',
  templateUrl: './card-list-view.component.html',
  styleUrl: './card-list-view.component.scss'
})
export class CardListViewComponent implements OnInit, OnChanges {
  @Input() data: GetActivityCardListSummaryDto = { activityCardList: [], noOfCardsNoUpdate: 0, noOfCardsActive: 0, noOfCardsTaskOverdue: 0, noOfCardsUnassignedTasks: 0, noOfCardsMissingDueDate: 0 };
  @Input() statusData: StateDto[] = [];
  @Output() editEvent: EventEmitter<GetActivityCardListDto> = new EventEmitter<GetActivityCardListDto>();
  @Output() updateEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  isHistoryModalVisible: boolean;
  historys: PagedResultDto<ModelingHistoryDto>;
  @ViewChild('myTable') table: DatatableComponent;
  info: string;
  language: string
  categoryColorMap: any = {};
  priorityColorMap: any = {};
  statusColorMap: any = {};

  constructor(private confirmation: ConfirmationService,
    private service: ActivityCardService,
    private localizationService: LocalizationService,
    private toasterService: ToasterService,
    private configService: ConfigStateService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data?.currentValue) {
      changes.data.currentValue.activityCardList.forEach(item => {
        item.longInstruction = item.longInstruction.replace(/<[^>]*>/g, '')
      });
      this.caclulateDueDateState();
    }
  }

  ngOnInit(): void {
    this.localizationService.get('::LABLE_ActivityCard').subscribe(data => {
      this.info = data
    });
  }

  caclulateDueDateState() {
    const nowDate = new Date().getTime();
    this.data.activityCardList.forEach(item => {
      if (item.dueDate) {
        if (item.isPastDue) {
          item['dueDateColor'] = 'red';
        } else {
          const dueDate = new Date(item.dueDate).getTime();
          const timeDifference = (dueDate - nowDate) / (1000 * 60 * 60 * 24);
          if (timeDifference > 0 && timeDifference < 1) {
            item['dueDateColor'] = '#f0b638';
          }
        }
      } else {
        item['dueDateColor'] = 'blue';
      }
      const hexRegex = /^#([0-9A-F]{6})$/i;
      if (item.categoryColor && hexRegex.test(item.categoryColor)) {
        this.categoryColorMap[item.id] = {
          'background-color': item.categoryColor,
          'color': this.calculateTextColor(item.categoryColor)
        }
      }
      if (item.priorityColor && hexRegex.test(item.priorityColor)) {
        this.priorityColorMap[item.id] = {
          'background-color': item.priorityColor,
          'color': this.calculateTextColor(item.priorityColor)
        }
      }
      if (item.statusColor && hexRegex.test(item.statusColor)) {
        this.statusColorMap[item.id] = {
          'background-color': item.statusColor,
          'color': this.calculateTextColor(item.statusColor)
        }
      }
    });
    this.data.activityCardList = [...this.data.activityCardList];
  }

  private calculateTextColor(hexColor: string) {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#ffffff';
  }

  formatDate(date: any) {
    return new Date(date?.toString() + '+00:00').toLocaleString();
  }

  getLocalDate(date: any) {
    return AppUtils.getLocalDate(date);
  }

  archiveCard(card: GetActivityCardListDto) {
    if (card.currentStateName === 'Completed') {
      this.service.updateActivityCardStatusByCardIdAndNewStatusId(
        card.id, this.statusData.find(x => x.name === 'Archived').id
      ).subscribe(res => {
        this.toasterService.success('::LABEL_SuccessfullyArchived');
        this.updateEvent.emit(true);
      })
    }
  }

  cancelCard(card: GetActivityCardListDto) {
    if (card.currentStateName !== 'Completed') {
      this.service.updateActivityCardStatusByCardIdAndNewStatusId(
        card.id, this.statusData.find(x => x.name === 'Cancelled').id
      ).subscribe(res => {
        this.toasterService.success('::LABEL_SuccessfullyCancelled');
        this.updateEvent.emit(true);
      })
    }
  }

  restoreCard(card: GetActivityCardListDto) {
    if (card.currentStateName === 'Cancelled' || card.currentStateName === 'Archived') {
      this.service.updateActivityCardStatusByCardIdAndNewStatusId(
        card.id, this.statusData.find(x => x.name === 'New').id
      ).subscribe(res => {
        this.toasterService.success('::LABEL_SuccessfullyRestored');
        this.updateEvent.emit(true);
      })
    }
  }

  edit(row) {
    this.editEvent.emit(row);
  }

  viewHistory(card: GetActivityCardListDto) {
    this.service.getHistoryByInput({
      id: card.id,
      maxResultCount: 1000,
    }).subscribe(data => {
      this.historys = data;
      this.isHistoryModalVisible = true;
    });
  }

  showRequestUpdateForTaskOwner(data: GetActivityCardListDto): boolean {
    return !!(data.tasks.length > 0) &&
      data.tasks.some(task => task.status === 'Open' && !['', null, undefined].includes(task.ownerId));
  }

  requestUpdateForAllTaskOwners(data: GetActivityCardListDto) {
    const requestBodyArray = [];
    data.tasks.filter(task => task.status === 'Open' && !['', null, undefined].includes(task.ownerId)).forEach(item => {
      requestBodyArray.push({
        userId: this.configService.getOne('currentUser').id,
        notifyUserIds: item.ownerId ? [item.ownerId] : [],
        activityCardId: data.id,
        taskId: item.id,
        baseLink: window.location.origin
      });
    });

    forkJoin(requestBodyArray.map(item => this.service.notifyTaskOwnerByInput(item))).subscribe(responses => {
      this.toasterService.success('::LABEL_RequestUpdateForTaskOwnerSuccessfully');
    });
  }

  requestUpdateForCardOwner(data: GetActivityCardListDto) {
    this.service.notifyCardOwnerByInput({
      userId: this.configService.getOne('currentUser').id,
      notifyUserIds: data.assignedOwnerId ? [data.assignedOwnerId] : [],
      activityCardId: data.id,
      baseLink: window.location.origin
    }).subscribe(res => {
      this.toasterService.success('::LABEL_RequestUpdateForCardOwnerSuccessfully');
    });
  }

}
