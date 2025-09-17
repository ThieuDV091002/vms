import { APP_BOOTSTRAP_LISTENER, } from '@angular/core';
import { RightBarService } from './shared/services/right-bar.service';


export const NAV_ITEM_PROVIDERS = [
  {
    provide: APP_BOOTSTRAP_LISTENER,
    useFactory: configureNavItems,
    deps: [RightBarService],
    multi: true,
  },
];

export function configureNavItems(service: RightBarService) {
  return () => {
    service.AddItems();
  }
}
