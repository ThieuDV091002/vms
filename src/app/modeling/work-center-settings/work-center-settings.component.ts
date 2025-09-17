import { Component, OnInit } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { LocalizationService } from '@abp/ng.core';
import { debounceTime, finalize, Subject } from 'rxjs';
import { DataIntegrationSettingService, WorkCenterSettingService } from '@apis/general/production-review';
import { CreateUpdateWorkCenterSettingDto, DataIntegrationSettingDto, WorkCenterSettingDto, WorkCenterSettingGetListInput } from '@apis/general/production-review/dtos';
import { WorkCenterDto } from '@apis/corporate/dtos';
import { WorkCenterService } from '@apis/corporate';

@Component({
  selector: 'app-work-center-settings',
  templateUrl: './work-center-settings.component.html',
  styleUrl: './work-center-settings.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "WorkCenterSettingsComponent",
    }
  ]
})
export class WorkCenterSettingsComponent extends ModelingBase<WorkCenterSettingService, WorkCenterSettingGetListInput, CreateUpdateWorkCenterSettingDto> implements OnInit {

  data: PagedResultDto<WorkCenterSettingDto> = { items: [], totalCount: 0 };
  selected: WorkCenterSettingDto;
  isModalVisible = false;
  isHistoryModalVisible = false;
  workCenterSettingForm: FormGroup;
  modalBusy = false;
  info: string;
  infos: string;
  form: any;
  columns = [
    { displayKey: '::WorkCenter', field: 'workCenterName' },
    { displayKey: '::WorkCenterDisplayName', field: 'workCenterDisplayName' },
    { displayKey: '::Description', field: 'description' },
  ];
  workcenters: WorkCenterDto[] = [];
  dataIntegrationSettings: DataIntegrationSettingDto[];
  isCollapse = false;
  tenantInfo: any;
  workcenterInput$ = new Subject<string | null>();
  debounceTime = 500;

  constructor(public list: ListService<WorkCenterSettingGetListInput>,
    public service: WorkCenterSettingService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private localizationService: LocalizationService,
    private workcenterService: WorkCenterService,
    private dataIntegrationSettingService: DataIntegrationSettingService,
  ) {
    super(service, list, 'work-center-setting');
    this.tenantInfo = this.configService.getOne('extraProperties');

  }

  ngOnInit(): void {
    this.hookToQuery();
    // this.workcenterService.getAllInstancesByTenantInfo(this.tenantInfo?.DataTierType, this.tenantInfo?.DataTierId).subscribe(req => {
    //   this.workcenters = req;
    // });
    this.workcenterInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.getWorkcenters(searchItem);
      });
    this.dataIntegrationSettingService.getAllInstances().subscribe(req => {
      this.dataIntegrationSettings = req;
    });
    this.localizationService.get('::LABEL_WorkCenterSetting').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::MENU_WorkCenterSetting').subscribe(data => {
      this.infos = data
    });
  }

  getWorkcenters(searchTerm = '') {
    this.workcenterService.getList({ name: searchTerm, maxResultCount: 10, tenantDataTierID: this.tenantInfo?.DataTierId, tenantDataTierType: this.tenantInfo?.DataTierType }).subscribe(res => {
      // const filteredCells = this.workcenters.filter(workcenter => !res.items.some(item => item.id === workcenter.id));
      // this.workcenters = [...res.items, ...filteredCells];
      this.workcenters = res.items;
    });
  }

  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res;
      this.data.items.forEach((item) => {
        item.workCenterName = item.name;
        item.dataIntegrationSettingName = this.dataIntegrationSettings?.find(c => c.id === item.dataIntegrationSettingId)?.name || '';
      })
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
      this.workcenterService.get(res.workCenterId, { skipHandleError: true }).subscribe({
        next: workcenter => {
          this.selected.workCenterName = workcenter.name;
          this.workcenters = [workcenter];
          this.buildForm();
          this.isModalVisible = true;
        },
        error: error => {
          this.selected.workCenterName = '';
          this.workcenters = [];
          this.buildForm();
          this.isModalVisible = true;
        }
      }
      );
    });
  }

  add() {
    this.getWorkcenters();
    this.selected = {} as WorkCenterSettingDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.workCenterSettingForm = this.fb.group({
      workCenterId: [this.selected.workCenterId || undefined, Validators.required],
      description: [this.selected.description || ''],
      tenantId: [this.selected.tenantId || ''],
      tenantName: [this.selected.tenantName || ''],
      dataIntegrationSettingId: [this.selected.dataIntegrationSettingId || ''],
      goodQtyOption: [this.selected.goodQtyOption || ''],
      scrapQtyOption: [this.selected.scrapQtyOption || ''],
      kpi: [this.selected.kpi || ''],
      fpyTarget: [this.selected.fpyTarget || 0],
      sppmTarget: [this.selected.sppmTarget || 0],
      performanceTarget: [this.selected.performanceTarget || 0],
      upphTarget: [this.selected.upphTarget || 0],
      udtTarget: [this.selected.udtTarget || 0],
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      workCenterName: [this.workcenters?.find(c => c.id === this.selected?.workCenterId)?.name || ''],
      dataIntegrationSettingName: [this.dataIntegrationSettings.find(c => c.id === this.selected?.dataIntegrationSettingId)?.name || ''],
    });
    if (!this.selected.id) {
      this.workCenterSettingForm.patchValue({
        name: '',
        displayName: ''
      });
    }
    this.workCenterSettingForm.get('dataIntegrationSettingId').valueChanges.subscribe(selectedId => {
      const selectItem = this.dataIntegrationSettings.find(c => c.id === selectedId);
      if (selectItem) {
        this.workCenterSettingForm.get('dataIntegrationSettingName').setValue(selectItem.name);
      }
    });
    this.workCenterSettingForm.get('workCenterId')?.valueChanges.subscribe(workCenterId => {
      const selectedWorkCenter = this.workcenters.find(wc => wc.id === workCenterId);

      if (selectedWorkCenter) {
        this.workCenterSettingForm.get('workCenterName').setValue(selectedWorkCenter.name);
        this.workCenterSettingForm.patchValue({
          name: selectedWorkCenter.name,
          displayName: selectedWorkCenter.name
        });
      } else {
        this.workCenterSettingForm.patchValue({
          name: '',
          displayName: ''
        });
      }
    });
  }

  copyModalOpen(event: any) {
    this.getWorkcenters();
  }

  copySetting(e) {
    const info = this.removeLastS(e.objectType);
    this.workcenterService.get(e.data.workCenterId).subscribe(workCenter => {
      this.service.create({...e.data, workCenterName: workCenter?.name, name: workCenter?.name, displayName: workCenter?.name}).subscribe(res => {
        this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
          messageLocalizationParams: [info, res.name],
        });
        this.list.get();
        this.edit(res);
      });
    });
  }

  save() {
    if (this.workCenterSettingForm.invalid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    const request = this.selected.id
      ? this.service.update(this.selected.id, this.workCenterSettingForm.value)
      : this.service.create(this.workCenterSettingForm.value);
    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      this.modalBusy = false;
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.workCenterSettingForm.value.name],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.workCenterSettingForm.reset();
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

  
onInputLimit(event: any) {
  const input = event.target;
  let value = Number(input.value);
  if (value > 100) value = 100;
  if (value < 0) value = 0;
  if (input.value !== value.toString()) {
    input.value = value;
    const formControlName = input.getAttribute('formControlName');
    if (formControlName && this.form && this.form.get(formControlName)) {
      this.form.get(formControlName).setValue(value, { emitEvent: false });
    }
  }
}

}
