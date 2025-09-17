import { ConfigStateService, Environment } from '@abp/ng.core';

import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrl: './profile-picture.component.scss',
  providers: [
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'PersonalSettings',
    },
  ],
})
export class ProfilePictureComponent {
  imageUrl: string;
  constructor(configService: ConfigStateService) {
    this.imageUrl = document.querySelector("lpx-avatar > div > img").attributes.getNamedItem("src").value;
  }

}
