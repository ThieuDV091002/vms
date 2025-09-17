import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { finalize } from 'rxjs';
import { DivisionService, SiteService } from '@apis/corporate';
import { CreateUpdateSiteDto, DivisionDto, ModelingHistoryDto, SiteDto, SiteGetListInput } from '@apis/corporate/dtos';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'SitesComponent',
    },
  ],
})
export class SitesComponent
  extends ModelingBase<SiteService, SiteGetListInput, CreateUpdateSiteDto>
  implements OnInit {
  data: PagedResultDto<SiteDto> = { items: [], totalCount: 0 };
  selected: SiteDto;
  form: FormGroup;
  historys: PagedResultDto<ModelingHistoryDto>;
  isMoveModalVisible = false;
  isModalVisible = false;
  isHistoryModalVisible = false;
  selectedSitesIdList: string[];
  divisionData: DivisionDto[] = [];
  moveToDivision = '';
  modalBusy = false;
  searchName = '';
  info: string;
  infos: string;
  divisionInfo: string;
  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    public list: ListService<SiteGetListInput>,
    public service: SiteService,
    private divisionService: DivisionService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'site');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::Site').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::LABEL_Sites').subscribe(data => {
      this.infos = data
    });
    this.localizationService.get('::Division').subscribe(data => {
      this.divisionInfo = data
    });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => {
        return this.service.getList({ ...query, name: this.searchName });
      })
      .subscribe(res => {
        this.data = res;
      });
  }

  getDivision() {
    this.divisionService.getAllInstances().subscribe(res => {
      this.divisionData = res;
    });
  }

  add() {
    if (this.divisionData.length === 0) {
      this.getDivision();
    }
    this.selected = {} as SiteDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      division: [this.selected.division || '', Validators.required],
      divisionName: [this.divisionData.find(c => c.id === this.selected?.division)?.name || ''],
      sapSiteCode: [this.selected.sapSiteCode || ''],
    });
    this.form.get('division').valueChanges.subscribe(selectedId => {
      const selectItem = this.divisionData.find(c => c.id === selectedId);
      if (selectItem) {
        this.form.get('divisionName').setValue(selectItem.name);
      }
    });
  }

  edit(row: any) {
    if (this.divisionData.length === 0) {
      this.getDivision();
    }
    this.service.get(row.id).subscribe(site => {
      this.selected = site;
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
    if (this.divisionData.length === 0) {
      this.getDivision();
    }
    this.isMoveModalVisible = true;
    this.moveToDivision = '';
    this.selectedSitesIdList = e.objectIds;
  }

  moveToNewDivision() {
    if ([null, ''].includes(this.moveToDivision) || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    let needToUpdate = {};
    const divisionName = this.divisionData.find(d => d.id === this.moveToDivision)?.name || '';

    this.selectedSitesIdList.forEach(id => {
      const selectedData = this.data.items.filter((item: SiteDto) => {
        item.division = this.moveToDivision;
        return item.id === id;
      })[0];
      const record = {
        name: selectedData.name,
        description: selectedData.description,
        displayName: selectedData.displayName,
        division: this.moveToDivision,
        divisionName: divisionName,
        sapSiteCode: '',
      };
      needToUpdate[id] = record;
    });
    this.isMoveModalVisible = false;
    const { name: nameValue } = needToUpdate[Object.keys(needToUpdate)[0]] || {};
    this.service.multipleUpdate(needToUpdate).pipe(finalize(() => { this.modalBusy = false; })).subscribe(res => {
      this.modalBusy = false;
      this.toasterService.success('::LABEL_MovedSuccessfully', '', {
        messageLocalizationParams: [this.info, nameValue, this.divisionInfo, divisionName],
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
}
