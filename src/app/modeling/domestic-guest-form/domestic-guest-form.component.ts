import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '@abp/ng.theme.shared';
import { LocalizationService } from '@abp/ng.core';
import { CreateDomesticGuestDto } from '@apis/vms/dtos/domestic-guest';
import { DomesticGuestService } from '@apis/vms/services/domestic-guest.service';
import { DepartmentPICService } from '@apis/vms/services';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-domestic-guest-form',
  templateUrl: './domestic-guest-form.component.html',
  styleUrl: './domestic-guest-form.component.scss',
})
export class DomesticGuestFormComponent implements OnInit {
  @ViewChild('formTop') formTop!: ElementRef;

  scrollToTop(): void {
    const topElement = this.formTop?.nativeElement;
    if (topElement) {
      topElement.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }

  info: string;
  departments: any[] = [];
  domesticGuestForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private domesticGuestService: DomesticGuestService,
    private departmentService: DepartmentPICService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.localizationService.get('vms::LABEL_DomesticGuestRegistration').subscribe(data => {
      this.info = data;
    });

    this.loadDepartments();
    this.buildForm();
  }

  isDarkMode() {
    return this.themeService.isDarkTheme();
  }

  private buildForm() {
    this.domesticGuestForm = this.fb.group({
      fullName: ['', Validators.required],
      company: [''],
      department: ['', Validators.required],
      email: [''],
      purpose: ['', Validators.required],
      workDate: ['', Validators.required],
    });
  }

  loadDepartments() {
    this.departmentService
      .getList({ name: '', sorting: '', skipCount: 0, maxResultCount: 100 })
      .subscribe(res => (this.departments = res.items));
  }

  onSubmit() {
    if (this.domesticGuestForm.invalid) {
      this.domesticGuestForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.domesticGuestForm.value;

    const dto: CreateDomesticGuestDto = {
      fullName: formValue.fullName,
      company: formValue.company || null,
      department: formValue.department,
      email: formValue.email || null,
      purpose: formValue.purpose,
      workDate: formValue.workDate,
    };

    this.domesticGuestService.create(dto).subscribe({
      next: () => {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, formValue.fullName],
        });
        this.resetForm();
        this.isSubmitting = false;
        this.scrollToTop();
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }

  private resetForm() {
    this.domesticGuestForm.reset();
  }
}