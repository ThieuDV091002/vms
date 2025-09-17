import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { RoleBoardTaskDto } from '@apis/ticket/dtos';
import { RoleBoardTaskService } from '@apis/ticket/role-board';
import { of } from 'rxjs';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { WorkCenterService } from '@apis/corporate';
import { IdentityRoleDto } from '@abp/ng.identity/proxy';
import { FocusedItemService } from '@apis/ticket/role-board-settings';
import { FocusedItemDto } from '@apis/ticket/role-board-settings/dtos';

@Component({
  selector: 'app-role-board-task',
  template: `
  <div class="widget-page h-100" [ngClass]="{'widget-fullscreen': expandTask}">
    <h5>{{title | abpLocalization}}</h5>
    <div class="action-bar widget-toolbar">
        <span (click)="expand()"><i class="fa fa-expand me-1 cursor" [ngClass]="expandTask ? 'fa-compress' : 'fa-expand'" ></i></span>
        <span (click)="openEditModal()"><i class="fa fa-cog cursor" ></i></span>
    </div>
    <ngx-datatable #taskDataTable [rows]='tasks.items' [limit]="settings.RowCount" [count]="tasks.totalCount" [list]="list" default [scrollbarV]="true">
        <!-- <ngx-datatable-column [name]="'::LABEL_Task' | abpLocalization" [sortable]="false" [width]="50" [canAutoResize]="false">
          <ng-template let-row="row" ngx-datatable-cell-template>
            <div class="custom-table-cell task-name-container" [title]="row.taskType.name">
              <span class="task-name">{{getShortTaskName(row.taskType.name)}}</span>
            </div>
          </ng-template>
        </ngx-datatable-column> -->
        <ngx-datatable-column [name]="'::WorkCenter' | abpLocalization" [width]="130" [canAutoResize]="false" [sortable]="false">
          <ng-template let-row="row" ngx-datatable-cell-template>
            <div class="custom-table-cell" >
              <span class="workcenter-container" *ngIf="getWorkCenterName(row.dataTierId)" [ngStyle]="taskColorsMap[row.id]" [title]="getWorkCenterName(row.dataTierId)">
                {{getWorkCenterName(row.dataTierId)}}
              </span>
            </div>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column [name]="'::LABEL_Instructions' | abpLocalization" [sortable]="false">
          <ng-template let-row="row" ngx-datatable-cell-template>
            <div class="custom-table-cell" [title]="row.instructions">
              {{row.instructions}}
            </div>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column [name]="(apiName === 'getUrgentTasks' ? '::LABEL_Duration' : '::LABEL_DurationIn') | abpLocalization" [width]="100" [canAutoResize]="false" [sortable]="false">
            <ng-template let-row="row" ngx-datatable-cell-template>
                <div class="custom-table-cell">
                  {{getOverDue(row.durationHours)}}
                </div>
            </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column [name]="''" [sortable]="false" [width]="20" [canAutoResize]="false">
            <ng-template let-row="row" ngx-datatable-cell-template>
                <div *ngIf="isFocusedItem(row)" class="custom-table-cell priority">
                  <span><i class="fa fa-exclamation-circle"></i></span>
                </div>
            </ng-template>
        </ngx-datatable-column>
    </ngx-datatable>
    </div>
    <abp-modal [(visible)]="editModalVisible">
      <ng-template #abpHeader>
        <h3>{{'::Edit' | abpLocalization}}</h3>
      </ng-template>
      <ng-template #abpBody>
        <form #dashboardForm="ngForm">
          <div class="form-group mb-2">
            <label for="name" [title]="'::INFO_Role' | abpLocalization">{{'::LABEL_Role' | abpLocalization}}</label>
            <ng-select
              [items]="roles"
              [appendTo]="'body'"
              bindLabel="name"
              bindValue="name"
              [(ngModel)]="editsettings.role">
            </ng-select>
          </div>

          <div class="form-group mb-2">
            <label for="name" [title]="'::INFO_RefreshInterval' | abpLocalization">{{'::LABEL_RefreshInterval' | abpLocalization}}</label><span> * </span>
            <input type="number" id="refreshInterval" required [(ngModel)]="editsettings.refreshInterval" name="refreshInterval" class="form-control">
          </div>

          <div class="form-group">
            <label [title]="'::INFO_RowCount' | abpLocalization">{{'::LABEL_RowCount' | abpLocalization}}</label>
            <select class="form-select" [(ngModel)]="editsettings.RowCount" name="layoutClass">
                <option value="10">10</option>
                <option value="10">15</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
            </select>
          </div>
        </form>
      </ng-template>
      <ng-template #abpFooter>
        <button type="button" class="btn btn-outline-primary" abpClose>
          {{ '::Cancel' | abpLocalization }}
        </button>
        <button class="btn btn-primary" (click)="saveSettiings()">
          <i class="fa fa-check"></i>
          {{'::Save' | abpLocalization}}
        </button>
      </ng-template>
    </abp-modal>
  `,
  styles: [`
    :host {
        display: block;
        width: 100%;
        height: calc(100% - 1rem);
        position: relative;
        padding: .2rem;
        ngx-datatable {
            height: 96%;
            ::ng-deep {
              > div {
                height: 100%!important;
                .datatable-body{
                    height: calc(100% - 4.2rem)!important;
                    .datatable-body-row datatable-body-cell.datatable-body-cell {
                    padding: 0!important;
                    .datatable-body-cell-label {
                      width:100%!important;
                      height: 100%!important;
                    }
                  }
                }
              }
              .datatable-footer {
                overflow: hidden;
                .datatable-footer-inner {
                  height: 2rem!important;
                  .page-count, .datatable-pager {
                    height: 2rem!important;
                    line-height: 2rem!important;
                  }
                }
              }
            }
        };
        .custom-table-cell {
          width: 100%!important;
          height: 2rem!important;
          line-height: 2rem!important;
          padding: 0 .2rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          &.priority {
            color: red;
            padding: 0!important;
          }
          .workcenter-container {
            display: inline-block;
            height: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            padding: 0 .2rem;
            width: 100%;
            &:empty {
              background-color: transparent!important;
              height: auto!important;
            }
          }
          .task-name {
            display: inline-block;
            width: 2rem;
            height: 2rem;
            line-height: 2rem;
            text-align: center;
            background: var(--lpx-primary);
            color: white;
            border-radius: 50%;
          }
        }
    }
    :host:hover .action-bar {
        display: block;
    }
    .action-bar {
        display: none;
        position: absolute;
        top: .2rem;
        right: .5rem;
        font-size: 1.2rem;
    }
    .cursor {
        cursor: pointer;
    }
    .status-color {
        display: inline-block;
        width: 40px;
        height: 20px;
    }
    `],
  providers: [
    ListService
  ]
})
export class RoleBoardTaskComponent implements OnChanges, OnInit, OnDestroy{
  @Input() title: string;
  @Input() responsiveRowCount: false;
  tasks: PagedResultDto<RoleBoardTaskDto> = {items: [], totalCount: 0};
  @Input() selectedDataTier;
  @Input() apiName: string;
  @Input() roles: IdentityRoleDto[] = [];
  @Output() expandChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('taskDataTable') taskDataTable: DatatableComponent;
  selectedDataTierType : string;
  selectedDataTierId: string;
  timer: any;
  editModalVisible = false;
  expandTask = false;
  settings = {
    refreshInterval: 10,
    role: '',
    RowCount: 10
  };
  editsettings: any = {};
  workCenterMap: Map<string, string> = new Map();
  taskColorsMap: any = {};
  focusedItems: FocusedItemDto[] = [];

  constructor(private roleBoardTaskService: RoleBoardTaskService, public list: ListService,
    private workCenterService : WorkCenterService, private focusedItemService: FocusedItemService) {
    focusedItemService.getList({maxResultCount: 100}).subscribe(res=> this.focusedItems = res.items);
  }

  ngOnInit(): void {
    this.hookToQuery();
    if (this.responsiveRowCount) {
      this.adjustPageSize();
      window.addEventListener('resize', this._onResize);
    }
  }

  private _onResize = () => {
    this.adjustPageSize();
  }

  adjustPageSize() {
    const width = window.screen.height;
    if (width >= 1440) {
      this.list.maxResultCount = 30;
      this.settings.RowCount = 30;
    } else if (width >= 1080) {
      this.list.maxResultCount = 20;
      this.settings.RowCount = 20;
    }
    else if (width >= 864) {
      this.list.maxResultCount = 15;
      this.settings.RowCount = 15;
    }
    else {
      this.list.maxResultCount = 10;
      this.settings.RowCount = 10;
    }
  }

  getWorkCenterName(workCenterId: string) {
    return this.workCenterMap.get(workCenterId);
  }

  isFocusedItem(row: any) {
    if (row.dataTierType === 'WorkCenter' && this.focusedItems.length > 0) {
      return this.focusedItems.some(item => item.workCenterId === row.dataTierId);
    } else {
      return false;
    }
  }

  getOverDue(time: number) {
    const days = Math.floor(time / 24);
    const hours = Math.floor(time % 24);
    const minutes = Math.floor((time % 1) * 60);
    return `${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm' : ''}`;
  }

  getShortTaskName(name: string) {
    const names = name.split(' ');
    // if just 1, then return first word, if more than 2, just retuen 2 first word
    return `${names[0][0]}${names.length > 1 ? names[1][0] : ''}`;
  }

  hookToQuery() {
    this.list.hookToQuery(query => {
      setTimeout(() => {
        this.getIntervalTasks();
      }, 0);
      return of()
    }).subscribe(result => {

    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedbaseDataTier = this.selectedDataTier?.workCenter ? this.selectedDataTier?.workCenter : (this.selectedDataTier?.cell ? this.selectedDataTier?.cell : this.selectedDataTier?.area);
    if (selectedbaseDataTier) {
      this.selectedDataTierType = selectedbaseDataTier.type;
      this.selectedDataTierId = selectedbaseDataTier.id;
    } else {
      this.selectedDataTierType = '';
      this.selectedDataTierId = '';
    }
    this.getIntervalTasks();
  }

  expand() {
    this.expandTask = !this.expandTask;
    this.expandChange.emit(this.expandTask ? this.apiName: '');
    setTimeout(()=> this.taskDataTable.recalculate(), 0)
  }

  getIntervalTasks() {
    this.getTasks();
    clearInterval(this.timer);
    this.timer = setInterval(() => this.getTasks(), this.settings.refreshInterval * 1000);
  }

  openEditModal() {
    this.editModalVisible = true;
    this.editsettings = Object.assign({}, this.settings);
  }

  saveSettiings() {
    this.editModalVisible = false;
    this.settings = Object.assign({}, this.editsettings);
    this.getIntervalTasks();
  }

  getTasks() {
  if (this.apiName) {
    // 统一提取多选ID数组，与Dashboard组件保持一致
    const areaIds = this.selectedDataTier?.areas?.map(area => area.id) ||
                   (this.selectedDataTier?.area?.id ? [this.selectedDataTier.area.id] : []);

    const cellIds = this.selectedDataTier?.cells?.map(cell => cell.id) ||
                   (this.selectedDataTier?.cell?.id ? [this.selectedDataTier.cell.id] : []);

    const workCenterIds = this.selectedDataTier?.workCenters?.map(wc => wc.id) ||
                         (this.selectedDataTier?.workCenter?.id ? [this.selectedDataTier.workCenter.id] : []);

    // API参数
    const params: any = {
      ownerRoleName: this.settings.role,
      skipCount: (this.taskDataTable?.offset || 0) * this.settings.RowCount,
      maxResultCount: this.settings.RowCount
    };

    // 使用多选ID数组作为参数
    if (areaIds.length > 0 || cellIds.length > 0 || workCenterIds.length > 0) {
      // 只添加非空数组
      if (areaIds.length > 0) params.areaIds = areaIds;
      if (cellIds.length > 0) params.cellIds = cellIds;
      if (workCenterIds.length > 0) params.workCenterIds = workCenterIds;
    } else {
      // 后备方案：使用单选模式
      if (this.selectedDataTierId && this.selectedDataTierType) {
        params.dataTierId = this.selectedDataTierId;
        params.dataTierType = this.selectedDataTierType;
      }
    }

        // 判断使用哪个层级的ID
    if (workCenterIds.length > 0) {
      params.workCenterIds = workCenterIds;
      // 删除其他层级的ID
      delete params.areaIds;
      delete params.cellIds;
    } else if (cellIds.length > 0) {
      params.cellIds = cellIds;
      // 删除其他层级的ID
      delete params.areaIds;
      delete params.workCenterIds;
    } else if (areaIds.length > 0) {
      params.areaIds = areaIds;
      // 删除其他层级的ID
      delete params.cellIds;
      delete params.workCenterIds;
    }
    // 调用API
      this.roleBoardTaskService[this.apiName](params).subscribe(res => {
      this.tasks = res;

      // 恢复原始代码中的工作中心名称处理逻辑
      this.tasks.items.forEach(task => {
        this.calculateColor(task);
        if (task.dataTierType === 'WorkCenter' && task.dataTierId && !this.workCenterMap.has(task.dataTierId)) {
          this.workCenterMap.set(task.dataTierId, '');
          this.workCenterService.get(task.dataTierId).subscribe(workCenter => {
            this.workCenterMap.set(task.dataTierId, workCenter.displayName);
          });
        }
      });
    });
  }
}

  private calculateColor(task: RoleBoardTaskDto) {
    // task.status = '#f44336';
    const hexRegex = /^#([0-9A-F]{6})$/i;
    if (task.status && hexRegex.test(task.status)) {

      this.taskColorsMap[task.id] = {
        'background-color': task.status,
        'color': this.calculateTextColor(task.status)
      }
    }
  }

  private calculateTextColor(hexColor: string) {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#ffffff';
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    if (this.responsiveRowCount) {
      window.removeEventListener('resize', this._onResize);
    }
  }
}
