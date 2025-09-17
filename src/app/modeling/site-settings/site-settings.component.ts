import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { AreaService, SiteService } from '@apis/corporate';
import { SiteDto } from '@apis/corporate/dtos';
import { SiteSettingService } from '@apis/general';
import { CreateUpdateSiteSettingDto, SiteSettingDto, SiteSettingGetListInput } from '@apis/general/dtos';
@Component({
  selector: 'app-site-settings',
  templateUrl: './site-settings.component.html',
  styleUrl: './site-settings.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'SiteSettingsComponent',
    },
  ],
})
export class SiteSettingsComponent
  extends ModelingBase<SiteSettingService, SiteSettingGetListInput, CreateUpdateSiteSettingDto>
  implements OnInit
{
  selected: SiteSettingDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<SiteSettingDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Site', field: 'name'},
  ];
  info: string;
  sites: SiteDto[] = [];
  inputNumberErrorType = '';
  isCollapse = false;
  tenantInfo: any;

  constructor(
    public list: ListService<SiteSettingGetListInput>,
    public service: SiteSettingService,
    public areaService: AreaService,
    public siteService: SiteService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService,
  ) {
    super(service, list, 'site-setting');
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.getSites();
    this.localizationService.get('::MENU_SiteSetting').subscribe(data => {
      this.info = data});
  }

  getSites() {
    if (this.sites.length) {return;}
    this.siteService.getAllInstances().subscribe(data => {
      this.sites = data;
    });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => this.service.getList(query))
      .subscribe(res => {
        this.data = res;
      });
  }


  buildForm() {
    this.form = this.fb.group({
      name: [this.selected?.name || ''],
      siteName: [this.selected?.siteName || ''],
      siteId: [this.selected?.siteId || null, Validators.required],
      tenantId: [this.selected?.tenantId || null],
    });
  }

  add() {
    this.getSites();
    this.selected = {} as SiteSettingDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  save() {;
    if (this.form.invalid) {
      return;
    }
    const site = this.sites.find(s => s.id === this.form.value.siteId);
    const formData = {
      ...this.form.value,
      name: site?.name,
      siteName: site?.name || '',
      displayName: site?.name,
      safetyIncidentsTarget: this.getTargetData(this.selected?.safetyIncidentsTarget) || null,
      nearMissesTarget: this.getTargetData(this.selected?.nearMissesTarget) || null,
      externalQNsTarget: this.getTargetData(this.selected?.externalQNsTarget) || null,
      internalQNsTarget: this.getTargetData(this.selected?.internalQNsTarget) || null,
      copqTarget: this.getTargetData(this.selected?.copqTarget) || null,
      copqcogsTarget: this.getTargetData(this.selected?.copqcogsTarget) || null,
      poeeTarget: this.getTargetData(this.selected.poeeTarget) || null,
      peopleProdTarget:this.getTargetData(this.selected?.peopleProdTarget) || null,
      assetProdTarget: this.getTargetData(this.selected?.assetProdTarget) || null,
      oeeTarget: this.getTargetData(this.selected?.oeeTarget) || null,
    };

    const request = this.selected.id
      ? this.service.update(this.selected.id, formData)
      : this.service.create(formData);

    request.subscribe((response) => {
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully','',{
          messageLocalizationParams: [this.info,site.name],
        });
      }
      else{
        this.toasterService.success('::LABEL_UpdatedSuccessfully','',{
          messageLocalizationParams: [this.info,this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.form.reset();
      this.list.get();
    });
  }

  getTargetData(targetSettings: string) {
    if (!targetSettings) {return null}
    const target = JSON.parse(targetSettings);
    const years = Object.keys(target).filter(year => target[year].some(t => t !== null));
    // remove years without any target
    for (const year of Object.keys(target)) {
        if (!years.includes(year)) {
            delete target[year];
        }
    }
    return JSON.stringify(target);
  }

  copyModalOpen(event: any) {
    this.getSites();
  }

  copySetting(e) {
    const info = this.removeLastS(e.objectType);
    const site = this.sites.find(s => s.id === e.data.siteId);
    const copyData = {
      ...e.data,
      siteName: site?.name,
      name: site?.name,
      displayName: site?.name
    };

    this.service.create(copyData).subscribe(res => {
      this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
        messageLocalizationParams: [info, res.name],
      });
      this.list.get();
      this.edit(res);
    });
  }

  edit(row) {
    this.getSites();
    this.service.get(row.id).subscribe(data => {
      this.selected = data;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  delete(row) {
    this.confirmationService
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info,row.name],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service.delete(row.id).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyDeleted','',{
              messageLocalizationParams: [this.info,row.name],
            });
            this.list.get();
          });
        }
      });
  }
}
