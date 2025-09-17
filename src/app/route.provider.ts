import { AutoUpdateService } from './shared/services/auto-update.service';
import { RoutesService, eLayoutType } from '@abp/ng.core';
import { APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { MenuService } from './shared/services/menu.service';


export const APP_ROUTE_PROVIDER = [
  { provide: APP_BOOTSTRAP_LISTENER, useFactory: configureRoutes, deps: [RoutesService, MenuService, AutoUpdateService], multi: true },
];

function configureRoutes(routesService: RoutesService, menuService: MenuService, AutoUpdateService: AutoUpdateService) {
  AutoUpdateService.startAutoUpdateCheck();
  return () => {
    menuService.addMenus();
    routesService.add([
      {
        path: '/',
        name: '::Menu:Home',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application
      }
    ]);
  };
}

