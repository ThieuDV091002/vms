import {
  AuthService,
  ConfigStateService,
  DynamicLayoutComponent,
  LocalizationService,
  ReplaceableComponentsService,
} from '@abp/ng.core';
import {
  AfterViewChecked,
  Component,
  OnInit,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
} from '@angular/core';
import { AbpSettingsService } from '@volosoft/abp.ng.theme.lepton-x';
import { RolesManagementComponent } from './modeling/roles-management/roles-management.component';
import { eIdentityComponents } from '@abp/ng.identity';
import { PersonalSettingsComponent } from './modeling/user-profile/components/personal-settings/personal-settings.component';
import { eAccountComponents } from '@abp/ng.account';
import { UserProfileComponent } from './modeling/user-profile/user-profile.component';
import { UsersComponent } from './modeling/users/users.component';
import { TenantsComponent } from './modeling/tenants/tenants.component';
import { eTenantManagementComponents } from '@abp/ng.tenant-management';
import { HomeService } from '@proxy/controllers';
import { Subscription } from 'rxjs';
import { NavbarRoutesComponent } from './shared/components/navbar-routes/navbar-routes.component';
import { eThemeLeptonXComponents } from '@abp/ng.theme.lepton-x';
import { LoaderBarService } from './shared/services/loaderbar.service';
import { LogoComponent } from './shared/components/logo/logo.component';
import { SettingTabsService } from '@abp/ng.setting-management/config';
import { TimezoneSettingsComponent } from './shared/components/timezone-settings/timezone-settings.component';
import { RoleBoardIntegrationComponent } from './modeling/settings/components/role-board-integration/role-board-integration.component';
import { ProductionReviewIntegrationComponent } from './modeling/settings/components/production-review-integration/production-review-integration.component';
import { environment } from 'src/environments/environment';
import { GeneralSettingsComponent } from './shared/components/general-settings/general-settings.component';
import { Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationSelectorComponent } from './shared/components/application-selector/application-selector.component';
import { DomPortalOutlet, ComponentPortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-root',
  template: `
    <app-loading-modal></app-loading-modal>
    <abp-loader-bar *ngIf="hasLoggedIn && showLoaderBar"></abp-loader-bar>
    <abp-dynamic-layout *ngIf="hasLoggedIn" #layout></abp-dynamic-layout>
    <!-- <abp-internet-status *ngIf="hasLoggedIn"></abp-internet-status> -->
  `,
})
export class AppComponent implements OnInit, AfterViewChecked {
  get hasLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }
  @ViewChild('layout') layout: DynamicLayoutComponent;

  subscription: Subscription;
  isSystemInfoModalVisible = false;
  showLoaderBar = true;
  version: string = environment.version;

  private isViewInitialized = false;
  private domInitialized = {
    sidebar: false,
    logo: false,
    nav: false,
    userProfile: false,
  };

  constructor(
    private authService: AuthService,
    abpSettingsService: AbpSettingsService,
    private replaceableComponents: ReplaceableComponentsService,
    private loaderBarService: LoaderBarService,
    private configService: ConfigStateService,
    private settingTabService: SettingTabsService,
    private localizationService: LocalizationService,
    private router: Router,
    private localeService: BsLocaleService,
    private modalService: NgbModal,
    private injector: Injector,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    const cultureName = this.localizationService.currentLang;
    if (cultureName === 'pl-PL') {
      this.localeService.use('pl');
    } else {
      this.localeService.use(cultureName);
    }

    var params = new URLSearchParams(window.location.search);
    var tenantParam = params.get('tenant');

    if (!this.authService.isAuthenticated) {
      const tenant = sessionStorage.getItem('tenant');
      if (tenant) {
        this.authService.navigateToLogin({ tenant: tenant, autologin: true });
        sessionStorage.removeItem('tenant');
      } else {
        if (tenantParam) {
          this.authService.navigateToLogin({ tenant: tenantParam, autologin: false });
        } else this.authService.navigateToLogin();
      }
    } else {
      var currentTenant = this.configService.getOne('currentTenant');
      if (currentTenant && tenantParam && currentTenant.name != tenantParam) {
        sessionStorage.setItem('tenant', tenantParam);
        this.authService.logout();
      }

      this.settingTabService.add([
        {
          name: '::SettingManagement:TimeZone',
          order: 200,
          component: TimezoneSettingsComponent,
          requiredPolicy: 'SettingManagement.TimeZone',
        },
      ]);
      // this.settingTabService.add([{
      //   name: '::LABEL_RoleBoardIntegration',
      //   order: 300,
      //   component: RoleBoardIntegrationComponent,
      //   requiredPolicy: 'RoleBoardIntegration'
      // }]);

      // this.settingTabService.add([{
      //   name: '::LABEL_ProductionReviewIntegration',
      //   order: 400,
      //   component: ProductionReviewIntegrationComponent,
      //   requiredPolicy: 'ProductionReviewIntegration'
      // }]);

      let extraProperties = configService.getOne('extraProperties');
      this.loaderBarService.loadingBarSubject$.subscribe(res => (this.showLoaderBar = res));
      // Delete user panel items
      let c = abpSettingsService['userMenuService'];
      c.removeItem('SecurityLogs');
      c.removeItem('AuthorityDelegation');
      // Replaceable Components
      this.replaceableComponents.add({
        component: RolesManagementComponent,
        key: eIdentityComponents.Roles,
      });
      this.replaceableComponents.add({
        component: UserProfileComponent,
        key: eAccountComponents.ManageProfile,
      });
      this.replaceableComponents.add({
        component: PersonalSettingsComponent,
        key: eAccountComponents.PersonalSettings,
      });
      this.replaceableComponents.add({
        component: UsersComponent,
        key: eIdentityComponents.Users,
      });
      this.replaceableComponents.add({
        component: TenantsComponent,
        key: eTenantManagementComponents.Tenants,
      });
      this.replaceableComponents.add({
        component: NavbarRoutesComponent,
        key: eThemeLeptonXComponents.Routes,
      });

      this.replaceableComponents.add({
        component: LogoComponent,
        key: eThemeLeptonXComponents.Logo,
      });

      this.replaceableComponents.add({
        component: GeneralSettingsComponent,
        key: eThemeLeptonXComponents.Settings,
      });
    }
  }

  ngAfterViewChecked() {
    // Prevent repeated DOM operations
    this.initializeDOMElements();
  }

  private initializeDOMElements() {
    try {
      const currentUser = this.configService.getOne('currentUser');
      const userId = currentUser?.id;
      if (!userId) return;

      // Initialize sidebar
      this.initializeSidebar(userId);

      // Initialize logo container
      this.initializeLogoContainer();

      // Initialize navigation container
      this.initializeNavContainer();

      // Initialize user profile
      this.initializeUserProfile();
    } catch (error) {
      console.error('Error in initializeDOMElements:', error);
    }
  }

  private initializeSidebar(userId: string) {
    try {
      if (document.querySelector('.ufe-fillter')) return;

      const storageKey = `sidebarState_${userId}`;
      const element = document.querySelector(
        'div.lpx-sidebar-container > div > lpx-navbar > nav > div > lpx-icon > i'
      ) as HTMLElement;

      if (element && !element.id) {
        element.id = 'sidebar-toggle';
        if (element.className === 'lpx-icon bi bi-filter-left') {
          element.className = 'fas fa-angles-left ufe-fillter';
        }

        element.addEventListener('click', () => {
          try {
            if (element.className.indexOf('left') > 0) {
              element.className = element.className.replace('left', 'right');
              localStorage.setItem(storageKey, 'collapsed');
            } else {
              element.className = element.className.replace('right', 'left');
              localStorage.setItem(storageKey, 'expanded');
            }
          } catch (error) {
            console.error('Error in sidebar click handler:', error);
          }
        });

        const sidebarState = localStorage.getItem(storageKey);
        if (sidebarState === 'collapsed') {
          setTimeout(() => {
            try {
              element.click();
            } catch (error) {
              console.error('Error clicking sidebar element:', error);
            }
          }, 100);
        }

        this.domInitialized.sidebar = true;
      }
    } catch (error) {
      console.error('Error in initializeSidebar:', error);
    }
  }

  private initializeLogoContainer() {
    try {
      if (document.querySelector(".ufe-logo-container")) return;

      const logoContainerElement = document.querySelector('.lpx-logo-container') as HTMLElement;
      if (logoContainerElement) {
        logoContainerElement.style.paddingTop = '15px';
        logoContainerElement.style.paddingBottom = '10px';
        this.domInitialized.logo = true;
        logoContainerElement.classList.add('ufe-logo-container');
      }
    } catch (error) {
      console.error('Error in initializeLogoContainer:', error);
    }
  }

  private initializeNavContainer() {
    try {
      if (document.querySelector(".ufe-nav-container")) return;

      const navContainerElement = document.querySelector('.lpx-nav') as HTMLElement;
      if (navContainerElement) {
        navContainerElement.style.paddingTop = '60px';
        this.domInitialized.nav = true;
        navContainerElement.classList.add('ufe-nav-container');
      }
    } catch (error) {
      console.error('Error in initializeNavContainer:', error);
    }
  }

  private initializeUserProfile() {
    try {
      if (document.getElementById('environment-tenantInfo-item')) return;

      const environment = this.version?.split(' (')[0] || 'DEV';
      const extraProperties = this.configService.getOne('extraProperties');
      const tenantDisplayName = extraProperties?.TenantDisplayName;

      let envInfo = '';
      if (tenantDisplayName === undefined || tenantDisplayName === null) {
        envInfo = `${environment}`;
      } else {
        envInfo = `${environment}-${tenantDisplayName}`;
      }

      const userProfile = document.querySelector('.outer-menu-item.lpx-user-menu') as HTMLElement;

      if (userProfile && !document.getElementById('environment-tenantInfo-item')) {
        const envInfoItem = document.createElement('li');
        envInfoItem.id = 'environment-tenantInfo-item';
        envInfoItem.innerText = envInfo;
        let style = 'text-align: center; margin-bottom: 10px;';

        switch (environment) {
          case 'QA':
            style += 'color: #04bfd5;';
            break;
          case 'PROD':
            style += 'color: #e736b0;';
            break;
          case 'DEV':
            style += 'color: #3f48cc;';
            break;
        }
        envInfoItem.onclick = (event) => {
          event.stopPropagation();
          event.preventDefault();
          return false;
        };

        envInfoItem.style.cssText = style;
        userProfile.insertBefore(envInfoItem, userProfile.firstChild);

         if(environment==='DEV'){
           var apps = document.createElement('div');
           apps.style.display = 'flex'
           apps.style.justifyContent = 'center'
           apps.style.marginTop = '-15px'
           apps.style.marginBottom = '5px'
           userProfile.insertBefore(apps, userProfile.firstChild);
           const outlet = new DomPortalOutlet(
             apps,
             this.componentFactoryResolver,
             this.appRef,
          this.injector
        );
        outlet.attach(new ComponentPortal(ApplicationSelectorComponent));

        apps.onclick = (event) => {
          event.stopPropagation();
          event.preventDefault();
        };
        }  
        
        this.domInitialized.userProfile = true;
      }
    } catch (error) {
      console.error('Error in initializeUserProfile:', error);
    }
  }



  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    try {
      document.documentElement.style.setProperty(
        '--label-no',
        `'${this.localizationService.instant('AbpUi::No')}'`
      );

      const currentUser = this.configService.getOne('currentUser');
      if (!currentUser?.id) {
        console.warn('Current user not found');
        return;
      }

      const userId = currentUser.id;
      const homepageKey = `homepage_${userId}`;
      const storedHomepage = localStorage.getItem(homepageKey);

      if (location.hash.replace('#', '') == '/') {
        if (storedHomepage) {
          this.router.navigate([storedHomepage]);
        } else {
          this.router.navigate(['/']);
        }
      }
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    }
  }
}
