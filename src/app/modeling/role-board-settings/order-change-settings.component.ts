import { IdentityRoleDto } from "@abp/ng.identity/proxy";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CreateUpdateOrderChangeSettingDto } from "@apis/ticket/role-board-settings/dtos";

@Component({
  selector: 'app-order-change-settings',
  template: `
          <ngx-datatable [rows]="settings" [footerHeight]="0" default id="OrderChangeSettingsDataTable">
            <ngx-datatable-column [width]="25" [canAutoResize]="false" [sortable]="false">
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
            <ngx-datatable-column [name]="'::LABEL_Role' | abpLocalization" prop="role" width="240" [canAutoResize]="false" [sortable]="false">
                <ng-template let-row="row" ngx-datatable-cell-template>
                    <ng-select [items]="roles" appendTo="body" bindValue="name" bindLabel="name" [(ngModel)]="row.roleName"></ng-select>
                </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column [name]="'::LABEL_Caution' | abpLocalization" prop="warningMinutes" [width]="95" [canAutoResize]="false" [sortable]="false">
                <ng-template let-row="row" ngx-datatable-cell-template>
                    <input type="text" class="form-control" (input)="inputMaxLimit($event, 5, row, 'warningMinutes')" [(ngModel)]="row.warningMinutes" placeholder="mins"/>
                </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column [name]="'::LABEL_Warning' | abpLocalization" prop="alertMinutes" [width]="95" [canAutoResize]="false" [sortable]="false">
                <ng-template let-row="row" ngx-datatable-cell-template>
                    <input type="text" class="form-control" (input)="inputMaxLimit($event, 5, row, 'alertMinutes')" [(ngModel)]="row.alertMinutes" placeholder="mins"/>
                </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column [name]="'::LABEL_IncomingChangeSettingProductChange' | abpLocalization" prop="isProductChange" [width]="75" [canAutoResize]="false" [sortable]="false">
                <ng-template let-row="row" ngx-datatable-cell-template>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" [(ngModel)]="row.isProductChange" />
                    </div>
                </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column [name]="'::LABEL_IncomingChangeSettingToolChange' | abpLocalization" prop="isToolChange" [width]="65" [canAutoResize]="false" [sortable]="false">
                <ng-template let-row="row" ngx-datatable-cell-template>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" [(ngModel)]="row.isToolChange" />
                    </div>
                </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column [name]="'::LABEL_IncomingChangeSettingRMChange' | abpLocalization" prop="isRMChange" [width]="65" [canAutoResize]="false" [sortable]="false">
                <ng-template let-row="row" ngx-datatable-cell-template>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" [(ngModel)]="row.isRMChange" />
                    </div>
                </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column [name]="'::LABEL_DisplayInstruction' | abpLocalization" prop="displayInstrcution" [width]="375" [sortable]="false">
                <ng-template let-row="row" ngx-datatable-cell-template>
                    <input type="input" class="form-control" [(ngModel)]="row.displayInstruction" />
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
                    .datatable-body-cell-label {
                        width: 100%;
                    }
                }
            }
            ngx-datatable ng-select {
                width: 230px;
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

export class OrderChangeSettingsComponent {
    @Input() settings: CreateUpdateOrderChangeSettingDto[] = [];
    @Input() roles: IdentityRoleDto[] = [];
    @Output() settingsChange = new EventEmitter<CreateUpdateOrderChangeSettingDto[]>();
    selectedSettings: CreateUpdateOrderChangeSettingDto[] = [];

    displayCheck() {
        return true;
    }

    add() {
        this.settings = [...this.settings, {
            roleName: '',
            isProductChange: false,
            isToolChange: false,
            isRMChange: false,
            displayInstruction: '',
            warningMinutes: 0,
            alertMinutes: 0
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
