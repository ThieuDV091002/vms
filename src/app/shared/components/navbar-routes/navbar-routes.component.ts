
import { ConfigStateService, CoreModule, CurrentUserDto, LocalizationPipe, PermissionService } from '@abp/ng.core';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import {
  AfterViewChecked,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,

  OnInit,

  ViewChild,

  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { UserMenuDto } from '@proxy/user-menus/dtos';
import { UserMenuService } from '@proxy/user-menus/user-menu.service';
import {
  RoutesService,
  getItemsFromGroup,
  GroupedNavbarItems,
  LpxNavbarItem,
  LpxNavbarModule,
  NavbarService,
  LpxVisibleDirective,
  LpxTranslateModule,
} from '@volo/ngx-lepton-x.core';
import { SharedModule } from '../../shared.module';
import { environment } from 'src/environments/environment';
import { UserService } from '@proxy/services';
import { Subscription } from 'rxjs';
import { CentralizedUserService } from '@apis/corporate';
import { IdentityUserService } from '@abp/ng.identity/proxy';
import { MenuService } from '../../services/menu.service';


export type NavbarItemsType = LpxNavbarItem[] | null | undefined;
export type NavbarGroupItemsType = GroupedNavbarItems[] | null | undefined;

@Component({
  selector: 'app-navbar-routes',
  templateUrl: './navbar-routes.component.html',
  styleUrls: ['./navbar-routes.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CoreModule,
    ThemeSharedModule,
    LpxNavbarModule,
    LpxVisibleDirective,
    LpxTranslateModule,
    SharedModule
  ]
})
export class NavbarRoutesComponent implements OnInit, AfterViewChecked {
  protected readonly injector = inject(Injector);
  protected readonly routesService = inject(RoutesService);
  protected readonly router = inject(Router);
  protected readonly navbarService = inject(NavbarService);
  protected readonly activatedRoute = inject(ActivatedRoute);

  version: string = environment.version; // AppVersion:1.0.0 will be replaced by CI/CD
  isSystemInfoModalVisible = false;
  currentUser: CurrentUserDto;
  defaultDataTier: string = 'Default Tier: ';
  displayedRoles: string;
  tooltipRoles: string;
  groupedItems = toSignal(this.navbarService.groupedNavbarItems$);

  navbarItems = toSignal(this.navbarService.navbarItems$);

  routerItem = input<boolean>();

  // routeClick = output<LpxNavbarItem>();

  itemsFromGroup = computed(() => {
    if (!this.groupedItems) {
      return undefined;
    }

    return getItemsFromGroup<GroupedNavbarItems, LpxNavbarItem>(
      this.groupedItems() || undefined
    );
  });
  subscription: Subscription;
  tenantInfo: any;
  centralizedUserId: string;
  @ViewChild('navMenu') navMenu: ElementRef;

  constructor(private config: ConfigStateService,
    private readonly userMenuService: UserMenuService,
    public configService: ConfigStateService,
    private readonly userService: UserService,
    private abpLocalization: LocalizationPipe,
    private menuService: MenuService,
    private centralizedUserService: CentralizedUserService,
    private identityUserService: IdentityUserService,
    private permissionService: PermissionService,
  ) {
    this.addMenus();
    this.fixNavbarItemsByRouter();
    this.currentUser = this.configService.getOne('currentUser');
    this.setRoles();
    this.userService.getUserWithDataTiersByIdByUserId(this.currentUser.id).subscribe(data => {
      if (data.defaultDataTier) {
        this.defaultDataTier += data.defaultDataTier.dataTierName;
      }
    }
    );
  }

  ngAfterViewChecked(): void {
    this.checkScroll();
  }

  checkScroll(): void {
    const navMenuContainerElement = document.querySelector('.lpx-nav');
    const navMenuContainerHeight = navMenuContainerElement.clientHeight - 86.5;
    const navMenuHeight = this.navMenu.nativeElement.clientHeight;
    if (navMenuHeight < navMenuContainerHeight) {
      const sideBar = document.querySelector('.lpx-sidebar');
      sideBar?.classList.remove('ps--active-y');
    }
  }

  ngOnInit(): void {
    if (this.currentUser.tenantId) {
      if (this.permissionService.getGrantedPolicy('AbpIdentity.Users')) {
        this.identityUserService.get(this.currentUser.id).subscribe(res => {
          this.centralizedUserId = res.extraProperties.RefSourceId;
          if (this.centralizedUserId && this.centralizedUserId !== '00000000-0000-0000-0000-000000000000' && this.permissionService.getGrantedPolicy('CentralizedUser')) {
            this.centralizedUserService.get(res.extraProperties.RefSourceId, { skipHandleError: true }).subscribe(res => {
              this.tenantInfo = res.accessibleTenants.find(x => x.tenantId === this.currentUser.tenantId);
            });
          }
        });
      }
    }
    this.menuService.appStateRefresh.subscribe((value) => {
      if (value) {
        this.addMenus();
      }
    });
  }

  openTenantPopup() {
    this.router.navigate(['/']);
    this.onRouteClick(
      {
        "text": "Home",
        "breadcrumbText": "",
        "link": "/",
        "icon": "fas fa-home",
        "children": [],
        "showOnMobileNavbar": true,
        "expanded": false,
        "selected": true
      },
      this.navbarItems()
    );
    this.navbarItems().forEach(item => {
      if (item.link === '/') {
        item.selected = true;
      }
    });
    this.menuService.openTenantsPopup.next({ isOpen: true, currentTenantName: this.tenantInfo.displayLongText, currentTenantId: this.tenantInfo.tenantId, centralizedUserId: this.centralizedUserId });
  }

  public addMenus() {
    const currentUser = this.config.getOne("currentUser");
    let roles = currentUser.roles;
    if ((roles.findIndex(x => x === 'admin') >= 0 && this.navbarItems().length === 2) || this.navbarItems().length === 1) {
      if (roles && roles.length > 0) {
        this.userMenuService.getUserMenuByRoles(roles).subscribe(data => {
          if (data) {
            data.forEach((c, index) => {
              let route: LpxNavbarItem = {
                text: c.displayName ?? c.name,
                icon: c.iconClass ? c.iconClass : "    ", //no icon is displayed by default and keep space
                id: c.displayName + index + Math.random(),
                link: c.children?.length > 0 ? undefined : c.path,
                children: this.getSubMenu(c.children),
                expanded: false
              }
              this.navbarService.addNavbarItems(route);
            })
          }
        })
      }
    }
  }

  filter(value) {
    this.filterMenu(this.navbarItems(), value);
  }

  filterMenu(menu: any, value: any) {
    let anyChildVisible = false;

    if (value) {
      menu.forEach(item => {
        let itemVisible = this.abpLocalization.transform(item.text).toLowerCase().includes(value.toLowerCase());
        let childrenVisible = false;
        if (itemVisible) {
          this.setAllChildrenVisible(item.children, true);
          item.expanded = true;
        } else {
          childrenVisible = item.children ? this.filterMenu(item.children, value) : false;
          item.expanded = childrenVisible;
        }

        item.visible = () => itemVisible || childrenVisible;
        anyChildVisible = anyChildVisible || item.visible();
      });
    } else {
      menu.forEach(item => {
        item.expanded = false;
        item.visible = () => true;
        if (item.children) {
          this.filterMenu(item.children, value);
        }
      });
      anyChildVisible = true;
    }

    return anyChildVisible;
  }

  setAllChildrenVisible(children: any, visible: boolean) {
    children.forEach(child => {
      child.visible = () => visible;
      if (child.children) {
        this.setAllChildrenVisible(child.children, visible);
      }
    });
  }

  private getSubMenu(children: Array<UserMenuDto>) {
    let result: LpxNavbarItem[] = [];
    children.forEach(c => {
      let route: LpxNavbarItem = {
        text: c.displayName ?? c.name,
        link: c.children?.length > 0 ? undefined : c.path,
        icon: c.iconClass ? c.iconClass : "    ", //no icon is displayed by default and keep space
        children: c.children.length > 0 ? this.getSubMenu(c.children) : [],
        expanded: false
      };
      result.push(route);
    });
    return result;
  }

  private isExpandedOrSelected = (item: LpxNavbarItem): boolean =>
    !!(item.expanded || item.selected);

  private isActive = (path: string) =>
    this.router?.isActive(
      this.router.createUrlTree([path], {
        relativeTo: this.activatedRoute,
      }),
      {
        paths: 'exact',
        queryParams: 'exact',
        fragment: 'exact',
        matrixParams: 'exact',
      }
    );

  onSubnavbarExpand(menuItem: LpxNavbarItem, menuItems: NavbarItemsType): void {
    if (menuItem.expanded) {
      const items = this.itemsFromGroup() || menuItems;
      if (!items) {
        return;
      }

      items
        .filter((item) => item !== menuItem)
        .forEach((item) => { item.expanded = false; item.selected = false; });
    }
  }

  onRouteClick(menuItem: LpxNavbarItem, menuItems: NavbarItemsType): void {
    const expandedItems = menuItems?.filter(this.isExpandedOrSelected);
    const expandedGroupItems = this.itemsFromGroup()?.filter(
      this.isExpandedOrSelected
    );

    const items = expandedGroupItems || expandedItems;

    if (items) {
      items
        .filter((item) => item !== menuItem)
        .reduce<LpxNavbarItem[]>((acc, item) => {
          return [...acc, item, ...this.flatChildren(item.children || [])];
        }, [])
        ?.filter(
          (item) =>
            !this.checkChildrenIncludesItem(item, menuItem) && item !== menuItem
        )
        .forEach((item) => {
          item.selected = false;
          item.expanded = false;
        });
    }

    // this.routeClick.emit(menuItem);
  }

  checkChildrenIncludesItem(
    item: LpxNavbarItem,
    menuItem: LpxNavbarItem
  ): boolean {
    return (
      item.children?.reduce(
        (acc, child) =>
          acc ||
          child === menuItem ||
          this.checkChildrenIncludesItem(child, menuItem),
        false
      ) || false
    );
  }

  flatChildren(menuItems: NavbarItemsType): LpxNavbarItem[] {
    return (
      menuItems?.reduce<LpxNavbarItem[]>((acc, item) => {
        return [...acc, item, ...this.flatChildren(item.children || [])];
      }, []) || []
    );
  }

  fixNavbarItemsByRouter() {
    effect(() => {
      const currentNavigation = this.routesService.currentNavigation();

      if (!currentNavigation) {
        return;
      }

      this.fixNavbarItems(
        currentNavigation,
        this.navbarItems() as LpxNavbarItem[]
      );
    });
  }

  fixNavbarItems(currentUrl: string, items: LpxNavbarItem[] = []): void {
    items?.forEach((item) => {
      if (item.children?.length) {
        item.expanded = this.hasUrlInChildren(item, currentUrl);
        this.fixNavbarItems(currentUrl, item.children);
      } else if (item.link && item.link !== '/') {
        item.selected = this.isActive(item.link);
      } else {
        item.selected = item.link === currentUrl;
      }
    });
  }

  hasUrlInChildren(item: LpxNavbarItem, url: string): boolean {
    if (item.link && item.link === url) {
      return true;
    }

    if (item.link && item.link !== '/') {
      return this.isActive(item.link);
    }

    if (item.children) {
      for (const child of item.children) {
        const found = this.hasUrlInChildren(child, url);
        if (found) {
          return true;
        }
      }
    }

    return false;
  }

  showSystemInfoModal() {
    this.isSystemInfoModalVisible = true;
  }

  setRoles() {
    this.displayedRoles = 'Role: ';
    const roles = this.currentUser.roles;
    if (roles.length > 1) {
      this.displayedRoles += roles.slice(0, 2).join(', ') + '...';
      this.tooltipRoles = roles.join(', ');
    } else {
      this.displayedRoles += roles.join(', ');
      this.tooltipRoles = '';
    }
  }
}
