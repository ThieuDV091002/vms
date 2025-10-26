import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import {TransportationListComponent} from "../../../shared/components/travel-guide/transportation/transportation-list";

@Component({
    selector: 'app-transportation',
    imports: [
        ComponentCardComponent,
        PageBreadcrumbComponent,
        TransportationListComponent
    ],
    templateUrl: './transportation.component.html',
    styles: ``
})
export class TransportationsComponent {

}
