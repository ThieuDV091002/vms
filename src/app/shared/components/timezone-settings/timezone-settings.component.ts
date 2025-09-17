import { LocalizationService, NameValue } from '@abp/ng.core';
import { TimeZoneSettingsService } from '@abp/ng.setting-management/proxy';
import { ToasterService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timezone-settings',
  templateUrl: './timezone-settings.component.html',
  styleUrl: './timezone-settings.component.scss'
})
export class TimezoneSettingsComponent implements OnInit {

  timeZoneOptions: NameValue[] = [];
  selectedTimeZone: string;
  info: string;

  constructor(private timeZoneService: TimeZoneSettingsService,
    private toasterService: ToasterService,
    private localizationService: LocalizationService,
  ) {
    this.localizationService.get('AbpTiming::DisplayName:Abp.Timing.Timezone').subscribe((res) => {
      this.info = res;
    });
  }

  ngOnInit(): void {
    this.getTimeZoneOptions();
    this.getTimeZone();
  }

  getTimeZoneOptions(): void {
    this.timeZoneService.getTimezones().subscribe(timezones => {
      this.timeZoneOptions = timezones;
    });
  }

  getTimeZone(): void {
    this.timeZoneService.get().subscribe(timezone => {
      this.selectedTimeZone = timezone;
    });
  }

  selectChange(event): void {
    this.selectedTimeZone = event.value;
  }

  save(): void {
    this.timeZoneService.update(this.selectedTimeZone).subscribe(() => {
      this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
        messageLocalizationParams: [this.info, this.selectedTimeZone],
      });
    });
  }

}
