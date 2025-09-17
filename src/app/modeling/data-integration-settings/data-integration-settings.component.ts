import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { LocalizationService } from '@abp/ng.core';
import { finalize } from 'rxjs';
import { DataIntegrationSettingService } from '@apis/general/production-review';
import { CreateUpdateDataIntegrationSettingDto, DataIntegrationSettingDto, DataIntegrationSettingGetListInput } from '@apis/general/production-review/dtos';

@Component({
  selector: 'app-data-integration-settings',
  templateUrl: './data-integration-settings.component.html',
  styleUrl: './data-integration-settings.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "DataIntegrationSettingsComponent",
    }
  ]
})
export class DataIntegrationSettingsComponent extends ModelingBase<DataIntegrationSettingService, DataIntegrationSettingGetListInput, CreateUpdateDataIntegrationSettingDto> implements OnInit {

  data: PagedResultDto<DataIntegrationSettingDto> = { items: [], totalCount: 0 };
  selected: DataIntegrationSettingDto;
  isModalVisible = false;
  isHistoryModalVisible = false;
  dataIntegrationSettingForm: FormGroup;
  modalBusy = false;
  info: string;
  infos: string;
  form: any;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::DisplayName', field: 'displayName' },
    { displayKey: '::Description', field: 'description' },
  ];

  constructor(public list: ListService<DataIntegrationSettingGetListInput>,
    public service: DataIntegrationSettingService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private localizationService: LocalizationService) {
    super(service, list, 'data-integration-setting');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_DataIntegrationSetting').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::MENU_DataIntegrationSetting').subscribe(data => {
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
    this.selected = {} as DataIntegrationSettingDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.dataIntegrationSettingForm = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      tenantId: [this.selected.tenantId || ''],
      tenantName: [this.selected.tenantName || ''],
      databaseName: [this.selected.databaseName || ''],
      productionQtyDataMethod: [this.selected.productionQtyDataMethod || ''],
      goodQtyStoredProc: [this.selected.goodQtyStoredProc || ''],
      scrapQtyDataMethod: [this.selected.scrapQtyDataMethod || ''],
      scrapQtyStoredProc: [this.selected.scrapQtyStoredProc || ''],
      reworkQtyDataMethod: [this.selected.reworkQtyDataMethod || ''],
      reworkQtyStoredProc: [this.selected.reworkQtyStoredProc || ''],
      downtimeDataMethod: [this.selected.downtimeDataMethod || ''],
      downtimeStoredProc: [this.selected.downtimeStoredProc || ''],
      breaktimeDataMethod: [this.selected.breaktimeDataMethod || ''],
      breaktimeStoredProc: [this.selected.breaktimeStoredProc || ''],
      laborDataMethod: [this.selected.laborDataMethod || ''],
      laborStoredProc: [this.selected.laborStoredProc || ''],
    });
  }

  save() {
    if (this.dataIntegrationSettingForm.invalid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    const request = this.selected.id
      ? this.service.update(this.selected.id, this.dataIntegrationSettingForm.value)
      : this.service.create(this.dataIntegrationSettingForm.value);
    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      this.modalBusy = false;

      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.dataIntegrationSettingForm.value.name],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.dataIntegrationSettingForm.reset();
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
