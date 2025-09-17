import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto, SessionStateService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { StateModelService } from '@apis/ticket';
import { CreateUpdateRoleBoardTaskTypeDto, RoleBoardTaskTypeDto, RoleBoardTaskTypeGetListInput, StateModelDto } from '@apis/ticket/dtos';
import { LocalizationService } from '@abp/ng.core';
import { RoleBoardTaskTypeService } from '@apis/ticket/role-board';
@Component({
  selector: 'app-role-board-model',
  templateUrl: './role-board-task-types.component.html',
  styleUrl: './role-board-task-types.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "RoleBoardModelComponent",
    },
  ]
})
export class RoleBoardTaskTypesComponent
  extends ModelingBase<RoleBoardTaskTypeService, RoleBoardTaskTypeGetListInput, CreateUpdateRoleBoardTaskTypeDto>
  implements OnInit {
  selected: RoleBoardTaskTypeDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<RoleBoardTaskTypeDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  stateModels: StateModelDto[];
  taskTypeCategories = ['Action', 'Exception'];
  defaultWarningColor = '#ffeb3b';
  defaultAlertColor = '#f44336';
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::Description', field: 'description' },
    // { displayKey: '::IsComplete', field: 'isCompleted' },
  ];
  selectedWarningColor = this.defaultWarningColor;
  selectedAlertColor = this.defaultAlertColor;
  info: string;
  isCollapse = false;

  constructor(
    public list: ListService<RoleBoardTaskTypeGetListInput>,
    public service: RoleBoardTaskTypeService,
    private stateModelService: StateModelService,
    private cdr: ChangeDetectorRef,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private session: SessionStateService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'role-board-task-type');
  }

  ngOnInit(): void {
    this.getStateModels();
    this.localizationService.get('::LABEL_TaskType').subscribe(data => {
      this.info = data
    });
  }

  getStateModels() {
    this.stateModelService
      .getList({
        ids: [],
        maxResultCount: 1000,
      })
      .subscribe(res => {
        this.stateModels = res.items;
        this.hookToQuery();
      });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => this.service.getList(query))
      .subscribe(res => {
        this.data = res;
        this.data.items.forEach(item => {
          item.stateModelName = this.stateModels.find(x => x.id === item.stateModelId)?.name || '';
        })
      });
  }

  buildForm() {
    let colorPattern = /^#[0-9A-F]{6}$/i;
    this.form = this.fb.group({
      name: [this.selected?.name || '', Validators.required],
      description: [this.selected?.description || ''],
      displayName: [this.selected?.displayName || ''],
      stateModelId: [this.selected.stateModelId || '', Validators.required],
      category: [this.selected.category || '', Validators.required],
      tenantId: [this.selected.tenantId || ''],
      warningColor: [this.selected.warningColor || this.defaultWarningColor, [Validators.required, Validators.pattern(colorPattern)]],
      alertColor: [this.selected.alertColor || this.defaultAlertColor, [Validators.required, Validators.pattern(colorPattern)]],
    });

    this.selectedWarningColor = this.selected?.warningColor || this.defaultWarningColor;
    this.selectedAlertColor = this.selected?.alertColor || this.defaultAlertColor;

    this.form.get('warningColor').valueChanges.subscribe(color => {
      if (/^#[0-9A-F]{6}$/i.test(color)) {
        this.selectedWarningColor = color;
      }
    });
    this.form.get('alertColor').valueChanges.subscribe(color => {
      if (/^#[0-9A-F]{6}$/i.test(color)) {
        this.selectedAlertColor = color;
      }
    });
  }

  updateColor(color, type) {
    this.form.controls[type].patchValue(color, { emitEvent: false });
  }

  add() {
    this.selected = {} as RoleBoardTaskTypeDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const stateModel = this.stateModels.find(x => x.id === this.form.value.stateModelId);
    const request = this.selected.id
      ? this.service.update(this.selected.id, {...this.form.value, stateModelName: stateModel?.name || ''})
      : this.service.create({...this.form.value, stateModelName: stateModel?.name || ''});
    request.subscribe(() => {
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
            this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
              messageLocalizationParams: [this.info, row.name],
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

