import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateContractorRequestDto } from '@apis/vms/dtos/contractor-request';

@Component({
  selector: 'app-contractor-form',
  templateUrl: './contractor-form.component.html',
  styleUrls: ['./contractor-form.component.scss']
})
export class ContractorFormComponent implements OnInit {
  contractorForm: FormGroup;
  isMobileMenuOpen = false;
  documentFiles: File[] = [];
  documentPreviews: { file: File; url: string }[] = [];

  constructor(private fb: FormBuilder) {
    this.contractorForm = this.fb.group({
      requestType: ['', Validators.required],
      molexSupervisorName: ['', Validators.required],
      contractorName: ['', Validators.required],
      contractorSupervisorName: ['', Validators.required],
      contractorSupervisorPhone: ['', Validators.required],
      workingArea: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      employeeNumber: ['', [Validators.required, Validators.min(1)]],
      workDescription: ['', Validators.required],
      oldWorkPermitCode: [''],
      molexSupervisorEmail: ['', [Validators.required, Validators.email]],
      contractorEmail: ['', [Validators.required, Validators.email]],
      videoConfirmed: ['', Validators.required],
      message: ['', Validators.required],
      employeeLists: this.fb.array([]),
      documentFiles: [null]
    });
  }

  ngOnInit(): void {
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
          this.documentPreviews.push({ file, url: '' });
        }
      });

      input.value = '';
    }
  }

  removeDocumentFile(index: number): void {
    this.documentFiles.splice(index, 1);
    this.documentPreviews.splice(index, 1);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onSubmit(): void {
    if (this.contractorForm.valid) {
      const formValue = this.contractorForm.value;
      const requestDto: CreateContractorRequestDto = {
        requestType: parseInt(formValue.requestType),
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
        employeeLists: formValue.employeeLists,
        documentFiles: this.documentFiles
      };
      console.log('Form Submitted:', requestDto);
    } else {
      console.log('Form is invalid');
    }
  }
}