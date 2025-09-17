import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, PagedResultDto, SessionStateService } from '@abp/ng.core';
import { Confirmation } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { LabelCategoryService } from '@proxy';
import { CreateUpdateLabelCategoryDto, LabelCategoryDto, LabelCategoryGetListInput } from '@proxy/dtos/label-category';
@Component({
  selector: 'app-label-categories',
  templateUrl: './label-categories.component.html',
  styleUrl: './label-categories.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "LabelCategoriesComponent",
    },
  ],
})
export class LabelCategoriesComponent extends ModelingBase<LabelCategoryService, LabelCategoryGetListInput, CreateUpdateLabelCategoryDto> implements OnInit {
  selected: LabelCategoryDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<LabelCategoryDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Name', field: 'name' }
  ]
  info: string;
  infos: string;
  constructor(
    public list: ListService<LabelCategoryGetListInput>,
    public service: LabelCategoryService,
    public fb: FormBuilder,
    private session: SessionStateService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'label-category');
  }
  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_LabelCategory').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::MENU_LabelCategory').subscribe(data => {
      this.infos = data
    });
  }
  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res
      this.data.items.forEach(item => {
        item.displayName = item.displayName || item.name;
      })

    });
  }
  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || ''],
      tenantId: [this.selected.tenantId || '']
      //description: [ this.selected.description || '', Validators.required]
    });
  }
  add() {
    this.selected = {} as LabelCategoryDto;
    this.buildForm();
    this.isModalVisible = true;
  }
  save() {
    if (this.form.invalid) {
      return;
    }

    if (!this.form.value.displayName) {
      this.form.patchValue({ displayName: this.form.value.name });
    }

    const request = this.selected.id
      ? this.service.update(this.selected.id, this.form.value)
      : this.service.create(this.form.value);
    request.subscribe(data => {
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
  edit(row) {
    this.service.get(row.id).subscribe((data) => {
      this.selected = data;
      this.buildForm();
      this.isModalVisible = true;
    });
  }
  delete(row) {
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.info, row.name],
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
          messageLocalizationParams: [this.info, row.name],
        });
        this.service.delete(row.id).subscribe(() => this.list.get());
      }
    });
  }

  sort(data: any) {
    const { prop, dir } = data.sorts[0];
    this.list.sortKey = prop;
    this.list.sortOrder = dir;
  }

  search(e) {
    this.list.filter = e.target.value;
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
