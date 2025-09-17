import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';
import { NfcService } from 'src/app/shared/services/nfc.service';
import { PlatformService } from 'src/app/shared/services/platform.service';

@Component({
  selector: 'read-nfc',
  templateUrl: './read-nfc.component.html',
  styleUrl: './read-nfc.component.scss'
})
export class ReadNFCComponent implements OnInit {
  public scannedTag$ = this.nfcService.scannedTag$;
  constructor(private readonly nfcService: NfcService, private readonly platformService: PlatformService, public route: Router) {

  }
  ngOnInit(): void {
    this.nfcService.startScanSession();
    this.subscribeToObservables();
  }

  ngOnDestroy(): void {
    this.nfcService.stopScanSession();
  }
  private subscribeToObservables(): void {
    if (this.platformService.isIos()) {
      this.nfcService.scannedTag$
        .pipe(take(1), untilDestroyed(this))
        .subscribe(() => this.nfcService.stopScanSession());
    }
  }
}
