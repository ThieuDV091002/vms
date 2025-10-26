import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-guest-general',
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: './guest-general.html',
    styles: ``
})
export class GuestInfoGeneralCardComponent {

    general = {
        fullname: "John Doe",
        company: "ABC Corp",
        title: "Manager",
        purpose: "Business Meeting",
        guest_number: 1,
        work_with_whom_in_molex: "Mr. Smith",
        is_hotel_support: true,
        hotel_id: 101,
        hotel_name: "Molex Hotel",
        room_type: "Deluxe",
        is_food_restrict: true,
        food_restrict_detail: "Vegetarian",
        other_request: "Late check-in"
    };
}
