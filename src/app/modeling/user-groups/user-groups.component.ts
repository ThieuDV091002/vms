import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, PagedResultDto, SessionStateService } from '@abp/ng.core';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { UserGroupService } from '@proxy';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { IdentityUserDto, IdentityUserService } from '@abp/ng.identity/proxy';
import { UserService } from '@proxy/services';
import { LocalizationService } from '@abp/ng.core';
import { CreateUpdateUserGroupDto, UserGroupDto, UserGroupGetListInput, UserGroupUsersDto } from '@proxy/dtos/user-group';
import { debounceTime, Subject } from 'rxjs';
import { AppUtils } from '../utils/app.utils';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrl: './user-groups.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'UserGroupsComponent',
    },
  ],
})

export class UserGroupsComponent extends ModelingBase<UserGroupService, UserGroupGetListInput, CreateUpdateUserGroupDto> implements OnInit {
  displayName: string = 'UserGroup';
  selectUsers: Array<{ userId: string; email: string; name: string }> = [];
  selected: UserGroupDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<UserGroupDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  userOptions = [] as IdentityUserDto[];
  isAddUserModalVisible = false;
  selectedUser: IdentityUserDto;
  @ViewChild('datatable') datatable: any;
  users: Array<IdentityUserDto> = [];

  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::DisplayName', field: 'displayName' },
  ];
  info: string;
  infos: string;
  userSearchInput$ = new Subject<string | null>();
  debounceTime = 500;

  constructor(
    public list: ListService<UserGroupGetListInput>,
    public service: UserGroupService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private session: SessionStateService,
    public userService: UserService,
    private cd: ChangeDetectorRef,
    private localizationService: LocalizationService,
    private identityUserService: IdentityUserService,

  ) {
    super(service, list, 'user-group');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.registSearchDebounce();
    this.localizationService.get('::LABEL_UserGroup').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::MENU_UserGroup').subscribe(data => {
      this.infos = data
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

  getUsers(userSearchItem = ''): void {
    this.identityUserService.getList({ filter: userSearchItem, maxResultCount: 10 }).subscribe((res) => {
      this.users = res.items;
    });
  }

  getUserDisplayName(user: any) {
    return AppUtils.getUserDisplayName(user);
  }

  private hookToQuery() {
    this.list.hookToQuery(query => this.service.getList(query)).subscribe(res => {
      this.data = res;
    });
  }

  // private loadUserOptions() {
  //   this.userService.getAllInstances().subscribe((res) => {
  //     this.userOptions = res;
  //     this.filteredUserOptions = res.slice(0, 100); // 默认显示前100个用户
  //   });
  // }

  add() {
    this.getUsers();
    this.selected = {} as UserGroupDto;
    this.selectUsers = [];
    this.buildForm();
    this.isModalVisible = true;
  }

  edit(row: UserGroupDto) {
    this.service.get(row.id).subscribe((data) => {
      this.selected = data;

      if (!this.selected.users) {
        this.selectUsers = [];
      } else {
        this.selectUsers = this.selected.users.map(selectedUser => {
          if (!this.users.find(u => u.id === selectedUser.userId)) {
            this.identityUserService.get(selectedUser.userId).subscribe(user => {
              this.users = [...this.users, user];
            })
          }
          return {
            userId: selectedUser.userId,
            name: selectedUser.userName,
            email: selectedUser.userEmail
          }
        });
      }
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected?.name || '', Validators.required],
      description: [this.selected?.description || ''],
      displayName: [this.selected?.displayName || '', Validators.required],
      tenantId: [this.selected?.tenantId || ''],
      users: [this.selected?.users || []]
    });

    this.selectUsers.forEach((user) => {
      this.form.addControl(user.userId, this.fb.control(user.userId));
    });
  }

  delete(row: UserGroupDto) {
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.info, row.name],
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.service.delete(row.id).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.info, row.name],
          });
          this.list.get();
        });
      }
    });
  }

  sort(data: any) {
    const { prop, dir } = data.sorts[0];
    this.list.sortKey = prop;
    this.list.sortOrder = dir;
  }

  search(e) {
    this.list.filter = e.target.value;
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const filteredUsers = this.selectUsers.filter(user => user.userId);

    this.selected.users = filteredUsers.map(user => ({
      userId: user.userId,
      name: user.name
    }));

    this.form.value.users = this.selected.users;

    const request = this.selected.id
      ? this.service.update(this.selected.id, this.form.value)
      : this.service.create(this.form.value);

    request.subscribe(() => {
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.form.value.name],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.form.reset();
      this.list.get();
    });
  }

  addUserRow() {
    this.selectUsers = [
      ...this.selectUsers,
      { userId: '', name: '', email: '' }
    ];
  }

  selectUser(e, row) {
    const isDuplicate = this.selectUsers.some(item => item.userId === e && item !== row);
    if (isDuplicate) {
      setTimeout(() => {
        this.selectUsers = this.selectUsers.map(item => {
          if (item === row) {
            item.userId = '';
            item.name = '';
            item.email = '';
          }
          return item;
        });
      }, 0); 
      this.toasterService.error('::UserAlreadySelected');
    } else {
      this.selectUsers = this.selectUsers.map(user => {
        if (user.userId === row.userId) {
          return {
            userId: e,
            name: this.users.find(option => option.id === e)?.name || '',
            email: this.users.find(option => option.id === e)?.email || ''
          };
        } else {
          return user;
        }
      });
    }
  }

  deleteUser(row: UserGroupUsersDto) {
    this.selectUsers = this.selectUsers.filter(user => user.userId !== row.userId);
  }

  multiDelete(e) {
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.infos + '<br/>', e.objectNames.join(',<br/>')],
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.service['multipleDeleteByIds'](e.objectIds).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.infos, e.objectNames],
          });
          this.list.get()
        });
      }
    });
  }
}
