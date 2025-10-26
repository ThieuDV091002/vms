import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-guest-flight',
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: './guest-flight.html',
    styles: ``
})
export class GuestInfoFlightCardComponent {

    flight = [
        {
            id: 1,
            guest_info_id: 1,
            date: "2025-09-25",
            no: "AA123",
            route: "New York → Chicago",
            time: "10:30 AM",
            flight_type: "Arrival"
        },
        {
            id: 2,
            guest_info_id: 3,
            date: "2025-09-26",
            no: "UA456",
            route: "Chicago → Tokyo",
            time: "08:00 PM",
            flight_type: "Departure"
        }
    ];
}
