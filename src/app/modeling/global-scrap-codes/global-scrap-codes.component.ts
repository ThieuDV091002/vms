import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto, LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { GlobalScrapCodeService } from '@apis/general/production-review';
import { CreateUpdateGlobalScrapCodeDto, GlobalScrapCodeDto, GlobalScrapCodeGetListInput } from '@apis/general/production-review/dtos';


@Component({
  selector: 'app-global-scrap-codes',
  templateUrl: './global-scrap-codes.component.html',
  styleUrl: './global-scrap-codes.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'GlobalScrapCodesComponent',
    },
  ],
})
export class GlobalScrapCodesComponent
  extends ModelingBase<GlobalScrapCodeService, GlobalScrapCodeGetListInput, CreateUpdateGlobalScrapCodeDto>
  implements OnInit {
  selected: GlobalScrapCodeDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<GlobalScrapCodeDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::Description', field: 'description' },
    { displayKey: '::DisplayName', field: 'displayName' }
  ];
  info: string;
  constructor(
    public list: ListService<GlobalScrapCodeGetListInput>,
    public service: GlobalScrapCodeService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'global-scrap-code');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_GlobalScrapCode').subscribe(data => {
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
      tenantId: [this.selected?.tenantId || '']
    });
  }

  add() {
    this.selected = {} as GlobalScrapCodeDto;
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
