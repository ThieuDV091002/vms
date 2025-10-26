import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import {AttractionListComponent} from "../../../shared/components/travel-guide/attraction/attraction-list";

@Component({
    selector: 'app-food',
    imports: [
        ComponentCardComponent,
        PageBreadcrumbComponent,
        AttractionListComponent
    ],
    templateUrl: './attraction.component.html',
    styles: ``
})
export class AttractionsComponent {

}
