import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GuestInfoDto, GuestInfoGetListInput, GuestInfoListDto } from '@apis/vms/dtos/guest-information';
import { GuestInfoService } from '@apis/vms/services/guest-info.service';

@Component({
  selector: 'app-guest-information',
  templateUrl: './guest-information.component.html',
  styleUrl: './guest-information.component.scss',
  providers: [
    ListService,
      {
        provide: EXTENSIONS_IDENTIFIER,
        useValue: 'GuestInformationComponent',
      },
  ],
})
export class GuestInformationComponent implements OnInit {
  selected: GuestInfoDto;
  isModalVisible: boolean;
  data: PagedResultDto<GuestInfoListDto> = { items: [], totalCount: 0 };
  columns = [
    { displayKey: '::Full Name', field: 'fullName' },
    { displayKey: '::Company', field: 'company' },
    { displayKey: '::Title', field: 'title' },
    { displayKey: '::Purpose', field: 'purpose' },
    { displayKey: '::Work With Whom In MXV', field: 'workWithWhomInMolex' },
  ];
  info: string;
  keyword = '';
  constructor(
    public list: ListService<GuestInfoGetListInput>,
    public service: GuestInfoService,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService
  ) {
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_GuestInformation').subscribe(data => {
      this.info = data
    });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(input => {
        return this.service.getList({ ...input, keyword: this.keyword });
      })
      .subscribe(res => {
        this.data = res;
      });
  }

  searchByfilter(event: string) {
    this.keyword = event;
    this.list.get();
  }

  view(row) {
    this.service.get(row.id).subscribe(data => {
      this.selected = data;
      this.isModalVisible = true;
    });
  }

  notify(row) {
    this.confirmationService
      .warn('::LABEL_NotificationConfirmationMessage', '', {
        messageLocalizationParams: [this.info, row.fullName || row.objectNames],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service.notify(row.objectIds).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyNotified', '', {
              messageLocalizationParams: [this.info, row.fullName || row.objectNames],
            });
          });
        }
        this.isModalVisible = false;
      });
  }
}
