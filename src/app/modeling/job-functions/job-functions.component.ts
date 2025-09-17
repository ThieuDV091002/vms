import { Component, OnInit } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { LocalizationService } from '@abp/ng.core';
import { finalize } from 'rxjs';
import { JobFunctionService } from '@apis/general/support-teams';
import { JobFunctionGetListInput, CreateUpdateJobFunctionDto, JobFunctionDto } from '@apis/general/support-teams/dtos';

@Component({
  selector: 'app-job-functions',
  templateUrl: './job-functions.component.html',
  styleUrl: './job-functions.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "JobFunctionsComponent",
    }
  ]
})
export class JobFunctionsComponent extends ModelingBase<JobFunctionService, JobFunctionGetListInput, CreateUpdateJobFunctionDto> implements OnInit {

  data: PagedResultDto<JobFunctionDto> = { items: [], totalCount: 0 };
  selected: JobFunctionDto;
  isModalVisible = false;
  isHistoryModalVisible = false;
  jobFunctionForm: FormGroup;
  modalBusy = false;
  info: string;
  infos: string;
  selectedAlertColor = '';

  constructor(public list: ListService<JobFunctionGetListInput>,
    public service: JobFunctionService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private localizationService: LocalizationService) {
    super(service, list, 'job-function');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_JobFunction').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::LABEL_JobFunctions').subscribe(data => {
      this.infos = data
    });
  }

  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res;
    });
  }

  delete(e: any) {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.info,e.name],
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
    this.service.get(row.id).subscribe((jobFunction) => {
      this.selected = jobFunction;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  add() {
    this.selected = {} as JobFunctionDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.jobFunctionForm = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      tenantId: [this.selected.tenantId || ''],
      tenantName: [this.selected.tenantName || ''],
      color: [this.selected.color || undefined, Validators.required]
    });
    this.selectedAlertColor = this.selected?.color || '';
  }

  updateColor(color) {
    this.jobFunctionForm.controls['color'].patchValue(color, { emitEvent: false });
  }

  save() {
    if (this.jobFunctionForm.invalid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    const request = this.selected.id
      ? this.service.update(this.selected.id, this.jobFunctionForm.value)
      : this.service.create(this.jobFunctionForm.value);
    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      this.modalBusy = false;
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.jobFunctionForm.value.name],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.jobFunctionForm.reset();
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
