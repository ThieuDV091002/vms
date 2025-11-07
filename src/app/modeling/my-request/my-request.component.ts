import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, NgModule, OnInit } from '@angular/core';
import {
  ContractorRequestFileDto,
  ContractorRequestDto,
  ContractorRequestGetListInput,
  ContractorRequestListDto,
} from '@apis/vms/dtos/contractor-request';
import { ContractorRequestService } from '@apis/vms/services';
import { FileService } from '@apis/vms/services/file.service';
import { finalize } from 'rxjs';
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
  employeeListFiles: ContractorRequestFileDto[] = [];
  documentFiles: ContractorRequestFileDto[] = [];
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
    this.localizationService.get('::Work Permit Request').subscribe(data => {
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
        if (file.fileId) {
          file['loading'] = true;
          this.fileService
            .get(file.fileId, DashboardUtils.isImageFile(file.fileName))
            .pipe(finalize(() => delete file['loading']))
            .subscribe((res: any) => {
              const url = URL.createObjectURL(DashboardUtils.convertBase64ToBlob(res));
              file['mediaAccessUrl'] = url;
              file['isImage'] = DashboardUtils.isImageFile(file.fileName);
            });
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
      .warn('::LABEL_ApproveConfirmationMessage', '', {
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
      .warn('::LABEL_RejectConfirmationMessage', '', {
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
