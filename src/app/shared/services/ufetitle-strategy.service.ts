import { ConfigStateService, LocalizationService } from '@abp/ng.core';
import { effect, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UFETitleStrategy extends TitleStrategy {
  protected readonly title = inject(Title);
  protected readonly configState = inject(ConfigStateService);
  protected readonly localizationService = inject(LocalizationService);
  protected routerState: RouterStateSnapshot;
  version: string = environment.version;

  projectName = toSignal(this.configState.getDeep$('localization.defaultResourceName'), {
    initialValue: 'MyProjectName',
  });
  langugageChange = toSignal(this.localizationService.languageChange$);

  constructor() {
    super();
    effect(() => {
      if (this.langugageChange()) {
        this.updateTitle(this.routerState);
      }
    });
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    this.routerState = routerState;
    const title = this.buildTitle(routerState);
    var environment = this.version.split(' (')[0];
    var tenantDisplayName = this.configState.getOne("extraProperties").TenantDisplayName;
    var envInfo = "";
    if(tenantDisplayName === undefined || tenantDisplayName === null) {
      envInfo = `${environment}`
    } else {
      envInfo = `${environment}-${tenantDisplayName}`
    }

    const projectName = this.localizationService.instant({
      key: 'vms::AppName',
      defaultValue: 'UFE',
    });

    if (!title) {
      return this.title.setTitle(projectName + " " + envInfo);
    }

    let localizedText = this.localizationService.instant({ key: title, defaultValue: title });

    localizedText += ` | ${projectName} ${envInfo}`;


    this.title.setTitle(localizedText);
  }
}
