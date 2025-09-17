import { Component, OnInit } from '@angular/core';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { ActivityCardPriorityService } from '@apis/ticket';
import { ActivityCardPriorityDto, ActivityCardPriorityGetListInput, CreateUpdateActivityCardPriorityDto } from '@apis/ticket/dtos';
import { ModelingBase } from '../modeling-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { ModelingHistoryDto } from '@apis/general/dtos';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-activity-card-priorities',
  templateUrl: './activity-card-priorities.component.html',
  styleUrl: './activity-card-priorities.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "ActivityCardPrioritiesComponent",
    },
  ]
})
export class ActivityCardPrioritiesComponent  extends ModelingBase<ActivityCardPriorityService, ActivityCardPriorityGetListInput, CreateUpdateActivityCardPriorityDto> implements OnInit {
  data: PagedResultDto<ActivityCardPriorityDto> = { items: [], totalCount: 0 };
  selected: ActivityCardPriorityDto;
  form: FormGroup;
  historys: PagedResultDto<ModelingHistoryDto>;
  isModalVisible = false;
  isHistoryModalVisible = false;
  modalBusy = false;
  keyword = '';
  selectedRoles = [];
  info: string;
  selectedAlertColor = '';

  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    public list: ListService<ActivityCardPriorityGetListInput>,
    public service: ActivityCardPriorityService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'activity-card-priority');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_ActivityCardPriority').subscribe(data => {
      this.info = data
    });
  }

  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res;
    });
  }

  edit(row: any) {
    this.service.get(row.id).subscribe((link) => {
      this.selected = link;
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

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      color: [this.selected.color || '', Validators.required],
      tenantId: [this.selected.tenantId || ''],
      tenantName: [this.selected.tenantName || '']
    });
    this.selectedAlertColor = this.selected?.color || '';
  }

  updateColor(color) {
    this.form.controls['color'].patchValue(color, { emitEvent: false });
  }

  add() {
    this.selected = {} as ActivityCardPriorityDto;
    this.buildForm();
    this.isModalVisible = true;
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
}
