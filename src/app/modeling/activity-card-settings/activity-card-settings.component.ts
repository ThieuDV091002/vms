import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { CurrentUserDto, ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { ActivityCardPriorityService, ActivityCardSettingsService } from '@apis/ticket';
import { ModelingBase } from '../modeling-base';
import { ActivityCardPriorityDto, ActivityCardSettingsDto, ActivityCardSettingsGetListInput, CreateUpdateActivityCardSettingsDto } from '@apis/ticket/dtos';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { ModelingHistoryDto } from '@apis/general/dtos';
import { debounceTime, finalize, Subject } from 'rxjs';
import { AreaDto, CellDto, SiteDto } from '@apis/corporate/dtos';
import { SiteService } from '@apis/corporate/site.service';
import { UserService } from '@proxy/services';
import { IdentityUserDto, IdentityUserService } from '@abp/ng.identity/proxy';
import { AppUtils } from '../utils/app.utils';
import { UserGroupUsersDto } from '@proxy/dtos/user-group';

@Component({
  selector: 'app-activity-card-settings',
  templateUrl: './activity-card-settings.component.html',
  styleUrl: './activity-card-settings.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "ActivityCardSettingsComponent",
    },
  ]
})
export class ActivityCardSettingsComponent extends ModelingBase<ActivityCardSettingsService, ActivityCardSettingsGetListInput, CreateUpdateActivityCardSettingsDto> implements OnInit {

  data: PagedResultDto<ActivityCardSettingsDto> = { items: [], totalCount: 0 };
  selected: ActivityCardSettingsDto;
  form: FormGroup;
  historys: PagedResultDto<ModelingHistoryDto>;
  isModalVisible = false;
  isHistoryModalVisible = false;
  modalBusy = false;
  keyword = '';
  info: string;
  siteData: SiteDto[] = [];
  areaData: AreaDto[] = [];
  cellData: CellDto[] = [];
  activityCardPriorityData: ActivityCardPriorityDto[] = [];
  userData: IdentityUserDto[] = [];
  selectedSiteData: SiteDto;
  // filteredUserOptions: IdentityUserDto[] = [];
  tenantInfo: any;
  userSearchInput$ = new Subject<string | null>();
  debounceTime = 500;
  selectedUserMap = new Map<string, IdentityUserDto | UserGroupUsersDto | CurrentUserDto>();
  copySelectedSiteData: SiteDto;
  copySelectedAreaData: AreaDto;
  copySelectedCellData: CellDto;

  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    public list: ListService<ActivityCardSettingsGetListInput>,
    public service: ActivityCardSettingsService,
    private localizationService: LocalizationService,
    private siteService: SiteService,
    private activityCardPriorityservice: ActivityCardPriorityService,
    private identityUserService: IdentityUserService,
  ) {
    super(service, list, 'activity-card-settings');
    this.tenantInfo = this.configService.getOne('extraProperties');

  }

  ngOnInit(): void {
    this.hookToQuery();

    this.registSearchDebounce();
    this.localizationService.get('::LABEL_ActivityCardSettings').subscribe(data => {
      this.info = data
    });
  }

  registSearchDebounce() {
    // user input search input debounce
    this.userSearchInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.getUsers(searchItem);
      })
  }

  getUsers(userSearchItem = ''): void {
    this.identityUserService.getList({ filter: userSearchItem, maxResultCount: 10 }).subscribe((res) => {
      this.userData = res.items;
    });
  }

  getSiteData() {
    if (this.tenantInfo && this.tenantInfo.DataTierType === 'Site') {
      this.siteService.get(this.tenantInfo.DataTierId).subscribe(res => {
        this.siteData = [res];
      });
    } else {
      this.siteService.getAllInstances().subscribe(res => {
        this.siteData = res;
      });
    }
  }

  getUserDisplayName(user: any) {
    return AppUtils.getUserDisplayName(user);
  }

  getActivityCardPriorityData() {
    this.activityCardPriorityservice.getAllInstances().subscribe(res => {
      this.activityCardPriorityData = res;
    });
  }


  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList({ ...query, keyword: this.keyword }) }).subscribe(res => {
      this.data = res;
    });
  }

  edit(row: any) {
    if (this.userData.length === 0 || this.siteData.length === 0 || this.activityCardPriorityData.length === 0) {
      this.getSiteData();
      this.getUsers();
      this.getActivityCardPriorityData()
    }
    this.service.get(row.id).subscribe((setting) => {
      this.selected = setting;
      if (!this.userData.some(item => item.id === this.selected.defaultOwner) && this.selected.defaultOwner) {
        this.identityUserService.get(this.selected.defaultOwner).subscribe(item => {
          this.userData.unshift(item);
          this.userData = [...this.userData];
        })
      }
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

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || ''],
      displayName: [this.selected.displayName || ''],
      description: [this.selected.description || ''],
      site: [this.selected.site || undefined, Validators.required],
      area: [this.selected.area || undefined],
      cell: [this.selected.cell || undefined],
      defaultOwner: [this.selected.defaultOwner || ''],
      defaultPriority: [this.selected.defaultPriority || ''],
      escalationDuration: [this.selected.escalationDuration || 0],
      tenantId: [this.selected.tenantId || ''],
      tenantName: [this.selected.tenantName || '']
    }, { validators: this.atLeastOneFieldValidator(['defaultOwner', 'defaultPriority', 'escalationDuration']) });
    if (this.selected?.id) {
      this.siteService.getTreeView(this.selected.site).subscribe(res => {
        this.selectedSiteData = res;
        this.areaData = res.areas;
        this.cellData = this.areaData.find(item => item.id === this.selected.area)?.cells;
      })
    }
    this.form.controls['site'].valueChanges.subscribe(value => {
      if (value) {
        this.siteService.getTreeView(value).subscribe(res => {
          this.selectedSiteData = res;
          this.areaData = res.areas;
          this.form.controls['area'].setValue(undefined);
          this.form.controls['cell'].setValue(undefined);
        })
      } else {
        this.form.controls['area'].setValue(undefined);
        this.form.controls['cell'].setValue(undefined);
        this.areaData = [];
        this.cellData = [];
      }
    });

    this.form.controls['area'].valueChanges.subscribe(value => {
      if (value) {
        const selectedArea = this.selectedSiteData.areas.find(item => item.id === value);
        this.cellData = selectedArea.cells;
      } else {
        this.form.controls['cell'].setValue(undefined);
        this.cellData = [];
      }
    });
  }

  atLeastOneFieldValidator(fields: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as any;
      const isValid = fields.some(field => formGroup.controls[field].value);
      return isValid ? null : { atLeastOneField: true };
    };
  }

  add() {
    if (this.userData.length === 0 || this.siteData.length === 0 || this.activityCardPriorityData.length === 0) {
      this.getSiteData();
      this.getUsers();
      this.getActivityCardPriorityData()
    }

    this.selected = {} as ActivityCardSettingsDto;
    this.areaData = [];
    this.cellData = [];
    this.buildForm();
    if (this.tenantInfo && this.tenantInfo?.DataTierType === 'Site') {
      this.siteService.getTreeView(this.tenantInfo?.DataTierId).subscribe(res => {
        this.selectedSiteData = res;
        this.areaData = res.areas;
        this.cellData = this.areaData.find(item => item.id === this.selected.area)?.cells;
        this.form.controls['site'].setValue(this.tenantInfo?.DataTierId);
      })
    }
    this.isModalVisible = true;
  }

  save() {
    if (this.form.invalid || this.modalBusy) {
      return;
    }
    const site = this.siteData.find(item => item.id === this.form.value.site);
    const area = this.areaData?.find(item => item.id === this.form.value.area);
    const cell = this.cellData?.find(item => item.id === this.form.value.cell);
    const owner = this.userData.find(item => item.id === this.form.value.defaultOwner);
    const priority = this.activityCardPriorityData.find(item => item.id === this.form.value.defaultPriority);
    this.modalBusy = true;
    let name = '';
    name = site?.name;
    if (area) {
      name += '-' + area?.name;
    }
    if (cell) {
      name += '-' + cell.name;
    }
    this.form.controls['name'].setValue(name);
    this.form.controls['displayName'].setValue(name);
    if (!this.form.value.escalationDuration) {
      this.form.controls['escalationDuration'].setValue(0);
    } else {
      this.form.controls['escalationDuration'].setValue(Number(this.form.value.escalationDuration));
    }
    const request = this.selected.id
      ? this.service.update(this.selected.id, {
        ...this.form.value, siteName: site?.name || '',
        areaName: area?.name || '',
        cellName: cell?.name || '',
        defaultOwnerName: owner?.userName || '',
        defaultPriorityName: priority?.name || ''
      })
      : this.service.create({
        ...this.form.value, siteName: site?.name || '',
        areaName: area?.name || '',
        cellName: cell?.name || '',
        defaultOwnerName: owner?.userName || '',
        defaultPriorityName: priority?.name || ''
      });
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

  selectChange(event, type) {
    if (type === 'site') {
      if (event?.id) {
        this.form.controls['site'].setValue(event.id);
      } else {
        this.form.controls['site'].setValue(undefined);
      }

    }

    if (type === 'area') {
      if (event?.id) {
        this.form.controls['area'].setValue(event.id);
      }
      else {
        this.form.controls['area'].setValue(undefined);
      }
    }

    if (type === 'cell') {
      if (event?.id) {
        this.form.controls['cell'].setValue(event.id);
      }
      else {
        this.form.controls['cell'].setValue(undefined);
      }
    }

    if (type === 'defaultOwner') {
      if (event?.id) {
        this.form.controls['defaultOwner'].setValue(event.id);
      }
      else {
        this.form.controls['defaultOwner'].setValue(undefined);
      }
    }

    if (type === 'defaultPriority') {
      if (event?.id) {
        this.form.controls['defaultPriority'].setValue(event.id);
      }
      else {
        this.form.controls['defaultPriority'].setValue(undefined);
      }
    }
  }

  copySelectChange(event, type) {
    if (type === 'site') {
      if (event?.id) {
        this.copySelectedSiteData = event;
        this.siteService.getTreeView(event.id).subscribe(res => {
          this.areaData = res.areas;
          this.copySelectedAreaData = undefined;
          this.copySelectedCellData = undefined;
        })
      } else {
        this.copySelectedSiteData = undefined;
      }
    }
    if (type === 'area') {
      if (event?.id) {
        this.copySelectedAreaData = event;
        const selectedArea = this.selectedSiteData.areas.find(item => item.id === event.id);
        this.cellData = selectedArea.cells;
        this.copySelectedCellData = undefined;
      }
      else {
        this.copySelectedAreaData = undefined;
      }
    }
    if (type === 'cell') {
      if (event?.id) {
        this.copySelectedCellData = event;
      }
      else {
        this.copySelectedCellData = undefined;
      }
    }
  }

  searchByfilter(event: string) {
    this.keyword = event;
    this.list.get();
  }

  copyModalOpen(event: any) {
    if (this.siteData.length === 0) {
      this.getSiteData();
    }
    if (this.tenantInfo && this.tenantInfo?.DataTierType === 'Site') {
      this.siteService.getTreeView(this.tenantInfo?.DataTierId).subscribe(res => {
        this.selectedSiteData = res;
        this.copySelectedSiteData = res;
        this.areaData = res.areas;
        this.cellData = this.areaData.find(item => item.id === this.selected.area)?.cells;
      })
    }
  }

  copySetting(e) {
    const info = this.removeLastS(e.objectType);
    let name = '';
    name = this.copySelectedSiteData?.name;
    if (this.copySelectedAreaData) {
      name += '-' + this.copySelectedAreaData?.name;
    }
    if (this.copySelectedCellData) {
      name += '-' + this.copySelectedCellData.name;
    }
    this.service.create({
      name: name,
      description: '',
      displayName: name,
      site: this.copySelectedSiteData?.id,
      siteName: this.copySelectedSiteData?.name || '',
      area: this.copySelectedAreaData?.id,
      areaName: this.copySelectedAreaData?.name || '',
      cell: this.copySelectedCellData?.id,
      cellName: this.copySelectedCellData?.name || '',
      defaultOwner: e.data.defaultOwner,
      defaultOwnerName: e.data.defaultOwnerName,
      defaultPriority: e.data.defaultPriority,
      defaultPriorityName: e.data.defaultPriorityName,
      escalationDuration: e.data.escalationDuration,
      tenantId: e.data.tenantId,
      tenantName: e.data.tenantName,
    } as CreateUpdateActivityCardSettingsDto).subscribe(res => {
      this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
        messageLocalizationParams: [info, res.name],
      });
      this.list.get();
      this.edit(res);
    });
  }
}
