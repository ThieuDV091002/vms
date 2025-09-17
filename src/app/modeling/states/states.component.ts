import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto, SessionStateService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { StateService } from '@apis/ticket';
import { CreateUpdateStateDto, StateDto, StateGetListInput } from '@apis/ticket/dtos';
import { LocalizationService } from '@abp/ng.core';
@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrl: './states.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'StatesComponent',
    },
  ],
})
export class StatesComponent
  extends ModelingBase<StateService, StateGetListInput, CreateUpdateStateDto>
  implements OnInit
{
  selected: StateDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<StateDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::Description', field: 'description' },
    { displayKey: '::IsComplete', field: 'isCompleted' },
    { displayKey: '::LABEL_Color', field: 'color' }
  ];
  info: string;
  selectedColor: string;

  constructor(
    public list: ListService<StateGetListInput>,
    public service: StateService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private session: SessionStateService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'state');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::State').subscribe(data => {
      this.info = data});
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => this.service.getList(query))
      .subscribe(res => {
        this.data = res;
      });
  }

  buildForm() {
    this.selectedColor = this.selected?.color || '';
    this.form = this.fb.group({
      name: [this.selected?.name || '', Validators.required],
      description: [this.selected?.description || ''],
      displayName: [this.selected?.displayName || '', Validators.required],
      tenantId: [this.selected.tenantId || ''],
      color: [this.selected?.color || ''],
      isCompleted: [this.selected?.isCompleted || false]
    });
    this.form.get('color').valueChanges.subscribe(color => {
      if (/^#[0-9A-F]{6}$/i.test(color)) {
        this.selectedColor = color;
      }
    });
  }

  updateColor(color, type) {
    this.form.controls[type].patchValue(color, { emitEvent: false });
  }

  add() {
    this.selected = {} as StateDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const request = this.selected.id
      ? this.service.update(this.selected.id, this.form.value)
      : this.service.create(this.form.value);
    request.subscribe(() => {
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully','',{
          messageLocalizationParams: [this.info,this.form.value.name],
        });
      }
      else{
        this.toasterService.success('::LABEL_UpdatedSuccessfully','',{
          messageLocalizationParams: [this.info,this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.form.reset();
      this.list.get();
    });
  }

  edit(row) {
    this.service.get(row.id).subscribe(data => {
      this.selected = data;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  delete(row) {
    this.confirmationService
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info,row.name],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service.delete(row.id).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyDeleted','',{
              messageLocalizationParams: [this.info,row.name],
            });
            this.list.get();
          });
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
}
