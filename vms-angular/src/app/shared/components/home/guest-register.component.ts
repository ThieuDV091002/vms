import {Component} from '@angular/core';
import {NgClass} from "@angular/common";
import {ModalService} from "../../services/modal.service";
import {ButtonComponent} from "../ui/button/button.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputFieldComponent} from "../form/input/input-field.component";
import {LabelComponent} from "../form/label/label.component";
import {ModalComponent} from "../ui/modal/modal.component";
import {SelectComponent} from "../form/select/select.component";
import {TextAreaComponent} from "../form/input/text-area.component";
import {TimePickerComponent} from "../form/time-picker/time-picker.component";
import {DatePickerComponent} from "../form/date-picker/date-picker.component";

@Component({
    selector: 'app-guest-register',
    templateUrl: './guest-register.component.html',
    imports: [
        NgClass,
        ButtonComponent,
        FormsModule,
        InputFieldComponent,
        LabelComponent,
        ModalComponent,
        ReactiveFormsModule,
        SelectComponent,
        TextAreaComponent,
        TimePickerComponent,
        DatePickerComponent
    ],
    styles: ''
})
export class GuestRegisterComponent {
    communityMembers = [
        {
            img: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
            alt: 'User 1',
            zIndex: 'z-[1]'
        },
        {
            img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            alt: 'User 2',
            zIndex: 'z-[2]'
        },
        {
            img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop',
            alt: 'User 3',
            zIndex: 'z-[3]'
        }
    ];

    constructor(public modal: ModalService) {}

    isOpen = false;
    openModal() { this.isOpen = true; }
    closeModal() { this.isOpen = false; }

    hotelOptions = [
        { value: '1', label: 'Yes' },
        { value: '0', label: 'No' },
    ];
    foodOptions = [
        { value: '1', label: 'Yes' },
        { value: '0', label: 'No' },
    ];
    transportOptions = [
        { value: '1', label: 'Yes' },
        { value: '0', label: 'No' },
    ];
    visitOptions = [
        { value: '1', label: 'Yes' },
        { value: '0', label: 'No' },
    ];
    cardOptions = [
        { value: 'Blue', label: 'Blue(For non visit factory)' },
        { value: 'Red', label: 'Red(For non visit factory)' },
    ];
    uniformOptions = [
        { value: 'Green', label: 'Green(For leaderboard)' },
        { value: 'Orange', label: 'Orange' },
    ];
    selectedValue = '';
    selectedValues: string[] = ['1', '2'];

    handleSelectChange(value: string) {
        this.selectedValue = value;
        console.log('Selected value:', value);
    }

    handleSave() {
        console.log('Saving changes...');
        this.modal.closeModal();
    }
    dateValue: any;
    timeValue = '';
    onTimeSelected(time: string) {
        console.log('Picked time:', time);
    }
    handleDateChange(event: any) {
        this.dateValue = event;
        console.log('Date changed:', event);
    }

    selectedHotelOption: string = '0';
    selectedCardOption: string = '';

    isHotelFieldsEnabled = false;
    isHotelSelectEnabled = false;

    handleHotelSelectChange(value: string) {
        this.selectedHotelOption = value;
        this.isHotelFieldsEnabled = value === '1';
        this.isHotelSelectEnabled = value === '1';
    }

    handleCardSelectChange(value: string) {
        this.selectedCardOption = value;
    }

    isVisitFieldsEnabled = false; // điều khiển 2 select Card + Uniform

    handleVisitSelectChange(value: string) {
        this.isVisitFieldsEnabled = value === '1'; // enable nếu Yes
    }

    isFoodDetailEnabled = false;

    handleFoodSelectChange(value: string) {
        this.isFoodDetailEnabled = value === '1';
    }

    isTransportFieldsEnabled = false;

    handleTransportSelectChange(value: string) {
        this.isTransportFieldsEnabled = value === '1'; // enable khi Yes
    }
}
