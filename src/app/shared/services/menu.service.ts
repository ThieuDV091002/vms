import { AuthService, ConfigStateService, PermissionService, RoutesService, eLayoutType } from '@abp/ng.core';
import { eThemeSharedRouteNames } from '@abp/ng.theme.shared';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root'
})

export class MenuService {

  public openTenantsPopup = new BehaviorSubject<any>({ isOpen: false, currentTenant: '', centralizedUserId: '' });
  public appStateRefresh = new BehaviorSubject<any>(false);
  constructor(private config: ConfigStateService,
    private readonly routesService: RoutesService,
    private readonly permissionService: PermissionService,
    private authService: AuthService,
    private platformService: PlatformService) {
  }

  public addMenus() {

    //add mobile menus
    if (this.platformService.isMobile) {
      this.routesService.add([{
        path: '/mobile/card-creator',
        name: '::CardCreator',
        requiredPolicy: 'ActivityCard.Create'

      },
      {
        path: '/device-test',
        name: '::DeviceTest',

      }
      ])

    }

    if (this.authService.isAuthenticated) {
      const currentUser = this.config.getOne("currentUser");
      let roles = currentUser.roles
      if (roles.findIndex(x => x === 'admin') >= 0) {
        const canMenuView = this.permissionService.getGrantedPolicy('UserMenu');
        if (canMenuView)
          this.routesService.add([
            {
              path: '/dashboard',
              name: '::MENU_Dashboard',
              parentName: eThemeSharedRouteNames.Administration,
              iconClass: 'bi bi-clipboard-data',
              requiredPolicy: 'Dashboard',
              order: 2,
              layout: eLayoutType.application
            },
            {
              path: '/modeling/applications',
              name: '::Applications',
              parentName: eThemeSharedRouteNames.Administration,
              iconClass: 'bi bi-window-dock',
              requiredPolicy: 'Applications',
              order: 2,
              layout: eLayoutType.application
            },
            {
              path: '/modeling/user-menus',
              name: '::UserMenu',
              parentName: eThemeSharedRouteNames.Administration,
              iconClass: 'fas fa-tasks',
              requiredPolicy: 'UserMenu',
              order: 2,
              layout: eLayoutType.application
            },
          ])
      } else {
        this.routesService.remove(['AbpUiNavigation::Menu:Administration']);
      }
      // if (roles && roles.length > 0) {
      //   this.userMenuService.getUserMenuByRoles(roles).subscribe(data => {
      //     if (data) {
      //       let routes: ABP.Route[] = []
      //       data.forEach(c => {
      //         let route: ABP.Route = {
      //           name: c.displayName ?? c.name,
      //           path: c.path,
      //           iconClass: c.iconClass ? c.iconClass : "fas fa-wrench",
      //         }
      //         route['displayName'] = c.displayName ?? c.name
      //         if (c.children?.length > 0) {
      //           this.getSubMenu(route, c.children)
      //         }
      //         routes.push(route)
      //       })
      //       if (routes.length > 0)
      //         this.routesService.add(routes)
      //     }
      //   })
      // }
    }
  }
  // private getSubMenu(parentRoute: ABP.Route, children: Array<UserMenuDto>) {
  //   let routes: ABP.Route[] = []
  //   children.forEach(c => {
  //     let route: ABP.Route = {
  //       name: c.displayName ?? c.name,
  //       path: c.path,
  //       iconClass: c.iconClass ? c.iconClass : "fas fa-list",
  //       parentName: parentRoute.name
  //     }
  //     route['displayName'] = c.displayName ?? c.name
  //     if (c.children?.length > 0) {
  //       this.getSubMenu(route, c.children)
  //     }
  //     routes.push(route)
  //   })

  //   this.routesService.add(routes)
  // }
}


