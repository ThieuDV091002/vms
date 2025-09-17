import { Component, ViewEncapsulation } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-error',
  templateUrl: './custom-error.component.html',
  styleUrls: ['./custom-error.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomErrorComponent  {
  data: string; // Error message
  details: string; // Detailed information
  nextAction: string; // Next action to display
  modalRef: NgbModalRef;
  isShowDetails = false;

  formatErrorMessage(message: string, nextAction: string): string {
    if (!message) return '';
    const formatted = `<strong>${message}</strong>`;
    return nextAction ? `${formatted}<br>${nextAction}` : formatted;
  }

  close() {
    this.modalRef?.close();
  }
}
