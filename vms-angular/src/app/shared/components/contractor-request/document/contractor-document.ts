import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-contractor-request-document',
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: './contractor-document.html',
    styles: ``
})
export class ContractorRequestDocumentCardComponent {

    files = [
        {
            id: 1,
            vendor_request_id: 1,
            fileName: "WorkPermit_Document.pdf",
            url: "/assets/files/WorkPermit_Document.pdf",
            filetype: "document"
        },
        {
            id: 2,
            vendor_request_id: 1,
            fileName: "Employee_List.xlsx",
            url: "/assets/files/Employee_List.xlsx",
            filetype: "document"
        },
        {
            id: 3,
            vendor_request_id: 1,
            fileName: "Safety_Checklist.docx",
            url: "/assets/files/Safety_Checklist.docx",
            filetype: "document"
        }
    ];
}
