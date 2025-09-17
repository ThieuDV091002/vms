import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { PagedResultDto } from '@abp/ng.core/lib/models/dtos';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ModelingHistoryDto } from '@proxy/dtos/modeling';
import { SessionStateService } from '@abp/ng.core';

@Component({
  selector: 'app-history-modal',
  template: `
  <abp-modal [(visible)]="isHistoryModalVisible" [options]="{size: 'xl'}" [suppressUnsavedChangesWarning]="true" (visibleChange)="visibleChangeEvent($event)">
    <ng-template #abpHeader>
        <h3>{{ '::ViewHistory' | abpLocalization }}</h3>
    </ng-template>
    <ng-template #abpBody>
        <div class="form-group d-inline-block">
            <label for="start-date">{{'::LABEL_StartDate' | abpLocalization}}</label>
            <input type="text" class="form-control" id="start-date" [(ngModel)]="startDate" [minDate]="minDate" [maxDate]="endDate || maxDate" bsDatepicker
                  [bsConfig]="{containerClass: 'theme-dark-blue', adaptivePosition: true, keepDatepickerOpened: true, dateInputFormat: 'DD MMM YYYY'}" />
        </div>
        <div class="form-group d-inline-block ms-1">
            <label for="end-date">{{'::LABEL_EndDate' | abpLocalization}}</label>
            <input type="text" class="form-control" id="end-date" [(ngModel)]="endDate" [minDate]="startDate || minDate" [maxDate]="maxDate" bsDatepicker
                [bsConfig]="{containerClass: 'theme-dark-blue', adaptivePosition: true, keepDatepickerOpened: true, dateInputFormat: 'DD MMM YYYY'}" />
        </div>
        <button class="btn btn-outline-primary btn-sm ms-1" (click)="clear()">{{'::Clear' | abpLocalization}}</button>
        <button class="btn btn-primary btn-sm ms-1" [disabled]="!startDate && !endDate" (click)="filterHistory()">{{'::Apply' | abpLocalization}}</button>
        <ngx-datatable #myTable [rows]="filteredHistorys" [limit]="10" [count]="filteredHistorys.length" default >

        <ngx-datatable-row-detail [rowHeight]="'auto'">
            <ng-template let-row="row" let-expanded="expanded" ngx-datatable-row-detail-template>
            <div class="history-detail">
                <ngx-datatable [rows]="row?.children" default>
                    <ngx-datatable-column [name]="'::FieldName' | abpLocalization" prop="propertyName"></ngx-datatable-column>
                    <ngx-datatable-column [name]="'::Before' | abpLocalization" prop="originalValue"></ngx-datatable-column>
                    <ngx-datatable-column [name]="'::After' | abpLocalization" prop="newValue"></ngx-datatable-column>
                </ngx-datatable>
            </div>
            </ng-template>
        </ngx-datatable-row-detail>
        <ngx-datatable-column [width]="50" [resizeable]="false" [sortable]="false" [draggable]="false" [canAutoResize]="false">
            <ng-template let-row="row" let-expanded="expanded" ngx-datatable-cell-template>
            <a
                href="javascript:void(0)"
                class="expand-icon"
                [class.datatable-icon-right]="!expanded"
                [class.datatable-icon-down]="expanded"
                title="Expand/Collapse Row"
                (click)="toggleExpandRow(row)"
            >
            </a>
            </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column [name]="'::ExecutionTime' | abpLocalization" [comparator]="dateComparator" prop="executionTime">
            <ng-template let-row="row" ngx-datatable-cell-template>
            {{formatDate(row.executionTime) | date: 'dd MMM yyyy hh:mm:ss a' }}
            </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column [name]="'::UserName' | abpLocalization" prop="userName"></ngx-datatable-column>
        <ngx-datatable-column [name]="'::ChangeType' | abpLocalization" prop="changeType"></ngx-datatable-column>
        </ngx-datatable>
        </ng-template>
    <ng-template #abpFooter>
        <button type="button" class="btn btn-outline-primary btn-sm" abpClose>
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
            .datatable-body-cell {
              word-break: break-all!important;
            }
        }
        .datatable-footer {
            background: var(--lpx-content-bg)!important;
        }
    }
 `],
})
export class HistoryModalComponent implements OnChanges {
  @Input() isHistoryModalVisible: boolean;
  @Output() isHistoryModalVisibleChange = new EventEmitter<boolean>();
  @ViewChild('myTable') table: DatatableComponent;
  @Input() historys: PagedResultDto<ModelingHistoryDto>;
  language: string;
  filteredHistorys: ModelingHistoryDto[] = [];
  startDate: string;
  endDate: string;
  minDate = new Date('2024-01-01');
  maxDate = new Date('2050-12-31');

  constructor(private session: SessionStateService,) {
    this.language = this.session.getLanguage();
  }

  ngOnChanges(): void {
    if (this.historys) {
      this.filteredHistorys = this.historys.items;
      // Sort the history by execution time descending
      this.filteredHistorys.sort((a, b) => new Date(b.executionTime).getTime() - new Date(a.executionTime).getTime());
    } else {
      this.filteredHistorys = [];
    }
  }

  clear() {
    this.startDate = '';
    this.endDate = '';
    this.filteredHistorys = this.historys.items;
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

    this.filteredHistorys = this.historys.items.filter(item => {
      const date = new Date(item.executionTime);
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
      this.isHistoryModalVisibleChange.emit(false);
    }
  }

}
