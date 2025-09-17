import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { AssessmentTeamDto } from '@apis/ticket/dtos';
import { IdentityUserDto, IdentityUserService } from '@abp/ng.identity/proxy';
import { UserGroupDto } from '@proxy/dtos/user-group';
import { UserService } from '@proxy/services';
import { UserGroupService } from '@proxy';
import { debounceTime, forkJoin, Subject } from 'rxjs';

@Component({
  selector: 'app-assessment-scheduling-rule-teams',
  template: `
    <div class="teams-header d-flex justify-content-between align-items-center mb-1">
      <label class="form-label" style="color: var(--lpx-brand)">{{'::MENU_AssessmentTeam'|abpLocalization}}</label>
      <div>
        <button type="button" class="btn btn-primary btn-sm" (click)="addTeam()">
          <i class="fas fa-plus me-1"></i>
          {{'::Create' | abpLocalization}}
        </button>
        <button type="button" class="btn btn-danger btn-sm mx-2" (click)="deleteSelectedTeams()" [disabled]="selectedTeams?.length === 0">
          <i class="fas fa-trash me-1"></i>
          {{'::Delete' | abpLocalization}}
        </button>
      </div>
    </div>
    <div class="teams-body">
      <ngx-datatable
        [rows]="teams"
        [count]="teams?.length"
        [limit]="'5'"
        [displayCheck]="displayCheck"
        [selectionType]="'checkbox'"
        [selected]="selectedTeams"
        (select)="onSelect($event)"
        [scrollbarV]="false"
        [scrollbarH]="false"
        default>
        <ngx-datatable-column
          name=""
          [checkboxable]="true"
          [headerCheckboxable]="teams?.length"
          [width]="25"
          [sortable]="false"
          [canAutoResize]="false"
          >
        </ngx-datatable-column>
        <ngx-datatable-column
          [name]="('::LABEL_Owner' | abpLocalization) + ' *'"
          [sortable]="false"
          >
          <ng-template let-row="row" ngx-datatable-cell-template>
            <ng-select
              [items]="userList"
              appendTo="body"
              bindValue="id"
              bindLabel="name"
              [(ngModel)]="row.owner"
              (ngModelChange)="onTeamChange()"
              [typeahead]="userSearchInput$"
              [clearable]="!!row.owner">
               <ng-template ng-option-tmp let-item="item">
                <ng-template #tipContent>{{ item.email }}</ng-template>
                  <span [ngbTooltip]="tipContent" placement="right" container="body" tooltipClass="my-tooltip-class">
                  {{ item.name }}
                </span>
              </ng-template>
            </ng-select>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column
          [name]="('::LABEL_UserGroup' | abpLocalization)"
          [sortable]="false" >
          <ng-template let-row="row" ngx-datatable-cell-template>
            <ng-select
              [items]="userGroupList"
              appendTo="body"
              bindValue="id"
              bindLabel="displayName"
              [(ngModel)]="row.userGroup"
              (ngModelChange)="onUserGroupChange(row)"
              [clearable]="row.userGroup !== EMPTY_USER_GROUP">
                <ng-template ng-option-tmp let-item="item">
                  <div 
                    [ngbTooltip]="item.displayName" 
                    placement="right" 
                    container="body" 
                    tooltipClass="user-group-tooltip-class"
                    class="option-container">
                    {{ item.displayName }}
                  </div>
                </ng-template>
            </ng-select>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column
          [name]="('::LABEL_MaxAssessmentPerDay' | abpLocalization)"
          [sortable]="false">
          <ng-template let-row="row" ngx-datatable-cell-template>
          <div class="input-group">
            <input
              class="form-control"
              [(ngModel)]="row.maxAssessmentPerDay"
              (ngModelChange)="onTeamChange()"
              min="1"
              appInputNumber>
          </div>
          </ng-template>
        </ngx-datatable-column>
      </ngx-datatable>
    </div>
  `,
  styles: [`
    :host {
      position: relative;
    }
    ngx-datatable ng-select {
      line-height: 1.3rem;
    }
    .action-bar {
      display: inline-block;
      float: right;
    }
    @media (max-width: 992px) {
      .action-bar {
        display: flex;
        justify-content: flex-end;
        float: none;
      }
    }
    .input-group .btn {
      height: 100%;
      padding: 0;
      margin: 0;
      line-height: 1;
    }
    ::ng-deep .my-tooltip-class {
      z-index: 99999999999 !important;
      max-width: none; 
      white-space: nowrap;
    }
    
    ::ng-deep .user-group-tooltip-class {
      z-index: 99999999999 !important;
      max-width: 25vw !important;
      width: auto !important;
      word-wrap: break-word !important;
      white-space: normal !important;
      text-align: left !important;
    }

    ::ng-deep .user-group-tooltip-class .tooltip-inner {
      max-width: 25vw !important;
      width: auto !important;
      word-wrap: break-word !important;
      white-space: normal !important;
      text-align: left !important;
      padding: 8px 12px !important;
    }

    ::ng-deep .option-container {
      width: 100%;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class AssessmentTeamsComponent implements OnInit, OnChanges {
  formatUserName(user: IdentityUserDto): string {
    return `${user.surname}, ${user.name}`;
  }

  @Input() teams: AssessmentTeamDto[] = [];
  @Output() teamsChange = new EventEmitter<AssessmentTeamDto[]>();
  userList: IdentityUserDto[] = [];
  filteredUserList: IdentityUserDto[] = [];
  userGroupList: UserGroupDto[] = [];
  selectedTeams: AssessmentTeamDto[] = [];
  EMPTY_USER_GROUP = '00000000-0000-0000-0000-000000000000';
  userSearchInput$ = new Subject<string | null>();
  debounceTime = 500;
  

  constructor(private userService: UserService,
    private userGroupService: UserGroupService,
    private identityUserService: IdentityUserService,
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.teams && changes.teams.currentValue) {
      this.teams.forEach(team => {
        const selectedGroup = this.userGroupList.find(group => group.id === team.userGroup);
        team.userGroupName = selectedGroup ? selectedGroup.name : '';
        if (!this.userList.some(user => user.id === team.owner) && team.owner) {
          this.identityUserService.get(team.owner).subscribe(user => {
            this.userList = [user, ...this.userList];
          });
        }
      });
      this.teamsChange.emit(this.teams);
    }
  }

  ngOnInit(): void {
    this.getUsers();
    this.getUserGroups();
    this.registSearchDebounce();
  }

  getUsers(userSearchItem = ''): void {
    this.userService.getUserList({ filter: userSearchItem, maxResultCount: 10 }).subscribe((res) => {
      this.userList = res.items;
      const filteredUsers = this.userList.filter(user => !res.items.some(item => item.id === user.id));
      this.userList = [...res.items, ...filteredUsers];
    });
  }

  registSearchDebounce() {
    // user input search input debounce
    this.userSearchInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.getUsers(searchItem);
      })
  }

  getUserGroups() {
    this.userGroupService.getAllInstances().subscribe(res => {
      this.userGroupList = res;
    });
  }

  filterUsers(searchTerm: string) {
    if (!searchTerm) {
      this.filteredUserList = this.userList.slice(0, 200);
    } else {
      this.filteredUserList = this.userList.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 200);
    }
  }

  displayCheck() {
    return true;
  }

  addTeam() {
    this.teams = [...this.teams, {
      owner: '',
      userGroup: this.EMPTY_USER_GROUP,
      userGroupName: 'string',
      maxAssessmentPerDay: 1
    } as AssessmentTeamDto];
    this.teamsChange.emit(this.teams);
  }

  onSelect({ selected }) {
    if (selected && Array.isArray(selected)) {
      this.selectedTeams = selected;
    }
  }

  deleteSelectedTeams() {
    this.teams = this.teams.filter(x => !this.selectedTeams.includes(x));
    this.teamsChange.emit(this.teams);
    this.selectedTeams = [];
  }

  onTeamChange() {
    this.teamsChange.emit(this.teams);
  }

  onUserGroupChange(row: AssessmentTeamDto) {
    const selectedGroup = this.userGroupList.find(group => group.id === row.userGroup);
    if (selectedGroup) {
      row.userGroupName = selectedGroup.name;
    } else {
      row.userGroup = '00000000-0000-0000-0000-000000000000';
      row.userGroupName = 'string';
    }
    this.teamsChange.emit(this.teams);
  }

  increment(row: AssessmentTeamDto) {
    if (row.maxAssessmentPerDay < Infinity) {
      row.maxAssessmentPerDay++;
      this.onTeamChange();
    }
  }

  decrement(row: AssessmentTeamDto) {
    if (row.maxAssessmentPerDay > 1) {
      row.maxAssessmentPerDay--;
      this.onTeamChange();
    }
  }
}
