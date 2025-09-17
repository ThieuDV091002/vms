import { Toaster, ToasterService } from "@abp/ng.theme.shared";
import { Inject, Injectable, InjectionToken } from "@angular/core";

export const ORIGINAL_TOASTER_SERVICE = new InjectionToken<ToasterService>('ORIGINAL_TOASTER_SERVICE');
@Injectable({
  providedIn: 'root',
})
export class CustomToasterService {
  constructor(@Inject(ORIGINAL_TOASTER_SERVICE)private toasterService: ToasterService) {}

  show(message: string, title?: string, severity?: Toaster.Severity, options?: Partial<Toaster.ToastOptions>): void {
    const option = options || {};
    option.life = option?.life || (severity === 'success' ? 5000 : 10000);
    this.toasterService.show(message, title, severity, option);
    if (option.sticky === true) {return}
    // this.showProgressBar(option.life);
  }

  success(message: string, title?: string, options?: Partial<Toaster.ToastOptions>): void {
    const option = options || {};
    option.life = option.life || 5000;
    this.toasterService.success(message, title, option);
    if (option.sticky === true) {return}
    // this.showProgressBar(option.life);
  }

  warn(message: string, title?: string, options?: Partial<Toaster.ToastOptions>): void {
    const option = options || {};
    option.life = option.life || 10000;
    this.toasterService.warn(message, title, option);
    if (option.sticky === true) {return}
    // this.showProgressBar(option.life);
  }

  info(message: string, title?: string, options?: Partial<Toaster.ToastOptions>): void {
    const option = options || {};
    option.life = option.life || 10000;
    this.toasterService.info(message, title, option);
    if (option.sticky === true) {return}
    // this.showProgressBar(option.life);
  }

  error(message: string, title?: string, options?: Partial<Toaster.ToastOptions>): void {
    const option = options || {};
    option.life = option.life || 10000;
    this.toasterService.error(message, title, option);
    if (option.sticky === true) {return}
    // this.showProgressBar(option.life);
  }

  showProgressBar(duration: number): void {
    const toastContainer = document.querySelector('.abp-toast-container');
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressBar.style.width = '20%';
    progressBar.style.height = '5px';
    progressBar.style.backgroundColor = 'rgba(255,255,255,0.5)';
    progressBar.style.position = 'absolute';
    progressBar.style.bottom = '0';
    progressBar.style.left = '0';
    toastContainer.appendChild(progressBar);
    // refresh progress bar every 10ms
    const startTime = Date.now();
    const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = (elapsedTime / (duration || 5000)) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;

        if (progress >= 100) {
            clearInterval(interval);
            // remove progress bar
            progressBar.remove();
        }
    }, 10);
  }
}