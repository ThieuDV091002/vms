import { ListService, PagedResultDto } from '@abp/ng.core';
import { eFeatureManagementComponents } from '@abp/ng.feature-management';
import { GetTenantsInput, TenantDto, TenantService } from '@abp/ng.tenant-management/proxy';
import { TenantService as TenantMgmtService, TenantService as TenantExService } from '@proxy/services';
import { Confirmation } from '@abp/ng.theme.shared';
import {
  EXTENSIONS_IDENTIFIER,
  FormPropData,
  generateFormFromProps,
} from '@abp/ng.components/extensible';
import { Component, inject, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { eTenantManagementComponents } from '@abp/ng.tenant-management';
import { AppUtils } from '../utils/app.utils';
import { ModelingTemplateComponent } from '../modeling-template/modeling-template.component';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { ApplicationsDto } from '@apis/corporate/molex/uef/dtos';
import { ModelingHistoryDto } from '@proxy/dtos/modeling';
import { ApplicationsService } from '@apis/corporate/molex/uef/services';
import { CorporateService, DivisionService, SiteService } from '@apis/corporate';
import { CreateUpdateTenantModelingDto, UpdateTenantPasswordDto } from '@proxy/dtos/tenant';
import { CorporateDto, DivisionDto, SiteDto } from '@apis/corporate/dtos';
import { of } from 'rxjs';
import { TenantService as UFETenantService } from '@proxy/services/tenant.service';
@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: eTenantManagementComponents.Tenants,
    },
  ],
})
export class TenantsComponent extends ModelingBase<TenantMgmtService, GetTenantsInput, CreateUpdateTenantModelingDto> implements OnInit {
  protected readonly tenantService = inject(TenantService);

  protected readonly tenantExService = inject(TenantExService);
  private readonly injector = inject(Injector);
  @ViewChild('modelingTemplate') modelingTemplate: ModelingTemplateComponent;
  data: PagedResultDto<TenantDto> = { items: [], totalCount: 0 };

  selected!: TenantDto;

  tenantForm!: UntypedFormGroup;

  isModalVisible!: boolean;

  visibleFeatures = false;

  providerKey!: string;

  modalBusy = false;

  featureManagementKey = eFeatureManagementComponents.FeatureManagement;

  applicationsData: ApplicationsDto[] = [];
  updateTenantPasswordDto: UpdateTenantPasswordDto = { tenantId: '', password: '' };
  dataTierData: any;
  isResetPassword = false;
  isHistoryModalVisible = false;
  isManageConnectionStrings = false;
  useTheSharedDatabase = false;
  defaultConnectionString: string;
  historys: PagedResultDto<ModelingHistoryDto>;
  info: string;
  corporates: CorporateDto[] = []
  divisions: DivisionDto[] = []
  sites: SiteDto[] = []
  get hasSelectedTenant(): boolean {
    return Boolean(this.selected.id);
  }

  onVisibleFeaturesChange = (value: boolean) => {
    this.visibleFeatures = value;
  };

  constructor(
    public service: TenantMgmtService,
    public list: ListService<GetTenantsInput>,
    private fb: FormBuilder,
    private applicationService: ApplicationsService,
    private corporateService: CorporateService,
    private divisionService: DivisionService,
    private siteService: SiteService,
    private localizationService: LocalizationService,
    private ufeTenantService: UFETenantService
  ) {
    super(service, list, 'tenant');
  }

  ngOnInit() {
    this.hookToQuery();
    this.localizationService.get('::LABEL_Tenant').subscribe(data => {
      this.info = data
    });
  }

  getApplications() {
    this.applicationService.getAllInstances().subscribe(res => {
      this.applicationsData = res;
    })
  }

  getDataTier(dataTierType) {
    let request;
    if (dataTierType === 'Corporate') {
      if (this.corporates.length > 0) {
        request = of(this.corporates)
      }
      else
        request = this.corporateService.getAllInstances();
    }
    if (dataTierType === 'Division') {
      if (this.divisions.length > 0) {
        request = of(this.divisions)
      }
      else
        request = this.divisionService.getAllInstances();
    }
    if (dataTierType === 'Site') {
      if (this.sites.length > 0) {
        request = of(this.sites)
      }
      else {
        request = this.siteService.getAllInstances();
      }

    }
    request.subscribe(res => {
      if (dataTierType === "Corporate") {
        this.corporates = res;
      }
      else if (dataTierType === "Division") {
        this.divisions = res;
      }
      else if (dataTierType === "Site") {
        this.sites = res;
      }
      this.dataTierData = res;
    })
  }

  private createTenantForm() {
    const data = new FormPropData(this.injector, this.selected);
    this.tenantForm = generateFormFromProps(data);
    this.tenantForm.addControl('displayName', this.fb.control(this.selected.extraProperties?.DisplayName || '', Validators.required));
    this.tenantForm.addControl('description', this.fb.control(this.selected.extraProperties?.Description || ''));
    this.tenantForm.addControl('displayLongText', this.fb.control(this.selected.extraProperties?.DisplayLongText || '', Validators.required));
    this.tenantForm.addControl('application', this.fb.control(this.selected.extraProperties?.ApplicationId || '', Validators.required));
    this.tenantForm.addControl('dataTierType', this.fb.control(this.selected.extraProperties?.DataTierType || '', Validators.required));
    this.tenantForm.addControl('dataTier', this.fb.control(this.selected.extraProperties?.DataTierId || '', Validators.required));
    this.tenantForm.controls['dataTierType'].valueChanges.subscribe(type => {
      this.getDataTier(type);
      this.tenantForm.controls['dataTier'].setValue('');
    })
    setTimeout(() => {
      this.tenantForm.controls['name'].valueChanges.subscribe(name => {
        this.tenantForm.controls['displayName'].setValue(name);
      });
    }, 50);
    this.tenantForm.controls['application'].valueChanges.subscribe(appId => {
      const selectedApp = this.applicationsData.find(app => app.id === appId);
      this.tenantForm.controls['applicationName']?.setValue(selectedApp?.name || '');
    });
    if (!this.tenantForm.contains('applicationName')) {
      this.tenantForm.addControl('applicationName', this.fb.control(this.selected.extraProperties?.ApplicationName || ''));
    }
  }

  addTenant() {
    if (this.applicationsData.length === 0) {
      this.getApplications();
    }
    this.selected = {} as TenantDto;
    this.createTenantForm();
    this.isModalVisible = true;
  }

  editTenant(row: any) {
    if (this.applicationsData.length === 0) {
      this.getApplications();
    }
    this.tenantService.get(row.id).subscribe(res => {
      this.selected = res;
      this.getDataTier(this.selected.extraProperties?.DataTierType)
      this.createTenantForm();
      this.isModalVisible = true;
    });
  }

  save() {
    if (!this.tenantForm.valid || this.modalBusy) return;
    this.modalBusy = true;
    const requestBody: any = {
      name: this.tenantForm.value.name,
      adminEmailAddress: this.tenantForm.value.adminEmailAddress,
      adminPassword: this.tenantForm.value.adminPassword,
      extraProperties: {
        DisplayName: this.tenantForm.value.displayName,
        Description: this.tenantForm.value.description,
        DisplayLongText: this.tenantForm.value.displayLongText,
        ApplicationId: this.tenantForm.value.application,
        ApplicationName: this.tenantForm.value.applicationName,
        DataTierType: this.tenantForm.value.dataTierType,
        DataTierId: this.tenantForm.value.dataTier,
        DataTierName: this.dataTierData.find(x => x.id === this.tenantForm.value.dataTier)?.displayName
      }
    }

    const { id } = this.selected;

    (id
      ? this.tenantService.update(id, { ...this.selected, ...requestBody })
      : this.tenantService.create(requestBody)
    )
      .pipe(finalize(() => (this.modalBusy = false)))
      .subscribe(() => {
        this.isModalVisible = false;
        if (!this.selected.id) {
          this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
            messageLocalizationParams: [this.info, requestBody.name],
          });
        }
        else {
          this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
            messageLocalizationParams: [this.info, this.selected.name],
          });
        }
        this.list.get();
      });
  }

  copy(e) {
    e.data.adminPassword = AppUtils.generatePassword();
    e.data.adminEmailAddress = 'admin@molex.com';
    if (e.data.displayName) {
      e.data.extraProperties.DisplayName = e.data.displayName;
    }
    this.tenantService.create(e.data).subscribe(res => {
      this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
        messageLocalizationParams: [this.info, e.data.name],
      });
      this.list.get();
      this.editTenant(res);
    });
  }

  getLocalDate(date: string) {
    return AppUtils.getLocalDate(date);
  }

  delete(row: any) {
    this.confirmationService
      .warn(
        '::LABEL_DeletionConfirmationMessage',
        '',
        {
          messageLocalizationParams: [this.info, row.name],
        }
      )
      .subscribe((status: Confirmation.Status) => {
        if (status === Confirmation.Status.confirm) {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.info, row.name],
          });
          this.tenantService.delete(row.id).subscribe(() => this.list.get());
        }
      });
  }

  hookToQuery() {
    this.list
      .hookToQuery(query => {
        return this.tenantExService.getList(query);
      })
      .subscribe(res => {
        res?.items.forEach(element => {
          element['displayName'] = element.extraProperties['DisplayName'] ?? "";
          element['description'] = element.extraProperties['Description'] ?? "";
        });
        this.data = res;
      });
  }

  onSharedDatabaseChange(value: boolean) {
    if (!value) {
      setTimeout(() => {
        const defaultConnectionString = document.getElementById(
          'defaultConnectionString'
        ) as HTMLInputElement;
        if (defaultConnectionString) {
          defaultConnectionString.focus();
        }
      }, 0);
    }
  }

  openFeaturesModal(row: any) {
    this.providerKey = row.name;
    setTimeout(() => {
      this.visibleFeatures = true;
    }, 0);
  }

  sort(data: any) {
    const { prop, dir } = data.sorts[0];
    this.list.sortKey = prop;
    this.list.sortOrder = dir;
  }
  editConnectionString(row) {
    if (row)
      this.tenantService
        .getDefaultConnectionString(row.id)
        .subscribe(res => {
          this.selected = row as TenantDto;
          if (res) {
            this.defaultConnectionString = res;
            this.useTheSharedDatabase = false;
          } else {
            this.defaultConnectionString = '';
            this.useTheSharedDatabase = true;
          }
          this.isManageConnectionStrings = true;
        });
  }
  testDefaultConnectionString() {
    this.tenantExService.checkConnectionString(this.defaultConnectionString).subscribe(res => {
      if (res) {
        this.toasterService.success('::MSG_ConnectionSucceeded');
      }
    });
  }
  updateDefaultConnectionString() {
    if (this.useTheSharedDatabase) {
      this.tenantService.deleteDefaultConnectionString(this.selected.id).subscribe(() => {
        this.toasterService.success('::LABEL_SuccessfullySaved');
        this.isManageConnectionStrings = false;
      });
    } else {
      this.tenantService
        .updateDefaultConnectionString(this.selected.id, this.defaultConnectionString)
        .subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullySaved');
          this.isManageConnectionStrings = false;
        });
    }
  }
  showResetPasswordModal(row: any) {
    this.isResetPassword = true;
    this.updateTenantPasswordDto = { tenantId: row.id, password: '' };
  }
  resetPassword() {
    this.modalBusy = true;
    this.ufeTenantService.updateResetPassword(this.updateTenantPasswordDto).subscribe(() => {
      this.toasterService.success('::LABEL_SuccessfullySaved');
      this.isResetPassword = false;
      this.modalBusy = false;
    }, error => {
      this.modalBusy = false;
    });
  }
}
