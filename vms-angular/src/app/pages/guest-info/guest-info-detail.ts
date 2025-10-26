import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import {GuestInfoGeneralCardComponent} from "../../shared/components/guest-info/guest-general/guest-general";
import {GuestInfoFlightCardComponent} from "../../shared/components/guest-info/guest-flight/guest-flight";
import {GuestInfoTransportCardComponent} from "../../shared/components/guest-info/guest-transport/guest-transport";
import {GuestInfoUniformCardComponent} from "../../shared/components/guest-info/guest-uniform/guest-uniform";
import {ButtonComponent} from "../../shared/components/ui/button/button.component";

@Component({
    selector: 'app-guest-info-detail',
    imports: [
        CommonModule,
        PageBreadcrumbComponent,
        GuestInfoGeneralCardComponent,
        GuestInfoFlightCardComponent,
        GuestInfoTransportCardComponent,
        GuestInfoUniformCardComponent,
        ButtonComponent
    ],
    templateUrl: './guest-info-detail.html',
    styles: ``
})
export class GuestInfoDetailComponent {

}
