import { eAccountComponents, ManageProfileStateService } from '@abp/ng.account';
import { fadeIn } from '@abp/ng.theme.shared';
import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@abp/ng.account.core/proxy';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  animations: [trigger('fadeIn', [transition(':enter', useAnimation(fadeIn))])],
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  selectedTab = 0;

  changePasswordKey = eAccountComponents.ChangePassword;

  personalSettingsKey = eAccountComponents.PersonalSettings;
  profilePictureKey = "PersonalSettings";
  profile$ = this.manageProfileState.getProfile$();

  hideChangePasswordTab?: boolean;
  hideProfilePictureTab?: boolean;
  
  constructor(
    protected profileService: ProfileService,
    protected manageProfileState: ManageProfileStateService,
  ) { }

  ngOnInit() {
    this.profileService.get().subscribe(profile => {
      this.manageProfileState.setProfile(profile);
      if (!profile.isExternal) {
        this.hideChangePasswordTab = true;
        this.hideProfilePictureTab = true;
        this.selectedTab = 2;
      }
    });
  }
}
