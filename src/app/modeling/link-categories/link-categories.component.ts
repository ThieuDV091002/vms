import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { finalize } from 'rxjs';
import { LinkCategoryService } from '@apis/general/links';
import { LinkCategoryGetListInput, CreateUpdateLinkCategoryDto, LinkCategoryDto } from '@apis/general/links/dtos';
import { ModelingHistoryDto } from '@apis/general/dtos';

@Component({
  selector: 'app-link-categories',
  templateUrl: './link-categories.component.html',
  styleUrl: './link-categories.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "LinkCategoriesComponent",
    },
  ]
})
export class LinkCategoriesComponent extends ModelingBase<LinkCategoryService, LinkCategoryGetListInput, CreateUpdateLinkCategoryDto> implements OnInit {

  data: PagedResultDto<LinkCategoryDto> = { items: [], totalCount: 0 };
  selected: LinkCategoryDto;
  form: FormGroup;
  historys: PagedResultDto<ModelingHistoryDto>;
  isModalVisible = false;
  isHistoryModalVisible = false;
  modalBusy = false;
  info: string;
  infos: string;

  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    public list: ListService<LinkCategoryGetListInput>,
    public service: LinkCategoryService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'link-category');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_LinkCategory').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::LABEL_LinkCategories').subscribe(data => {
      this.infos = data
    });
  }

  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res;
    });
  }

  add() {
    this.selected = {} as LinkCategoryDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      sequence: [this.selected.sequence || 0, [Validators.required, this.qtyGreaterThanZeroValidator()]],
      tenantId: [this.selected.tenantId || ''],
      tenantName: [this.selected.tenantName || '']
    });
  }

  qtyGreaterThanZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value > 0;
      return isValid ? null : { qtyGreaterThanZero: { value: control.value } };
    };
  }

  edit(row: any) {
    this.service.get(row.id).subscribe((linkCategory) => {
      this.selected = linkCategory;
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
