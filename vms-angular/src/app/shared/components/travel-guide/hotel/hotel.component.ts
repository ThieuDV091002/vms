import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BadgeComponent } from '../../ui/badge/badge.component';
import {ModalService} from "../../../services/modal.service";
import {ButtonComponent} from "../../ui/button/button.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputFieldComponent} from "../../form/input/input-field.component";
import {LabelComponent} from "../../form/label/label.component";
import {ModalComponent} from "../../ui/modal/modal.component";
import {SelectComponent} from "../../form/select/select.component";

@Component({
    selector: 'app-hotel-list',
    imports: [
        CommonModule,
        BadgeComponent,
        ButtonComponent,
        FormsModule,
        InputFieldComponent,
        LabelComponent,
        ModalComponent,
        ReactiveFormsModule,
        SelectComponent,
    ],
    templateUrl: './hotel.component.html',
    styles: ``
})
export class HotelListComponent {
    constructor(public modal: ModalService) {}

    isOpen = false;
    openModal() { this.isOpen = true; }
    closeModal() { this.isOpen = false; }

    hotel ={
        hotelName: 'string',
        room: 'string',
        roomRate: 'string',
        address: 'string',
        distanceToMXV: 14.5,
        drivingTimeToMXV: 20,
        distanceToNoiBai: 14.5,
        drivingTimeToNoiBai: 20,
        status: 'Active',
        actions: { delete: true , edit: true },
    }

    tableData = [
        {
            id: 1,
            hotelName: 'string',
            room: 'string',
            roomRate: 'string',
            address: 'string',
            distanceToMXV: 14.5,
            drivingTimeToMXV: 20,
            distanceToNoiBai: 14.5,
            drivingTimeToNoiBai: 20,
            status: 'Active',
            actions: { delete: true , edit: true },
        },
        {
            id: 2,
            hotelName: 'string',
            room: 'string',
            roomRate: 'string',
            address: 'string',
            distanceToMXV: 14.5,
            drivingTimeToMXV: 20,
            distanceToNoiBai: 14.5,
            drivingTimeToNoiBai: 20,
            status: 'Active',
            actions: { delete: true , edit: true },
        },
        {
            id: 3,
            hotelName: 'string',
            room: 'string',
            roomRate: 'string',
            address: 'string',
            distanceToMXV: 14.5,
            drivingTimeToMXV: 20,
            distanceToNoiBai: 14.5,
            drivingTimeToNoiBai: 20,
            status: 'Active',
            actions: { delete: true , edit: true },
        },
        {
            id: 4,
            hotelName: 'string',
            room: 'string',
            roomRate: 'string',
            address: 'string',
            distanceToMXV: 14.5,
            drivingTimeToMXV: 20,
            distanceToNoiBai: 14.5,
            drivingTimeToNoiBai: 20,
            status: 'Active',
            actions: { delete: true , edit: true },

        },
        {
            id: 5,
            hotelName: 'string',
            room: 'string',
            roomRate: 'string',
            address: 'string',
            distanceToMXV: 14.5,
            drivingTimeToMXV: 20,
            distanceToNoiBai: 14.5,
            drivingTimeToNoiBai: 20,
            status: 'Close',
            actions: { delete: true , edit: true },
        },
    ];

    getBadgeColor(status: string): 'success' | 'error' {
        if (status === 'Active') return 'success';
        return 'error';
    }

    options = [
        { value: 'Active', label: 'Active' },
        { value: 'Close', label: 'Close' },
    ];
    selectedValue = '';
    selectedValues: string[] = ['1', '2'];

    handleSelectChange(value: string) {
        this.selectedValue = value;
        console.log('Selected value:', value);
    }

    handleSave() {
        // Handle save logic here
        console.log('Saving changes...');
        this.modal.closeModal();
    }
}
