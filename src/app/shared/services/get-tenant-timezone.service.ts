import { Injectable } from '@angular/core';
import { TimeZoneSettingsService } from '@abp/ng.setting-management/proxy';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetTenantTimezoneService {
  constructor(
    private timeZoneSettingsService: TimeZoneSettingsService,
  ) { }

  getTimeZoneOffset(): Observable<string> {
    return new Observable(observer => {
      this.timeZoneSettingsService.getTimezones().subscribe({
        next: timezones => {
          this.timeZoneSettingsService.get().subscribe({
            next: selectedTimeZone => {
              const option = timezones.find(tz => tz.value === selectedTimeZone);
              if (option) {
                const matchFromName = option.name.match(/[（(]([+-]\d{1,2}:\d{2})[）)]/);
                if (matchFromName) {
                  let offset = matchFromName[1];
                  if (offset.length === 5) {
                    offset = offset[0] + '0' + offset.slice(1);
                  }
                  observer.next(offset);
                  observer.complete();
                  return;
                }

                const matchFromValue = option.value.match(/UTC([+-]\d{1,2})/);
                if (matchFromValue) {
                  let hours = matchFromValue[1];
                  if (hours.length === 2) {
                    hours = hours[0] + '0' + hours[1];
                  }
                  const offset = `${hours}:00`;
                  observer.next(offset);
                  observer.complete();
                  return;
                }
              }
              observer.next('+00:00');
              observer.complete();
            },
            error: err => observer.error(err)
          });
        },
        error: err => observer.error(err)
      });
    });
  }

  getDateWithOffset(date: Date = new Date(), offset: string, fullDate: boolean = false): string | Date {
    try {
      if (!offset?.match(/^[+-]\d{2}:\d{2}$/)) {
        throw new Error(`Invalid timezone offset format: ${offset}`);
      }

      if (!(date instanceof Date) || isNaN(date.getTime())) {
        date = new Date();
      }

      const browserOffset = -date.getTimezoneOffset();
      const [targetHours, targetMinutes] = offset.split(':').map(Number);
      const targetOffset = offset.startsWith('-')
        ? -(Math.abs(targetHours) * 60 + Math.abs(targetMinutes))
        : (Math.abs(targetHours) * 60 + Math.abs(targetMinutes));

      const diffMinutes = targetOffset - browserOffset;
      const targetDate = new Date(date.getTime() + diffMinutes * 60000);
      if (fullDate) {
        return targetDate;
      }

      const result = [
        targetDate.getFullYear(),
        String(targetDate.getMonth() + 1).padStart(2, '0'),
        String(targetDate.getDate()).padStart(2, '0')
      ].join('-');

      return result;

    } catch (error) {
      if (fullDate) {
        return date;
      }
      return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
      ].join('-');
    }
  }
}
