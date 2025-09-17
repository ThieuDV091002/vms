import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation } from '@abp/ng.theme.shared';
import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { TextTemplateService } from '@proxy/services';
import { CreateUpdateTextTemplateDto, TextTemplateDto, TextTemplateGetListInput } from '@proxy/dtos/text-template';
@Component({
  selector: 'text-template',
  templateUrl: './text-template.component.html',
  styleUrl: './text-template.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "UserMenuComponent",
    },
  ],
})
export class TextTemplateComponent extends ModelingBase<TextTemplateService, TextTemplateGetListInput, CreateUpdateTextTemplateDto> implements OnInit {

  selected: TextTemplateDto;
  isModalVisible: boolean;
  data: PagedResultDto<TextTemplateDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  isShowLayout: boolean = false;
  layouts: TextTemplateDto[] = [];
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::IsLayout', field: 'isLayout' },
    { displayKey: '::Layout', field: 'layout' }
  ]
  info: string;
  constructor(injector: Injector, public list: ListService<TextTemplateGetListInput>, public service: TextTemplateService, private fb: FormBuilder, private localizationService: LocalizationService) {
    super(service, list, 'text-template');
  }
  ngOnInit(): void {
    this.getLayouts();
    this.hookToQuery();
    this.localizationService.get('::LABEL_TextTemplate').subscribe(data => {
      this.info = data
    });
  }
  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res
      this.data.items.forEach(item => {
        item.layoutName = this.layouts.find(x => x.id === item.layoutId)?.name || '';
      })
    });
  }
  buildForm() {
    this.isShowLayout = this.selected.isLayout;
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      isLayout: [this.selected.isLayout || false],
      layoutId: [this.selected.layoutId || ''],
      displayName: [this.selected.displayName || ''],
      layoutName: [this.selected.layoutName || ''],
      content: [this.selected.content || null, Validators.required],
      tenantId: [this.selected.tenantId || '']
    });
  }
  add() {
    this.selected = {} as TextTemplateDto;
    this.buildForm();
    this.isModalVisible = true;
  }
  save() {

    if (this.form.invalid) {
      return;
    }
    const layout = this.layouts.find(x => x.id == this.form.value.layoutId);
    const request = this.selected.id
      ? this.service.update(this.selected.id, {...this.form.value, layoutName: layout?.name || ''})
      : this.service.create({...this.form.value, layoutName: layout?.name || ''});
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
      if (data.isLayout)
        this.getLayouts();
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
  async getLayouts() {
    let input = {} as TextTemplateGetListInput;
    input.isLayout = true;
    this.service.getList(input).subscribe(res => {
      this.layouts = res.items;
    });
  }
  search(e) {
    this.list.filter = e.target.value;
  }


}
