import { Component, OnInit } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { MessageCategoryService } from '@apis/general';
import { CreateUpdateMessageCategoryDto, MessageCategoryDto, MessageCategoryGetListInput, ModelingHistoryDto } from '@apis/general/dtos';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-message-categories',
  templateUrl: './message-categories.component.html',
  styleUrl: './message-categories.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "LinksComponent",
    },
  ]
})
export class MessageCategoriesComponent extends ModelingBase<MessageCategoryService, MessageCategoryGetListInput, CreateUpdateMessageCategoryDto> implements OnInit {
  data: PagedResultDto<MessageCategoryDto> = { items: [], totalCount: 0 };
  selected: MessageCategoryDto;
  isModalVisible = false;
  historys: PagedResultDto<ModelingHistoryDto>;
  modalBusy = false;
  info: string;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    public list: ListService<MessageCategoryGetListInput>,
    public service: MessageCategoryService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'message-category');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_MessageCategory').subscribe(data => {
      this.info = data;
    });
  }

  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res;
    });
  }

  add() {
    this.selected = {} as MessageCategoryDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  edit(row: any) {
    this.service.get(row.id).subscribe((messageCategory) => {
      this.selected = messageCategory;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      tenantId: [this.selected.tenantId || ''],
      tenantName: [this.selected.tenantName || '']
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

}
