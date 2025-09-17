import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, PagedResultDto, SessionStateService } from '@abp/ng.core';
import { Confirmation } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelingBase } from '../modeling-base';
import { LabelCategoryService, UserLabelService } from '@proxy';
import { LocalizationService } from '@abp/ng.core';
import { CreateUpdateUserLabelDto, UserLabelDto, UserLabelGetListInput } from '@proxy/dtos/user-label';
import { LabelCategoryDto, LabelCategoryGetListInput } from '@proxy/dtos/label-category';

@Component({
  selector: 'app-user-labels',
  templateUrl: './user-labels.component.html',
  styleUrl: './user-labels.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "UserLabelsComponent",
    },
  ],
})

export class UserLabelsComponent extends ModelingBase<UserLabelService, UserLabelGetListInput, CreateUpdateUserLabelDto> implements OnInit {
  selected: UserLabelDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<UserLabelDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  userLabel: UserLabelDto[] = [];
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::Category', field: 'categoryName' },
    { displayKey: '::LabelValue', field: 'labelValue' }
  ]
  labelCategories: LabelCategoryDto[] = [];
  info: string;
  constructor(
    public list: ListService<UserLabelGetListInput>,
    public service: UserLabelService,
    public labelCategoryService: LabelCategoryService,
    public fb: FormBuilder,
    private session: SessionStateService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'user-label');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_UserLabel').subscribe(data => {
      this.info = data
    });
  }
  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res
    });
  }
  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      category: [this.selected.category || '', Validators.required],
      categoryName: [this.selected.categoryName || ''],
      labelValue: [this.selected.labelValue || '', Validators.required],
      tenantId: [this.selected.tenantId || ''],
      displayName: [this.selected.displayName || '']
    });
  }
  add() {
    if (this.labelCategories.length === 0) {
      this.getCategories();
    }
    this.selected = {} as UserLabelDto;
    this.buildForm();
    this.isModalVisible = true;
  }
  save() {
    if (this.form.invalid) {
      return;
    }
    const category = this.labelCategories.find(x => x.id === this.form.value.category);

    if (!this.form.value.displayName) {
      this.form.patchValue({ displayName: this.form.value.name });
    }

    const request = this.selected.id
      ? this.service.update(this.selected.id, {...this.form.value, categoryName: category?.name || ''})
      : this.service.create({...this.form.value, categoryName: category?.name || ''});

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
    if (this.labelCategories.length === 0) {
      this.getCategories();
    }
    this.service.get(row.id).subscribe((data) => {
      this.selected = data;
      this.buildForm();
      this.isModalVisible = true;
    });
  }
  delete(row) {
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.info,row.name],
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

  async getCategories() {
    const input: LabelCategoryGetListInput = {
      filter: '',
      sorting: '',
      skipCount: 0,
      maxResultCount: 100

    };

    this.labelCategoryService.getList(input).subscribe(res => {
      this.labelCategories = res.items;
    });
  }

  search(e) {
    this.list.filter = e.target.value;
  }
}
