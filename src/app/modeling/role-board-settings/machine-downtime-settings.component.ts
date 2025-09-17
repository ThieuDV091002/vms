import { ListService } from "@abp/ng.core";
import { IdentityRoleDto } from "@abp/ng.identity/proxy";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { LocalDowntimeReasonDto } from "@apis/general/dtos";
import { LocalDowntimeReasonService } from "@apis/general/local-downtime-reason.service";
import { CreateUpdateMachineDowntimeSettingDto, } from "@apis/ticket/role-board-settings/dtos";
import { debounceTime, distinctUntilChanged, map, Subject, switchMap } from "rxjs";


@Component({
  selector: 'app-machine-downtime-settings',
  template: `
          <ngx-datatable [rows]="settings" [footerHeight]="0" default id="machineDowntimeSettingsDataTable">
            <ngx-datatable-column [width]="25" [sortable]="false" [canAutoResize]="false">
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
            <ngx-datatable-column [name]="'::LABEL_Role' | abpLocalization" [sortable]="false" [canAutoResize]="false" [width]="362">
                <ng-template let-row="row" ngx-datatable-cell-template>
                    <ng-select [items]="roles" appendTo="body" bindValue="name" bindLabel="name" [(ngModel)]="row.roleName"></ng-select>
                </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column [name]="'::LABEL_LocalDowntimeReason' | abpLocalization" [sortable]="false" [canAutoResize]="false" [width]="362">
                <ng-template let-row="row" ngx-datatable-cell-template>
                    <ng-select [items]="localDowntimeReasons" appendTo="body" bindValue="id" bindLabel="displayName" [(ngModel)]="row.localDownTimeReasonId"
                                  [placeholder]="'::LABEL_ShowingTopTen' | abpLocalization" [typeahead]="localDowntimeReasonInput$"   
                ></ng-select>
                </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column [name]="'::LABEL_Caution' | abpLocalization" [width]="95" [canAutoResize]="false" [sortable]="false">
                <ng-template let-row="row" ngx-datatable-cell-template>
                    <input type="text" class="form-control" (input)="inputMaxLimit($event, 5, row, 'warningMinutes')" [(ngModel)]="row.warningMinutes" placeholder="mins"/>
                </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column [name]="'::LABEL_Warning' | abpLocalization" [width]="95" [canAutoResize]="false" [sortable]="false">
                <ng-template let-row="row" ngx-datatable-cell-template>
                    <input type="text" class="form-control" (input)="inputMaxLimit($event, 5, row, 'alertMinutes')" [(ngModel)]="row.alertMinutes" placeholder="mins"/>
                </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column [name]="'::LABEL_DowntimeNotificationRuleEscalate' | abpLocalization" [width]="95" [canAutoResize]="false" [sortable]="false">
                <ng-template let-row="row" ngx-datatable-cell-template>
                    <input type="text" class="form-control" (input)="inputMaxLimit($event, 5, row, 'escalatedMinutes')" [(ngModel)]="row.escalatedMinutes" placeholder="mins"/>
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
            :host ::ng-deep .datatable-body-cell {
                display: flex!important;
                align-items: center!important;
            }
            ngx-datatable ng-select {
                width: 352px;
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

export class MachineDowntimeSettingsComponent {
  @Input() settings: CreateUpdateMachineDowntimeSettingDto[] = [];
  @Input() localDowntimeReasons: LocalDowntimeReasonDto[] = [];
  @Input() roles: IdentityRoleDto[] = [];
  @Output() settingsChange = new EventEmitter<CreateUpdateMachineDowntimeSettingDto[]>();
  selectedSettings: CreateUpdateMachineDowntimeSettingDto[] = [];
  list: ListService;
  localDowntimeReasonInput$ = new Subject<string|null>();

  constructor(
    private localDowntimeReasonService: LocalDowntimeReasonService,
  ) {

  }

  ngOnInit(): void {
  this.localDowntimeReasonInput$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap(term => this.getLocalDowntimeReasons(term))
  ).subscribe(value => {
      this.localDowntimeReasons = value;
    
  });
}

  displayCheck() {
    return true;
  }

  add() {
    this.settings = [...this.settings, {
      localDownTimeReasonId: null,
      roleName: '',
      warningMinutes: 0,
      alertMinutes: 0,
      escalatedMinutes: 0
    }];
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


  getLocalDowntimeReasons(term: string | null) {
    term = term || '';
    term = term.trim();
  return this.localDowntimeReasonService.getList({
    maxResultCount: 10,
    filter: term
  }).pipe(
    map(data => data.items)
  );
}

}
