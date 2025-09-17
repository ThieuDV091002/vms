import { AccessLevelType } from '@proxy/access-level-type.enum';
import { ListService, PagedResultDto } from '@abp/ng.core';
import {
  GetIdentityUsersInput,
  IdentityRoleDto,
  IdentityRoleService,
  IdentityUserCreateDto,
  IdentityUserDto,
  IdentityUserService,
} from '@abp/ng.identity/proxy';
import { ePermissionManagementComponents } from '@abp/ng.permission-management';
import { Confirmation, eFormComponets } from '@abp/ng.theme.shared';
import {
  EXTENSIONS_IDENTIFIER,
  FormPropData,
  generateFormFromProps,
} from '@abp/ng.components/extensible';
import {
  Component,
  inject,
  Injector,
  OnInit,
  TemplateRef,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { eIdentityComponents } from '@abp/ng.identity';
import { AppUtils } from '../utils/app.utils';
import { KochidService } from 'src/app/shared/services/kochid.service';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { UserService } from '@proxy/services';
import { CreateUpdateUserModelingDto } from '@proxy/dtos/user';
import { ModelingHistoryDto } from '@proxy/dtos/modeling';
import { AreaDto } from '@apis/corporate/dtos';
import { AreaService } from '@apis/corporate';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: eIdentityComponents.Users,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class UsersComponent
  extends ModelingBase<UserService, GetIdentityUsersInput, CreateUpdateUserModelingDto>
  implements OnInit {
  protected readonly identityUserService = inject(IdentityUserService);
  private readonly fb = inject(UntypedFormBuilder);
  private readonly injector = inject(Injector);
  private readonly DEFAULT_UUID = '00000000-0000-0000-0000-000000000000';
  data: PagedResultDto<IdentityUserDto> = { items: [], totalCount: 0 };

  @ViewChild('modalContent', { static: false })
  modalContent!: TemplateRef<any>;

  form!: UntypedFormGroup;

  selected?: IdentityUserDto;

  selectedUserRoles?: IdentityRoleDto[];

  roles?: IdentityRoleDto[];

  visiblePermissions = false;

  providerKey?: string;

  isModalVisible?: boolean;

  modalBusy = false;

  permissionManagementKey = ePermissionManagementComponents.PermissionManagement;

  entityDisplayName: string;

  inputKey = eFormComponets.FormCheckboxComponent;

  isHistoryModalVisible = false;
  isImportDetailsVisible = false;
  historys: PagedResultDto<ModelingHistoryDto>;
  dataTierTreeNode: AreaDto[] = [];
  treeNodeReady = false;
  selectedUserRoleIds: Array<string> = [];
  searchItem;
  searchDataTierTreeNode: AreaDto[] = [];
  trackByFn: TrackByFunction<AbstractControl> = (index, item) => Object.keys(item)[0] || index;

  onVisiblePermissionChange = (event: boolean) => {
    this.visiblePermissions = event;
  };
  info: string;

  get roleGroups(): UntypedFormGroup[] {
    return ((this.form.get('roleNames') as UntypedFormArray)?.controls as UntypedFormGroup[]) || [];
  }
  defaultDataTier = {
    defaultDataTierType: '',
    defaultDataTierId: ''
  };
  tenantInfo: any;
  isCollapse = false;

  constructor(
    public service: UserService,
    public list: ListService<GetIdentityUsersInput>,
    private areaService: AreaService,
    private kochidService: KochidService,
    private localizationService: LocalizationService,
    private roleService: IdentityRoleService
  ) {
    super(service, list, 'user');
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit() {
    this.hookToQuery();
    this.service['export'] = true;
    this.localizationService.get('::LABEL_User').subscribe(data => {
      this.info = data
    });
  }

  searchDataTierNode(e) {
    this.searchItem = e.target.value;
    if (this.searchItem) {
      this.searchDataTierTreeNode = this.dataTierTreeNode.filter(item => {
        return item.displayName && item.displayName.toLowerCase().includes(this.searchItem.toLowerCase());
      });
    } else {
      this.searchDataTierTreeNode = [];
    }
  }

  buildForm() {
    this.selected['isKochAccount'] = this.selected?.extraProperties
      ? this.selected?.extraProperties['IsKochAccount']
      : false;

    if (!this.selected.id) this.selected.lockoutEnabled = false;
    const data = new FormPropData(this.injector, this.selected);

    this.form = generateFormFromProps(data);

    let currentUserRoles = this.configService.getDeep('currentUser.roles')||[];

    this.identityUserService.getAssignableRoles().subscribe(({ items }) => {
      let maxLevel = Math.max(
        ...items
          .filter(x => currentUserRoles.includes(x.name))
          .map(x => x.extraProperties?.AccessLevel ?? 1)
      );
      this.roles = items.filter(x=>(x.extraProperties.AccessLevel??1)<=maxLevel);
      if (this.roles) {
        this.form.addControl(
          'roleNames',
          this.fb.array(
            this.roles.map(role =>
              this.fb.group({
                [role.name as string]: [
                  this.selected?.id
                    ? !!this.selectedUserRoles?.find(userRole => userRole.id === role.id)
                    : role.isDefault,
                ],
              })
            )
          )
        );
      }
    });
  }
  rolesSelectChange(e) {
    this.selectedUserRoles = e;
  }
  openModal() {
    this.buildForm();
    this.isModalVisible = true;
  }

  add() {
    this.selected = {} as IdentityUserDto;
    this.selectedUserRoles = [] as IdentityRoleDto[];
    this.searchItem = '';
    this.selectedUserRoleIds = [];
    this.initDataTierTree(null);
    this.openModal();
  }

  initDataTierTree(userId: string) {
    this.treeNodeReady = false;
    if (this.dataTierTreeNode.length < 1) {
      this.areaService.getTreeViewList({ ids: [], tenantDataTierID: this.tenantInfo?.DataTierId, tenantDataTierType: this.tenantInfo?.DataTierType }).subscribe(res => {
        AppUtils.initTreeData(res);
        this.dataTierTreeNode = res;
        this.initUserDataTierTree(userId);
      });
    } else {
      this.initUserDataTierTree(userId);
    }
  }

  initUserDataTierTree(userId) {
    if (userId) {
      this.service.getAssignnedDataTiersByUserIdByUserId(userId).subscribe(res => {
        this.defaultDataTier = {
          defaultDataTierType: res.defaultDataTierType,
          defaultDataTierId: res.defaultDataTierId
        };
        AppUtils.initTreeDataState(this.dataTierTreeNode, res.assignedDataTiers, this.defaultDataTier);
        this.treeNodeReady = true;
      });
    } else {
      AppUtils.initTreeDataState(this.dataTierTreeNode, []);
      this.treeNodeReady = true;
    }
  }

  edit({ id, name }) {
    this.searchItem = '';
    this.identityUserService
      .get(id)
      .pipe(
        tap(user => {
          this.selected = user;
          this.initDataTierTree(user.id);
        }),
        switchMap(() => this.identityUserService.getRoles(id))
      )
      .subscribe(userRole => {
        this.selectedUserRoles = userRole.items || [];
        this.selectedUserRoleIds = userRole.items.map(x => x.id);
        this.openModal();
      });
  }

  getLocalDate(date: string) {
    return AppUtils.getLocalDate(date);
  }

  copy(e) {
    const { email, isActive, lockoutEnabled } = e.data;
    const newUser = {
      email,
      isActive,
      lockoutEnabled,
      extraProperties: {},
    } as IdentityUserCreateDto;
    // try to get user info from kochidService
    // if can get, set name/surname/username/phonenumber from existing user, else set name using email but removing email suffix
    this.kochidService.getUserInfo(email, { skipAddingHeader: true }).subscribe(data => {
      if (data?.resources?.length > 0) {
        newUser.extraProperties['isKochAccount'] = true;
        newUser.name = data?.resources[0].attributes.givenName
        newUser.password = 'Molex@2024' + email
        newUser.surname = data?.resources[0].attributes.sn
        newUser.userName = data?.resources[0].attributes.sAMAccountName
        newUser.phoneNumber = data?.resources[0].attributes.mobile ?? ""
      }
      else {
        newUser.extraProperties['isKochAccount'] = false;
        newUser.userName = e.data.email.split('@')[0];
        newUser.password = '';
        newUser.password = AppUtils.generatePassword();
      }
      // also copy role and data tier
      forkJoin({
        userWithDataTier: this.service.getUserWithDataTiersByIdByUserId(e.data.id),
        userRoles: this.identityUserService.getRoles(e.data.id)
      }).pipe(
        switchMap(results => {
          // copy roles
          const roleNames = results.userRoles.items.map(role => role.name);
          return this.service.create({ ...newUser, roleNames: roleNames, dataTiers: null }
          ).pipe(
            switchMap(newUser => this.service.fullyUpdateUserDataTierMappingsByDto({
              userId: newUser.id,
              defaultDataTierType: results.userWithDataTier.extraProperties.DefaultDataTierType,
              defaultDataTierId: results.userWithDataTier.extraProperties.DefaultDataTierId,
              assignedDataTiers: results.userWithDataTier.assignedDataTiers.map(item => ({ parent: newUser.id, dataTierName: item.dataTierName, dataTierType: item.dataTierType, dataTierId: item.dataTierId, isDefault: true }))
            }))
          )
        }
        )).subscribe(user => {
          this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
            messageLocalizationParams: [this.info, e.data.userName],
          });
          this.list.get();
          this.edit({id: user.id, name: user.userName});
        });
    })

  }

  save() {
    if (!this.form.valid || this.modalBusy) return;
    // this.modalBusy = true;
    if (!this.form.value.extraProperties) this.selected.extraProperties = {};
    this.form.value.extraProperties['IsKochAccount'] = this.selected['isKochAccount'] ?? false;
    const { roleNames = [] } = this.form.value;
    this.selectedUserRoles = this.selectedUserRoles || [];
    // Roles that the current user can operate
    const mappedRoleNames = roleNames
      .filter((role: { [key: string]: any }) => !!role[Object.keys(role)[0]])
      .map((role: { [key: string]: any }) => Object.keys(role)[0]) || [];
    // Roles that the current user cannot operate but already has
    const additionalSelectedRoles = this.selectedUserRoles.filter(role => {
      const isInFormRoles = roleNames.some(r => {
        const roleKey = Object.keys(r)[0];    
        return roleKey === role.name;
      });
      return !isInFormRoles;
    });
    // Merge both role sets together
    additionalSelectedRoles.forEach(role => {
      if (!mappedRoleNames.includes(role.name)) {
        mappedRoleNames.push(role.name);
      }
    });
    const { id } = this.selected || {};
    const dataTier = {
      userId: this.DEFAULT_UUID,
      defaultDataTierType: this.defaultDataTier.defaultDataTierType,
      defaultDataTierId: this.defaultDataTier.defaultDataTierId,
      assignedDataTiers: AppUtils.getCheckedTreeData(this.dataTierTreeNode, true).map(item => {
        return {
          parent: this.DEFAULT_UUID,
          dataTierType: item.type,
          dataTierId: item.id,
          isDefault: true,
          dataTierName: item.name
        };
      }),
    };
    (id
      ? this.service.update(id, {
        ...this.selected,
        ...this.form.value,
        roleNames: mappedRoleNames,
        dataTiers: dataTier
      })
      : this.service.create({ ...this.form.value, roleNames: mappedRoleNames, dataTiers: dataTier })
    )
      .pipe(

        finalize(() => (this.modalBusy = false))
      )
      .subscribe(() => {
        this.isModalVisible = false;
        if (!this.selected.id) {
          this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
            messageLocalizationParams: [this.info, this.form.value.userName],
          });
        }
        else {
          this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
            messageLocalizationParams: [this.info, this.selected.userName],
          });
        }
        this.list.get();
      });
  }

  delete({ id, name }) {
    this.confirmationService
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info, name],
      })
      .subscribe((status: Confirmation.Status) => {
        if (status === Confirmation.Status.confirm) {
          this.service.delete(id).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
              messageLocalizationParams: [this.info, name],
            });
            this.list.get();
          });
        }
      });
  }
  multiDelete(e) {
    const info =
      this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [e.objectType + '<br/>', e.userNames.join(',<br/>')],
      }).subscribe((status) => {
        if (status === Confirmation.Status.confirm) {
          this.service['multipleDeleteByIds'](e.objectIds).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
              messageLocalizationParams: [e.objectType, e.userNames],
            });
            this.list.get()
          });
        }
      });
  }
  sort(data: any) {
    const { prop, dir } = data.sorts[0];
    this.list.sortKey = prop;
    this.list.sortOrder = dir;
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => {
        return this.service.getUserList(query);
      })
      .subscribe(res => (this.data = res));
  }

  openPermissionsModal(providerKey: string, entityDisplayName?: string) {
    this.providerKey = providerKey;
    this.entityDisplayName = entityDisplayName;
    setTimeout(() => {
      this.visiblePermissions = true;
    }, 0);
  }
  showPassword(password, passwordButtonLabel) {
    if (password) {
      password.type = password.type == 'password' ? 'text' : 'password';
      passwordButtonLabel.className = password.type == 'password' ? 'fa fa-eye-slash' : 'fa fa-eye';
    }
  }
  getUserInfo(event) {
    this.kochidService
      .getUserInfo(this.form.value.email, { skipAddingHeader: true })
      .subscribe(data => {
        if (data?.resources?.length > 0) {
          this.selected['isKochAccount'] = true;
          this.form.value.name = data?.resources[0].attributes.givenName;
          this.form.value.password = 'Molex@2024' + this.form.value.email;
          this.form.value.surname = data?.resources[0].attributes.sn;
          this.form.value.userName = data?.resources[0].attributes.sAMAccountName;
          this.form.value.phoneNumber = data?.resources[0].attributes.mobile ?? '';
          this.form.setValue({ ...this.form.value });
        } else {
          this.selected['isKochAccount'] = false;
          this.form.value.name = '';
          this.form.value.password = '';
          this.form.value.surname = '';
          this.form.value.userName = '';
          this.form.value.phoneNumber = '';  
          this.form.setValue({ ...this.form.value });
        }
      });
  }

  defaultDataTierChange(event) {
    this.defaultDataTier = event;
  }

  onPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const filtered = input.value.replace(/[^\d +]/g, '');
  this.form.controls['phoneNumber'].setValue(filtered, { emitEvent: false });
}
}
