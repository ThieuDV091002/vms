import { Component, OnInit } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { LocalizationService } from '@abp/ng.core';
import { finalize, forkJoin } from 'rxjs';
import { ActivityCardTypeService, StateModelService, StateService } from '@apis/ticket';
import { ActivityCardTypeDto, ActivityCardTypeGetListInput, CreateUpdateActivityCardTypeDto, StateModelDto, StateDto } from '@apis/ticket/dtos';

@Component({
  selector: 'app-activity-card-types',
  templateUrl: './activity-card-types.component.html',
  styleUrl: './activity-card-types.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "ActivityCardTypesComponent",
    }
  ]
})
export class ActivityCardTypesComponent extends ModelingBase<ActivityCardTypeService, ActivityCardTypeGetListInput, CreateUpdateActivityCardTypeDto> implements OnInit {

  data: PagedResultDto<ActivityCardTypeDto> = { items: [], totalCount: 0 };
  selected: ActivityCardTypeDto;
  isModalVisible = false;
  isHistoryModalVisible = false;
  activityCardTypeForm: FormGroup;
  modalBusy = false;
  stateModels: StateModelDto[] = [];
  states: StateDto[] = [];
  defaultEmptyGuid = '00000000-0000-0000-0000-000000000000';
  info: string;
  infos: string;
  form: any;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::DisplayName', field: 'displayName' },
    { displayKey: '::Description', field: 'description' },
    { displayKey: '::LABEL_CardColor', field: 'cardColor' },
    // { displayKey: '::LABEL_RequiredReason', field: 'requiredReason' },
    // { displayKey: '::LABEL_RequiredIncidentDate', field: 'requiredIncidentDate' },
    // { displayKey: '::LABEL_RequiredEscalation', field: 'requiredEscalation' },
    // { displayKey: '::LABEL_RequiredValueRealization', field: 'requiredValueRealization' },
  ];
  selectedCardColor: string;
  isCollapse = false;
  fieldsSetting = [
    { type: 'categoryField', name: 'Category' },
    { type: 'reasonField', name: 'LABEL_Reason', parentType: 'categoryField' },
    { type: 'locationField', name: 'LABEL_Location' },
    { type: 'priorityField', name: 'LABEL_Priority' },
    { type: 'incidentDateField', name: 'LABEL_IncidentDate' },
    { type: 'assessmentField', name: 'LABEL_AssessmentFields' },
    { type: 'extraProjectNumField', name: 'LABEL_ExternalProjectNo' }
  ];
  constructor(public list: ListService<ActivityCardTypeGetListInput>,
    public service: ActivityCardTypeService,
    public stateModelService: StateModelService,
    public stateService: StateService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private localizationService: LocalizationService) {
    super(service, list, 'activity-card-type');
  }

  ngOnInit(): void {
    this.getStateModels();
    this.localizationService.get('::LABEL_ActivityCardType').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::MENU_ActivityCardType').subscribe(data => {
      this.infos = data
    });
  }

  getStateModels() {
    forkJoin([
      this.stateModelService.getAllInstances(),
      this.stateService.getList({ maxResultCount: 1000 })
    ]).subscribe(([stateModels, states]) => {
      this.stateModels = stateModels;
      this.states = states.items;
      this.hookToQuery();
    });
  }

  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res;
      this.data.items.forEach(item => {
        item.stateModelName = this.stateModels.find(stateModel => stateModel.id === item.stateModelId)?.name || '';
        item.initialStatusName = this.states.find(state => state.id === item.initialStatusId)?.name || '';
      });
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

  edit(row: any) {
    this.service.get(row.id).subscribe((res) => {
      this.selected = res;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  add() {
    this.selected = {} as ActivityCardTypeDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.activityCardTypeForm = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      tenantId: [this.selected.tenantId || ''],
      tenantName: [this.selected.tenantName || ''],
      stateModelId: [this.selected.stateModelId || this.defaultEmptyGuid],
      initialStatusId: [this.selected?.initialStatusId || this.defaultEmptyGuid],
      cardColor: [this.selected.cardColor || ''],
      // to be deleted start
      // requiredReason: [this.selected.requiredReason || false],
      // requiredIncidentDate: [this.selected.requiredIncidentDate || false],
      // requiredEscalation: [this.selected.requiredEscalation || false],
      // requiredValueRealization: [this.selected.requiredValueRealization || false],
      // to be deleted end
      // to be update start when api ready/dto
      categoryField: [this.selected?.categoryField || 'Required'],
      reasonField: [this.selected?.reasonField || 'Required'],
      locationField: [this.selected?.locationField || 'Required'],
      priorityField: [this.selected?.priorityField || 'Required'],
      incidentDateField: [this.selected?.incidentDateField || 'Required'],
      assessmentField: [this.selected?.assessmentField || 'Required'],
      extraProjectNumField: [this.selected?.extraProjectNumField || 'Required'],
      // to be update start when api ready/dto
      stateModelName: [this.stateModels.find(c => c.id === this.selected?.stateModelId)?.name || ''],
      initialStatusName: [this.states.find(c => c.id === this.selected?.initialStatusId)?.name || ''],
    });
    this.selectedCardColor = this.selected?.cardColor || '';
    this.activityCardTypeForm.get('cardColor').valueChanges.subscribe(color => {
      if (/^#[0-9A-F]{6}$/i.test(color)) {
        this.selectedCardColor = color;
      }
    });

    this.activityCardTypeForm.get('stateModelId').valueChanges.subscribe(selectedId => {
      const selectItem = this.stateModels.find(c => c.id === selectedId);
      if (selectItem) {
        this.activityCardTypeForm.get('stateModelName').setValue(selectItem.name);
      }
    });

    this.activityCardTypeForm.get('initialStatusId').valueChanges.subscribe(selectedId => {
      const selectItem = this.states.find(c => c.id === selectedId);
      if (selectItem) {
        this.activityCardTypeForm.get('initialStatusName').setValue(selectItem.name);
      }
    });

  }

  onCheckboxChange(e, name, value) {
    if (e.target.checked) {
      this.activityCardTypeForm.controls[name].patchValue(value);
      const child = this.fieldsSetting.find(x => x.parentType === name);
      if (child && value === 'Optional' && this.activityCardTypeForm.controls[child.type].value === 'Required') {
        this.activityCardTypeForm.controls[child.type].patchValue('Optional');
      }
      if (child && value === 'Hidden') {
        this.activityCardTypeForm.controls[child.type].patchValue('Hidden');
      }
    } else {
      this.activityCardTypeForm.controls[name].patchValue('Required');
      if (value === 'Required') {
        e.target.checked = true;
      }
    }
  }
  updateColor(color, type) {
    this.activityCardTypeForm.controls[type].patchValue(color, { emitEvent: false });
  }
  save() {
    if (this.activityCardTypeForm.invalid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    const stataModel = this.stateModels.find(x => x.id === this.activityCardTypeForm.value.stateModelId);
    const state = this.states.find(x => x.id === this.activityCardTypeForm.value.initialStatusId);
    const request = this.selected.id
      ? this.service.update(this.selected.id, {...this.activityCardTypeForm.value, stateModelName: stataModel?.name || '', initialStatusName : state?.name || ''})
      : this.service.create({...this.activityCardTypeForm.value, stateModelName: stataModel?.name || '', initialStatusName : state?.name || ''});
    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      this.modalBusy = false;
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.activityCardTypeForm.value.name],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.activityCardTypeForm.reset();
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
