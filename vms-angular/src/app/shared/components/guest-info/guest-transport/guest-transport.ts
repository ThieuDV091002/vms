import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-guest-transport',
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: './guest-transport.html',
    styles: ``
})
export class GuestInfoTransportCardComponent {

    transport = {
        id: 1,
        guest_info_id: 1,
        is_airport_trans: true,
        is_daily_trans: true,
        address: "JW Marriott Hotel",
        time: "09:00 AM",
        route: "O'Hare Airport → Molex Dong Anh"
    };
}
