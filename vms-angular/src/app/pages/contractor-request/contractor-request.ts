import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import {ContractorRequestListComponent} from "../../shared/components/contractor-request/contractor-request-list";

@Component({
    selector: 'app-guest-info',
    imports: [
        ComponentCardComponent,
        PageBreadcrumbComponent,
        ContractorRequestListComponent,
    ],
    templateUrl: './contractor-request.html',
    styles: ``
})
export class ContractorRequestsComponent {

}