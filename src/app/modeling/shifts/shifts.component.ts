import { Component, OnInit } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { CreateUpdateShiftDto, ShiftDto, ShiftGetListInput } from '@apis/general/dtos/models';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { ShiftService } from '@apis/general';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'ShiftsComponent',
    },
  ],
})

export class ShiftsComponent
  extends ModelingBase<ShiftService, ShiftGetListInput, CreateUpdateShiftDto>
  implements OnInit {
  selected: ShiftDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<ShiftDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::DisplayName', field: 'displayName' },
    { displayKey: '::Description', field: 'description' }
  ];
  info: string;
  infos: string;

  constructor(
    public list: ListService<ShiftGetListInput>,
    public service: ShiftService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'shift');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::Shift').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::MENU_Shift').subscribe(data => {
      this.infos = data
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
      displayName: [this.selected?.displayName || '', Validators.required],
      description: [this.selected?.description || ''],
      tenantId: [this.selected?.tenantId || ''],
    });
  }

  add() {
    this.selected = {} as ShiftDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    const request = this.selected.id
      ? this.service.update(this.selected.id, formValue)
      : this.service.create(formValue);

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

  sort(data: any) {
    const { prop, dir } = data.sorts[0];
    this.list.sortKey = prop;
    this.list.sortOrder = dir;
  }

  search(e) {
    this.list.filter = e.target.value;
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
