import { ToasterService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '@apis/general/services';
import { ContarctorRequestFileDto, ContractorRequestDto } from '@apis/vms/dtos/contractor-request'; // Adjust imports
import { JobSectionDto, JobTextFieldDto, JobTypeDetailDto, JobTypeDto } from '@apis/vms/dtos/job-type';
import { ContractorRequestService } from '@apis/vms/services/contractor-request.service'; // Import service đã sửa
import { JobTypeService } from '@apis/vms/services/job-type.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, of } from 'rxjs';
import { DashboardUtils } from 'src/app/dashboard/utils';
import { ContractorRequestType, CreateContractorRequestDto, CreateEmployeeListDto, CreateJobTextFieldValueDto, CreateSelectionsDto, OptionSelectionDto, SectionSelectionDto } from './dtos/contractor-request'; // Import DTOs

enum FileType {
  EmployeeList = 2,
  Document = 3,
}

@Component({
  selector: 'app-contractor-form',
  templateUrl: './contractor-form.component.html',
  styleUrls: ['./contractor-form.component.scss']
})
export class ContractorFormComponent implements OnInit {
  contractorForm: FormGroup;
  isMobileMenuOpen = false;
  documentFiles: File[] = [];
  documentPreviews: { file: File; url: string | null }[] = [];
  jobTypes: JobTypeDto[] = [];
  selectedJobTypeDetail: JobTypeDetailDto | null = null;
  oldEmployeeListFiles: ContarctorRequestFileDto[] = [];
  oldWorkPermitError: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private jobTypeService: JobTypeService,
    private contractorRequestService: ContractorRequestService,
    private toasterService: ToasterService,
    private fileService: FileService,
  ) {
    this.contractorForm = this.fb.group({}); // Khởi tạo ở ngOnInit
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadJobTypes();
    this.setupOldWorkPermitListener();
    this.setupConditionalValidators();
  }

  // Thêm validators conditional dựa trên requestType
  private setupConditionalValidators(): void {
    const requestTypeControl = this.contractorForm.get('requestType');
    requestTypeControl?.valueChanges.subscribe((type: string) => {
      this.updateValidators(type);
    });
  }

  private updateValidators(type: string): void {
    const isNew = type === '0';
    const controlsToUpdate = [
      { name: 'molexSupervisorName', required: isNew },
      { name: 'contractorSupervisorName', required: isNew },
      { name: 'contractorSupervisorPhone', required: isNew },
      { name: 'workingArea', required: isNew },
      { name: 'startDate', required: isNew },
      { name: 'employeeNumber', required: isNew },
      { name: 'workDescription', required: isNew },
      { name: 'jobTypeId', required: isNew },
      { name: 'oldWorkPermitCode', required: !isNew },
    ];

    controlsToUpdate.forEach(({ name, required }) => {
      const control = this.contractorForm.get(name);
      if (required) {
        control?.setValidators(Validators.required);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });
  }

  setupOldWorkPermitListener(): void {
    this.contractorForm.get('oldWorkPermitCode')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      catchError(error => {
        this.toasterService.error('Failed to fetch old work permit details');
        this.oldEmployeeListFiles = [];
        this.oldWorkPermitError = 'Failed to fetch details';
        return of(null);
      })
    ).subscribe((code: string) => {
      if (code && this.contractorForm.get('requestType')?.value === '1') {
        this.oldWorkPermitError = null;
        this.contractorRequestService.getByOldWorkPermit(code).subscribe({
          next: (data: ContractorRequestDto) => {
            if (data) {
              this.oldEmployeeListFiles = data.files?.filter(file => file.fileType === FileType.EmployeeList) || [];
              this.processOldFiles();
              this.oldWorkPermitError = null;
            } else {
              this.oldEmployeeListFiles = [];
              this.oldWorkPermitError = 'No data found for the provided work permit code';
            }
          },
          error: (err) => {
            this.oldEmployeeListFiles = [];
            this.oldWorkPermitError = 'Invalid or non-existent work permit code';
            this.toasterService.error(this.oldWorkPermitError);
          }
        });
      } else {
        this.oldEmployeeListFiles = [];
        this.oldWorkPermitError = null;
      }
    });
  }

  loadJobTypes(): void {
    this.jobTypeService.getAll()
      .pipe(
        catchError(error => {
          this.toasterService.error('Failed to load job types');
          return of([]);
        })
      )
      .subscribe(jobTypes => {
        this.jobTypes = jobTypes;
      });
  }

  private initializeForm(): void {
    this.contractorForm = this.fb.group({
      requestType: ['', Validators.required],
      molexSupervisorName: [''],
      contractorName: ['', Validators.required],
      contractorSupervisorName: [''],
      contractorSupervisorPhone: [''],
      workingArea: [''],
      startDate: [''],
      endDate: ['', Validators.required],
      employeeNumber: [null],
      workDescription: [''],
      oldWorkPermitCode: [''],
      molexSupervisorEmail: ['', [Validators.required, Validators.email]],
      contractorEmail: ['', [Validators.required, Validators.email]],
      videoConfirmed: ['', Validators.required],
      employeeLists: this.fb.array([]),
      employeeListFile: [null],
      jobTypeId: [''],
      selectedSections: this.fb.array([]),
      textFieldsValues: this.fb.group({})
    });

    this.contractorForm.get('jobTypeId')?.valueChanges.subscribe((jobTypeId: string) => {
      if (jobTypeId) {
        this.loadJobTypeDetails(jobTypeId);
      } else {
        this.selectedJobTypeDetail = null;
        this.clearDynamicControls();
      }
    });
  }

  loadJobTypeDetails(jobTypeId: string): void {
    this.jobTypeService.getDetails(jobTypeId)
      .pipe(
        catchError(error => {
          this.toasterService.error('Failed to load job type details');
          return of(null);
        })
      )
      .subscribe(jobTypeDetail => {
        this.selectedJobTypeDetail = jobTypeDetail;
        if (jobTypeDetail) {
          this.updateDynamicControls();
        } else {
          this.clearDynamicControls();
        }
      });
  }

  private clearDynamicControls(): void {
    const selectedSections = this.contractorForm.get('selectedSections') as FormArray;
    selectedSections.clear();
    const textFieldsValues = this.contractorForm.get('textFieldsValues') as FormGroup;
    Object.keys(textFieldsValues.controls).forEach(key => {
      textFieldsValues.removeControl(key);
    });
  }

  private updateDynamicControls(): void {
    this.clearDynamicControls();

    if (!this.selectedJobTypeDetail) return;

    const selectedSections = this.contractorForm.get('selectedSections') as FormArray;
    const textFieldsValues = this.contractorForm.get('textFieldsValues') as FormGroup;

    this.selectedJobTypeDetail.sections.forEach((section: JobSectionDto) => {
      const sectionGroup = this.fb.group({
        jobSectionId: [section.jobSectionId],
        jobSectionName: [section.name],
        options: this.fb.array([]) // Đổi tên để khớp DTO
      });
      selectedSections.push(sectionGroup);
    });

    this.selectedJobTypeDetail.textFields.forEach((field: JobTextFieldDto) => {
      const validators = field.isRequired ? [Validators.required] : [];
      textFieldsValues.addControl(field.jobTextFieldId ?? '', this.fb.control('', validators));
    });
  }

  getSelectedOptions(sectionIndex: number): FormArray {
    const selectedSections = this.contractorForm.get('selectedSections') as FormArray;
    return selectedSections.at(sectionIndex).get('options') as FormArray; // Đổi tên
  }

  toggleOption(sectionIndex: number, optionId: string, checked: boolean): void {
    const selectedOptions = this.getSelectedOptions(sectionIndex);
    if (checked) {
      selectedOptions.push(this.fb.group({
        jobOptionId: [optionId],
        jobOptionName: [this.getOptionName(sectionIndex, optionId)] // Lấy name từ detail
      }));
    } else {
      const index = selectedOptions.controls.findIndex(ctrl => ctrl.get('jobOptionId')?.value === optionId);
      if (index >= 0) {
        selectedOptions.removeAt(index);
      }
    }
  }

  private getOptionName(sectionIndex: number, optionId: string): string {
    const section = this.selectedJobTypeDetail?.sections[sectionIndex];
    const option = section?.options.find(opt => opt.jobOptionId === optionId);
    return option?.name ?? '';
  }

  isOptionSelected(sectionIndex: number, optionId: string): boolean {
    const selectedOptions = this.getSelectedOptions(sectionIndex);
    return selectedOptions.controls.some(ctrl => ctrl.get('jobOptionId')?.value === optionId);
  }

  get employeeLists(): FormArray {
    return this.contractorForm.get('employeeLists') as FormArray;
  }

  createEmployee(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      passport: ['', Validators.required],
      company: ['', Validators.required],
      managementDepartment: ['', Validators.required],
      molexSupervisor: ['', Validators.required]
    });
  }

  addEmployee(): void {
    this.employeeLists.push(this.createEmployee());
  }

  removeEmployee(index: number): void {
    this.employeeLists.removeAt(index);
  }

  onDocumentFilesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);
      this.documentFiles = [...this.documentFiles, ...newFiles];

      newFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.documentPreviews.push({ file, url: e.target.result });
          };
          reader.readAsDataURL(file);
        } else {
          this.documentPreviews.push({ file, url: null });
        }
      });

      input.value = '';
    }
  }

  onEmployeeListFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.contractorForm.patchValue({ employeeListFile: input.files[0] });
    }
  }

  removeDocumentFile(index: number): void {
    this.documentFiles.splice(index, 1);
    this.documentPreviews.splice(index, 1);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  processOldFiles(): void {
    this.oldEmployeeListFiles.forEach(file => {
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

  onSubmit(): void {
    if (this.contractorForm.invalid) {
      this.toasterService.error('Form is invalid. Please check required fields.');
      return;
    }

    this.isSubmitting = true;
    const formValue = this.contractorForm.value;

    // Chuẩn bị selections
    const selections: CreateSelectionsDto = {
      jobTypeId: formValue.jobTypeId,
      jobTypeName: this.jobTypes.find(jt => jt.id === formValue.jobTypeId)?.jobName ?? '',
      sections: formValue.selectedSections.map((section: any) => ({
        jobSectionId: section.jobSectionId,
        jobSectionName: section.jobSectionName,
        options: section.options.map((opt: any) => ({
          jobOptionId: opt.jobOptionId,
          jobOptionName: opt.jobOptionName
        })) as OptionSelectionDto[]
      })) as SectionSelectionDto[]
    };

    // Chuẩn bị textFieldValues
    const textFieldValues: CreateJobTextFieldValueDto[] = [];
    if (this.selectedJobTypeDetail) {
      this.selectedJobTypeDetail.textFields.forEach((field: JobTextFieldDto) => {
        const value = formValue.textFieldsValues[field.jobTextFieldId ?? ''];
        if (value) {
          textFieldValues.push({
            jobTypeId: formValue.jobTypeId,
            jobTypeName: selections.jobTypeName ?? '',
            jobTextFieldId: field.jobTextFieldId ?? '',
            textField: field.field ?? '',
            value: value
          });
        }
      });
    }

    const requestDto: CreateContractorRequestDto = {
      requestType: parseInt(formValue.requestType) as ContractorRequestType,
      molexSupervisorName: formValue.molexSupervisorName,
      contractorName: formValue.contractorName,
      contractorSupervisorName: formValue.contractorSupervisorName,
      contractorSupervisorPhone: formValue.contractorSupervisorPhone,
      workingArea: formValue.workingArea,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      employeeNumber: formValue.employeeNumber,
      workDescription: formValue.workDescription,
      oldWorkPermitCode: formValue.oldWorkPermitCode,
      molexSupervisorEmail: formValue.molexSupervisorEmail,
      contractorEmail: formValue.contractorEmail,
      employeeLists: formValue.employeeLists as CreateEmployeeListDto[],
      employeeListFile: formValue.employeeListFile,
      documentFiles: this.documentFiles,
      selections: selections,
      textFieldValues: textFieldValues
    };

    this.contractorRequestService.create(requestDto).subscribe({
      next: (result) => {
        this.toasterService.success('Contractor request created successfully!');
        this.isSubmitting = false;
        // Reset form or redirect if needed
      },
      error: (err) => {
        this.toasterService.error('Failed to create contractor request: ' + err.message);
        this.isSubmitting = false;
      }
    });
  }
}