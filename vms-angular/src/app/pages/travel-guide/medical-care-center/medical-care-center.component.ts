import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import {
    MedicalCareCenterListComponent
} from "../../../shared/components/travel-guide/medical-care-center/medical-care-center-list";

@Component({
    selector: 'app-medical-care-center',
    imports: [
        ComponentCardComponent,
        PageBreadcrumbComponent,
        MedicalCareCenterListComponent
    ],
    templateUrl: './medical-care-center.component.html',
    styles: ``
})
export class MedicalCareCentersComponent {

}
