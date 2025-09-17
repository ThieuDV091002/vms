import { Component, inject, ViewEncapsulation } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrl: './loading-modal.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoadingModalComponent {
  isShow: boolean = false;
  loadingText: string = 'Loading...';
  private readonly loadingService = inject(LoadingService);

  constructor() {}

  ngAfterViewInit() {
    this.loadingService?.loading$.subscribe(isLoading => {
      if (this.isShow != isLoading) this.isShow = isLoading;
    });
    this.loadingService?.loadingText$.subscribe(text => {
      this.loadingText = text;
    });
  }
}
