import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import {HotelListComponent} from "../../../shared/components/travel-guide/hotel/hotel.component";

@Component({
    selector: 'app-hotel',
    imports: [
        ComponentCardComponent,
        PageBreadcrumbComponent,
        HotelListComponent
    ],
    templateUrl: './hotel.component.html',
    styles: ``
})
export class HotelsComponent {

}
