import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '../ui/button/button.component';
import {CheckboxComponent} from "../form/input/checkbox.component";
import {Router} from "@angular/router";

export interface GuestInfo {
    id: number;
    fullname: string;
    company: string;
    title: string;
    purpose: string;
    guest_number: number;
    work_with_whom_in_molex: string;
    is_hotel_support: boolean;
    hotel_id?: number;
    hotel_name?: string;
    room_type?: string;
    is_food_restrict: boolean;
    food_restrict_detail?: string;
    other_request?: string;
}

export interface FlightInfo {
    id: number;
    guest_info_id: number;
    date: string;
    no: string;
    route: string;
    time: string;
    flight_type: "Arrival" | "Departure";
}

export interface TransportInfo {
    id: number;
    guest_info_id: number;
    is_airport_trans: boolean;
    is_daily_trans: boolean;
    time?: string;
    route?: string;
    address?: string;
}

export interface UniformInfo {
    id: number;
    guest_info_id: number;
    is_visit_factory: boolean;
    card_type: "Blue" | "Red";
    uniform_type: "Green" | "Orange";
}

@Component({
    selector: 'app-guest-info-list',
    imports: [
        CommonModule,
        ButtonComponent,
        CheckboxComponent,
    ],
    templateUrl: './guest-info-list.html',
    styles: ``
})
export class GuestInfoListComponent {

    guestInfoData: GuestInfo[] = [
        {
            id: 1,
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
        },
        {
            id: 2,
            fullname: "Jane Smith",
            company: "XYZ Ltd",
            title: "Engineer",
            purpose: "Factory Visit",
            guest_number: 2,
            work_with_whom_in_molex: "Ms. Johnson",
            is_hotel_support: false,
            is_food_restrict: false
        },
        {
            id: 3,
            fullname: "Michael Lee",
            company: "GlobalTech",
            title: "Director",
            purpose: "Audit",
            guest_number: 1,
            work_with_whom_in_molex: "Mr. Brown",
            is_hotel_support: true,
            hotel_id: 102,
            hotel_name: "City Inn",
            room_type: "Suite",
            is_food_restrict: true,
            food_restrict_detail: "No peanuts",
            other_request: "Airport pickup"
        },
        {
            id: 4,
            fullname: "Michael Lee",
            company: "GlobalTech",
            title: "Director",
            purpose: "Audit",
            guest_number: 1,
            work_with_whom_in_molex: "Mr. Brown",
            is_hotel_support: true,
            hotel_id: 102,
            hotel_name: "City Inn",
            room_type: "Suite",
            is_food_restrict: true,
            food_restrict_detail: "No peanuts",
            other_request: "Airport pickup"
        },
        {
            id: 5,
            fullname: "Michael Lee",
            company: "GlobalTech",
            title: "Director",
            purpose: "Audit",
            guest_number: 1,
            work_with_whom_in_molex: "Mr. Brown",
            is_hotel_support: true,
            hotel_id: 102,
            hotel_name: "City Inn",
            room_type: "Suite",
            is_food_restrict: true,
            food_restrict_detail: "No peanuts",
            other_request: "Airport pickup"
        },
        {
            id: 6,
            fullname: "Michael Lee",
            company: "GlobalTech",
            title: "Director",
            purpose: "Audit",
            guest_number: 1,
            work_with_whom_in_molex: "Mr. Brown",
            is_hotel_support: true,
            hotel_id: 102,
            hotel_name: "City Inn",
            room_type: "Suite",
            is_food_restrict: true,
            food_restrict_detail: "No peanuts",
            other_request: "Airport pickup"
        }
    ]

    flightInfoData: FlightInfo[] = [
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
    ]

    transportInfoData: TransportInfo[] = [
        {
            id: 1,
            guest_info_id: 1,
            is_airport_trans: true,
            is_daily_trans: false,
            time: "09:00 AM",
            route: "O'Hare Airport → Molex HQ"
        },
        {
            id: 2,
            guest_info_id: 2,
            is_airport_trans: false,
            is_daily_trans: true,
            time: "08:00 AM",
            address: "Downtown Hotel → Molex Factory"
        },
        {
            id: 3,
            guest_info_id: 3,
            is_airport_trans: true,
            is_daily_trans: true,
            time: "07:30 AM",
            route: "Airport → City Inn → Molex HQ"
        }
    ]

    uniformInfoData: UniformInfo[] = [
        {
            id: 1,
            guest_info_id: 2,
            is_visit_factory: true,
            card_type: "Red",
            uniform_type: "Orange"
        },
        {
            id: 2,
            guest_info_id: 3,
            is_visit_factory: true,
            card_type: "Red",
            uniform_type: "Green"
        }
    ];

    currentPage = 1;
    itemsPerPage = 5;

    get totalPages(): number {
        return Math.ceil(this.guestInfoData.length / this.itemsPerPage);
    }

    get currentItems(): GuestInfo[] {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.guestInfoData.slice(start, start + this.itemsPerPage);
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    selectedRows: string[] = [];
    selectAll: boolean = false;

    handleSelectAll() {
        this.selectAll = !this.selectAll;
        if (this.selectAll) {
            this.selectedRows = this.guestInfoData.map(row => row.id.toString());
        } else {
            this.selectedRows = [];
        }
    }

    handleRowSelect(id: string) {
        if (this.selectedRows.includes(id)) {
            this.selectedRows = this.selectedRows.filter(rowId => rowId !== id);
        } else {
            this.selectedRows = [...this.selectedRows, id];
        }
    }

    constructor(private router: Router) {}

    goToDetail(id: number) {
        this.router.navigate(['/guest-infos-detail']);
    }
}
