import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { MstStandardCategoryService } from '@apis/general/services/widget';
import { CreateUpdateMstStandardCategoryDto, MstStandardCategoryDto, MstStandardCategoryGetListInput } from '@apis/general/dtos/widget';
import { ModelingHistoryDto } from '@apis/general/dtos';


@Component({
  selector: 'app-standard-categories',
  templateUrl: './standard-categories.component.html',
  styleUrl: './standard-categories.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "DivisionsComponent",
    },
  ]
})
export class StandardCategoriesComponent extends ModelingBase<MstStandardCategoryService, MstStandardCategoryGetListInput, CreateUpdateMstStandardCategoryDto> implements OnInit {

  data: PagedResultDto<MstStandardCategoryDto> = { items: [], totalCount: 0 };
  selected: MstStandardCategoryDto;
  form: FormGroup;
  historys: PagedResultDto<ModelingHistoryDto>;
  isMoveModalVisible = false;
  isModalVisible = false;
  isHistoryModalVisible = false;
  selectedDivisionsIdList: string[];
  moveToCorporate = '';
  modalBusy = false;
  info: string;
  infos: string;
  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    public list: ListService<MstStandardCategoryGetListInput>,
    public service: MstStandardCategoryService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'mst-standard-category');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::StandardCategory').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::MENU_StandardCategory').subscribe(data => {
      this.infos = data
    });
  }

  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res;
    });
  }

  add() {
    this.selected = {} as MstStandardCategoryDto;
    this.buildForm();
    this.isModalVisible = true;
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

  edit(row: any) {
    this.service.get(row.id).subscribe((category) => {
      this.selected = category;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  copy(e) {
    this.service['create'](e.data).subscribe(res => {
      this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
        messageLocalizationParams: [this.info, e.data.name],
      });
      this.list.get();
      this.edit(res);
    });
  }

  delete(e: any) {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.info,e.name],
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
    request.subscribe(() => {
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
  searchByfilter(event: string) {
    this.list.hookToQuery(query => this.service.getList({ ...query })).subscribe(res => {
      this.data = res;
    })
  }

}
