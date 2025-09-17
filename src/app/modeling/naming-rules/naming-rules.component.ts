import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { NamingRuleService } from '@apis/general';
import { CreateUpdateNamingRuleDto, ModelingHistoryDto, NamingRuleDto, NamingRuleGetListInput } from '@apis/general/dtos';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-naming-rules',
  templateUrl: './naming-rules.component.html',
  styleUrl: './naming-rules.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'NamingRulesComponent',
    },
  ],
})
export class NamingRulesComponent extends ModelingBase<NamingRuleService, NamingRuleGetListInput, CreateUpdateNamingRuleDto> implements OnInit {
  data: PagedResultDto<NamingRuleDto> = { items: [], totalCount: 0 };
  selected: NamingRuleDto;
  form: FormGroup;
  historys: PagedResultDto<ModelingHistoryDto>;
  isMoveModalVisible = false;
  isModalVisible = false;
  isHistoryModalVisible = false;
  modalBusy = false;
  searchName = "";
  info: string;
  infos: string;
  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    public list: ListService<NamingRuleGetListInput>,
    public service: NamingRuleService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'area');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::Area').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::Areas').subscribe(data => {
      this.infos = data
    });

  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => {
        return this.service.getList({ ...query, filter: this.searchName });
      })
      .subscribe(res => {
        this.data = res;
      });
  }



  add() {
    this.selected = {} as NamingRuleDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || '']
    });

  }

  edit(row: any) {
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

