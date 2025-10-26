import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgClass } from "@angular/common";
import { ModalService } from "../../services/modal.service";
import { ButtonComponent } from "../ui/button/button.component";
import { DatePickerComponent } from "../form/date-picker/date-picker.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputFieldComponent } from "../form/input/input-field.component";
import { LabelComponent } from "../form/label/label.component";
import { ModalComponent } from "../ui/modal/modal.component";
import { SelectComponent } from "../form/select/select.component";
import { TextAreaComponent } from "../form/input/text-area.component";
import * as XLSX from 'xlsx';
import {FileInputComponent} from "../form/input/file-input.component";
import {FileInputExampleComponent} from "../form/form-elements/file-input-example/file-input-example.component";

@Component({
    selector: 'app-contractor-register',
    templateUrl: './contractor-register.component.html',
    imports: [
        NgClass,
        ButtonComponent,
        DatePickerComponent,
        FormsModule,
        InputFieldComponent,
        LabelComponent,
        ModalComponent,
        ReactiveFormsModule,
        SelectComponent,
        TextAreaComponent,
        FileInputComponent,
        FileInputExampleComponent
    ],
    styles: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorRegisterComponent {
    communityMembers = [
        {
            img: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
            alt: 'Member 1',
            zIndex: 'z-[1]'
        },
        {
            img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            alt: 'Member 2',
            zIndex: 'z-[2]'
        },
        {
            img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop',
            alt: 'Member 3',
            zIndex: 'z-[3]'
        }
    ];

    isOpen = false;
    openModal() {
        this.isOpen = true;
        this.cdr.markForCheck();
    }
    closeModal() {
        this.isOpen = false;
        this.cdr.markForCheck();
    }

    typeOptions = [
        { value: 'New', label: 'Giấy phép mới' },
        { value: 'Extend', label: 'Gia hạn giấy phép cũ / Bổ sung nhân viên' },
    ];
    selectedValue = '';
    selectedValues: string[] = ['1', '2'];

    dateValue: any;
    timeValue = '';
    onTimeSelected(time: string) {
        console.log('Picked time:', time); // e.g. "10:45"
    }
    handleDateChange(event: any) {
        this.dateValue = event;
        console.log('Date changed:', event);
        this.cdr.markForCheck();
    }

    permitForm: FormGroup;
    permitType: string | null = null;
    jobType: string | null = null;
    employees: any[] = [];
    relatedFiles: File[] = [];

    jobTypeOptions = [
        { value: '', label: '-- Chọn loại công việc --', disabled: true },
        { value: 'welding', label: 'A. Làm việc hàn, cắt' },
        { value: 'chemical', label: 'B. Làm việc tiếp xúc với hóa chất nguy hiểm' },
        { value: 'working_height', label: 'C. Làm việc trên cao' },
        { value: 'lifting', label: 'D. Làm việc sử dụng thiết bị nâng hạ' },
        { value: 'general', label: 'E. Công việc chung' }
    ];

    constructor(private fb: FormBuilder, public modal: ModalService, private cdr: ChangeDetectorRef) {
        this.permitForm = this.fb.group({
            molexSupervisor: ['', Validators.required],
            vendorCompany: ['', Validators.required],
            vendorSupervisor: ['', Validators.required],
            workArea: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            workerCount: ['', [Validators.required, Validators.min(1)]],
            jobDescription: ['', Validators.required],
            jobType: ['', Validators.required],
            molexEmail: ['', [Validators.required, Validators.email]],
            trainingCommit: [false, Validators.requiredTrue],
            vendorApprovalEmail: ['', [Validators.required, Validators.email]],
            listCompleted: [false, Validators.requiredTrue],
            weldTasks: this.fb.array([]),
            weldConditions: this.fb.array([]),
            weldSafety: this.fb.array([]),
            chemical1: [''],
            chemical2: [''],
            chemical3: [''],
            chemical4: [''],
            chemical5: [''],
            chemical6: [''],
            chemicalHazards: this.fb.array([], Validators.required),
            ppe: this.fb.array([], Validators.required),
            fireExtinguishers: this.fb.array([], Validators.required),
            spillMaterials: this.fb.array([], Validators.required),
            spillOtherMaterial: [''],
            workingHeightDevices: this.fb.array([], Validators.required),
            workingHeightConditions: this.fb.array([], Validators.required),
            workingHeightSafety: this.fb.array([], Validators.required),
            workingHeightOtherDevice: [''],
            liftingEquipmentInfo: ['', Validators.required],
            liftingConditions: this.fb.array([], Validators.required),
            generalHazards: this.fb.array([], Validators.required),
            generalSafety: this.fb.array([], Validators.required),
            oldPermitNumberRenew: ['', Validators.required],
            vendorCompanyRenew: ['', Validators.required],
            renewToDate: ['', Validators.required],
            noAddList: [false],
            completedAddList: [false]
        });
    }

    handleSelectChange(value: string): void {
        this.selectedValue = value;
        this.permitType = value;
        this.permitForm.reset();
        this.employees = [];
        this.jobType = null;
        if (value === 'New') {
            this.permitForm.get('oldPermitNumberRenew')?.clearValidators();
            this.permitForm.get('vendorCompanyRenew')?.clearValidators();
            this.permitForm.get('renewToDate')?.clearValidators();
            this.permitForm.get('noAddList')?.clearValidators();
            this.permitForm.get('completedAddList')?.clearValidators();
        } else if (value === 'Extend') {
            this.permitForm.get('molexSupervisor')?.clearValidators();
            this.permitForm.get('vendorCompany')?.clearValidators();
            this.permitForm.get('vendorSupervisor')?.clearValidators();
            this.permitForm.get('workArea')?.clearValidators();
            this.permitForm.get('startDate')?.clearValidators();
            this.permitForm.get('endDate')?.clearValidators();
            this.permitForm.get('workerCount')?.clearValidators();
            this.permitForm.get('jobDescription')?.clearValidators();
            this.permitForm.get('jobType')?.clearValidators();
            this.permitForm.get('molexEmail')?.clearValidators();
            this.permitForm.get('trainingCommit')?.clearValidators();
            this.permitForm.get('vendorApprovalEmail')?.clearValidators();
            this.permitForm.get('listCompleted')?.clearValidators();
        }
        this.permitForm.updateValueAndValidity();
        this.cdr.markForCheck();
        console.log('Selected value:', value);
    }

    onJobTypeChange(value: string): void {
        this.jobType = value;
        this.clearJobTypeValidators();
        if (value === 'welding') {
            this.permitForm.get('weldTasks')?.setValidators(Validators.required);
            this.permitForm.get('weldConditions')?.setValidators(Validators.required);
            this.permitForm.get('weldSafety')?.setValidators(Validators.required);
        } else if (value === 'chemical') {
            this.permitForm.get('chemicalHazards')?.setValidators(Validators.required);
            this.permitForm.get('ppe')?.setValidators(Validators.required);
            this.permitForm.get('fireExtinguishers')?.setValidators(Validators.required);
            this.permitForm.get('spillMaterials')?.setValidators(Validators.required);
        } else if (value === 'working_height') {
            this.permitForm.get('workingHeightDevices')?.setValidators(Validators.required);
            this.permitForm.get('workingHeightConditions')?.setValidators(Validators.required);
            this.permitForm.get('workingHeightSafety')?.setValidators(Validators.required);
        } else if (value === 'lifting') {
            this.permitForm.get('liftingEquipmentInfo')?.setValidators(Validators.required);
            this.permitForm.get('liftingConditions')?.setValidators(Validators.required);
        } else if (value === 'general') {
            this.permitForm.get('generalHazards')?.setValidators(Validators.required);
            this.permitForm.get('generalSafety')?.setValidators(Validators.required);
        }
        this.permitForm.updateValueAndValidity();
        this.cdr.markForCheck();
    }

    clearJobTypeValidators(): void {
        this.permitForm.get('weldTasks')?.clearValidators();
        this.permitForm.get('weldConditions')?.clearValidators();
        this.permitForm.get('weldSafety')?.clearValidators();
        this.permitForm.get('chemicalHazards')?.clearValidators();
        this.permitForm.get('ppe')?.clearValidators();
        this.permitForm.get('fireExtinguishers')?.clearValidators();
        this.permitForm.get('spillMaterials')?.clearValidators();
        this.permitForm.get('workingHeightDevices')?.clearValidators();
        this.permitForm.get('workingHeightConditions')?.clearValidators();
        this.permitForm.get('workingHeightSafety')?.clearValidators();
        this.permitForm.get('liftingEquipmentInfo')?.clearValidators();
        this.permitForm.get('liftingConditions')?.clearValidators();
        this.permitForm.get('generalHazards')?.clearValidators();
        this.permitForm.get('generalSafety')?.clearValidators();
        this.permitForm.updateValueAndValidity();
    }

    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files || !input.files[0]) return;
        const file = input.files[0];
        if (file.size > 5 * 1024 * 1024) {
            alert('File quá lớn! Vui lòng chọn file dưới 5MB.');
            input.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev: any) => {
            try {
                const data = new Uint8Array(ev.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

                let addedCount = 0;
                jsonData.forEach((row: any) => {
                    if (row['Tên'] && row['Số CCCD/ Hộ chiếu']) {
                        this.employees.push({
                            name: row['Tên'],
                            dob: row['Ngày sinh'] || '',
                            id: row['Số CCCD/ Hộ chiếu'],
                            company: row['Công ty'] || '',
                            department: row['Bộ phận quản lý'] || '',
                            molexPIC: row['Người phụ trách của Molex'] || ''
                        });
                        addedCount++;
                    }
                });
                this.employees = [...this.employees];
                alert(`Đã nhập thành công ${addedCount} nhân viên!`);
                input.value = '';
            } catch (error) {
                console.error('Import error:', error);
                alert('Lỗi nhập file. Vui lòng kiểm tra lại định dạng file.');
            } finally {
                this.cdr.markForCheck();
            }
        };
        reader.readAsArrayBuffer(file);
    }

    onRelatedFilesChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.relatedFiles = Array.from(input.files);
        }
        this.cdr.markForCheck();
    }

    deleteEmployee(index: number): void {
        this.employees.splice(index, 1);
        this.employees = [...this.employees];
        this.cdr.markForCheck();
    }

    trackByEmployeeId(index: number, emp: any): string | number {
        return emp.id || index;
    }

    onNoAddListChange(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;
        if (checked) {
            this.permitForm.get('completedAddList')?.setValue(false);
            this.employees = [];
        }
        this.cdr.markForCheck();
    }

    handleSave(): void {
        if (this.permitForm.invalid) {
            this.permitForm.markAllAsTouched();
            this.cdr.markForCheck();
            return;
        }

        if (this.permitType === 'Extend' && !this.permitForm.get('noAddList')?.value && this.employees.length === 0) {
            alert('Vui lòng nhập danh sách nhân viên hoặc chọn "Không bổ sung danh sách".');
            return;
        }

        const formValue = this.permitForm.value;
        const data = this.permitType === 'New' ? {
            molexSupervisor: formValue.molexSupervisor,
            vendorCompany: formValue.vendorCompany,
            vendorSupervisor: formValue.vendorSupervisor,
            workArea: formValue.workArea,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            workerCount: formValue.workerCount,
            jobDescription: formValue.jobDescription,
            jobType: formValue.jobType,
            molexEmail: formValue.molexEmail,
            trainingCommit: formValue.trainingCommit,
            relatedFiles: this.relatedFiles,
            vendorApprovalEmail: formValue.vendorApprovalEmail,
            employeeList: this.employees,
            jobDetails: {
                weldTasks: formValue.weldTasks,
                weldConditions: formValue.weldConditions,
                weldSafety: formValue.weldSafety,
                chemical1: formValue.chemical1,
                chemical2: formValue.chemical2,
                chemical3: formValue.chemical3,
                chemical4: formValue.chemical4,
                chemical5: formValue.chemical5,
                chemical6: formValue.chemical6,
                chemicalHazards: formValue.chemicalHazards,
                ppe: formValue.ppe,
                fireExtinguishers: formValue.fireExtinguishers,
                spillMaterials: formValue.spillMaterials,
                spillOtherMaterial: formValue.spillOtherMaterial,
                workingHeightDevices: formValue.workingHeightDevices,
                workingHeightConditions: formValue.workingHeightConditions,
                workingHeightSafety: formValue.workingHeightSafety,
                workingHeightOtherDevice: formValue.workingHeightOtherDevice,
                liftingEquipmentInfo: formValue.liftingEquipmentInfo,
                liftingConditions: formValue.liftingConditions,
                generalHazards: formValue.generalHazards,
                generalSafety: formValue.generalSafety
            }
        } : {
            oldPermitNumber: formValue.oldPermitNumberRenew,
            vendorCompany: formValue.vendorCompanyRenew,
            renewToDate: formValue.renewToDate,
            noAddList: formValue.noAddList,
            completedAddList: formValue.completedAddList,
            employeeList: this.employees
        };

        console.log('Saving changes...', data);
        alert(this.permitType === 'New' ? 'Gửi giấy phép mới thành công!' : 'Gửi gia hạn/bổ sung thành công!');
        this.modal.closeModal();
        this.permitForm.reset();
        this.employees = [];
        this.relatedFiles = [];
        this.jobType = null;
        this.permitType = null;
        this.selectedValue = '';
        this.dateValue = null;
        this.timeValue = '';
        this.cdr.markForCheck();
    }
}