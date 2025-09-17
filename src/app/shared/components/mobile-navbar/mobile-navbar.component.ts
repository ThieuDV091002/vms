import { Component, ContentChild, OnDestroy } from '@angular/core';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import {
  RoutesService,
  getItemsFromGroup,
  GroupedNavbarItems,
  LpxNavbarItem,
  LpxNavbarModule,
  NavbarService,
  LpxVisibleDirective,
  LpxTranslateModule,
  LogoPanelDirective,
  LayoutService,
  LpxIconModule,
} from '@volo/ngx-lepton-x.core';
import { CoreModule } from '@abp/ng.core';
import { SharedModule } from '../../shared.module';


@Component({
  selector: 'app-mobile-navbar',
  standalone: true,
  imports: [
    CoreModule,
    ThemeSharedModule,
    LpxNavbarModule,
    LpxVisibleDirective,
    LpxTranslateModule,
    SharedModule,
    LpxIconModule,
  ],
  templateUrl: './mobile-navbar.component.html',
  styleUrl: './mobile-navbar.component.scss'
})
export class MobileNavbarComponent implements OnDestroy {
  userMenuHidden = true;
  navItemsHidden = true;
  mobileMenuOpened = 'mobile-menu-opened';

  @ContentChild(LogoPanelDirective) logoPanel?: LogoPanelDirective;

  constructor(
    public navService: NavbarService,
    private layoutService: LayoutService
  ) { }

  ngOnDestroy() {
    this.layoutService.removeClass(this.mobileMenuOpened);
  }

  toggleUserMenu() {
    this.userMenuHidden = !this.userMenuHidden;
  }

  toggleNavbar() {
    this.navItemsHidden = !this.navItemsHidden;
    this.setLayoutClass();
  }

  setLayoutClass() {
    if (this.navItemsHidden) {
      this.layoutService.removeClass(this.mobileMenuOpened);
    } else {
      this.layoutService.addClass(this.mobileMenuOpened);
    }
  }
}
