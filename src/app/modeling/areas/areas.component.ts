import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { finalize } from 'rxjs';
import { AreaService, SiteService } from '@apis/corporate';
import { AreaDto, AreaGetListInput, CreateUpdateAreaDto, ModelingHistoryDto, SiteDto } from '@apis/corporate/dtos';
@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'AreasComponent',
    },
  ],
})
export class AreasComponent
  extends ModelingBase<AreaService, AreaGetListInput, CreateUpdateAreaDto>
  implements OnInit {
  data: PagedResultDto<AreaDto> = { items: [], totalCount: 0 };
  selected: AreaDto;
  form: FormGroup;
  historys: PagedResultDto<ModelingHistoryDto>;
  isMoveModalVisible = false;
  isModalVisible = false;
  isHistoryModalVisible = false;
  selectedAreasIdList: string[];
  siteData: SiteDto[] = [];
  moveToSite = '';
  modalBusy = false;
  searchName = '';
  info: string;
  infos: string;
  siteInfo: string;
  tenantInfo: any;

  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    public list: ListService<AreaGetListInput>,
    public service: AreaService,
    private siteService: SiteService,
    private localizationService: LocalizationService,
  ) {
    super(service, list, 'area');
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::Area').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::Areas').subscribe(data => {
      this.infos = data
    });
    this.localizationService.get('::Site').subscribe(data => {
      this.siteInfo = data
    });
    const width = window.innerWidth;
    const height = window.innerHeight;
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => {
        return this.service.getList({ ...query, name: this.searchName, tenantDataTierID: this.tenantInfo?.DataTierId, tenantDataTierType: this.tenantInfo?.DataTierType });
      })
      .subscribe(res => {
        this.data = res;
      });
  }

  getSite() {
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

  add() {
    if (this.siteData.length === 0) {
      this.getSite();
    }
    this.selected = {} as AreaDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      site: [this.selected.site || '', Validators.required],
      siteName: [this.siteData?.find(c => c.id === this.selected?.site)?.name || ''],
    });
    this.form.get('site').valueChanges.subscribe(selectedId => {
      const selectItem = this.siteData.find(c => c.id === selectedId);
      if (selectItem) {
        this.form.get('siteName').setValue(selectItem.name);
      }
    });
  }

  edit(row: any) {
    if (this.siteData.length === 0) {
      this.getSite();
    }
    this.service.get(row.id).subscribe(area => {
      this.selected = area;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  delete(e: any) {
    this.confirmation
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info, e.name],
      })
      .subscribe(status => {
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

  move(e) {
    if (this.siteData.length === 0) {
      this.getSite();
    }
    this.isMoveModalVisible = true;
    this.moveToSite = '';
    this.selectedAreasIdList = e.objectIds;
  }

  moveToNewSite() {
    if ([null, ''].includes(this.moveToSite) || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    let needToUpdate = {};
    const siteName = this.siteData.find(d => d.id === this.moveToSite)?.name || '';
    this.selectedAreasIdList.forEach(id => {
      const selectedData = this.data.items.filter((item: AreaDto) => {
        item.site = this.moveToSite;
        return item.id === id;
      })[0];
      const record = {
        name: selectedData.name,
        description: selectedData.description,
        displayName: selectedData.displayName,
        site: this.moveToSite,
        siteName: siteName
      };
      needToUpdate[id] = record;
    });
    this.isMoveModalVisible = false;
    const { name: nameValue } = needToUpdate[Object.keys(needToUpdate)[0]] || {};
    this.service.multipleUpdate(needToUpdate).pipe(finalize(() => { this.modalBusy = false; })).subscribe(res => {
      this.modalBusy = false;
      this.toasterService.success('::LABEL_MovedSuccessfully', '', {
        messageLocalizationParams: [this.info, nameValue, this.siteInfo, siteName],
      });
      this.isMoveModalVisible = false;
      this.list.get();
    });
  }

  searchByfilter(event: string) {
    this.searchName = event;
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

  selectChange(event) {
    if (event?.id) {
      this.form.controls['site'].setValue(event.id);
    } else {
      this.form.controls['site'].setValue(undefined);
    }
  }
}
