import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto, LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { HotelService } from '@apis/vms/services';
import { CreateUpdateHotelDto, HotelDto, HotelGetListInput } from '@apis/vms/dtos';


@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'HotelComponent',
    },
  ],
})
export class HotelComponent
  extends ModelingBase<HotelService, HotelGetListInput, CreateUpdateHotelDto>
  implements OnInit {
  selected: HotelDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<HotelDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::DisplayName', field: 'displayName' },
    { displayKey: '::Room', field: 'room' },
    { displayKey: '::RoomRate', field: 'roomRate' },
    { displayKey: '::Address', field: 'address' },
  ];
  info: string;
  constructor(
    public list: ListService<HotelGetListInput>,
    public service: HotelService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'hotel');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::Hotel').subscribe(data => {
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
      room: [this.selected?.room || '', Validators.required],
      roomRate: [this.selected?.roomRate || '', Validators.required],
      address: [this.selected?.address || '', Validators.required],
      distanceToMolexDongAnh: [this.selected?.distanceToMolexDongAnh || '', Validators.required],
      drivingTimeToMolexDongAnh: [this.selected?.drivingTimeToMolexDongAnh || '', Validators.required],
      distanceToNoiBai: [this.selected?.distanceToNoiBai || '', Validators.required],
      drivingTimeToNoiBai: [this.selected?.drivingTimeToNoiBai || '', Validators.required],
    });
  }

  add() {
    this.selected = {} as HotelDto;
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

