import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-site-huddle-monthly-summary-view',
  templateUrl: './site-huddle-monthly-summary-view.component.html',
  styleUrl: './site-huddle-monthly-summary-view.component.scss'
})
export class SiteHuddleMonthlySummaryViewComponent {
  @ViewChild('tableBodyWrapper', { static: true }) tableBodyWrapper!: ElementRef;
  @ViewChild('tableHeaderWrapper', { static: true }) tableHeaderWrapper!: ElementRef;


  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  rows = [
    { label: 'Safety Incident', isCategory: true },
    { label: 'Near Misses', isCategory: true },
    { label: 'External QNs', isCategory: true },
    { label: 'Internal QNs', isCategory: true },
    { label: 'COPQ / COGS', isCategory: true },
    { label: 'People Productivity', isCategory: true },
    { label: 'Asset Productivity', isCategory: true },
    { label: 'OEE', isCategory: true },
    { label: 'POEE', isCategory: true },
    { label: 'CRD%', isCategory: true },
    { label: 'MPD%', isCategory: true },
    { label: 'Gross Inventory $', isCategory: true },
    { label: 'DSI', isCategory: true }
  ];
  private resizeListener!: () => void;
  isDarkTheme = this.themeService.isDarkTheme();


  constructor(private renderer: Renderer2,
    private themeService: ThemeService,
  ) { }

  ngOnInit(): void {
    this.themeService.listenToThemeChanges(() => {
      this.isDarkTheme = this.themeService.isDarkTheme();
    });
  }

  ngAfterViewInit(): void {
    this.updateScrollbarWidth();

    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.updateScrollbarWidth();
    });
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      this.resizeListener();
    }
  }

  private updateScrollbarWidth(): void {
    const scrollbarWidth = this.tableBodyWrapper.nativeElement.offsetWidth - this.tableBodyWrapper.nativeElement.clientWidth;
    this.renderer.setStyle(this.tableHeaderWrapper.nativeElement, 'padding-right', `${scrollbarWidth}px`);
  }

}
