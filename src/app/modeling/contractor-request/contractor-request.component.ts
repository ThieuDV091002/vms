import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractorRequestFileDto, ContractorRequestDto, ContractorRequestGetListInput, ContractorRequestListDto } from '@apis/vms/dtos/contractor-request';
import { ContractorRequestService } from '@apis/vms/services';
import { FileService } from '@apis/vms/services/file.service';
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
    { displayKey: 'vms::ContractorName', field: 'contractorName' },
    { displayKey: 'vms::WorkPermit', field: 'workPermitCode' },
    { displayKey: 'vms::WorkingArea', field: 'workingArea' },
    { displayKey: 'vms::PICStatus', field: 'molexSupervisorApproveStatusText' },
    { displayKey: 'vms::EHSStatus', field: 'ehsApproveStatusText' },
  ];
  info: string;
  contractorName = '';
  comment: string = '';
  workPermitCode: string = '';
  employeeListFiles: ContractorRequestFileDto[] = [];
  documentFiles: ContractorRequestFileDto[] = [];
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
    this.localizationService.get('vms::LABEL_WorkPermitRequest').subscribe(data => {
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
          2: 'Rejected',
        };

        this.data = {
          ...res,
          items: res.items.map(item => ({
            ...item,
            id: item.contractorRequestId,
            molexSupervisorApproveStatusText: statusMap[item.molexSupervisorApproveStatus],
            ehsApproveStatusText: statusMap[item.ehsApproveStatus],
          })),
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
      comment: ['', Validators.required],
    });
  }

  view(row) {
    this.buildForm();
    this.service.get(row.contractorRequestId).subscribe(data => {
      this.selected = data;
      this.employeeListFiles =
        data.files?.filter(file => file.fileType === FileType.EmployeeList) || [];
      this.documentFiles = data.files?.filter(file => file.fileType === FileType.Document) || [];
      this.processFiles();
      this.comment = '';
      this.workPermitCode = '';
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

  approve(row: any) {
    if (this.form.invalid) {
      return;
    }
    const comment = this.form.get('comment').value;
    const workPermitCode = this.form.get('workPermitCode').value;
    this.confirmationService
      .warn('vms::LABEL_ApproveConfirmationMessage', '', {
        messageLocalizationParams: [this.info, row.contractorName],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service.approveEhsApproveStatus(row.id, comment, workPermitCode).subscribe({
            next: () => {
              this.toasterService.success('vms::LABEL_SuccessfullyApproved', '', {
                messageLocalizationParams: [this.info, row.contractorName],
              });
              this.isModalVisible = false;
              this.list.get();
            }
          });
        }
      });
  }

  reject(row: any) {
    if (this.form.invalid) {
      return;
    }
    const comment = this.form.get('comment').value;
    this.confirmationService
      .warn('vms::LABEL_RejectConfirmationMessage', '', {
        messageLocalizationParams: [this.info, row.contractorName],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service.rejectEhsApproveStatus(row.id, comment).subscribe({
            next: () => {
              this.toasterService.success('vms::LABEL_SuccessfullyRejected', '', {
                messageLocalizationParams: [this.info, row.contractorName],
              });
              this.isModalVisible = false;
              this.list.get();
            }
          });
        }
      });
  }

  exportEmployeeList() {
    if (!this.selected?.id) return;

    this.service.export(this.selected.id).subscribe((res: any) => {
      const blob = DashboardUtils.convertBase64ToBlob(res);

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      const now = new Date();
      const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
      a.download = `EmployeeList_${this.selected.contractorName}_${timestamp}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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

  multiDelete(e) {
    this.confirmationService
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info + '<br/>', e.objectNames.join(',<br/>')],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service['multipleDeleteByIds'](e.objectIds).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
              messageLocalizationParams: [this.info, e.objectNames],
            });
            this.list.get();
          });
        }
      });
  }
}
