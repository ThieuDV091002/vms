import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { PagedResultDto } from '@abp/ng.core/lib/models/dtos';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SessionStateService } from '@abp/ng.core';
import { SchedulerExecutionHistoryDto } from '@apis/scheduler/dtos';

@Component({
  selector: 'app-execution-history-modal',
  template: `
  <abp-modal [(visible)]="isExecutionHistoryModalVisible" [options]="{size: 'xl'}" [suppressUnsavedChangesWarning]="true" (visibleChange)="visibleChangeEvent($event)">
    <ng-template #abpHeader>
        <h3>{{ '::viewExecutionHistory' | abpLocalization }}</h3>
    </ng-template>
    <ng-template #abpBody>
        <div class="mb-2">
          <div class="form-group d-inline-block">
              <label for="start-date">{{'::LABEL_StartDate' | abpLocalization}}</label>
              <!-- <input type="date" id="start-date" [(ngModel)]="startDate" class="form-control form-control-sm d-inline-block ms-1" min="2024-01-01" [max]="endDate || '2050-12-31'"/> -->
              <input type="text" id="start-date" [(ngModel)]="startDate" [minDate]="minDate" [maxDate]="endDate || maxDate" bsDatepicker
                  [bsConfig]="{containerClass: 'theme-dark-blue', adaptivePosition: true, keepDatepickerOpened: true, dateInputFormat: 'DD MMM YYYY'}" />
          </div>
          <div class="form-group d-inline-block ms-1">
              <label for="end-date">{{'::LABEL_EndDate' | abpLocalization}}</label>
              <!-- <input type="date" id="end-date" [(ngModel)]="endDate" class="form-control form-control-sm d-inline-block ms-1" [min]="startDate || '2024-01-01'" max="2050-12-31"/> -->
              <input type="text" id="end-date" [(ngModel)]="endDate" [minDate]="startDate || minDate" [maxDate]="maxDate" bsDatepicker
                  [bsConfig]="{containerClass: 'theme-dark-blue', adaptivePosition: true, keepDatepickerOpened: true, dateInputFormat: 'DD MMM YYYY'}" />
          </div>
          <button class="btn btn-outline-primary btn-sm ms-1" (click)="clear()">{{'::Clear' | abpLocalization}}</button>
          <button class="btn btn-primary btn-sm ms-1" [disabled]="!startDate && !endDate" (click)="filterHistory()">{{'::Apply' | abpLocalization}}</button>
        </div>
        <ngx-datatable [rows]="executionHistorys?.items" [limit]="10" [count]="executionHistorys?.totalCount" default>
          <ngx-datatable-column [name]="'::LABEL_StartExecutionTime' | abpLocalization" [comparator]="dateComparator" prop="startExecutionTime">
              <ng-template let-row="row" ngx-datatable-cell-template>
              {{formatDate(row.startExecutionTime) | date: 'dd MMM yyyy hh:mm:ss a' }}
              </ng-template>
          </ngx-datatable-column>
          <ngx-datatable-column [name]="'::LABEL_Exception' | abpLocalization" prop="exception"></ngx-datatable-column>
          <ngx-datatable-column [name]="'::LABEL_IsSuccess' | abpLocalization" prop="isSuccess"></ngx-datatable-column>
        </ngx-datatable>
    </ng-template>
    <ng-template #abpFooter>
        <button type="button" class="btn btn-sm btn-outline-primary" abpClose>
            {{ 'AbpIdentity::Close' | abpLocalization }}
        </button>
    </ng-template>
  </abp-modal>
  `,
  styles: [`
    .expand-icon {
        text-decoration: none;
    }
    input[type="date"] {
        width: 150px;
    }
    :host ::ng-deep {
        .datatable-row-detail {
            width: 100%!important;
            padding: 0!important;
        }
        .datatable-scroll {
            max-width: 100%!important;
        }
        .datatable-body-cell-label span {
          word-break: break-word!important;
        }
    }
    .history-detail ::ng-deep {
        .datatable-body-row {
            background: var(--lpx-content-bg)!important;
        }
        .datatable-footer {
            background: var(--lpx-content-bg)!important;
        }
    }
 `],
})
export class ExecutionHistoryModalComponent implements OnChanges {
  @Input() isExecutionHistoryModalVisible: boolean;
  @Output() isExecutionHistoryModalVisibleChange = new EventEmitter<boolean>();
  @ViewChild('myTable') table: DatatableComponent;
  @Input() executionHistorys: PagedResultDto<SchedulerExecutionHistoryDto>;
  language: string;
  filteredHistorys: SchedulerExecutionHistoryDto[] = [];
  startDate: string;
  endDate: string;
  minDate = new Date('2024-01-01');
  maxDate = new Date('2050-12-31');

  constructor(private session: SessionStateService,) {
    this.language = this.session.getLanguage();
  }

  ngOnChanges(): void {
    if (this.executionHistorys) {
        this.filteredHistorys = this.executionHistorys.items;
        // Sort the history by execution time descending
        this.filteredHistorys.sort((a, b) => new Date(b.startExecutionTime).getTime() - new Date(a.startExecutionTime).getTime());
    } else {
      this.filteredHistorys = [];
    }
  }

  clear() {
    this.startDate = '';
    this.endDate = '';
    this.filteredHistorys = this.executionHistorys.items;
  }

  filterHistory() {
    // startDate or endDate maybe just have one value, or both have value
    // 确保 startDate 和 endDate 都是 Date 类型
    const start = this.startDate ? new Date(this.startDate) : this.minDate;
    const end = this.endDate ? new Date(this.endDate) : this.maxDate;
    // start 设为当天00:00:00
    start.setHours(0, 0, 0, 0);
    // end 设为当天23:59:59，包含整天
    end.setHours(23, 59, 59, 999);

    this.filteredHistorys = this.executionHistorys.items.filter(item => {
      const date = new Date(item.startExecutionTime);
      return date >= start && date <= end;
    });
  }

  dateComparator(a, b) {
    return new Date(a).getTime() - new Date(b).getTime();
  }

  toggleExpandRow(row) {
    if (this.table && this.table.rowDetail) {
        this.table.rowDetail.toggleExpandRow(row);
    }
  }

  formatDate(date: any) {
    /**
     * As API may return 3 types of date format
     * US format: MM/DD/YYYY hh:mm:ss AM/PM
     * EU format: DD/MM/YYYY HH:mm:ss
     * ISO format: YYYY/MM/DD HH:mm:ss
     * US and ISO format works fine, but for EU format,
     * it may throw an error,as date will treat as month which might larger that 12
     * should handel EU format separately
     */
    const isEuPattern = /^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}$/;
    if (isEuPattern.test(date)) {
      return new Date(this.convertToStandardDateFormat(date) + "+00:00").toLocaleString();
    } else {
      return new Date(date?.toString() + '+00:00').toLocaleString();
    }
  }

  private convertToStandardDateFormat(dateString: string) {
    const [datePart, timePart] = dateString.split(/\s+/);
    const [day, month, year] = datePart.split('/');

    // Format the date as YYYY/MM/DD HH:mm:ss
    return `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')} ${timePart}`;
  }

  visibleChangeEvent(e) {
    if (!e) {
        this.isExecutionHistoryModalVisibleChange.emit(false);
    }
  }

}
