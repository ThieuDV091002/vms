import { AuthService, ConfigStateService, RoutesService, SessionStateService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MenuService } from '../shared/services/menu.service';
import { CookieService } from 'ngx-cookie-service';
import { CentralizedUserService } from '@apis/corporate';
import { CentralizedUserDto } from '@apis/corporate/dtos';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  get hasLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }
  url: SafeResourceUrl;

  isModalVisible = false;
  currentTenantName = '';
  currentTenantId = '';

  userInfo: CentralizedUserDto;

  constructor(private authService: AuthService,
    routesService: RoutesService,
    private _sanitizer: DomSanitizer,
    private menuService: MenuService,
    private cookieService: CookieService,
    private centralizedUserService: CentralizedUserService,
    private configService: ConfigStateService,
    private sessionService: SessionStateService
  ) {
    if (!this.authService.isAuthenticated) {
      this.login();
    }
    else {


    }

  }

  ngOnInit(): void {
    this.menuService.openTenantsPopup.subscribe(event => {
      if (event.isOpen) {
        this.currentTenantName = event.currentTenantName;
        this.currentTenantId = event.currentTenantId;
        this.centralizedUserService.get(event.centralizedUserId, { skipHandleError: true }).subscribe(user => {
          this.isModalVisible = true;
          this.userInfo = user;
        })
      }
    });


  }

  login() {
    this.authService.navigateToLogin();
  }

  switchTenant(tenantId) {
    if (tenantId == this.currentTenantId) {
      return;
    }
    sessionStorage.setItem('tenant', this.userInfo?.accessibleTenants.find(x => x.tenantId == tenantId).tenantName);
    this.authService.logout();
  }
}
