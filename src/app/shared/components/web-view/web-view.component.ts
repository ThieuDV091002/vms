import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'web-view',
  templateUrl: './web-view.component.html',
  styleUrl: './web-view.component.scss'
})
export class WebViewComponent {
  @Input() title: string = ''
  @Input() url: string = '#'
  @Input() witdh: string = '100%'
  @Input() height: string = '800px'
  constructor(router: ActivatedRoute, private sanitizer: DomSanitizer) {
    router.queryParams.subscribe(params => {
      this.url = params['url'] || '#'
    });
  }
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
