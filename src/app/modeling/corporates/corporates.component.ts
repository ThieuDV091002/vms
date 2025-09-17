import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { finalize } from 'rxjs';
import { CorporateService } from '@apis/corporate';
import { CorporateGetListInput, CreateUpdateCorporateDto, CorporateDto, ModelingHistoryDto } from '@apis/corporate/dtos';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'corporates',
  templateUrl: './corporates.component.html',
  styleUrl: './corporates.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'CorporatesComponent',
    },
  ],
})
export class CorporatesComponent
  extends ModelingBase<CorporateService, CorporateGetListInput, CreateUpdateCorporateDto>
  implements OnInit {
  data: PagedResultDto<CorporateDto> = { items: [], totalCount: 0 };
  selected: CorporateDto;
  form: FormGroup;
  historys: PagedResultDto<ModelingHistoryDto>;
  isModalVisible = false;
  isHistoryModalVisible = false;
  modalBusy = false;
  searchName = '';
  info: string;
  infos: string;
  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    public list: ListService<CorporateGetListInput>,
    public service: CorporateService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'corporate');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::Corporate').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::MENU_Corporate').subscribe(data => {
      this.infos = data
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
    this.selected = {} as CorporateDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
    });
  }

  edit(row: any) {
    this.service.get(row.id).subscribe(corporate => {
      this.selected = corporate;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  delete(e: any) {
    this.confirmation
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info,e.name],
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
