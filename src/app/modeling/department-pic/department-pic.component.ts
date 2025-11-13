import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { DepartmentPICService } from '@apis/vms/services';
import { CreateUpdateDepartmentPICMatrixDto, DepartmentPICMatrixDto, DepartmentPICMatrixGetListInput } from '@apis/vms/dtos/department-pic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';

@Component({
  selector: 'app-department-pic',
  templateUrl: './department-pic.component.html',
  styleUrl: './department-pic.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'HotelComponent',
    },
  ],
})
export class DepartmentPicComponent extends ModelingBase<DepartmentPICService, DepartmentPICMatrixGetListInput, CreateUpdateDepartmentPICMatrixDto> 
implements OnInit {
  selected: DepartmentPICMatrixDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<DepartmentPICMatrixDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::DisplayName', field: 'displayName' },
    { displayKey: 'vms::PICName', field: 'picName' },
    { displayKey: 'vms::PICEmail', field: 'picEmail' },
  ];
  info: string;
  name = '';
  constructor(
    public list: ListService<DepartmentPICMatrixGetListInput>,
    public service: DepartmentPICService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'departmentPICMatrix');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('vms::LABEL_DepartmentPICMatrix').subscribe(data => {
      this.info = data
    });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(input => {
        return this.service.getList({ ...input, name: this.name });
      })
      .subscribe(res => {
        this.data = res;
      });
  }

  searchByfilter(event: string) {
    this.name = event;
    this.list.get();
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected?.name || '', Validators.required],
      description: [this.selected?.description || ''],
      displayName: [this.selected?.displayName || '', Validators.required],
      tenantId: [this.selected?.tenantId || ''],
      picName: [this.selected?.picName || '', Validators.required],
      picEmail: [this.selected?.picEmail || '', Validators.required],
    });
  }

  add() {
    this.selected = {} as DepartmentPICMatrixDto;
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
