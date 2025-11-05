import { LocalizationService } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';
import { ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ContractorRequestFileDto, ContractorRequestDto, ContractorRequestType, CreateContractorRequestDto, CreateEmployeeListDto, CreateJobTextFieldValueDto, CreateSelectionsDto, OptionSelectionDto, SectionSelectionDto } from '@apis/vms/dtos/contractor-request';
import { JobSectionDto, JobTextFieldDto, JobTypeDetailDto, JobTypeDto } from '@apis/vms/dtos/job-type';
import { ContractorRequestService } from '@apis/vms/services/contractor-request.service';
import { FileService } from '@apis/vms/services/file.service';
import { JobTypeService } from '@apis/vms/services/job-type.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, take } from 'rxjs';
import { DashboardUtils } from 'src/app/dashboard/utils';

enum FileType {
  EmployeeList = 2,
  Document = 3,
}

@Component({
  selector: 'app-contractor-form',
  templateUrl: './contractor-form.component.html',
  styleUrls: ['./contractor-form.component.scss'],
})
export class ContractorFormComponent implements OnInit {
  info: string;
  contractorForm: FormGroup;
  isMobileMenuOpen = false;
  documentFiles: File[] = [];
  documentPreviews: { file: File; url: string | null }[] = [];
  jobTypes: JobTypeDto[] = [];
  selectedJobTypeDetail: JobTypeDetailDto | null = null;
  oldEmployeeListFiles: ContractorRequestFileDto[] = [];
  oldWorkPermitError: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private jobTypeService: JobTypeService,
    private contractorRequestService: ContractorRequestService,
    private toasterService: ToasterService,
    private fileService: FileService,
    private localizationService: LocalizationService,
    private viewportScroller: ViewportScroller,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.contractorForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.localizationService.get('::LABEL_ContractorRequest').subscribe(data => {
      this.info = data;
    });
    this.initializeForm();
    this.loadJobTypes();
    this.setupOldWorkPermitListener();
    this.setupConditionalValidators();
  }

  private setupConditionalValidators(): void {
    const requestTypeControl = this.contractorForm.get('requestType');
    requestTypeControl?.valueChanges.subscribe((type: string) => {
      this.updateValidators(type || '');
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
      if (control) {
        if (required) {
          control.setValidators(Validators.required);
        } else {
          control.clearValidators();
        }
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  setupOldWorkPermitListener(): void {
    this.contractorForm
      .get('oldWorkPermitCode')
      ?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        catchError(error => {
          this.oldEmployeeListFiles = [];
          return of(null);
        })
      )
      .subscribe((code: string) => {
        if (code && this.contractorForm.get('requestType')?.value === '1') {
          this.oldWorkPermitError = null;
          this.contractorRequestService.getByOldWorkPermit(code).subscribe({
            next: (data: ContractorRequestDto) => {
              if (data) {
                this.oldEmployeeListFiles =
                  data.files?.filter(file => file.fileType === FileType.EmployeeList) || [];
                this.processOldFiles();
                this.oldWorkPermitError = null;
              } else {
                this.oldEmployeeListFiles = [];
                this.oldWorkPermitError = 'No data found for the provided work permit code';
              }
            },
            error: err => {
              this.oldEmployeeListFiles = [];
            },
          });
        } else {
          this.oldEmployeeListFiles = [];
          this.oldWorkPermitError = null;
        }
      });
  }

  loadJobTypes(): void {
    this.jobTypeService
      .getAll()
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

  private validateEmployeeRequirement(): ValidatorFn {
    return (form: FormGroup): ValidationErrors | null => {
      const requestType = form.get('requestType')?.value;
      const employeeLists = form.get('employeeLists') as FormArray;
      const employeeListFile = form.get('employeeListFile')?.value;

      const isNewRequest = requestType === '0';
      const hasEmployeeList = employeeLists.length === form.get('employeeNumber').value;
      const hasFile = !!employeeListFile;

      if (isNewRequest && !hasEmployeeList && !hasFile) {
        return { employeeRequired: true };
      }
      return null;
    };
  }

  private initializeForm(): void {
    this.contractorForm = this.fb.group(
      {
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
        textFieldsValues: this.fb.group({}),
      },
      {
        validators: this.validateEmployeeRequirement(),
      }
    );

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
    this.jobTypeService
      .getDetails(jobTypeId)
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
        options: this.fb.array([]),
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
    return selectedSections.at(sectionIndex).get('options') as FormArray;
  }

  toggleOption(sectionIndex: number, optionId: string, checked: boolean): void {
    const selectedOptions = this.getSelectedOptions(sectionIndex);
    if (checked) {
      selectedOptions.push(
        this.fb.group({
          jobOptionId: [optionId],
          jobOptionName: [this.getOptionName(sectionIndex, optionId)],
        })
      );
    } else {
      const index = selectedOptions.controls.findIndex(
        ctrl => ctrl.get('jobOptionId')?.value === optionId
      );
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
      managementDepartment: [''],
      molexSupervisor: [''],
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

  onSubmit(): void {
    this.ngZone.onStable
      .asObservable()
      .pipe(take(1))
      .subscribe(() => {
        requestAnimationFrame(() => {
          const titleElement = document.getElementById('form-title');
          if (titleElement) {
            this.viewportScroller.scrollToAnchor('form-title');
          } else {
            this.viewportScroller.scrollToPosition([0, 0]);
          }
        });
      });
    if (this.contractorForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.contractorForm.value;
    const isNew = formValue.requestType === '0';
    let selections: CreateSelectionsDto | undefined;
    let textFieldValues: CreateJobTextFieldValueDto[] | undefined;

    if (isNew) {
      selections = {
        jobTypeId: formValue.jobTypeId,
        jobTypeName: this.jobTypes.find(jt => jt.id === formValue.jobTypeId)?.jobName ?? '',
        sections: formValue.selectedSections.map((section: any) => ({
          jobSectionId: section.jobSectionId,
          jobSectionName: section.jobSectionName,
          options: section.options.map((opt: any) => ({
            jobOptionId: opt.jobOptionId,
            jobOptionName: opt.jobOptionName,
          })) as OptionSelectionDto[],
        })) as SectionSelectionDto[],
      };

      textFieldValues = [];
      if (this.selectedJobTypeDetail) {
        this.selectedJobTypeDetail.textFields.forEach((field: JobTextFieldDto) => {
          const value = formValue.textFieldsValues[field.jobTextFieldId ?? ''];
          if (value) {
            textFieldValues.push({
              jobTypeId: formValue.jobTypeId,
              jobTypeName: selections.jobTypeName ?? '',
              jobTextFieldId: field.jobTextFieldId ?? '',
              textField: field.field ?? '',
              value: value,
            });
          }
        });
      }
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
      selections,
      textFieldValues,
    };

    this.contractorRequestService.create(requestDto).subscribe({
      next: result => {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, formValue.contractorName],
        });
        this.isSubmitting = false;
        this.resetForm();
      },
    });
  }

  private resetForm(): void {
    this.contractorForm.reset({
      requestType: '',
      molexSupervisorName: '',
      contractorName: '',
      contractorSupervisorName: '',
      contractorSupervisorPhone: '',
      workingArea: '',
      startDate: '',
      endDate: '',
      employeeNumber: null,
      workDescription: '',
      oldWorkPermitCode: '',
      molexSupervisorEmail: '',
      contractorEmail: '',
      videoConfirmed: '',
      jobTypeId: '',
    });

    const employeeLists = this.contractorForm.get('employeeLists') as FormArray;
    employeeLists.clear();

    const selectedSections = this.contractorForm.get('selectedSections') as FormArray;
    selectedSections.clear();

    const textFieldsValues = this.contractorForm.get('textFieldsValues') as FormGroup;
    Object.keys(textFieldsValues.controls).forEach(key => {
      textFieldsValues.removeControl(key);
    });

    this.documentFiles = [];
    this.documentPreviews = [];
    this.contractorForm.patchValue({ employeeListFile: null });

    this.oldEmployeeListFiles = [];
    this.oldWorkPermitError = null;

    this.selectedJobTypeDetail = null;

    this.updateValidators('');
  }
}