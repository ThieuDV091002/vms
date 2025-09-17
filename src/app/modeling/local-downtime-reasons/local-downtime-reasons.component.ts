import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto, LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { CreateUpdateLocalDowntimeReasonDto, GlobalDowntimeCodeDto, LocalDowntimeReasonDto, LocalDowntimeReasonGetListInput } from '@apis/general/dtos';
import { GlobalDowntimeCodeService, LocalDowntimeReasonService } from '@apis/general';


@Component({
  selector: 'app-local-downtime-reasons',
  templateUrl: './local-downtime-reasons.component.html',
  styleUrl: './local-downtime-reasons.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'LocalDowntimeReasonsComponent',
    },
  ],
})
export class LocalDowntimeReasonsComponent
  extends ModelingBase<LocalDowntimeReasonService, LocalDowntimeReasonGetListInput, CreateUpdateLocalDowntimeReasonDto>
  implements OnInit {
  selected: LocalDowntimeReasonDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<LocalDowntimeReasonDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  globalDowntimeCodes: GlobalDowntimeCodeDto[] = [];
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::Description', field: 'description' },
    { displayKey: '::DisplayName', field: 'displayName' },
  ];
  info: string;
  constructor(
    public list: ListService<LocalDowntimeReasonGetListInput>,
    public globalDowntimeCodeService: GlobalDowntimeCodeService,
    public service: LocalDowntimeReasonService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'local-downtime-reason');
  }

  ngOnInit(): void {
    this.getGlobalDowntimeCodes();
    this.localizationService.get('::LABEL_LocalDowntimeReason').subscribe(data => {
      this.info = data
    });
  }

  getGlobalDowntimeCodes() {
    this.globalDowntimeCodeService
      .getList({
        maxResultCount: 1000,
      })
      .subscribe(data => {
        this.globalDowntimeCodes = data.items.sort((a, b) => {
        const aLabel = (a.displayName || a.name || '').toLowerCase();
        const bLabel = (b.displayName || b.name || '').toLowerCase();
        return aLabel.localeCompare(bLabel);
      });
        this.hookToQuery();
      });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => this.service.getList(query))
      .subscribe(res => {
        this.data = res;
        this.data.items.forEach(item => {
          item.globalDowntimeCode = this.globalDowntimeCodes.find(x => x.id === item.globalDowntimeCodeId)?.name || '';
        })
      });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected?.name || '', Validators.required],
      description: [this.selected?.description || ''],
      displayName: [this.selected?.displayName || '', Validators.required],
      tenantId: [this.selected?.tenantId || ''],
      isPlanned: [this.selected?.isPlanned || ''],
      globalDowntimeCodeId: [this.selected?.globalDowntimeCodeId || '', Validators.required]
    });
  }

  add() {
    this.selected = {} as LocalDowntimeReasonDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const code = this.globalDowntimeCodes.find(x => x.id === this.form.value.globalDowntimeCodeId);
    const request = this.selected.id
      ? this.service.update(this.selected.id, {...this.form.value, globalDowntimeCode: code?.name || ''})
      : this.service.create({...this.form.value, globalDowntimeCode: code?.name || ''});
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
}
