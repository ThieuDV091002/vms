import { HomeRoutingModule } from './../../home/home-routing.module';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutoUpdateService {
  lastSrcs: string[] = [];
  needTip = true;
  scriptReg = /<script.*src=["'](?<src>.*main[^"']*)["']/gm;
  checkInterval = 300000;

  constructor(
    private confirmationService: ConfirmationService
  ) {
    this.startAutoUpdateCheck();
  }

  async extractNewScripts(): Promise<string[]> {
    const html = await fetch('/?_timestamp=' + Date.now()).then((resp) => resp.text());
    this.scriptReg.lastIndex = 0;
    let result: string[] = [];
    let match: RegExpExecArray;
    while ((match = this.scriptReg.exec(html) as RegExpExecArray)) {
      result.push(match.groups?.src);
    }
    return result;
  }
  getCurrentVersion() {
    const html = document.body.innerHTML;
    this.scriptReg.lastIndex = 0;
    let result: string[] = [];
    let match: RegExpExecArray;
    while ((match = this.scriptReg.exec(html) as RegExpExecArray)) {
      result.push(match.groups?.src);
    }
    this.lastSrcs = result;
  }

  async checkForUpdates() {
    const newSrcs = await this.extractNewScripts();
    if (this.lastSrcs.length && this.needTip && !this.arraysEqual(this.lastSrcs, newSrcs)) {
      this.promptUpdate();
    }
  }

  startAutoUpdateCheck() {
    this.getCurrentVersion();
    setInterval(() => this.checkForUpdates(), this.checkInterval);
  }

  arraysEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  promptUpdate() {
    this.confirmationService.warn('::LABEL_UpdateMessage', '').subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        window.location.reload();
      }
    });
  }
}
