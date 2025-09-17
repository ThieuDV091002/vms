import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto, LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { CreateUpdateLocalScrapReasonDto, LocalScrapReasonDto, LocalScrapReasonGetListInput } from '@apis/general/dtos';
import { LocalScrapReasonService } from '@apis/general';
import { GlobalScrapCodeDto } from '@apis/general/production-review/dtos';
import { GlobalScrapCodeService } from '@apis/general/production-review';


@Component({
  selector: 'app-local-scrap-reasons',
  templateUrl: './local-scrap-reasons.component.html',
  styleUrl: './local-scrap-reasons.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'LocalScrapReasonsComponent',
    },
  ],
})
export class LocalScrapReasonsComponent
  extends ModelingBase<LocalScrapReasonService, LocalScrapReasonGetListInput, CreateUpdateLocalScrapReasonDto>
  implements OnInit {
  selected: LocalScrapReasonDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<LocalScrapReasonDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  globalScrapCodes: GlobalScrapCodeDto[] = [];
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::Description', field: 'description' },
    { displayKey: '::DisplayName', field: 'displayName' },
  ];
  info: string;
  constructor(
    public list: ListService<LocalScrapReasonGetListInput>,
    public globalScrapCodeService: GlobalScrapCodeService,
    public service: LocalScrapReasonService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'local-scrap-reason');
  }

  ngOnInit(): void {
    this.getGlobalScrapCodes();
    this.localizationService.get('::LABEL_LocalScrapReason').subscribe(data => {
      this.info = data
    });
  }

  getGlobalScrapCodes() {
    this.globalScrapCodeService
      .getList({
        maxResultCount: 1000,
      })
      .subscribe(data => {
        this.globalScrapCodes = data.items.sort((a, b) => {
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
          item.globalScrapCode = this.globalScrapCodes.find(x => x.id === item.globalScrapCodeId).name || '';
        });
      });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected?.name || '', Validators.required],
      description: [this.selected?.description || ''],
      displayName: [this.selected?.displayName || '', Validators.required],
      tenantId: [this.selected?.tenantId || ''],
      globalScrapCodeId: [this.selected?.globalScrapCodeId || '', Validators.required]
    });
  }

  add() {
    this.selected = {} as LocalScrapReasonDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const code = this.globalScrapCodes.find(x => x.id === this.form.value.globalScrapCodeId);
    const request = this.selected.id
      ? this.service.update(this.selected.id, {...this.form.value, globalScrapCode: code?.name || ''})
      : this.service.create({...this.form.value, globalScrapCode: code?.name || ''});
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
