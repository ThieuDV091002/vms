import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import { BadgeComponent } from '../../ui/badge/badge.component';
import {ModalService} from "../../../services/modal.service";
import {ButtonComponent} from "../../ui/button/button.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputFieldComponent} from "../../form/input/input-field.component";
import {LabelComponent} from "../../form/label/label.component";
import {ModalComponent} from "../../ui/modal/modal.component";
import {SelectComponent} from "../../form/select/select.component";
import {FileInputComponent} from "../../form/input/file-input.component";

@Component({
    selector: 'app-food-list',
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
        FileInputComponent,
    ],
    templateUrl: './food-list.html',
    styles: ``
})
export class FoodListComponent {
    constructor(public modal: ModalService) {}

    isOpen = false;
    openModal() { this.isOpen = true; }
    closeModal() { this.isOpen = false; }

    food ={
        Name: 'string',
        locationUrl: 'string',
        photoUrl: '/images/grid-image/image-01.png',
        status: "Active",
        actions: { delete: true , edit: true },
    }

    tableData = [
        {
            id: 1,
            Name: 'Food 1',
            locationUrl: 'https://maps.google.com/food1',
            photoUrl: '/images/grid-image/image-01.png',
            status: 'Active',
            actions: { delete: true, edit: true },
        },
        {
            id: 2,
            Name: 'Food 2',
            locationUrl: 'https://maps.google.com/food2',
            photoUrl: '/images/grid-image/image-01.png',
            status: 'Active',
            actions: { delete: true, edit: true },
        },
        {
            id: 3,
            Name: 'Food 3',
            locationUrl: 'https://maps.google.com/food3',
            photoUrl: '/images/grid-image/image-01.png',
            status: 'Active',
            actions: { delete: true, edit: true },
        },
        {
            id: 4,
            Name: 'Food 4',
            locationUrl: 'https://maps.google.com/food4',
            photoUrl: '/images/grid-image/image-01.png',
            status: 'Active',
            actions: { delete: true, edit: true },
        },
        {
            id: 5,
            Name: 'Food 5',
            locationUrl: 'https://maps.google.com/food5',
            photoUrl: 'https://picsum.photos/200/100?random=5',
            status: 'Close',
            actions: { delete: true, edit: true },
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
        console.log('Saving changes...');
        this.modal.closeModal();
    }

    previewUrl: string = this.food.photoUrl;

    handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.previewUrl = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }
}
