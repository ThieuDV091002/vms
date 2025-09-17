import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { finalize } from 'rxjs';
import { LocalizationService } from '@abp/ng.core';
import { ApplicationsGetListInput, CreateUpdateApplicationsDto, ApplicationsDto } from '@apis/corporate/molex/uef/dtos';
import { ApplicationsService } from '@apis/corporate/molex/uef/services';
import { ModelingHistoryDto } from '@apis/corporate/dtos';
import { FileService } from 'src/app/dashboard/services/file.service';
import { ApplicationService as OpenIdApplicationService } from '@proxy/services';
import { ApplicationDto } from '@proxy/dtos';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "ApplicationsComponent",
    }
  ]
})
export class ApplicationsComponent extends ModelingBase<ApplicationsService, ApplicationsGetListInput, CreateUpdateApplicationsDto> implements OnInit {

  data: PagedResultDto<ApplicationsDto> = { items: [], totalCount: 0 };
  selected: ApplicationsDto;
  form: FormGroup;
  openIdAppsForm: Array<FormGroup> = [];
  historys: PagedResultDto<ModelingHistoryDto>;
  isModalVisible = false;
  modalBusy = false;
  keyword = '';
  info: string;
  infos: string;
  uploadFile: File;
  inProgress = false;
  iconUrl: string | ArrayBuffer | null = null;
  attachmentMap = new Map<string, string>();
  activeOpenIdTabIndex: number = 0;
  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    public list: ListService<ApplicationsGetListInput>,
    public service: ApplicationsService,
    private localizationService: LocalizationService,
    private fileService: FileService,
    private openIdApplicationService: OpenIdApplicationService
  ) {
    super(service, list, 'applications');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_Application').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::Applications').subscribe(data => {
      this.infos = data
    });
  }

  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList({ ...query, name: this.keyword }) }).subscribe(res => {
      this.data = res;
    });
  }

  add() {
    this.selected = {} as ApplicationsDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.getUrl(this.selected.icon);
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      url: [this.selected.url || ''],
      icon: [this.selected.icon || '']
    });
    if (this.selected.id) {
      this.openIdAppsForm = [];
      this.openIdApplicationService.getList({ filter: this.selected.name, maxResultCount: 100 }).subscribe(res => {
        if (res.items && res.items.length > 0) {
          res.items.forEach(item => {
            const openIdAppForm = this.buildOpenIdAppForm(item);
            this.openIdAppsForm.push(openIdAppForm);
          }
          );
        }
      });
    }
  }
  buildOpenIdAppForm(app: ApplicationDto): FormGroup {
    return this.fb.group({
      id: [app.id || ''],
      clientId: [app.clientId || '', Validators.required],
      clientSecret: [app.clientSecret || null],
      displayName: [app.displayName || '', Validators.required],
      consentType: [app.consentType || ''],
      clientUri: [app.clientUri || environment.oAuthConfig.issuer],
      logoUri: [app.logoUri || null],
      applicationType: [app.applicationType || null],
      clientType: [app.clientType || 'public'],
      extensionGrantTypes: [app.extensionGrantTypes || []],
      postLogoutRedirectUris: [app.postLogoutRedirectUris || [environment.oAuthConfig.issuer]],
      redirectUris: [app.redirectUris || []],
      allowPasswordFlow: [app.allowPasswordFlow || true],
      allowClientCredentialsFlow: [app.allowClientCredentialsFlow || true],
      allowAuthorizationCodeFlow: [app.allowAuthorizationCodeFlow || true],
      allowRefreshTokenFlow: [app.allowRefreshTokenFlow || true],
      allowHybridFlow: [app.allowHybridFlow || false],
      allowImplicitFlow: [app.allowImplicitFlow || false],
      allowLogoutEndpoint: [app.allowLogoutEndpoint || true],
      allowDeviceEndpoint: [app.allowDeviceEndpoint || false],
      scopes: [app.scopes || [
        "address",
        "email",
        "phone",
        "profile",
        "roles",
        "UFE"
      ], Validators.required]
    });
  }
  edit(row: any) {
    this.service.get(row.id).subscribe((area) => {
      this.selected = area;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  delete(e: any) {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.info, e.name],
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.service.delete(e.id).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.info, e.name],
          });
          this.list.get();
        });
      }
    });
  }

  save() {
    if (this.form.invalid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    const request = this.selected.id
      ? this.service.update(this.selected.id, this.form.value)
      : this.service.create(this.form.value);
    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      this.modalBusy = false;
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.form.value.name],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.form.reset();
      this.list.get();
    });
  }

  searchByfilter(event) {
    this.keyword = event;
    this.list.get();
  }
  multiDelete(e) {
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.infos + '<br/>', e.objectNames.join(',<br/>')],
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.service['multipleDeleteByIds'](e.objectIds).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.infos, e.objectNames],
          });
          this.list.get()
        });
      }
    });
  }
  onFileChange(e: Event) {
    const htmlEl = e.target as HTMLInputElement;
    const file = htmlEl.files[0];
    if (file) {
      this.uploadFile = file;
    }
    this.uploadImage(htmlEl);
  }
  uploadImage(el) {
    if (this.uploadFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const arrayBuffer = reader.result.split(',')[1];
          this.inProgress = true;
          this.fileService.create(this.uploadFile.name, arrayBuffer).subscribe({
            next: res => {
              this.inProgress = false;
              this.selected.icon = res.url;
              this.form.patchValue({ icon: res.url });
              this.attachmentMap.set(res.url, <string>reader.result);
              this.iconUrl = <string>reader.result;
            },
            error: err => {
              this.inProgress = false;
              this.toasterService.error(err.error?.message || '::LABEL_UploadFailed');
            }
          });
        }
      };
      reader.readAsDataURL(this.uploadFile);
    }
  }
  getUrl(fileId: string) {
    if (!fileId) {
      this.iconUrl = null;
      return;
    }
    if (this.attachmentMap.has(fileId)) {
      return this.attachmentMap.get(fileId);
    }

    this.fileService.get(fileId)
      .subscribe((res: any) => {
        let imageUrl;
        if (typeof res === 'string') {
          imageUrl = 'data:image/jpeg;base64,' + res;
        } else {
          const blob = this.convertBase64ToBlob(res, 'image/jpeg');
          imageUrl = URL.createObjectURL(blob);
        }
        this.iconUrl = imageUrl;
        this.attachmentMap.set(fileId, imageUrl);
      });
  }
  convertBase64ToBlob(base64Data: string, contentType: string = 'application/octet-stream'): Blob {
    const sliceSize = 512;
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  updateOpenIdApplication(group: FormGroup) {
    if (group.invalid || this.modalBusy) {
      group.markAllAsTouched();
      return;
    }
    this.modalBusy = true;
    const data = group.value;
    this.openIdApplicationService.update(data.id, data)
      .pipe(finalize(() => { this.modalBusy = false; }))
      .subscribe({
        next: () => {
          this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
            messageLocalizationParams: [this.info, data.clientId],
          });
          // 可选：刷新列表或其他操作
        },
        error: (err) => {
          this.toasterService.error(err.error?.message || '::LABEL_UpdateFailed');
        }
      });
  }

  onRedirectUrisInput(group: FormGroup, value: string) {
    const arr = value.split('\n').map(x => x.trim()).filter(x => x);
    const ctrl = group.get('redirectUris');
    ctrl?.setValue(arr);
    ctrl?.markAsDirty();
    ctrl?.updateValueAndValidity();
  }
}
