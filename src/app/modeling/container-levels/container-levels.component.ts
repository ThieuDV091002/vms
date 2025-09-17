import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, PagedResultDto, SessionStateService } from '@abp/ng.core';
import { Confirmation } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { ContainerLevelService } from '@apis/general';
import { ContainerLevelGetListInput, CreateUpdateContainerLevelDto, ContainerLevelDto } from '@apis/general/dtos';
@Component({
  selector: 'app-container-levels',
  templateUrl: './container-levels.component.html',
  styleUrl: './container-levels.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "ContainerLevelsComponent",
    },
  ],
})
export class ContainerLevelsComponent extends ModelingBase<ContainerLevelService, ContainerLevelGetListInput, CreateUpdateContainerLevelDto> implements OnInit {
  selected: ContainerLevelDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<ContainerLevelDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::DisplayName', field: 'displayName' }
  ]
  info: string;
  constructor(
    public list: ListService<ContainerLevelGetListInput>,
    public service: ContainerLevelService,
    public fb: FormBuilder,
    private session: SessionStateService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'container-level');
  }
  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::ContainerLevel').subscribe(data => {
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
      displayName: [this.selected.displayName || '', Validators.required],
      tenantId: [this.selected.tenantId || '']
      //description: [ this.selected.description || '', Validators.required]
    });
  }
  add() {
    this.selected = {} as ContainerLevelDto;
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

  search(e) {
    this.list.filter = e.target.value;
  }
}
