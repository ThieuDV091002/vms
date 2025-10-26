import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-guest-uniform',
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: './guest-uniform.html',
    styles: ``
})
export class GuestInfoUniformCardComponent {

    uniform = {
        id: 1,
        guest_info_id: 2,
        is_visit_factory: true,
        card_type: "Red",
        uniform_type: "Orange"
    };
}
