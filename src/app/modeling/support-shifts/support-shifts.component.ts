import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { LocalizationService } from '@abp/ng.core';
import { finalize } from 'rxjs';
import { SupportShiftService } from '@apis/general/support-teams';
import { CreateUpdateSupportShiftDto, SupportShiftDto, SupportShiftGetListInput } from '@apis/general/support-teams/dtos';

@Component({
  selector: 'app-support-shifts',
  templateUrl: './support-shifts.component.html',
  styleUrl: './support-shifts.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "SupportShiftsComponent",
    }
  ]
})
export class SupportShiftsComponent extends ModelingBase<SupportShiftService, SupportShiftGetListInput, CreateUpdateSupportShiftDto> implements OnInit {

  data: PagedResultDto<SupportShiftDto> = { items: [], totalCount: 0 };
  selected: SupportShiftDto;
  isModalVisible = false;
  supportShiftForm: FormGroup;
  modalBusy = false;
  info: string;
  infos: string;
  constructor(public list: ListService<SupportShiftGetListInput>,
    public service: SupportShiftService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private localizationService: LocalizationService) {
    super(service, list, 'support-shift');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_SupportShift').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::MENU_SupportShift').subscribe(data => {
      this.infos = data
    });
  }

  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res
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
    this.service.get(row.id).subscribe((supportShift) => {
      this.selected = supportShift;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  add() {
    this.selected = {} as SupportShiftDto;

    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.supportShiftForm = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      tenantId: [this.selected.tenantId || ''],
      tenantName: [this.selected.tenantName || '']
    })
  }

  save() {
    if (this.supportShiftForm.invalid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    const request = this.selected.id
      ? this.service.update(this.selected.id, this.supportShiftForm.value)
      : this.service.create(this.supportShiftForm.value);
    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      this.modalBusy = false;
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.supportShiftForm.value.name],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.supportShiftForm.reset();
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
