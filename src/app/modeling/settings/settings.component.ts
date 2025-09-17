import { ABP } from '@abp/ng.core';
import { SettingTabsService } from '@abp/ng.setting-management/config';
import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnDestroy, OnInit {
  private subscription = new Subscription();
  settings: ABP.Tab[] = [];

  selected!: ABP.Tab;

  trackByFn: TrackByFunction<ABP.Tab> = (_, item) => item.name;

  constructor(private settingTabsService: SettingTabsService) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription.add(
      this.settingTabsService.visible$.subscribe(settings => {
        //remove FeatureManagement
        settings = settings.filter(setting => setting.name != 'AbpFeatureManagement::Permission:FeatureManagement');
        this.settings = settings;

        if (!this.selected) this.selected = this.settings[0];
      }),
    );
  }
}
