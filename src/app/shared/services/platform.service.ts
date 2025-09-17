import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  public isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  public isIos(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  public isAndroid(): boolean {
    return /Android/.test(navigator.userAgent);
  }

  public isWeb(): boolean {
    return !this.isIos() && !this.isAndroid();
  }

  public isMobile = this.isIos() || this.isAndroid();
}
