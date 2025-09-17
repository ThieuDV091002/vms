import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContentTemplateDto } from '@apis/notification/dtos/content-templates';
import { ExportNotificationDetailDto, NotificationDetailDto } from '@apis/notification/dtos/notification-settings';
import { ContentTemplateService } from '@apis/notification';
import { UserService } from '@proxy/services';
import { UserGroupService } from '@proxy';
import { UserGroupDto } from '@proxy/dtos/user-group';
import { IdentityUserDto } from '@abp/ng.identity/proxy';
import { ToasterService } from '@abp/ng.theme.shared';

@Component({
  selector: 'app-notification-settings-details',
  template: `
    <ngx-datatable
      [rows]="currentNotificationSettingDetails"
      [count]="currentNotificationSettingDetails?.length"
      [limit]="'5'"
      [selectionType]="'checkbox'"
      [selected]="selectedNotificationSettingDetails"
      (select)="onSelect($event)"
      [scrollbarV]="false"
      [scrollbarH]="false"
      default>
      <ngx-datatable-column
        [checkboxable]="true"
        [headerCheckboxable]="currentNotificationSettingDetails?.length"
        [width]="25"
        [sortable]="false"
        [canAutoResize]="false">
      </ngx-datatable-column>
      <ngx-datatable-column
        [name]="('::LABEL_Mode' | abpLocalization) + ' *'"
        [sortable]="false">
        <ng-template let-row="row" ngx-datatable-cell-template>
          <ng-select
            [items]="['Email', 'In-App']"
            appendTo="body"
            bindValue="name"
            bindLabel="name"
            [(ngModel)]="row.mode"
            [clearable]="!!row.mode">
          </ng-select>
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column
        [name]="('::LABEL_ContentTemplate' | abpLocalization) + ' *'"
        [sortable]="false">
        <ng-template let-row="row" ngx-datatable-cell-template>
          <ng-select
            [items]="showContentTemplateList"
            appendTo="body"
            bindValue="id"
            bindLabel="displayName"
            [(ngModel)]="row.contentTemplate"
            (search)="filterContentTemplate($event)"
            [clearable]="!!row.contentTemplate">
          </ng-select>
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column
        [name]="('::LABEL_RecipientType' | abpLocalization)"
        [sortable]="false">
        <ng-template let-row="row" ngx-datatable-cell-template>
          <ng-select #select
            [appendTo]="'body'"
            [searchable]="false"
            [items]="recipientTypeList"
            [multiple]="true"
            [closeOnSelect]="false"
            [hideSelected]="true"
            bindLabel="name"
            bindValue="name"
            [(ngModel)]="row.recipientTypes">
            <ng-template ng-header-tmp>
              <input
                class="form-control multiple-select-search"
                type="search"
                (input)="select.filter($event.target.value)"/>
            </ng-template>
          </ng-select>
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column
        [name]="('::LABEL_RecipientUser' | abpLocalization)"
        [sortable]="false">
        <ng-template let-row="row" ngx-datatable-cell-template>
          <ng-select #select
            [appendTo]="'body'"
            [searchable]="false"
            [items]="showUserList"
            [multiple]="true"
            [closeOnSelect]="false"
            [hideSelected]="true"
            bindLabel="name"
            bindValue="name"
            [(ngModel)]="row.recipientUsers"
            (change)="onUserChanges($event)">
            <ng-template ng-header-tmp>
              <input
                class="form-control multiple-select-search"
                type="search"
                (input)="searchUser($event.target.value)"/>
            </ng-template>
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
        [name]="('::LABEL_RecipientUserGroup' | abpLocalization)"
        [sortable]="false">
        <ng-template let-row="row" ngx-datatable-cell-template>
          <ng-select #select
            [appendTo]="'body'"
            [searchable]="false"
            [items]="showUserGroupList"
            [multiple]="true"
            [closeOnSelect]="false"
            [hideSelected]="true"
            bindLabel="displayName"
            bindValue="name"
            [(ngModel)]="row.recipientUserGroups"
            (change)="onUserGroupChanges($event)">
            <ng-template ng-header-tmp>
              <input
                class="form-control multiple-select-search"
                type="search"
                (input)="searchUserGroup($event.target.value)"/>
            </ng-template>
          </ng-select>
        </ng-template>
      </ngx-datatable-column>
    </ngx-datatable>
    <div class="mt-2">
      <button type="button" class="btn btn-primary btn-sm me-2" (click)="addDetails()">
        <i class="fas fa-plus me-1"></i>
        {{'::Create' | abpLocalization}}
      </button>
      <button type="button" class="btn btn-danger btn-sm me-2" (click)="addSelectDetails()" [disabled]="selectedNotificationSettingDetails?.length === 0">
        <i class="fas fa-trash me-1"></i>
        {{'::Delete' | abpLocalization}}
      </button>
      <button type="button" class="btn btn-primary btn-sm me-2" (click)="save()" [disabled]="currentNotificationSettingDetails?.length === 0">
        <i class="fa fa-check me-1"></i>
        {{'::Save' | abpLocalization}}
      </button>
    </div>
  `,
  styles: [`
    .multiple-select-search {
      width: 100%;
      padding: 0.125rem 0.625rem;
    }

    ::ng-deep .my-tooltip-class {
        z-index: 99999999999 !important;
        max-width: none;
        white-space: nowrap;
    }
  `]
})

export class NotificationSettingDetailsComponent implements OnInit {
  @Input() currentNotificationSettingDetails: ExportNotificationDetailDto[] = [];
  @Input() saveUserList: IdentityUserDto[] = [];
  @Input() saveUserGroupList: UserGroupDto[] = [];
  @Input() initContentTemplateList: ContentTemplateDto[]= [];
  @Input() initUserList: IdentityUserDto[]= [];
  @Input() initUserGroupList: UserGroupDto[]= [];
  @Output() saveChange = new EventEmitter<NotificationDetailDto[]>();
  selectedNotificationSettingDetails: ExportNotificationDetailDto[]= [];
  showContentTemplateList: ContentTemplateDto[]= [];
  showUserList: IdentityUserDto[]= [];
  showUserGroupList: UserGroupDto[]= [];
  recipientTypeList = ['Record Creator', 'Record Executor', 'API Define List']

  constructor(
    private contentTemplateSerice : ContentTemplateService,
    private userService: UserService,
    private userGroupService: UserGroupService,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    this.showContentTemplateList = this.initContentTemplateList;
    this.showUserGroupList = this.initUserGroupList;
    this.showUserList = this.initUserList;
    console.log('Initial notification saveUserList:', this.saveUserList);
  }

  filterContentTemplate(event) {
    if(event.term) {
      this.contentTemplateSerice.getList({maxResultCount: 10, filter: event.term}).subscribe(data => {
        this.showContentTemplateList = data.items;
      });
    } else {
      this.showContentTemplateList = this.initContentTemplateList;
    }
  }

  addDetails() {
    this.currentNotificationSettingDetails = [...this.currentNotificationSettingDetails, {
      mode: '',
      contentTemplateId: '',
      recipientTypes: [],
      recipientUserGroups: [],
      recipientUsers: [],
    } as ExportNotificationDetailDto ];
  }

  onSelect({ selected }) {
    if (selected && Array.isArray(selected)) {
      this.selectedNotificationSettingDetails = selected;
    }
  }

  addSelectDetails() {
    this.currentNotificationSettingDetails = this.currentNotificationSettingDetails.filter(x => !this.selectedNotificationSettingDetails.includes(x));
    this.selectedNotificationSettingDetails = [];
  }

  searchUser(term: string) {
    if(term) {
      this.userService.getUserList({maxResultCount: 10, filter: term}).subscribe(data => {
        this.showUserList = data.items;
      });
    } else {
      this.showUserList = this.initUserList;
    }
  }

  searchUserGroup(term: string) {
    if(term) {
      this.userGroupService.getList({maxResultCount: 10, ids: [], filter: term}).subscribe(data => {
        this.showUserGroupList = data.items;
      });
    } else {
      this.showUserGroupList = this.initUserGroupList;
    }
  }

  save() {
    const invalidDetails = this.currentNotificationSettingDetails.filter(x => !x.mode || !x.contentTemplate);
    if (invalidDetails.length > 0) {
      this.toasterService.error('Mode and Content Template are required fields.');
      return;
    }

    console.log('Saving notification details...');
    console.log('Current notification setting details:', this.currentNotificationSettingDetails);

    const details = this.currentNotificationSettingDetails.map(x => {
      const detail = { } as NotificationDetailDto;
      detail.mode = x.mode;
      detail.contentTemplateId = x.contentTemplate;
      detail.recipientTypes = x.recipientTypes.map(y => {
        return { recipientTypeValue: y };
      });
      detail.recipientUsers = x.recipientUsers.map(userName => {
        return { userId: this.getUserId(userName), userName: userName };
      });
      detail.recipientUserGroups = x.recipientUserGroups.map(groupName => {
        return { userGroupId: this.getGroupId(groupName), userGroupName: groupName };
      });
      return detail;
    });
    this.saveChange.emit(details);
    console.log('Notification details saved:', details);
    this.toasterService.success('::LABEL_DetailSuccessfullySaved');
  }

  getUserId(userName: string): string {
    const user = this.saveUserList.find(user => user.name === userName || user.userName === userName);
    return user ? user.id : null;
  }

  getGroupId(groupName: string): string {
    const group = this.saveUserGroupList.find(group => group.name === groupName);
    return group ? group.id : null;
  }

  onUserChanges(selectedUsers: IdentityUserDto[]) {
    this.saveUserList = [...this.saveUserList, ...selectedUsers.filter(user => !this.saveUserList.some(u => u.id === user.id))];
    this.showUserList = this.initUserList;
  }

  onUserGroupChanges(selectedGroups: UserGroupDto[]) {
    this.saveUserGroupList = [...this.saveUserGroupList, ...selectedGroups.filter(group => !this.saveUserGroupList.some(g => g.id === group.id))];
    this.showUserGroupList = this.initUserGroupList;
  }
}
