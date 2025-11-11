import { AccountConfigModule } from '@abp/ng.account/config';
import { CoreModule } from '@abp/ng.core';
import { registerLocale } from '@abp/ng.core/locale';
import { IdentityConfigModule } from '@abp/ng.identity/config';
import { SettingManagementConfigModule } from '@abp/ng.setting-management/config';
import { TenantManagementConfigModule } from '@abp/ng.tenant-management/config';
import { SideMenuLayoutModule } from '@volosoft/abp.ng.theme.lepton-x/layouts';
import { CUSTOM_ERROR_HANDLERS, InternetConnectionStatusComponent, ThemeSharedModule, ToasterService } from '@abp/ng.theme.shared';
import { NgModule, Type, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NAV_ITEM_PROVIDERS } from './nav-item.provider';
import { FeatureManagementModule } from '@abp/ng.feature-management';
import { AbpOAuthModule } from '@abp/ng.oauth';
import { AccountLayoutModule } from '@volosoft/abp.ng.theme.lepton-x/account';
import { LpxSideMenuLayoutModule } from '@volosoft/ngx-lepton-x/layouts';
import { LpxResponsiveModule } from '@volo/ngx-lepton-x.core';
import { ModelingModule } from './modeling/modeling.module';
import { PageModule } from '@abp/ng.components/page';
import { APP_ROUTE_PROVIDER } from './route.provider';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SharedModule } from './shared/shared.module';
import { CookieService } from 'ngx-cookie-service';
import { RouteReuseStrategy, TitleStrategy } from '@angular/router';
import { UFETitleStrategy } from './shared/services/ufetitle-strategy.service';
import { AppReuseStrategy } from './shared/ReuseStrategy';
import { ThemeLeptonXModule } from '@volosoft/abp.ng.theme.lepton-x';
import { CustomErrorComponent } from './shared/components/custom-error/custom-error.component';
import { CustomErrorHandlerService } from './shared/services/custom-error-handler.service';
import { CustomToasterService, ORIGINAL_TOASTER_SERVICE } from './shared/services/custom-toaster.service';
import { localizationResources } from 'src/assets/i18n';
@NgModule({
  imports: [
    ThemeSharedModule.forRoot({
      confirmationIcons: {
        warning: 'bi bi-exclamation-triangle',
        error: 'bi bi-x-circle',
        info: 'bi bi-info-circle',
      },
    }),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule.forRoot({
      environment,
      registerLocaleFn: registerLocale(),
      localizations: localizationResources,
    }),
    AbpOAuthModule.forRoot(),

    AccountLayoutModule.forRoot(),
    AccountConfigModule.forRoot(),
    IdentityConfigModule.forRoot(),
    TenantManagementConfigModule.forRoot(),
    SettingManagementConfigModule.forRoot(),
    ThemeLeptonXModule.forRoot(),
    SideMenuLayoutModule.forRoot(),
    FeatureManagementModule.forRoot(),
    InternetConnectionStatusComponent,
    LpxSideMenuLayoutModule,
    LpxResponsiveModule,
    ModelingModule,
    PageModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    SharedModule,

  ],
  declarations: [AppComponent],
  providers: [
    APP_ROUTE_PROVIDER,
    NAV_ITEM_PROVIDERS,
    CookieService,
    {
      provide: TitleStrategy,
      useExisting: UFETitleStrategy
    },
    {
      provide: RouteReuseStrategy,
      useClass: AppReuseStrategy
    },
    {
      provide: CUSTOM_ERROR_HANDLERS,
      useExisting: CustomErrorHandlerService,
      multi: true,
    },
    {
      provide: ORIGINAL_TOASTER_SERVICE,
      useClass: ToasterService,
    },
    {
      provide: ToasterService,
      useClass: CustomToasterService
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
