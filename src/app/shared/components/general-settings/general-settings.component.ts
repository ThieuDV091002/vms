import { Component, OnInit, OnDestroy, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { eThemeLeptonXComponents } from '@volosoft/abp.ng.theme.lepton-x';
import { ConfigStateService, SessionStateService, LocalizationService } from '@abp/ng.core';
import { Subscription } from 'rxjs';
import { ThemeService, LpxTheme } from '@volosoft/ngx-lepton-x';
import { LanguageService, LpxLanguage } from '@volo/ngx-lepton-x.core';
import { LpxContainer, SideMenuLayoutService } from '@volosoft/ngx-lepton-x/layouts';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lpx-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit, OnDestroy {
  menuActive = false;
  appearanceActive = false;
  containerActive = false;
  languageActive = false;
  isActive = false;

  // Control the highlighting of menu items
  generalSettingsHighlight = true; // Default to true
  appearanceHighlight = false;
  containerHighlight = false;
  languageHighlight = false;
  helpHighlight = false;
  helpSelectedItem?: string;

  // Save the currently selected sub function icon for each menu
  currentAppearanceIcon = 'bi bi-palette-fill';
  currentContainerIcon = 'bi bi-aspect-ratio';
  currentLanguageIcon = 'bi bi-globe';
  currentHelpIcon = 'bi bi-question-circle';

  static readonly type = eThemeLeptonXComponents.Settings;

  languages: LpxLanguage[] = [];
  currentLanguage = 'EN';
  private languageDisplayMap: { [key: string]: string } = {
    'zh-Hans': 'ZH-HANS',
    'zh-Hant': 'ZH-HANT',
    'pl-PL': 'PL-PL'
  };

  helpItems = {
    items: [
      {
        title: '::MENU_Help',
        icon: 'bi bi-book',
        link: 'https://document.ufe.molex.com/documents/en/ufe/latest'
      },
      {
        title: '::MENU_Training',
        icon: 'bi bi-mortarboard',
        link: 'https://document.ufe.molex.com/documents/en/ufe/latest/ufe-mosaic/Role-Specific'
      },
      {
        title: '::MENU_ReleaseNotes',
        icon: 'bi bi-journals',
        link: 'https://document.ufe.molex.com/documents/en/ufe/latest/releases/Overview'
      },
      {
        title: '::MENU_SendFeedback',
        icon: 'bi bi-chat-dots',
        link: 'https://kochprod.service-now.com/compass?id=sc_cat_item&table=sc_cat_item&sys_id=e8ea73f483f8e610bd0f40426daad33a'
      }
    ]
  };

  private themeKeyMap: { [key: string]: string } = {
    'dim': 'SemiDark',
    'light': 'Light',
    'dark': 'Dark',
    'system': 'System'
  };

  private containerKeyMap: { [key: string]: string } = {
    'fixed': 'Fluid',
    'boxed': 'Boxed',
    'full': 'FullWidth'
  };
  themes: LpxTheme[] = [];
  currentTheme: LpxTheme | undefined;
  currentContainer: LpxContainer | undefined;
  containerTypes: LpxContainer[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private configState: ConfigStateService,
    private sessionState: SessionStateService,
    private themeService: ThemeService,
    private layoutService: SideMenuLayoutService,
    public languageService: LanguageService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private localizationService: LocalizationService,
    private localeService: BsLocaleService
    
  ) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickTarget = event.target as HTMLElement;
    // Check if the menu link or menu item has been clicked
    if (clickTarget.closest('.lpx-context-menu') || clickTarget.closest('.setting-icon')) {
      return;
    }
    // Click occurs outside the menu area
    this.closeAllMenus();
    // this.resetAllMenus();
    // this.updateHighlights();
  }

  async ngOnInit() {
    // Monitor language changes
    this.subscriptions.push(
      this.localizationService.languageChange$.subscribe(() => {
        // Trigger change detection when language changes
        this.closeAllMenus();
        this.resetAllMenus();
      }),
      this.themeService.styles$.subscribe(styles => {
        this.themes = styles;
      }),
      this.themeService.selectedStyle$.subscribe(theme => {
        this.currentTheme = theme;
        if (theme?.icon) {
          this.currentAppearanceIcon = theme.icon;
        }
      }),
      this.layoutService.layouts$.subscribe(layouts => {
        this.containerTypes = layouts;

      }),
      this.layoutService.selectedLayout$.subscribe(layout => {
        this.currentContainer = layout;

        if (layout?.icon) {
          this.currentContainerIcon = layout.icon;
        }
      })
    );
    this.languageService.selectedLanguage.displayName
    this.subscriptions.push(
      this.languageService.languages$.subscribe(langs => {
        const currentLang = this.languageService.selectedLanguage;
        this.languages = langs.map(lang => ({
          ...lang,
          selected: currentLang?.cultureName === lang.cultureName
        }));
      }),
      this.languageService.selectedLanguage$.subscribe(lang => {
        if (lang) {
          const cultureName = lang.cultureName || '';
          this.currentLanguage = this.languageDisplayMap[cultureName] || cultureName.split('-')[0].toUpperCase();
          this.languages = this.languages.map(l => ({
            ...l,
            selected: l.cultureName === lang.cultureName
          }));
        }
      })
    );

    await this.themeService.initTheme();
    this.layoutService.initLayout();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private openAllMenus() {
    this.menuActive = true;
    this.appearanceActive = true;
    this.containerActive = true;
    this.languageActive = true;
    this.isActive = true;
    this.updateHighlights();
  }

  private closeAllMenus() {
    this.menuActive = false;
  }

  show() {
    if (!this.menuActive) {
      this.openAllMenus();
    } else {
      this.closeAllMenus();
    }
  }

  private resetAllMenus() {
    this.appearanceActive = false;
    this.containerActive = false;
    this.languageActive = false;
    this.isActive = false;
  }

  private updateHighlights() {
    this.appearanceHighlight = this.appearanceActive;
    this.containerHighlight = this.containerActive;
    this.languageHighlight = this.languageActive;
    this.helpHighlight = this.isActive;
    this.generalSettingsHighlight = true;
  }

  private closeOtherMenus(exceptMenu: string) {
    if (exceptMenu !== 'appearance') this.appearanceActive = false;
    if (exceptMenu !== 'container') this.containerActive = false;
    if (exceptMenu !== 'language') this.languageActive = false;
    if (exceptMenu !== 'help') this.isActive = false;
    this.updateHighlights();
  }

  onSettingIconClick(type: string) {
    this.menuActive = true;

    switch(type) {
      case 'appearance':
        this.closeOtherMenus('appearance');
        this.appearanceActive = true;
        break;
      case 'containerWidth':
        this.closeOtherMenus('container');
        this.containerActive = true;
        break;
      case 'helpCenter':
        this.closeOtherMenus('help');
        this.isActive = true;
        break;
      case 'language':
        this.closeOtherMenus('language');
        this.languageActive = true;
        break;
    }

    this.updateHighlights();
  }

  onGeneralSettingsClick() {
    if (this.menuActive) {
      this.closeAllMenus();
    } else {
      this.openAllMenus();
    }
  }

  onAppearanceClick() {
    if (this.appearanceActive) {
      this.appearanceActive = false;
    } else {
      this.closeOtherMenus('appearance');
      this.appearanceActive = true;
    }
    this.updateHighlights();
  }

  onContainerClick() {
    if (this.containerActive) {
      this.containerActive = false;
    } else {
      this.closeOtherMenus('container');
      this.containerActive = true;
    }
    this.updateHighlights();
  }

  onLanguageClick() {
    if (this.languageActive) {
      this.languageActive = false;
    } else {
      this.closeOtherMenus('language');
      this.languageActive = true;
    }
    this.updateHighlights();
  }

  toggleMenu() {
    if (this.isActive) {
      this.isActive = false;
    } else {
      this.closeOtherMenus('help');
      this.isActive = true;
    }
    this.updateHighlights();
  }

  onThemeChange(theme: LpxTheme) {
    if (theme) {
      this.themeService.setTheme(theme);
      this.currentTheme = theme;
      if (theme.icon) {
        this.currentAppearanceIcon = theme.icon;
      }
    }
  }

  onWidthChange(container: LpxContainer) {
    if (container) {
      this.layoutService.changeLayout(container);
      this.currentContainer = container;
      if (container.icon) {
        this.currentContainerIcon = container.icon;
      }
    }
  }

  async onLanguageChange(lang: LpxLanguage) {
    if (lang?.cultureName) {
      // Set the currently selected language
      this.languageService.setSelectedLanguage(lang);

      // Update language list status
      this.languages = this.languages.map(l => ({
        ...l,
        selected: l.cultureName === lang.cultureName
      }));

      if (lang.cultureName === 'pl-PL') {
        this.localeService.use('pl');
      } else {
        this.localeService.use(lang.cultureName);
      }


      // Update the displayed language code
      const cultureName = lang.cultureName;
      this.currentLanguage = this.languageDisplayMap[cultureName] || cultureName.split('-')[0].toUpperCase();

      // Set the language in the session
      await this.sessionState.setLanguage(cultureName);


      await this.localizationService.registerLocale(cultureName);


      // Reload localized configuration
      await this.configState.refreshAppState().toPromise();
      document.documentElement.style.setProperty('--label-no', `'${this.localizationService.instant('AbpUi::No')}'`);
    }
  }

  onHelpItemClick(item: any) {
    if (item?.icon) {
      this.currentHelpIcon = item.icon;
    }
  }

}
