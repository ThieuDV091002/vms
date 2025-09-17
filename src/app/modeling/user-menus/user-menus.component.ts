import { ListService, PagedResultDto, SessionStateService } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ePermissionManagementComponents } from '@abp/ng.permission-management';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { concatMap } from 'rxjs';
import { Router } from '@angular/router';
import { AppUtils } from '../utils/app.utils';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { UserMenuService } from '@proxy/user-menus';
import { CreateUpdateUserMenuDto, GetUserMenuInput, UserMenuDto } from '@proxy/user-menus/dtos';
import { ExportUserMenuDto } from '@proxy/dtos';
import { ModelingHistoryDto } from '@proxy/dtos/modeling';
import { LanguagesService, MenuType } from '@proxy';
import { LanguagesDto } from '@proxy/dtos/language';

@Component({
  selector: 'app-user-menus',
  templateUrl: './user-menus.component.html',
  styleUrl: './user-menus.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "UserMenusComponent",
    },
  ],
})
export class UserMenusComponent extends ModelingBase<UserMenuService, GetUserMenuInput, ExportUserMenuDto> implements OnInit {

  selected: UserMenuDto;
  menuItemSelected: UserMenuDto;
  form: FormGroup
  menuItemForm: FormGroup
  data: PagedResultDto<UserMenuDto> = { items: [], totalCount: 0 };
  allMenuData: UserMenuDto[] = [];
  isModalVisible?: boolean;
  isAddModalVisible?: boolean;
  isImportDetailsVisible = false;
  modalBusy = false;
  providerKey?: string;
  visiblePermissions = false;
  routes: Array<string> = []
  permissionManagementKey = ePermissionManagementComponents.PermissionManagement;
  isHistoryModalVisible = false;
  historys: PagedResultDto<ModelingHistoryDto>;
  onVisiblePermissionChange = (event: boolean) => {
    this.visiblePermissions = event;
  };
  info: string;
  displayOptions: any[] = [];
  isDisplayNameModalVisible: boolean = false;
  isMenuItemDisplayNameModalVisible: boolean = false;
  labels = []
  allLabels = []
  selectedValue: any;
  menuItemSelectedValue: any;
  constructor(
    public service: UserMenuService,
    public list: ListService<GetUserMenuInput>,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private router: Router,
    private session: SessionStateService,
    private localizationService: LocalizationService,
    private languagesService: LanguagesService) {
    super(service, list, 'user-menu');
  }
  ngOnInit() {
    this.service.getAllInstances().subscribe((res) => {
      this.allMenuData = res;
    });
    this.hookToQuery();
    this.loadLanguageData();
    this.getRoutes();
    this.localizationService.get('::LABEL_UserMenu').subscribe(data => {
      this.info = data
    });
    this.initValues();
  }

  buildForm() {
    this.form = this.fb.group({
      path: [this.selected.path || '', ''],
      name: [this.selected.name || '', Validators.required],
      requiredPolicy: [this.selected.requiredPolicy || ''],
      order: [this.selected.order || 0, ''],
      iconClass: [this.selected.iconClass || ''],
      layout: [this.selected.layout || ''],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      tenantId: [this.selected.tenantId || ''],
      menuType: [this.selected.menuType || MenuType.Menu],
      subMenuId: [this.selected.subMenuId || null],
      children: [this.selected.children || []]
    });
  }
  buildMenuItemForm() {
    this.menuItemForm = this.fb.group({
      path: [this.menuItemSelected.path || '', this.menuItemSelected.menuType == MenuType.SubMenu ? null : Validators.required],
      name: [this.menuItemSelected.name || '', Validators.required],
      displayName: [this.menuItemSelected.displayName || '', Validators.required],
      requiredPolicy: [this.menuItemSelected.requiredPolicy || ''],
      order: [this.menuItemSelected.order || 0, Validators.required],
      parentId: [this.menuItemSelected.parentId || 0, Validators.required],
      iconClass: [this.menuItemSelected.iconClass || ''],
      layout: [this.menuItemSelected.layout || ''],
      description: [this.menuItemSelected.description || ''],
      tenantId: [this.menuItemSelected.tenantId || ''],
      menuType: [this.menuItemSelected.menuType || MenuType.MenuItem],
      subMenuId: [this.menuItemSelected.subMenuId || null, this.menuItemSelected.menuType == MenuType.MenuItem ? null : Validators.required],
      children: [this.menuItemSelected.children || []]
    });
  }
  add() {
    this.selected = {} as UserMenuDto;
    this.selected.menuType = MenuType.Menu;
    this.selected.children = [];
    this.selectedValue = '';
    this.buildForm();
    this.isModalVisible = true;
  }

  addSubMenu(id: string) {
    this.menuItemSelected = {} as UserMenuDto;
    this.menuItemSelected.menuType = MenuType.SubMenu;
    this.menuItemSelected.parentId = this.selected.id;
    this.menuItemSelectedValue = '';
    this.buildMenuItemForm();
    this.isAddModalVisible = true;
  }
  addMenuItem(id: string) {
    this.menuItemSelected = {} as UserMenuDto;
    this.menuItemSelected.parentId = this.selected.id;
    this.menuItemSelected.menuType = MenuType.MenuItem;
    this.menuItemSelectedValue = '';
    this.buildMenuItemForm();
    this.isAddModalVisible = true;
  }

  edit(row: any) {
    this.service.get(row.id).subscribe((menu) => {
      this.selected = menu;
      this.updateLabelValue();
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  getLocalDate(date: string) {
    return AppUtils.getLocalDate(date);
  }

  editMenuItem(menu: UserMenuDto) {

    this.menuItemSelected = menu;
    this.updateMenuItemLabelValue();
    this.buildMenuItemForm();
    this.isAddModalVisible = true;
  }

  copy(e) {
    // copy submenu and menuitem also
    this.service.get(e.data.id).subscribe((menu) => {
      delete e.data.tenantName;
      menu.name = e.data.name;
      menu.displayName = e.data.displayName;
      this.service.create(menu as CreateUpdateUserMenuDto).subscribe(res => {
        this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
          messageLocalizationParams: [this.info, e.data.name],
        });
        this.list.get();
        this.edit(res);
      });
    });
  }

  async getData() {
    const info = await this.localizationService.get('::UserMenu').toPromise();
    const message: string = info;
  }
  save() {

    if (this.form.invalid) {
      return;
    }
    this.modalBusy= true;
    if (!this.form.get('path').value) {
      this.form.patchValue({
        path: this.form.get('name').value
      })
    }
    const request = this.selected.id
      ? this.service.update(this.selected.id, this.form.value)
      : this.service.create(this.form.value);
    request.subscribe(res => {
      if (!this.selected.id) {
        this.allMenuData.push(res);
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
      this.modalBusy= false;
      this.form.reset();
      this.list.get();
    });

  }
  saveMenuItems() {
    if (!this.menuItemForm.value['path'] && this.menuItemForm.value['menuType'] != MenuType.MenuItem) {
      this.menuItemForm.patchValue({
        path: this.menuItemForm.value['name']
      })

    }
    if (this.menuItemForm.invalid) {
      return;
    }
    const exists = this.selected.children.find(x => x == this.menuItemSelected);
    if (!exists) {
      this.selected.children = [...this.selected.children, this.menuItemForm.value];
    } else {
      this.selected.children = this.selected.children.map(x => {
        if (x == this.menuItemSelected) {
          return this.menuItemForm.value;
        }
        return x;
      });
    }
    this.form.patchValue({
      children: this.selected.children
    });
    this.isAddModalVisible = false;
    this.menuItemForm.reset();
    // update
    // const request = this.menuItemSelected.id
    //   ? this.service.update(this.menuItemSelected.id, this.menuItemForm.value)
    //   : this.service.create(this.menuItemForm.value);
    // request.pipe(concatMap(x => {
    //   if (x) {
    //     return this.service.get(this.selected.id)
    //   }
    // })).subscribe(x => {
    //   this.selected = x;
    //   this.isAddModalVisible = false;
    //   this.menuItemForm.reset();
    // });

  }

  delete(e: any) {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.info, e.name],
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.service.delete(e.id).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.info, e.name],
          });
          this.list.get();
        });
      }
    });
  }

  deleteMenuItem(e: any) {
    this.confirmation.warn('::LABEL_SubmenuDelete', '',{
      messageLocalizationParams: [e.name],
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        // newly add ones which still not saved , maybe not have id
        this.selected.children = this.selected.children.filter(x => x!= e);
        this.form.patchValue({
          children: this.selected.children
        });
        // this.service.delete(id)
        //   .pipe(concatMap(data => {
        //     return this.service.get(this.selected.id)
        //   })).subscribe(data => {
        //     this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
        //       messageLocalizationParams: [this.info, this.selected.name],
        //     });

        //     this.selected.children = data.children

        //   });
      }
    });
  }

  sort(data: any) {
    const { prop, dir } = data.sorts[0];
    this.list.sortKey = prop;
    this.list.sortOrder = dir;
  }

  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res;

    });
  }
  getMenus(): Array<UserMenuDto> {
    if (this.allMenuData.length == 0) {
      this.service.getAllInstances().subscribe((res) => {
        this.allMenuData = res;
        return this.allMenuData.filter(x => x.menuType === 0 && x.id != this.selected.id);
      });

    }
    else {
      return this.allMenuData.filter(x => x.menuType === 0 && x.id != this.selected.id);

    }

  }

  getRoutes() {
    this.router.config.forEach(route => {
      if (route.component)
        this.routes.push(route.path);
    })
    this.routes.push('identity/roles');
    this.routes.push('identity/users');
    this.routes.push('tenant-management/tenants');
    this.routes.push('setting-management');
    this.routes.push('device-test');
    this.routes.push('dashboard');
    this.routes.push('dashboard/board/role-board');
    this.routes.push('dashboard/card/kanban-board');
    this.routes.push('dashboard/dashboard/production-review/machine-focus');
    this.routes.push('dashboard/production-review/labor-focus');
    this.routes.sort();
  }
  search(e) {
    this.list.filter = e.target.value;
  }

  loadLanguageData() {
    const languageName = 'en';
    this.languagesService.getByName(languageName).subscribe((res: LanguagesDto) => {
      if (res && res.extraProperties) {
        this.extractMenuKeys(res.extraProperties);
      }
    });
  }

  extractMenuKeys(extraProperties: Record<string, string>) {
    this.displayOptions = Object.keys(extraProperties)
      .filter(key => key.startsWith('MENU_'))
      .map(key => ({ name: key, id: `::${key}` }));
  }

  selectDispalyName() {
    this.isDisplayNameModalVisible = true;
  }

  selectMenuItemDispalyName() {
    this.isMenuItemDisplayNameModalVisible = true;
  }

  onDisplayNameSelected(label: any) {
    this.form.get('displayName')?.setValue(label.label);
    this.selected.displayName = label.label;
    this.selectedValue = label.value;
    this.isDisplayNameModalVisible = false;
  }

  onMenuItemDisplayNameSelected(label: any) {
    this.menuItemForm.get('displayName')?.setValue(label.label);
    this.menuItemSelected.displayName = label.label;
    this.menuItemSelectedValue = label.value;
    this.isMenuItemDisplayNameModalVisible = false;
  }

  updateValue(event: any) {
    this.selected.displayName = event.target.value;
    this.selectedValue = event.target.value;
  }

  updateMenuItemValue(event: any) {
    this.menuItemSelected.displayName = event.target.value;
    this.menuItemSelectedValue = event.target.value;
  }

  updateLabelValue() {
    const exists = this.labels.find(item => item.label === this.selected.displayName);
    this.selectedValue = exists ? exists.value : this.selected.displayName;
  }
  updateMenuItemLabelValue() {
    const exists = this.labels.find(item => item.label === this.menuItemSelected.displayName);
    this.menuItemSelectedValue = exists ? exists.value : this.menuItemSelected.displayName;
  }

  initValues() {
    let resources = this.configService.getAll().localization.resources;
    for (const element in resources) {
      this.allLabels.push(...Object.keys(resources[element].texts).map(key => ({ label: (element === 'UFE' ? '' : element) + '::' + key, value: resources[element].texts[key] })));
    }
    this.labels = this.allLabels
  }
}
