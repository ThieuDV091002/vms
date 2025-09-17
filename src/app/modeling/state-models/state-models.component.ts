import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto, SessionStateService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { StateService, StateModelService } from '@apis/ticket';
import { CreateUpdateStateModelDto, StateDto, StateModelDto, StateModelGetListInput } from '@apis/ticket/dtos';
import { LocalizationService } from '@abp/ng.core';
@Component({
  selector: 'app-state-models',
  templateUrl: './state-models.component.html',
  styleUrl: './state-models.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'StateModelsComponent',
    },
  ],
})
export class StateModelsComponent
  extends ModelingBase<StateModelService, StateModelGetListInput, CreateUpdateStateModelDto>
  implements OnInit {
  selected: StateModelDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<StateModelDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  states: StateDto[];
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::Description', field: 'description' },
    // { displayKey: '::DefaultState', field: 'defaultState' },
  ];
  info: string;
  isCollapse = false;

  constructor(
    public list: ListService<StateModelGetListInput>,
    public stateService: StateService,
    public service: StateModelService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private session: SessionStateService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'state-model');
  }

  ngOnInit(): void {
    this.getStates();
    this.localizationService.get('::StateModel').subscribe(data => {
      this.info = data
    });
  }

  getStates() {
    this.stateService
      .getList({
        maxResultCount: 1000,
      })
      .subscribe(data => {
        this.states = data.items;
        this.hookToQuery();
      });
  }

  updateTransitions(e) {
    this.form.controls['transitions'].setValue(e);
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => this.service.getList(query))
      .subscribe(res => {
        this.data = res;
        this.data.items.forEach(item => {
          item.defaultStateName = this.states.find(x => x.id === item.defaultState)?.name || '';
        });
      });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected?.name || '', Validators.required],
      description: [this.selected?.description || ''],
      displayName: [this.selected?.displayName || ''],
      tenantId: [this.selected.tenantId || ''],
      defaultState: [this.selected?.defaultState || '', Validators.required],
      transitions: [this.selected?.transitions || [], Validators.required],
    });
  }

  add() {
    this.selected = {} as StateModelDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const state = this.states.find(s => s.id === this.form.value.defaultState);
    const request = this.selected.id
      ? this.service.update(this.selected.id, { ...this.form.value, defaultStateName: state?.name || '' })
      : this.service.create({ ...this.form.value, defaultStateName: state?.name || '' });
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
        messageLocalizationParams: [this.info, row.name],
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

  copy(e, callback = null) {
    const info = this.removeLastS(e.objectType);
    this.service.get(e.data.id).subscribe(data => {

      const dataToCopy: CreateUpdateStateModelDto = {
        name: e.data.name,
        displayName: e.data.name,
        description: e.data.description,
        defaultState: e.data.defaultState,
        defaultStateName: e.data.defaultStateName,
        tenantId: e.data.tenantId,
        transitions: data.transitions.map(t => ({ ...t, id: undefined })),
        extraProperties: {}
      };
      this.service['create'](dataToCopy).subscribe(res => {
        this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
          messageLocalizationParams: [info, e.data.name],
        });
        this.list.get();
        if (callback && typeof callback === 'function') {
          callback(res);
        }
      });
    })
  }
}
