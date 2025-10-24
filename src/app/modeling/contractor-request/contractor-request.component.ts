import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '@apis/general/services/file.service';
import { ContarctorRequestFileDto, ContractorRequestDto, ContractorRequestGetListInput, ContractorRequestListDto } from '@apis/vms/dtos/contractor-request';
import { ContractorRequestService } from '@apis/vms/services';
import { finalize } from 'rxjs';
import { DashboardUtils } from 'src/app/dashboard/utils';

enum FileType {
  EmployeeList = 2,
  Document = 3,
}

@Component({
  selector: 'app-contractor-request',
  templateUrl: './contractor-request.component.html',
  styleUrl: './contractor-request.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'ContractorRequestComponent',
    },
  ],
})
export class ContractorRequestComponent implements OnInit {
  selected: ContractorRequestDto;
  isModalVisible: boolean;
  data: PagedResultDto<ContractorRequestListDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Contractor Name', field: 'contractorName' },
    { displayKey: '::Work Permit', field: 'workPermitCode' },
    { displayKey: '::Working Area', field: 'workingArea' },
    { displayKey: '::PIC Status', field: 'molexSupervisorApproveStatusText' },
    { displayKey: '::EHS Status', field: 'ehsApproveStatusText' },
  ];
  info: string;
  contractorName = '';
  comment: string = '';
  workPermitCode: string = '';
  employeeListFiles: ContarctorRequestFileDto[] = [];
  documentFiles: ContarctorRequestFileDto[] = [];
  constructor(
    public list: ListService<ContractorRequestGetListInput>,
    public service: ContractorRequestService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    public fileService: FileService,
    private localizationService: LocalizationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      workPermitCode: [''],
      comment: ['', Validators.required],
    });
    this.hookToQuery();
    this.localizationService.get('::LABEL_ContractorRequest').subscribe(data => {
      this.info = data;
    });
  }

  private hookToQuery() {
  this.list
    .hookToQuery(input => {
      return this.service.getApprovedList({ ...input, contractorName: this.contractorName });
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

  buildForm() {
    this.form = this.fb.group({
      workPermitCode: [''],
      comment: ['', Validators.required]
    });
  }

  view(row) {
    this.buildForm();
    this.service.get(row.contractorRequestId).subscribe(data => {
      this.selected = data;
      this.employeeListFiles = data.files?.filter(file => file.fileType === FileType.EmployeeList) || [];
      this.documentFiles = data.files?.filter(file => file.fileType === FileType.Document) || [];
      this.processFiles();
      this.comment = '';
      this.workPermitCode = '';
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
  
  approve(row: any) {
    if (this.form.invalid) {
      return;
    }
    const comment = this.form.get('comment').value;
    const workPermitCode = this.form.get('workPermitCode').value;
    this.confirmationService
      .warn('::LABEL_NotificationConfirmationMessage', '', {
        messageLocalizationParams: [this.info, row.contractorName],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service
            .approveEhsApproveStatus(row.id, comment, workPermitCode)
            .subscribe({
              next: () => {
                this.toasterService.success('::LABEL_SuccessfullyApproved', '', {
                  messageLocalizationParams: [this.info, row.contractorName],
                });
                this.isModalVisible = false;
                this.list.get();
              },
              error: (err) => {
                this.toasterService.error('::LABEL_ApprovalFailed', '', {
                  messageLocalizationParams: [this.info, row.contractorName],
                });
              },
            });
        }
      });
  }

  reject(row: any) {
    if (this.form.invalid) {
      return;
    }
    this.confirmationService
      .warn('::LABEL_NotificationConfirmationMessage', '', {
        messageLocalizationParams: [this.info, row.contractorName],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service.rejectEhsApproveStatus(row.id, this.comment).subscribe({
            next: () => {
              this.toasterService.success('::LABEL_SuccessfullyRejected', '', {
                messageLocalizationParams: [this.info, row.contractorName],
              });
              this.isModalVisible = false;
              this.list.get();
            },
            error: (err) => {
              this.toasterService.error('::LABEL_RejectionFailed', '', {
                messageLocalizationParams: [this.info, row.contractorName],
              });
            },
          });
        }
      });
  }
}
