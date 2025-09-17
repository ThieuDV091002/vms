import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { registerLocaleData } from '@angular/common';
// 越南语
import localevi from '@angular/common/locales/vi';
// 波兰语
import localePl from '@angular/common/locales/pl';
// 日语
import localeJa from '@angular/common/locales/ja';
// 马来语
import localems from '@angular/common/locales/ms';
// 韩语
import localeko from '@angular/common/locales/ko';
// 德语
import localeDe from '@angular/common/locales/de';
// 西班牙语
import localeEs from '@angular/common/locales/es';
// 简体中文
import localeZhHans from '@angular/common/locales/zh-Hans';
// 繁体中文
import localeZhHant from '@angular/common/locales/zh-Hant';
// 意大利语
import localeIt from '@angular/common/locales/it';
// 英语
import localeEn from '@angular/common/locales/en';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { deLocale } from 'ngx-bootstrap/locale';
import { zhCnLocale } from 'ngx-bootstrap/locale';
import { viLocale } from 'ngx-bootstrap/locale';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { plLocale } from 'ngx-bootstrap/locale';
import { jaLocale } from 'ngx-bootstrap/locale';
import { koLocale } from 'ngx-bootstrap/locale';
import { esLocale } from 'ngx-bootstrap/locale';
import { itLocale } from 'ngx-bootstrap/locale';
import { msLocale } from './app/shared/models/ms-locale';
import { zhHansLocale } from './app/shared/models/zh-hans-locale.modle';

// German
defineLocale('de', deLocale);
// Simplified Chinese
defineLocale('zh-hans', zhCnLocale);
// Traditional Chinese
defineLocale('zh-hant', zhHansLocale);
// Vietnamese
defineLocale('vi', viLocale);
// British English
defineLocale('en', enGbLocale);
// Malay
defineLocale('ms', msLocale);
// Polish
defineLocale('pl', plLocale);
// Japanese
defineLocale('ja', jaLocale);
// Korean
defineLocale('ko', koLocale);
// Spanish
defineLocale('es', esLocale);
// Italian
defineLocale('it', itLocale);

//fix number format issue
registerLocaleData(localevi, 'vi');
registerLocaleData(localePl, 'pl');
registerLocaleData(localeJa, 'ja');
registerLocaleData(localems, 'ms');
registerLocaleData(localeko, 'ko');
registerLocaleData(localeDe, 'de');
registerLocaleData(localeEs, 'es');
registerLocaleData(localeZhHans, 'zh-Hans');
registerLocaleData(localeZhHant, 'zh-Hant');
registerLocaleData(localeIt, 'it');
registerLocaleData(localeEn, 'en');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
