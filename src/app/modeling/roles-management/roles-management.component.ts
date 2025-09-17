import {
  EXTENSIONS_IDENTIFIER,
} from '@abp/ng.components/extensible';
import { ListService, PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { eIdentityComponents } from '@abp/ng.identity';
import { GetIdentityRolesInput, IdentityRoleDto, IdentityRoleService } from '@abp/ng.identity/proxy';
import { Confirmation } from '@abp/ng.theme.shared';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ePermissionManagementComponents } from '@abp/ng.permission-management';
import { finalize } from 'rxjs';
import { AppUtils } from '../utils/app.utils';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { PermissionsService, RoleService } from '@proxy/services';
import { ExportRoleModelingDto } from '@proxy/dtos/role';
import { UserMenuService } from '@proxy/user-menus';
import { UserMenuDto } from '@proxy/user-menus/dtos';
import { ModelingHistoryDto } from '@proxy/dtos/modeling';
import { AccessLevelType, accessLevelTypeOptions } from '@proxy/access-level-type.enum';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'roles-management',
  templateUrl: './roles-management.component.html',
  styleUrl: './roles-management.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: eIdentityComponents.Roles,
    },
  ],
})
export class RolesManagementComponent extends ModelingBase<RoleService, GetIdentityRolesInput, ExportRoleModelingDto> implements OnInit {
  protected readonly menuService = inject(UserMenuService);
  protected readonly identityRoleService = inject(IdentityRoleService);
  private fb: FormBuilder = inject(FormBuilder);
  private readonly DEFAULT_UUID = '00000000-0000-0000-0000-000000000000';
  data: PagedResultDto<IdentityRoleDto> = { items: [], totalCount: 0 };

  form!: UntypedFormGroup;

  selected?: IdentityRoleDto;

  isModalVisible!: boolean;

  visiblePermissions = false;

  providerKey?: string;
  modalBusy = false;
  menus: UserMenuDto[] = [];
  accessLevelTypeOptions = accessLevelTypeOptions.map(opt => ({
    ...opt,
    key: `Level ${opt.value} :`,
    localizationKey: `::LABEL_${opt.key}`,
    originalKey: opt.key
  }));

  AccessLevelType: AccessLevelType;
  permissionManagementKey = ePermissionManagementComponents.PermissionManagement;

  isHistoryModalVisible = false;
  historys: PagedResultDto<ModelingHistoryDto>;
  info: string;
  copyRoleName: string;

  constructor(
    public service: RoleService,
    public list: ListService<PagedAndSortedResultRequestDto>,
    private localizationService: LocalizationService,
    private permissionsService: PermissionsService
  ) {
    super(service, list, 'role');
  }

  onVisiblePermissionChange = (event: boolean) => {
    this.visiblePermissions = event;
    if (!event) {
      //this.toasterService.success("AbpSettingManagement::SuccessfullySaved")
    }
  };

  ngOnInit() {
    this.hookToQuery();
    this.localizationService.get('::LABEL_Role').subscribe(data => {
      this.info = data
    });
  }

  getMenus() {
    this.menuService.getList({ skipCount: 0, maxResultCount: 1000 }, { skipHandleError: true }).subscribe(data => {
      this.menus = data.items;
      if(this.data.items.length > 0) {
        this.data.items.forEach(item => {
          item['menu'] =this.localizationService.instant( this.menus.find(menu => menu.id === item.extraProperties?.MenuId)?.displayName || "");
        });
      }
    });
  }

  buildForm() {
    // Retrieve existing access levels
    const currentAccessLevel = this.selected?.extraProperties?.AccessLevel
    ? Number(this.selected.extraProperties.AccessLevel)
    : AccessLevelType.GeneralUser;

    this.form = this.fb.group({
      name: [this.selected?.name || '', Validators.required],
      isDefault: [this.selected?.isDefault || false],
      isPublic: [this.selected?.isPublic || false],
      menuId: [this.selected?.extraProperties?.MenuId || this.DEFAULT_UUID],
      accessLevel: [currentAccessLevel],
    });
    // const data = new FormPropData(this.injector, this.selected);
    // this.form = generateFormFromProps(data);
    // this.form['extraProperties?.MenuId']
  }

  openModal() {
    if (this.menus.length === 0) {
      this.getMenus();
    }
    this.buildForm();
    this.isModalVisible = true;
  }

  add() {
    this.selected = {} as IdentityRoleDto;
    this.openModal();
  }

  edit(row: any) {
    this.identityRoleService.get(row.id).subscribe(res => {
      this.selected = res;
      this.selected['menuId'] = this.selected.extraProperties?.MenuId;
      this.openModal();
    });
  }

  getLocalDate(date: string) {
    return AppUtils.getLocalDate(date);
  }

    onRoleNameChange(newRoleName: string) {
      this.copyRoleName = newRoleName;
  }

  copy(e) {
    this.permissionsService.get("R", this.copyRoleName).subscribe(res => {
      const permissions = res.groups.flatMap(group =>
        group.permissions
          .filter(permission => permission.isGranted)
          .map(permission => ({
            name: permission.name,
            isGranted: permission.isGranted
          }))
      );
      this.service.create(
        {
          name: e.data.name,
          isPublic: e.data.isPublic,
          isDefault: e.data.isDefault,
          extraProperties: {
            MenuId: e.data.extraProperties.MenuId,
            Permissions: permissions
          }
        }
      ).subscribe(role => {
        this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
          messageLocalizationParams: [this.info, e.data.name],
        });
        this.list.get();
        this.edit(role);
      });
    });
  }

  save() {
    if (!this.form.valid) return;
    this.modalBusy = true;

    const accessLevel = this.form.value.accessLevel;

    this.form.value['extraProperties'] = {
      ...(this.selected?.extraProperties || {}),
      MenuId: this.form.value['menuId'],
      AccessLevel: accessLevel,
    };

    const { id } = this.selected || {};
    (id
      ? this.identityRoleService.update(id, { ...this.selected, ...this.form.value })
      : this.identityRoleService.create(this.form.value)
    )
      .pipe(finalize(() => (this.modalBusy = false)))
      .subscribe(() => {
        this.isModalVisible = false;
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
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.info, name],
          });
          this.service.delete(id).subscribe(() => this.list.get());
        }
      });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => {
        return this.service.getList(query);
      })
      .subscribe(res =>{

        res.items.forEach(item => {
          item.extraProperties = item.extraProperties || {};
          if(this.menus.length === 0) {
            this.getMenus();
          }
          else{
            item['menu'] =this.localizationService.instant( this.menus.find(menu => menu.id === item.extraProperties.MenuId)?.displayName || "");
          }
          var accessLevel =this.accessLevelTypeOptions.find(opt => opt.value === item.extraProperties.AccessLevel)??this.accessLevelTypeOptions[0];
          item['accessLevel'] =accessLevel.key + this.localizationService.instant( accessLevel?.localizationKey) ;
        });
        this.data = res;
      }
        );
  }

  sort(data: any) {
    const { prop, dir } = data.sorts[0];
    this.list.sortKey = prop;
    this.list.sortOrder = dir;
  }
}
