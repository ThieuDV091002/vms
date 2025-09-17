import { Account, ManageProfileStateService, RE_LOGIN_CONFIRMATION_TOKEN, eAccountComponents } from '@abp/ng.account';
import { EXTENSIONS_IDENTIFIER, FormPropData, generateFormFromProps } from '@abp/ng.components/extensible';
import { AuthService, ConfigStateService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, Injector, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { filter, finalize } from 'rxjs';
import { ProfileDto, ProfileService } from '@abp/ng.account.core/proxy';
import { MenuService } from 'src/app/shared/services/menu.service';
import { KochidService } from 'src/app/shared/services/kochid.service';

interface ADUserInfo {
  sAMAccountName: string;
  givenName: string;
  sn: string;
  mail: string;
}
@Component({
  selector: 'personal-settings',
  templateUrl: './personal-settings.component.html',
  styleUrl: './personal-settings.component.scss',
  providers: [
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: eAccountComponents.PersonalSettings,
    },
  ],
})
export class PersonalSettingsComponent implements
  OnInit,
  Account.PersonalSettingsComponentInputs,
  Account.PersonalSettingsComponentOutputs {
  private readonly fb = inject(UntypedFormBuilder);
  protected readonly toasterService = inject(ToasterService);
  protected readonly profileService = inject(ProfileService);
  protected readonly manageProfileState = inject(ManageProfileStateService);
  protected readonly authService = inject(AuthService);
  protected readonly confirmationService = inject(ConfirmationService);
  protected readonly configState = inject(ConfigStateService);
  protected readonly kochidService = inject(KochidService);
  protected readonly isPersonalSettingsChangedConfirmationActive = inject(
    RE_LOGIN_CONFIRMATION_TOKEN,
  );
  private readonly injector = inject(Injector);
  protected readonly menuService = inject(MenuService);
  isReadOnly = true;

  selected?: ProfileDto;

  form!: UntypedFormGroup;

  inProgress?: boolean;
  aduserInfo: ADUserInfo;
  isAdUser: boolean = false;

  buildForm() {
    this.selected = this.manageProfileState.getProfile();
    if (!this.selected) {
      return;
    }
    const data = new FormPropData(this.injector, this.selected);
    this.form = generateFormFromProps(data);
  }

  ngOnInit(): void {
    this.buildForm();
    this.getADUserInfo();
  }

  getADUserInfo() {
    this.kochidService
      .getUserInfo(this.selected.email, { skipAddingHeader: true })
      .subscribe(res => {
        if (res?.resources?.length > 0) {
          this.isAdUser = true;
          this.aduserInfo = {
            sAMAccountName: res?.resources[0].attributes.sAMAccountName,
            givenName: res?.resources[0].attributes.givenName,
            sn: res?.resources[0].attributes.sn,
            mail: res?.resources[0].attributes.mail
          };
        } else {
          this.isAdUser = false;
        }
      });
  }

  submit() {
    if (this.form.invalid) return;
    
    // If the user is an AD user, update the form values with aduserInfo
    if (this.isAdUser && this.aduserInfo) {
      this.form.controls['name'].setValue(this.aduserInfo.givenName);
      this.form.controls['surname'].setValue(this.aduserInfo.sn);
      this.form.controls['email'].setValue(this.aduserInfo.mail);
      this.form.controls['userName'].setValue(this.aduserInfo.sAMAccountName);
    }

    const isLogOutConfirmMessageVisible = this.isLogoutConfirmMessageActive();
    const isRefreshTokenExists = this.authService.getRefreshToken();
    this.inProgress = true;
    this.profileService
      .update(this.form.value)
      .pipe(finalize(() => (this.inProgress = false)))
      .subscribe(profile => {
        this.manageProfileState.setProfile(profile);
        this.configState.refreshAppState().subscribe(() => {
          this.menuService.appStateRefresh.next(true);
        });
        this.toasterService.success(this.isAdUser ? '::LABEL_PersonalSettingSync' : '::LABEL_PersonalSettingSaved', '', {
          messageLocalizationParams: [this.form.value.name],
          life: 5000
        });

        if (isRefreshTokenExists) {
          return this.authService.refreshToken();
        }

        if (isLogOutConfirmMessageVisible) {
          this.showLogoutConfirmMessage();
        }
      });
  }

  logoutConfirmation = () => {
    this.authService.logout().subscribe();
  };

  private isLogoutConfirmMessageActive() {
    return this.isPersonalSettingsChangedConfirmationActive;
  }

  private showLogoutConfirmMessage() {
    this.confirmationService
      .info(
        'AbpAccount::PersonalSettingsChangedConfirmationModalDescription',
        'AbpAccount::PersonalSettingsChangedConfirmationModalTitle',
      )
      .pipe(filter(status => status === Confirmation.Status.confirm))
      .subscribe(this.logoutConfirmation);
  }

}
