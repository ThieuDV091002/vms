import { LocalizationModule, LocalizationService } from '@abp/ng.core';
import { ConfirmationService, ModalComponent, ToasterService } from '@abp/ng.theme.shared';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GuestInfoService } from '@apis/vms/services';

@Component({
  selector: 'app-guest-component',
  standalone: true,
  imports: [CommonModule, LocalizationModule],
  templateUrl: './guest-component.component.html',
  styleUrl: './guest-component.component.scss',
})
export class GuestComponent {
  form: FormGroup;
  constructor(
    public service: GuestInfoService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService
  ) {}

  buildForm() {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      company: ['', Validators.required],
    });
  }

  isModalOpen = false;

  openModal() {
    this.buildForm();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  confirmAction() {
    console.log('Action confirmed');
    this.closeModal();
  }
}
