import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelingBase } from '../modeling-base';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';
import { finalize } from 'rxjs';
import { LocalizationService } from '@abp/ng.core';
import { CentralizedUserService } from '@apis/corporate';
import { CentralizedUserDto, CentralizedUserGetListInput, CreateUpdateCentralizedUserDto } from '@apis/corporate/dtos';
import { ApplicationsDto } from '@apis/corporate/molex/uef/dtos';
import { ApplicationsService } from '@apis/corporate/molex/uef/services';
import { TenantDto } from '@abp/ng.tenant-management/proxy';
import { TenantService } from '@proxy/services';
import { KochidService } from 'src/app/shared/services/kochid.service';

@Component({
  selector: 'app-centralized-users',
  templateUrl: './centralized-users.component.html',
  styleUrl: './centralized-users.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "CentralizedUsersComponent",
    },
  ]
})
export class CentralizedUsersComponent extends ModelingBase<CentralizedUserService, CentralizedUserGetListInput, CreateUpdateCentralizedUserDto> implements OnInit {
  private readonly injector = inject(Injector);

  data: PagedResultDto<CentralizedUserDto> = { items: [], totalCount: 0 };
  isModalVisible = false;
  modalBusy = false;
  form!: FormGroup;
  selected!: CentralizedUserDto;
  tenantsData: TenantDto[];
  readonly = true;
  selectedTenants = [];
  info: string;
  infos: string;
  isCollapse = false;

  constructor(
    public list: ListService<CentralizedUserGetListInput>,
    public service: CentralizedUserService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private applicationService: ApplicationsService,
    private tenantService: TenantService,
    private localizationService: LocalizationService,
    private kochidService: KochidService,
  ) {
    super(service, list, 'centralized-user');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.getTenants();
    this.tenantService.apiName = 'corporate';
    this.localizationService.get('::LABEL_CentralizedUser').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::LABEL_CentralizedUsers').subscribe(data => {
      this.infos = data
    });
  }

  getTenants() {
    this.tenantService.getList({ maxResultCount: 1000 }).subscribe(res => {
      this.tenantsData = res.items.map(item => {
        const displayName = item.extraProperties?.DisplayName || '';
        const description = item.extraProperties?.DisplayLongText || '';
        let combinedDisplayName = displayName;
        if (displayName && description) {
          combinedDisplayName += " - " + description;
        } else if (description) {
          combinedDisplayName = description;
        }
        return {
          ...item,
          displayName: combinedDisplayName
        };
      });
    });
  }

  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res;
    });
  }

  add() {
    if (this.tenantsData.length === 0) {
      this.getTenants(); 
    }
    this.selected = {} as CentralizedUserDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.selectedTenants = this.selected.accessibleTenants?.map(item => { return item.tenantId });
    this.form = this.fb.group({
      email: [this.selected.emailAddress || '', [Validators.required, Validators.email]],
      name: [this.selected.name || ''],
      lastName: [this.selected.lastName || ''],
      firstName: [this.selected.firstName || ''],
      phoneNumber: [this.selected.phoneNumber || ''],
      supervisor: [this.selected.supervisor || ''],
      isActive: [this.selected.isActive || false],
      lockoutEnabled: [this.selected.lockoutEnabled || false],
      accessibleTenants: [this.selectedTenants || '', Validators.required],
    });
  }

  edit(row: any) {
    if (this.tenantsData.length === 0) {
      this.getTenants(); 
    }
    this.service.get(row.id).subscribe((user) => {
      this.selected = user;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  copy(e) {
    this.kochidService.getUserInfo(e.data.emailAddress, { skipAddingHeader: true }).subscribe(kochRes => {
      if (kochRes?.resources?.length > 0) {
        this.service['get'](e.data.id).subscribe((res) => {
          const info = this.removeLastS(e.objectType);
          e.data.accessibleTenants = res.accessibleTenants;
          e.data.name = kochRes?.resources[0].attributes.sAMAccountName;
          e.data.displayName = kochRes?.resources[0].attributes.sAMAccountName;
          e.data.firstName = kochRes?.resources[0].attributes.givenName;
          e.data.lastName = kochRes?.resources[0].attributes.sn;
          e.data.phoneNumber = kochRes?.resources[0].attributes.mobile ?? '';
          this.service['create'](e.data).subscribe(res => {
            this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
              messageLocalizationParams: [info, e.data.name],
            });
            this.list.get();
            this.edit(res);
          });
        });
      } else {
        this.confirmation.warn('AbpAccount::Volo.Account:InvalidEmailAddress', 'AbpExceptionHandling::DefaultErrorMessage404', {
          messageLocalizationParams: [e.data.emailAddress],
          hideCancelBtn: true,
          yesText: 'AbpUi::Close',
        })
      }
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
    const requestBody: CreateUpdateCentralizedUserDto = {
      emailAddress: this.form.value.email,
      name: this.form.value.name,
      displayName: '',
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      phoneNumber: this.form.value.phoneNumber,
      supervisor: this.form.value.supervisor,
      isActive: this.form.value.isActive,
      lockoutEnabled: this.form.value.lockoutEnabled,
      accessibleTenants: this.form.value.accessibleTenants.map(item => { return { tenantId: item, tenantName: this.tenantsData.find(x => x.id === item).name } }),
      extraProperties: {}
    };
    this.modalBusy = true;
    const request = this.selected.id
      ? this.service.update(this.selected.id, requestBody)
      : this.service.create(requestBody);
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

  getUserInfoByEmail(email) {
    if (email) {
      this.kochidService.getUserInfo(email, { skipAddingHeader: true }).subscribe(res => {
        if (res?.resources?.length > 0) {
          this.form.controls['name'].setValue(res?.resources[0].attributes.sAMAccountName);
          this.form.controls['firstName'].setValue(res?.resources[0].attributes.givenName);
          this.form.controls['lastName'].setValue(res?.resources[0].attributes.sn);
          this.form.controls['phoneNumber'].setValue(res?.resources[0].attributes.mobile ?? '');
        } else {
          this.confirmation.warn('AbpAccount::Volo.Account:InvalidEmailAddress', 'AbpExceptionHandling::DefaultErrorMessage404', {
            messageLocalizationParams: [email],
            hideCancelBtn: true,
            yesText: 'AbpUi::Close',
          })
        }
      })
    }
  }

  selectedTenantChanges(event) {
    this.form.controls['accessibleTenants'].setValue(event.map(item => { return item.id }));
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
}
