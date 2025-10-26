import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import {GuestInfoListComponent} from "../../shared/components/guest-info/guest-info-list";

@Component({
    selector: 'app-guest-info',
    imports: [
        ComponentCardComponent,
        PageBreadcrumbComponent,
        GuestInfoListComponent,
    ],
    templateUrl: './guest-info.html',
    styles: ``
})
export class GuestInfosComponent {

}
