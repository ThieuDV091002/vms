import { IdentityUserDto } from '@abp/ng.identity/proxy';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivityCardService } from '@apis/ticket';
import { GetActivityCardListDto } from '@apis/ticket/dtos';
import { DashboardUtils } from '../utils';
import { ConfigStateService } from '@abp/ng.core';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-activity-card-tile',
  template: `
    <div class="task-card">
      <!-- left status color -->
      <!-- <div class="status" [style.background-color]="data.statusColor || ''"></div> -->
      <div class="card-body">
        <!-- top action bar -->
        <div class="action-bar">
          <div class="d-flex">
            <!-- <div class="card-code"><span>KAN-0001</span></div> -->
            <div class="card-code" *ngIf="data['code']"><span>{{data['code']}}</span></div>
            <!-- <div class="card-badge" [style.background-color]="data?.priorityColor" [title]="data?.priorityName || ''">{{(data.priorityName || '').slice(0,3)}}</div> -->
          </div>
          <div class="d-flex action-bar-right">
            <!-- <div *ngIf="data.onSupport" class="card-badge support" title="Suppport">SPT</div>
            <div *ngIf="data.isDueDateChanged" class="card-badge due-date-changed" title="Due Date Changed">DD CDG</div>
            <div *ngIf="data.isPastDue" class="card-badge over-due" title="Over Due">OVD</div> -->
            <!-- <div *ngIf="data.noOfDaysOpen" class="badge-days-open">{{data.noOfDaysOpen}} days</div> -->
            <div class="isOverdue" *ngIf="data?.maxDueDate">
              <span class="overdue" *ngIf="overdue(data?.maxDueDate)">{{'::LABEL_Overdue'| abpLocalization}} ({{getDueDays(data?.maxDueDate)}} {{(getDueDays(data?.maxDueDate) > 1 ?'::LABEL_TrendsChartCategory' : '::LABEL_Day') | abpLocalization}})</span>
              <span *ngIf="!overdue(data?.maxDueDate)">{{'::LABEL_Due'| abpLocalization}} ({{getDueDays(data?.maxDueDate)}} {{(getDueDays(data?.maxDueDate) > 1 ?'::LABEL_TrendsChartCategory' : '::LABEL_Day') | abpLocalization}})</span>
            </div>
          </div>
        </div>

        <div class="tile-title" >
          <div class="d-md-inline-block" [title]="data.instructions">{{data.instructions}}</div>
        </div>
        <div class="tile-priority d-flex">
          <div class="" [style.color]="data?.priorityColor">{{data?.priorityName}}</div>
          <div class="ms-1"
            [title]="(data?.originalDataTierId || data?.previousDataTierId) ?
             ((data?.originalDataTierId ? (('::LABEL_Original' | abpLocalization) + ':' + data?.originalDataTierName) : '')+
              (data?.originalDataTierId && data?.previousDataTierId ? ', ' : '') +
             (data?.previousDataTierId ? (('::LABEL_Previous' | abpLocalization) + ':' + data?.previousDataTierName) : ''))
             : null"
            [class.tier-changed]="data?.originalDataTierId && data?.originalDataTierId !== data?.dataTierId">
            {{data?.dataTierName}}
          </div>
        </div>
        <div class="card-owner" *ngIf="user && data.assignedOwnerName">
          {{getDisplayName()}}
        </div>
        <!-- <div class="tile-category">
          <div class="d-md-inline-block text-nowrap" [style.background-color]="data?.categoryColor" [style.color]="calculateTextColor(data?.categoryColor)">{{data.categoryName}}
          </div>
        </div> -->
        <!-- <div class="tile-data-tier d-flex justify-content-between">
          <div class="tile-data-tier-item">
            @if ((data.originalDataTierId !== data.dataTierId) || data.previousDataTierId !== null) {
              <i
              [title]="'Original Data Tier: ' + data.originalDataTierName + ', Move from Data Tier:' + data.previousDataTierName"
              class="fa fa-history">
            </i>
            }
          </div>
          <div class="current-data-tier text-nowrap" [title]="data['dataTierName']">{{data['dataTierName']}}</div>
          <div></div>
        </div> -->
        <!-- footer comments/due date/card type/ owner -->
        <div class="tile-footer align-items-end">
          <div class="d-flex">
            <div class="tile-urgent me-1" *ngIf="data.needToEscalate" [title]="'::LABEL_RequiredEscalation' | abpLocalization"><i class="fa fa-warning"></i></div>
            <div class="tile-support me-2 cursor-pointer" *ngIf="data?.supportNum && data?.supportNum > 1" (click)="editCardIndex(2)" [title]="'::LABEL_SupportsToolTip' | abpLocalization:data?.supportNum"><i class="bi bi-person-raised-hand"></i><span>{{data?.supportNum}}</span></div>
            <div class="tile-support me-2 cursor-pointer" *ngIf="data?.supportNum && data?.supportNum < 2" (click)="editCardIndex(2)" [title]="'::LABEL_SupportToolTip' | abpLocalization:data?.supportNum"><i class="bi bi-person-raised-hand"></i><span>{{data?.supportNum}}</span></div>
            <div class="tile-due me-2 cursor-pointer" *ngIf="data?.overdueNum && data?.overdueNum > 1"(click)="editCardIndex(2)" [title]="'::LABEL_OverduesToolTip' | abpLocalization:data?.overdueNum"><i class="fa fa-clock"></i><span>{{data?.overdueNum}}</span></div>
            <div class="tile-due me-2 cursor-pointer" *ngIf="data?.overdueNum && data?.overdueNum < 2" (click)="editCardIndex(2)" [title]="'::LABEL_OverdueToolTip' | abpLocalization:data?.overdueNum"><i class="fa fa-clock"></i><span>{{data?.overdueNum}}</span></div>
            <div class="tile-due-change cursor-pointer"
              *ngIf="showMaxDuechange()"
              [title]="'::LABEL_MaxDueDateChangedAlert' | abpLocalization:maxOrignalDueDate:maxDueDate"
              (click)="dismissMaxDueDateChange()">
              <i class="fas fa-calendar-days"></i>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <!-- Request Update For Task Owner -->
            <div *ngIf="showRequestUpdateForTaskOwner() && data?.currentStateName !== 'Completed' && data?.currentStateName !== 'Cancelled' && data?.currentStateName !== 'Archived'">
              <span class="pe-1 cursor-pointer" [tooltip]="'::LABEL_RequestUpdateForTaskOwner' | abpLocalization"
                placement="bottom" [adaptivePosition]="false" container="body" (click)="requestUpdateForAllTaskOwners()">
                <i class="fa-solid fa-bell fa-lg" style="color: #74C0FC;"></i>
              </span>
            </div>
            <!-- Request Update For Card Owner -->
            <div *ngIf="data?.assignedOwnerId && data?.currentStateName !== 'Completed' && data?.currentStateName !== 'Cancelled' && data?.currentStateName !== 'Archived'">
              <span class="pe-1 cursor-pointer" [tooltip]="'::LABEL_RequestUpdateForCard' | abpLocalization"
                placement="bottom" [adaptivePosition]="false" container="body" (click)="requestUpdateForCardOwner()">
                  <i class="fa-solid fa-bell fa-lg" style="color: #63E6BE;"></i>
              </span>
            </div>
            <div class="comment" (click)="editCardIndex(3)" [title]="'::Comments' | abpLocalization"><i class="fa fa-commenting-o"></i> {{data?.noOfComments}}</div>
          </div>
          <!-- <div>
            <div *ngIf="data.dueDate" class="due-data">{{data.dueDate.split('T')[0]}}</div>
            <div class="card-type" [style.background-color]="data.cardColor">{{data.cardTypeName}}</div>
          </div>
          <div class="d-flex align-items-end">
            <div *ngIf="data.assignedOwnerName" class="owner" [title]="data.assignedOwnerName">{{data.assignedOwnerName?.slice(0,2)}}</div>
          </div> -->
        </div>
        <!-- <div class="tile-urgent" *ngIf="data.needToEscalate"><i class="fa fa-warning"></i></div> -->
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      position: relative;
      .card-body {
        color: var(--lpx-dark)!important;
      }
    }
    .isOverdue {
      font-size: .7rem;
      span{
        &.overdue {
          color: red;
        }
      }
    }
    .tier-changed {
      background-color: #FFC83D;
      color: #000000;
      padding: 0 .2rem;
    }
    .action-bar-right > div:not(:last-child){
      margin-right: 0.2rem;
    }
    .current-data-tier {
      max-width: 8rem;
    }
    .text-nowrap {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

    }
    .task-card {
      &:hover {
        background-color: var(--kanban-status-pool-hover-color) !important;
        cursor: move;
        border: 2px solid var(--kanban-header-color);
      }
      display: flex;
      border: 2px solid var( --lpx-widget-border-color);
      margin:0.3rem;
      padding: .5rem;
      font-size: .8rem;
      border-radius: .2rem;
      // background-color: var(--kanban-status-pool-color);
      box-shadow: var(--kanban-tile-box-shadow);
      .badge-days-open, .card-code {
        font-size:.6rem;
        line-height: .9rem;
        font-weight: bold;
      }
      .card-badge {
        font-size: 0.6rem;
        padding: 0 .2rem;
        border-radius: .2rem;
        line-height: .9rem;
        background: var(--lpx-dark);
        color: var(--lpx-light);
        text-transform: uppercase;
        &.support {
          background-color: #f9c640;
        }
        &.due-date-changed {
          background-color: #ed1c24;
        }
        &.over-due {
          background-color: #ed1c24;
        }
      }
      .status {
        width: .3rem;
        margin-right: .2rem;
      }
      .card-body {
        display: flex;
        padding: .1rem;
        flex-direction: column;
        width: 100%;
        .action-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .badge {
            margin: .1rem;
            padding: .1rem .3rem;
            cursor: pointer;
          }
        }
        .tile-title {
          font-size: .9rem;
          font-weight: 500;
          > div {
            display: -webkit-box!important;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            max-width: 80%;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            line-height: 1.3;
          }
        }
        .tile-support, .tile-due {
          position: relative;
          i {
            font-size: .9rem;
            color: red;
          }
          span {
            position: absolute;
            top: -.3rem;
            right: -.3rem;
            font-size: .6rem;
          }
        }
        .tile-due-change {
          i {
            font-size: .9rem;
            color: red;
          }
        }
        .tile-category {
          max-width: 80%;
          div {
            max-width: 100%;
            font-weight: 500;
            padding: 0 .2rem;
            // color: white;
            font-size: .8rem;
          }
        }
        .tile-footer {
          margin-top: .2rem!important;
          display: flex;
          justify-content: space-between;
          .comment, .email-request {
            cursor: pointer;
            border: 1px solid var(--lpx-dark);
            border-radius: .4rem;
            padding: 0 .3rem;
          }
          .card-type {
            padding: 0 .2rem;
            color: #ffffff;
            text-align: center;
          }
          .owner {
            width: 1.8rem;
            height: 1.8rem;
            text-align: center;
            line-height: 1.8rem;
            margin-left:.5rem;
            background-color: var(--lpx-dark);
            color: var(--lpx-light);
            border-radius: 50%;
            // text-transform:
          }
        }
        .tile-urgent {
          // position: absolute;
          // top:calc(50% - 0.75rem);
          // right: 2%;
          i {
            font-size: .9rem;
            color: #ff0000;
            animation: blink-animation 1s ease-in-out infinite;
          }
        }
        @keyframes blink-animation {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0;
            }
        }
      }
    }
 `],
})
export class ActivityCardTileComponent implements OnInit {
  @Input() data: GetActivityCardListDto;
  @Output() editCardEvent = new EventEmitter<number>();
  @Input() user: IdentityUserDto;
  maxDueDate: string;
  maxOrignalDueDate: string;

  constructor(
    private activityCardService: ActivityCardService,
    private confirmationService: ConfirmationService,
    private toasterService: ToasterService,
    private configService: ConfigStateService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.maxDueDate = this.formatDate(this.data?.maxDueDate);
    this.maxOrignalDueDate = this.formatDate(this.data?.maxOrignalDueDate);
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);
    return this.datePipe.transform(date.toLocaleDateString(), 'dd MMM yyyy') || '';
  }

  public calculateTextColor(hexColor: string) {
    const hexRegex = /^#([0-9A-F]{6})$/i;
    if (!hexRegex.test(hexColor)) {
      return 'inherit';
    }
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#ffffff';
  }

  editCardIndex(index: number) {
    this.editCardEvent.emit(index);
  }

  showMaxDuechange() {
    // data?. data?.maxOrignalDueDate && data?.maxDueDate && (data?.maxOrignalDueDate !== data?.maxDueDate)
    if (this.data?.maxOrignalDueDate && this.data?.maxDueDate && (this.data?.maxOrignalDueDate !== this.data?.maxDueDate)) {
      if (this.data?.lastAcknowledgeDate) {
        if (this.data?.lastTaskChangeDate) {
          return new Date(this.data?.lastTaskChangeDate) > new Date(this.data?.lastAcknowledgeDate);
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  dismissMaxDueDateChange() {
    this.confirmationService.warn('::LABEL_DismissMaxDueDateChangeAlert', 'AbpUi::AreYouSure')
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.activityCardService.updateLastAcknowledgeDate(this.data.id).subscribe(() => {
            this.toasterService.success('::LABEL_MaxDueDateChangeAlertDismissed');
            this.data.lastAcknowledgeDate = new Date().toISOString();
          });
        }
      });
  }

  getOwnerInitials(owner: string) {
    return owner.split(' ').map(name => name[0]).join('');
  }

  overdue(dueDate: string) {
    return new Date() > new Date(dueDate);
  }

  getDueDays(dueDate: string) {
    const dueDateObj = new Date(dueDate);
    const currentDate = new Date();
    const timeDiff = Math.abs(dueDateObj.getTime() - currentDate.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  }

  getDisplayName() {
    return DashboardUtils.getUserDisplayName(this.user);
  }

  showRequestUpdateForTaskOwner(): boolean {
    return !!(this.data.tasks.length > 0) &&
      this.data.tasks.some(task => task.status === 'Open' && !['', null, undefined].includes(task.ownerId));
  }

  requestUpdateForAllTaskOwners() {
    const requestBodyArray = [];
    this.data.tasks.filter(task => task.status === 'Open' && !['', null, undefined].includes(task.ownerId)).forEach(item => {
      requestBodyArray.push({
        userId: this.configService.getOne('currentUser').id,
        notifyUserIds: item.ownerId ? [item.ownerId] : [],
        activityCardId: this.data.id,
        taskId: item.id,
        baseLink: window.location.origin
      });
    });

    forkJoin(requestBodyArray.map(item => this.activityCardService.notifyTaskOwnerByInput(item))).subscribe(responses => {
      this.toasterService.success('::LABEL_RequestUpdateForTaskOwnerSuccessfully');
    });
  }

  requestUpdateForCardOwner() {
    this.activityCardService.notifyCardOwnerByInput({
      userId: this.configService.getOne('currentUser').id,
      notifyUserIds: this.data.assignedOwnerId ? [this.data.assignedOwnerId] : [],
      activityCardId: this.data.id,
      baseLink: window.location.origin
    }).subscribe(res => {
      this.toasterService.success('::LABEL_RequestUpdateForCardOwnerSuccessfully');
    });
  }

}
