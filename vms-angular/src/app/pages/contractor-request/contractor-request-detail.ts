import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import {
    ContractorRequestGeneralCardComponent
} from "../../shared/components/contractor-request/general-info/general-info";
import {
    ContractorRequestEmployeeListCardComponent
} from "../../shared/components/contractor-request/employee-list/contractor-employee-list";
import {
    ContractorRequestDocumentCardComponent
} from "../../shared/components/contractor-request/document/contractor-document";
import {TextAreaComponent} from "../../shared/components/form/input/text-area.component";
import {LabelComponent} from "../../shared/components/form/label/label.component";
import {ButtonComponent} from "../../shared/components/ui/button/button.component";

@Component({
    selector: 'app-contractor-request-detail',
    imports: [
        CommonModule,
        PageBreadcrumbComponent,
        ContractorRequestGeneralCardComponent,
        ContractorRequestEmployeeListCardComponent,
        ContractorRequestDocumentCardComponent,
        TextAreaComponent,
        LabelComponent,
        ButtonComponent
    ],
    templateUrl: './contractor-request-detail.html',
    styles: ``
})
export class ContractorRequestDetailComponent {
    Comment: string = "";
}
