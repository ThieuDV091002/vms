import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, NgModule, OnInit } from '@angular/core';
import {
  ContarctorRequestFileDto,
  ContractorRequestDto,
  ContractorRequestGetListInput,
  ContractorRequestListDto,
} from '@apis/vms/dtos/contractor-request';
import { ContractorRequestService } from '@apis/vms/services';
import { finalize } from 'rxjs';
import { FileService } from 'src/app/dashboard/services/file.service';
import { DashboardUtils } from 'src/app/dashboard/utils';

enum FileType {
  EmployeeList = 2,
  Document = 3,
}

@Component({
  selector: 'app-my-request',
  templateUrl: './my-request.component.html',
  styleUrl: './my-request.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'MyRequestComponent',
    },
  ],
})
export class MyRequestComponent implements OnInit {
  selected: ContractorRequestDto;
  isModalVisible: boolean;
  data: PagedResultDto<ContractorRequestListDto> = { items: [], totalCount: 0 };
  columns = [
    { displayKey: '::Contractor Name', field: 'contractorName' },
    { displayKey: '::Work Permit', field: 'workPermitCode' },
    { displayKey: '::Working Area', field: 'workingArea' },
    { displayKey: '::PIC Status', field: 'molexSupervisorApproveStatusText' },
    { displayKey: '::EHS Status', field: 'ehsApproveStatusText' },
  ];
  info: string;
  contractorName = '';
  employeeListFiles: ContarctorRequestFileDto[] = [];
  documentFiles: ContarctorRequestFileDto[] = [];
  previewModalVisible = false;
  previewImage = '';
  constructor(
    public list: ListService<ContractorRequestGetListInput>,
    public service: ContractorRequestService,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    public fileService: FileService,
    private localizationService: LocalizationService
  ) {}

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_ContractorRequest').subscribe(data => {
      this.info = data;
    });
  }

  private hookToQuery() {
  this.list
    .hookToQuery(input => {
      return this.service.getMyRequestList({ ...input, contractorName: this.contractorName });
    })
    .subscribe(res => {
      const statusMap = {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected'
      };

      this.data = {
        ...res,
        items: res.items.map(item => ({
          ...item,
          molexSupervisorApproveStatusText: statusMap[item.molexSupervisorApproveStatus],
          ehsApproveStatusText: statusMap[item.ehsApproveStatus]
        }))
      };
    });
  }

  searchByfilter(event: string) {
    this.contractorName = event;
    this.list.get();
  }

  view(row) {
    this.service.get(row.contractorRequestId).subscribe(data => {
      this.selected = data;
      this.employeeListFiles = data.files?.filter(file => file.fileType === FileType.EmployeeList) || [];
      this.documentFiles = data.files?.filter(file => file.fileType === FileType.Document) || [];
      this.processFiles();
      this.isModalVisible = true;
    });
  }

  processFiles() {
    [...this.employeeListFiles, ...this.documentFiles].forEach(file => {
      if (file.fileUrl && DashboardUtils.isImageFile(file.fileName)) {
        file['loading'] = true;
        this.fileService
          .get(file.fileUrl, DashboardUtils.isImageFile(file.fileName))
          .pipe(finalize(() => delete file['loading']))
          .subscribe((res: any) => {
            const url = URL.createObjectURL(DashboardUtils.convertBase64ToBlob(res));
            file['mediaAccessUrl'] = url;
            file['isImage'] = DashboardUtils.isImageFile(file.fileName);
          });
      } else if (file.fileUrl) {
        file['mediaAccessUrl'] = file.fileUrl;
        file['isImage'] = false;
      }
    });
  }

  async getPreviewImage(fileUrl: string) {
    this.previewModalVisible = true;
    const res = await this.fileService.get(fileUrl).toPromise();
    this.previewImage = URL.createObjectURL(DashboardUtils.convertBase64ToBlob(res as any));
  }

  approve(e: any) {
    this.confirmationService
      .warn('::LABEL_NotificationConfirmationMessage', '', {
        messageLocalizationParams: [this.info, e.contractorName],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          const approvalStatus = 1;
          this.service.updateMolexSupervisorApproveStatus(e.id, approvalStatus).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyApproved', '', {
              messageLocalizationParams: [this.info, e.contractorName],
            });
          });
          this.isModalVisible = false;
          this.list.get();
        }
      });
  }

  reject(e: any) {
    this.confirmationService
      .warn('::LABEL_NotificationConfirmationMessage', '', {
        messageLocalizationParams: [this.info, e.contractorName],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          const approvalStatus = 2;
          this.service.updateMolexSupervisorApproveStatus(e.id, approvalStatus).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyRejected', '', {
              messageLocalizationParams: [this.info, e.contractorName],
            });
          });
          this.isModalVisible = false;
          this.list.get();
        }
      });
  }
}
