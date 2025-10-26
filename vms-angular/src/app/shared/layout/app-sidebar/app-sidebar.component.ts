import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SafeHtmlPipe } from '../../pipe/safe-html.pipe';
import { SidebarWidgetComponent } from './app-sidebar-widget.component';
import { combineLatest, Subscription } from 'rxjs';

type NavItem = {
  name: string;
  icon: string;
  path?: string;
  new?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    SafeHtmlPipe,
    SidebarWidgetComponent
  ],
  templateUrl: './app-sidebar.component.html',
})
export class AppSidebarComponent {

  // Main nav items
  navItems: NavItem[] = [
      {
          name: "Travel Guide",
          icon: '<svg width="1em" height="1em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.25 2C.56 2 0 2.56 0 3.25v8.5C0 12.44.56 13 1.25 13H5c.896 0 1.475.205 1.809.448.317.23.441.51.441.802a.75.75 0 001.5 0c0-.292.124-.572.441-.802.334-.243.913-.448 1.809-.448h3.75c.69 0 1.25-.56 1.25-1.25v-8.5C16 2.56 15.44 2 14.75 2H11c-1.154 0-2.106.354-2.772 1-.081.08-.157.161-.228.246A3.131 3.131 0 007.772 3C7.106 2.354 6.154 2 5 2H1.25zm7.5 9.967c.61-.309 1.372-.467 2.25-.467h3.5v-8H11c-.846 0-1.394.253-1.728.577-.335.325-.522.787-.522 1.34v6.55zm-1.5 0v-6.55c0-.553-.187-1.015-.522-1.34C6.394 3.753 5.846 3.5 5 3.5H1.5v8H5c.878 0 1.64.158 2.25.467z" fill="currentColor"></path></g></svg>',
          subItems: [
              { name: "Hotels", path: "/hotel-lists", pro: false },
              { name: "Foods", path: "/food-lists", pro: false },
              { name: "Attractions", path: "/attraction-lists", pro: false },
              { name: "Medical Care Centers", path: "/medical-care-center-lists", pro: false },
              { name: "Transportations", path: "/transportation-lists", pro: false },
          ],
      },
      {
          icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z" fill="currentColor"></path></svg>`,
          name: "Guest Information",
          path: "/guest-infos",
      },
      {
          icon: '<svg width="1em" height="1em" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 73.457 73.457" xml:space="preserve" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M70.916,27.294H47.524v-5.711c0-0.829-0.672-1.5-1.5-1.5h-1.415v-3.09 c0-4.346-3.535-7.881-7.881-7.881c-4.345,0-7.88,3.535-7.88,7.881v3.09h-1.415c-0.828,0-1.5,0.671-1.5,1.5v5.711H2.542 c-0.553,0-1,0.448-1,1v19.492c0,0.552,0.447,1,1,1h6.966L5.535,73.457h8.35l2.416-15h40.856l2.416,15h8.35l-3.973-24.671h6.967 c0.553,0,1-0.448,1-1V28.294C71.916,27.742,71.468,27.294,70.916,27.294z M28.933,23.083h15.591v2.998H28.933V23.083z M31.848,16.993c0-2.691,2.189-4.881,4.88-4.881c2.691,0,4.881,2.189,4.881,4.881v3.09h-9.761V16.993z M10.87,46.786l4.665-17.492 h7.09L17.96,46.786H10.87z M30.66,29.294h7.089l-4.665,17.492h-7.089L30.66,29.294z M45.784,29.294h7.089l-4.665,17.492h-7.089 L45.784,29.294z M56.243,46.786l4.665-17.492h7.089l-4.665,17.492H56.243z M7.501,29.294L3.542,44.139V29.294H7.501z M16.784,55.457 l0.283-1.755h39.325l0.283,1.755H16.784z M56.069,51.702h-38.68l0.47-2.916h37.741L56.069,51.702z M35.228,6.069V1.5 c0-0.829,0.672-1.5,1.5-1.5s1.5,0.671,1.5,1.5v4.569c0,0.829-0.672,1.5-1.5,1.5S35.228,6.897,35.228,6.069z M43.531,10.517 c-0.586-0.585-0.586-1.536,0-2.121l3.23-3.23c0.586-0.586,1.535-0.586,2.121,0c0.586,0.585,0.586,1.536,0,2.121l-3.23,3.23 c-0.293,0.293-0.677,0.439-1.061,0.439C44.208,10.957,43.824,10.81,43.531,10.517z M24.482,7.063c-0.586-0.586-0.586-1.536,0-2.121 c0.586-0.586,1.535-0.586,2.121,0l3.23,3.231c0.586,0.586,0.586,1.536,0,2.121c-0.293,0.293-0.677,0.439-1.061,0.439 s-0.768-0.146-1.061-0.439L24.482,7.063z" fill="currentColor"></path> </g></svg>',
          name: "Contractor Request",
          path: "/contractor-requests",
      },
  ];
  // Others nav items
  othersItems: NavItem[] = [

  ];

  openSubmenu: string | null | number = null;
  subMenuHeights: { [key: string]: number } = {};
  @ViewChildren('subMenu') subMenuRefs!: QueryList<ElementRef>;

  readonly isExpanded$;
  readonly isMobileOpen$;
  readonly isHovered$;

  private subscription: Subscription = new Subscription();

  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    this.isHovered$ = this.sidebarService.isHovered$;
  }

  ngOnInit() {
    // Subscribe to router events
    this.subscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.setActiveMenuFromRoute(this.router.url);
        }
      })
    );

    // Subscribe to combined observables to close submenus when all are false
    this.subscription.add(
      combineLatest([this.isExpanded$, this.isMobileOpen$, this.isHovered$]).subscribe(
        ([isExpanded, isMobileOpen, isHovered]) => {
          if (!isExpanded && !isMobileOpen && !isHovered) {
            // this.openSubmenu = null;
            // this.savedSubMenuHeights = { ...this.subMenuHeights };
            // this.subMenuHeights = {};
            this.cdr.detectChanges();
          } else {
            // Restore saved heights when reopening
            // this.subMenuHeights = { ...this.savedSubMenuHeights };
            // this.cdr.detectChanges();
          }
        }
      )
    );

    // Initial load
    this.setActiveMenuFromRoute(this.router.url);
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscription.unsubscribe();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toggleSubmenu(section: string, index: number) {
    const key = `${section}-${index}`;

    if (this.openSubmenu === key) {
      this.openSubmenu = null;
      this.subMenuHeights[key] = 0;
    } else {
      this.openSubmenu = key;

      setTimeout(() => {
        const el = document.getElementById(key);
        if (el) {
          this.subMenuHeights[key] = el.scrollHeight;
          this.cdr.detectChanges(); // Ensure UI updates
        }
      });
    }
  }

  onSidebarMouseEnter() {
    this.isExpanded$.subscribe(expanded => {
      if (!expanded) {
        this.sidebarService.setHovered(true);
      }
    }).unsubscribe();
  }

  private setActiveMenuFromRoute(currentUrl: string) {
    const menuGroups = [
      { items: this.navItems, prefix: 'main' },
      { items: this.othersItems, prefix: 'others' },
    ];

    menuGroups.forEach(group => {
      group.items.forEach((nav, i) => {
        if (nav.subItems) {
          nav.subItems.forEach(subItem => {
            if (currentUrl === subItem.path) {
              const key = `${group.prefix}-${i}`;
              this.openSubmenu = key;

              setTimeout(() => {
                const el = document.getElementById(key);
                if (el) {
                  this.subMenuHeights[key] = el.scrollHeight;
                  this.cdr.detectChanges(); // Ensure UI updates
                }
              });
            }
          });
        }
      });
    });
  }

  onSubmenuClick() {
    console.log('click submenu');
    this.isMobileOpen$.subscribe(isMobile => {
      if (isMobile) {
        this.sidebarService.setMobileOpen(false);
      }
    }).unsubscribe();
  }  

  
}
