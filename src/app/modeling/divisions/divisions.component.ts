import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { finalize } from 'rxjs';
import { DivisionService, CorporateService } from '@apis/corporate';
import { DivisionGetListInput, CreateUpdateDivisionDto, DivisionDto, CorporateDto, ModelingHistoryDto } from '@apis/corporate/dtos';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'divisions',
  templateUrl: './divisions.component.html',
  styleUrl: './divisions.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'DivisionsComponent',
    },
  ],
})
export class DivisionsComponent
  extends ModelingBase<DivisionService, DivisionGetListInput, CreateUpdateDivisionDto>
  implements OnInit {
  protected readonly corporateService = inject(CorporateService);

  data: PagedResultDto<DivisionDto> = { items: [], totalCount: 0 };
  selected: DivisionDto;
  form: FormGroup;
  historys: PagedResultDto<ModelingHistoryDto>;
  isMoveModalVisible = false;
  isModalVisible = false;
  isHistoryModalVisible = false;
  selectedDivisionsIdList: string[];
  corporateData: CorporateDto[] = [];
  moveToCorporate = '';
  modalBusy = false;
  searchName = '';
  info: string;
  infos: string;
  corporateInfo: string;

  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    public list: ListService<DivisionGetListInput>,
    public service: DivisionService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'division');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::Division').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::LABEL_Divisions').subscribe(data => {
      this.infos = data
    });
    this.localizationService.get('::Corporate').subscribe(data => {
      this.corporateInfo = data
    });
  }

  private getCorporate() {
    this.corporateService.getAllInstances().subscribe(res => {
      this.corporateData = res;
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

  add() {
    if (this.corporateData.length === 0) {
      this.getCorporate();
    }
    this.selected = {} as DivisionDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      corporate: [this.selected.corporate || '', Validators.required],
      corporateName: [this.corporateData.find(c => c.id === this.selected?.corporate)?.name || '']
    });
    this.form.get('corporate').valueChanges.subscribe(selectedId => {
      const selectItem = this.corporateData.find(c => c.id === selectedId);
      if (selectItem) {
        this.form.get('corporateName').setValue(selectItem.name);
      }
    });
  }

  edit(row: any) {
    if (this.corporateData.length === 0) {
      this.getCorporate();
    }
    this.service.get(row.id).subscribe(division => {
      this.selected = division;
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
    if (this.corporateData.length === 0) {
      this.getCorporate();
    }
    this.selectedDivisionsIdList = e.objectIds;
    this.isMoveModalVisible = true;
    this.moveToCorporate = '';
  }

  moveToNewCorporate() {
    if ([null, ''].includes(this.moveToCorporate) || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    let needToUpdate = {};
    const corporateName = this.corporateData.find(corp => corp.id === this.moveToCorporate)?.name || '';
    this.selectedDivisionsIdList.forEach(id => {
      const selectedData = this.data.items.filter((item: DivisionDto) => {
        item.corporate = this.moveToCorporate;
        return item.id === id;
      })[0];
      const record = {
        name: selectedData.name,
        description: selectedData.description,
        displayName: selectedData.displayName,
        corporate: this.moveToCorporate,
        corporateName: corporateName
      };
      needToUpdate[id] = record;
    });
    const { name: nameValue } = needToUpdate[Object.keys(needToUpdate)[0]] || {};

    this.service.multipleUpdate(needToUpdate).pipe(finalize(() => { this.modalBusy = false; })).subscribe(res => {
      this.modalBusy = false;
      this.toasterService.success('::LABEL_MovedSuccessfully', '', {
        messageLocalizationParams: [this.info, nameValue, this.corporateInfo, corporateName],
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
      this.form.controls['corporate'].setValue(event.id);
    } else {
      this.form.controls['corporate'].setValue(undefined);
    }
  }
}
