import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CellDto } from "@apis/corporate/dtos";
import { CreateUpdateCellSettingDto } from "@apis/ticket/role-board-settings/dtos";

@Component({
  selector: 'app-role-board-cell-settings',
  template: `
            <div class="group-header">
                <div class="group-title">
                    {{'::LABEL_TaskEnabledSettings' | abpLocalization}}
                </div>
            </div>
            <ngx-datatable [rows]="settings" [footerHeight]="0" default id="RoleBoardCellSettingsDataTable">
                <ngx-datatable-column [width]="25" [canAutoResize]="false" [sortable]="false" >
                  <ng-template let-row="row" let-rowIndex="rowIndex" let-index ngx-datatable-cell-template>
                    <div ngbDropdown container="body" class="d-inline-block">
                      <i class="fa-solid fa-ellipsis-vertical m-1 cursor-pointer" data-toggle="dropdown"
                        aria-haspopup="true" ngbDropdownToggle></i>
                      <div ngbDropdownMenu aria-labelledby="dropdown">
                        <button ngbDropdownItem (click)="delete(rowIndex)">
                          {{ '::Delete' | abpLocalization }}
                        </button>
                      </div>
                    </div>
                  </ng-template>
                </ngx-datatable-column>
                <ngx-datatable-column [name]="'::Cell' | abpLocalization" prop="role" width="210" [sortable]="false" [canAutoResize]="false">
                    <ng-template let-row="row" ngx-datatable-cell-template>
                        <ng-select [items]="cells" appendTo="body" bindValue="id" bindLabel="displayName" [(ngModel)]="row.cellId"></ng-select>
                    </ng-template>
                </ngx-datatable-column>
                <ngx-datatable-column [name]="'::LABEL_CellSettingIsMinorStopagesTaskEnabled' | abpLocalization" width="55" [canAutoResize]="false" [sortable]="false" prop="isMinorStopagesTaskEnabled">
                    <ng-template let-row="row" ngx-datatable-cell-template>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" [(ngModel)]="row.isMinorStopagesTaskEnabled" />
                        </div>
                    </ng-template>
                </ngx-datatable-column>
                <ngx-datatable-column [name]="'::LABEL_CellSettingIsDTEnabled' | abpLocalization" width="55" [canAutoResize]="false" [sortable]="false" prop="isDowntimeTaskEnabled">
                    <ng-template let-row="row" ngx-datatable-cell-template>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" [(ngModel)]="row.isDowntimeTaskEnabled" />
                        </div>
                    </ng-template>
                </ngx-datatable-column>
                <ngx-datatable-column [name]="'::LABEL_CellSettingIsOrderChangeTaskEnabled' | abpLocalization" width="65" [canAutoResize]="false" [sortable]="false" prop="isOrderChangeTaskEnabled">
                    <ng-template let-row="row" ngx-datatable-cell-template>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" [(ngModel)]="row.isOrderChangeTaskEnabled" />
                        </div>
                    </ng-template>
                </ngx-datatable-column>
                <ngx-datatable-column [name]="'::LABEL_CellSettingIsFGCollectionTaskEnabled' | abpLocalization" width="90" [canAutoResize]="false" [sortable]="false" prop="isFGCollectionTaskEnabled">
                    <ng-template let-row="row" ngx-datatable-cell-template>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" [(ngModel)]="row.isFGCollectionTaskEnabled" />
                        </div>
                    </ng-template>
                </ngx-datatable-column>
                <ngx-datatable-column [name]="'::LABEL_CellSettingIsPLCIssueTaskEnabled' | abpLocalization" width="50" [canAutoResize]="false" [sortable]="false" prop="isPLCIssueTaskEnabled">
                    <ng-template let-row="row" ngx-datatable-cell-template>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" [(ngModel)]="row.isPLCIssueTaskEnabled" />
                        </div>
                    </ng-template>
                </ngx-datatable-column>
                <ngx-datatable-column [name]="'::LABEL_CellSettingIsScrapIncreaseTaskEnabled' | abpLocalization" width="75" [canAutoResize]="false" [sortable]="false" prop="isScrapIncreaseTaskEnabled">
                    <ng-template let-row="row" ngx-datatable-cell-template>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" [(ngModel)]="row.isScrapIncreaseTaskEnabled" />
                        </div>
                    </ng-template>
                </ngx-datatable-column>
                <ngx-datatable-column [name]="'::LABEL_CellSettingIsAutoConfirmErrorTaskEnabled' | abpLocalization" width="105" [canAutoResize]="false" [sortable]="false" prop="isAutoConfirmErrorTaskEnabled">
                    <ng-template let-row="row" ngx-datatable-cell-template>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" [(ngModel)]="row.isAutoConfirmErrorTaskEnabled" />
                        </div>
                    </ng-template>
                </ngx-datatable-column>
                <ngx-datatable-column [name]="'::LABEL_CellSettingIsMaterialLoadEnabled' | abpLocalization" width="75" [canAutoResize]="false" [sortable]="false" prop="isMaterialLoadTaskEnabled">
                    <ng-template let-row="row" ngx-datatable-cell-template>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" [(ngModel)]="row.isMaterialLoadTaskEnabled" />
                        </div>
                    </ng-template>
                </ngx-datatable-column>
                <ngx-datatable-column [name]="'::LABEL_CellSettingPLCCountMonitorDurationMinutes' | abpLocalization" [sortable]="false" [width]="95" [canAutoResize]="false" prop="plcCountMonitorDurationMinutes">
                    <ng-template let-row="row" ngx-datatable-cell-template>
                        <input type="text" class="form-control" (input)="inputMaxLimit($event, 5, row, 'plcCountMonitorDurationMinutes')" [(ngModel)]="row.plcCountMonitorDurationMinutes" placeholder="mins"/>
                    </ng-template>
                </ngx-datatable-column>
                <ngx-datatable-column [name]="'::LABEL_CellSettingScrapMonitorDurationMinutes' | abpLocalization" [sortable]="false" [width]="95" [canAutoResize]="false" prop="scrapMonitorDurationMinutes">
                    <ng-template let-row="row" ngx-datatable-cell-template>
                        <input type="text" class="form-control" (input)="inputMaxLimit($event, 5, row, 'scrapMonitorDurationMinutes')" [(ngModel)]="row.scrapMonitorDurationMinutes" placeholder="mins"/>
                    </ng-template>
                </ngx-datatable-column>
                <ngx-datatable-column [name]="'::LABEL_CellSettingScrapPPM' | abpLocalization" prop="scrapPPM" [width]="95" [canAutoResize]="false" [sortable]="false">
                    <ng-template let-row="row" ngx-datatable-cell-template>
                        <input type="text" (input)="inputMaxLimit($event, 5, row, 'scrapPPM')" class="form-control" [(ngModel)]="row.scrapPPM" />
                    </ng-template>
                </ngx-datatable-column>
            </ngx-datatable>
        <div class="action-bar d-flex justify-content-start align-items-center mt-2">
            <button type="button" class="btn btn-outline-danger btn-sm me-1" (click)="add()">
                <i class="fas fa-plus me-1"></i>
                {{'::Create' | abpLocalization}}
            </button>
        </div>
    `,
  styles: [`
            :host ::ng-deep {
                .datatable-header .datatable-header-cell .datatable-header-cell-template-wrap {
                    white-space: normal;
                }
                .datatable-body-cell {
                    display: flex!important;
                    align-items: center!important;
                }
            }
            .content-container {
                width: 100%!important;
                overflow: auto;
                .group-header, ngx-datatable {
                    width: 1035px;
                }
            }
            .group-title {
                margin-left: 235px;
                width: 505px;
                text-align: center;
                border-bottom: 2px solid var(--lpx-border-color);
                position: relative;
            }
            ngx-datatable ng-select {
                width: 200px;
                line-height: 1.3rem;
            }
            /* Chrome, Safari, Edge, and Opera */
            input[type="number"]::-webkit-inner-spin-button,
            input[type="number"]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            /* Firefox */
            input[type="number"] {
                -moz-appearance: textfield;
            }

            .dropdown-toggle::after {
                display: none !important;
            }
        `]

})

export class RoleBoardCellSettingsComponent {
    @Input() settings: CreateUpdateCellSettingDto[] = [];
    @Input() cells: CellDto[] = [];
    @Output() settingsChange = new EventEmitter<CreateUpdateCellSettingDto[]>();
    selectedSettings: CreateUpdateCellSettingDto[] = [];

    displayCheck() {
        return true;
    }

    add() {
        this.settings = [...this.settings, {
            cellId: '',
            isDowntimeTaskEnabled: false,
            isMinorStopagesTaskEnabled: false,
            isOrderChangeTaskEnabled: false,
            isFGCollectionTaskEnabled: false,
            isScrapIncreaseTaskEnabled: false,
            scrapMonitorDurationMinutes: 0,
            scrapPPM: 0,
            isPLCIssueTaskEnabled: false,
            plcCountMonitorDurationMinutes: 0,
            isAutoConfirmErrorTaskEnabled: false,
            isMaterialLoadTaskEnabled: false
        }]
        this.settingsChange.emit(this.settings);
    }

    inputMaxLimit(e, limit, row, field) {
        // just allow numbers
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        // limit the length
        if (e.target.value.length > limit) {
            e.target.value = e.target.value.slice(0, limit);
        }
        // convert to number
        e.target.value = e.target.value?.length ? +e.target.value : 0;
        row[field] = e.target.value;
    }

    onSelect({ selected }) {
        if (selected && Array.isArray(selected)) {
            this.selectedSettings = selected;
        }
      }

    delete(rowIndex: number) {
        this.settings.splice(rowIndex, 1);
        this.settings = [...this.settings];
        this.settingsChange.emit(this.settings);
    }
}
