import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto, LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { GlobalDowntimeCodeService } from '@apis/general';
import { CreateUpdateGlobalDowntimeCodeDto, GlobalDowntimeCodeDto, GlobalDowntimeCodeGetListInput } from '@apis/general/dtos';


@Component({
  selector: 'app-global-downtime-codes',
  templateUrl: './global-downtime-codes.component.html',
  styleUrl: './global-downtime-codes.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'GlobalDowntimeCodesComponent',
    },
  ],
})
export class GlobalDowntimeCodesComponent
  extends ModelingBase<GlobalDowntimeCodeService, GlobalDowntimeCodeGetListInput, CreateUpdateGlobalDowntimeCodeDto>
  implements OnInit {
  selected: GlobalDowntimeCodeDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<GlobalDowntimeCodeDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::Description', field: 'description' },
    { displayKey: '::DisplayName', field: 'displayName' }
  ];
  info: string;
  constructor(
    public list: ListService<GlobalDowntimeCodeGetListInput>,
    public service: GlobalDowntimeCodeService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'global-downtime-code');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_GlobalDowntimeCode').subscribe(data => {
      this.info = data
    });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => this.service.getList(query))
      .subscribe(res => {
        this.data = res;
      });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected?.name || '', Validators.required],
      description: [this.selected?.description || ''],
      displayName: [this.selected?.displayName || '', Validators.required],
      tenantId: [this.selected?.tenantId || ''],
      isPlanned: [this.selected?.isPlanned || 'No', Validators.required],
      isCosted: [this.selected?.isCosted || 'No', Validators.required]
    });
  }

  add() {
    this.selected = {} as GlobalDowntimeCodeDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const request = this.selected.id
      ? this.service.update(this.selected.id, this.form.value)
      : this.service.create(this.form.value);
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
