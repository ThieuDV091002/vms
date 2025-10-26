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
import {TextAreaComponent} from "../../form/input/text-area.component";

@Component({
    selector: 'app-attraction-list',
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
        TextAreaComponent,
    ],
    templateUrl: './attraction-list.html',
    styles: ``
})
export class AttractionListComponent {
    constructor(public modal: ModalService) {}

    isOpen = false;
    openModal() { this.isOpen = true; }
    closeModal() { this.isOpen = false; }

    attraction ={
        Name: 'string',
        locationUrl: 'https://www.google.com/maps/place/C%C3%B4ng+Ty+Molex/@21.1140524,105.7649471,17.14z/data=!4m6!3m5!1s0x3134ff37ed91730b:0xe71cf98490ffa06e!8m2!3d21.1125268!4d105.7643045!16s%2Fg%2F11h5tx5mq3?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D',
        description: 'This is a description',
        photoUrl: '/images/grid-image/image-01.png',
        status: "Active",
        actions: { delete: true , edit: true },
    }

    tableData = [
        {
            id: 1,
            Name: 'Attraction 1',
            locationUrl: 'https://maps.google.com/attraction1',
            description: 'This is a description',
            photoUrl: '/images/grid-image/image-01.png',
            status: 'Active',
            actions: { delete: true, edit: true },
        },
        {
            id: 2,
            Name: 'Attraction 2',
            locationUrl: 'https://maps.google.com/attraction2',
            description: 'This is a description',
            photoUrl: '/images/grid-image/image-01.png',
            status: 'Active',
            actions: { delete: true, edit: true },
        },
        {
            id: 3,
            Name: 'Attraction 3',
            locationUrl: 'https://maps.google.com/attraction3',
            description: 'This is a description',
            photoUrl: '/images/grid-image/image-01.png',
            status: 'Active',
            actions: { delete: true, edit: true },
        },
        {
            id: 4,
            Name: 'Attraction 4',
            locationUrl: 'https://maps.google.com/attraction4',
            description: 'This is a description',
            photoUrl: '/images/grid-image/image-01.png',
            status: 'Active',
            actions: { delete: true, edit: true },
        },
        {
            id: 5,
            Name: 'Attraction 5',
            locationUrl: 'https://maps.google.com/attraction5',
            description: 'This is a description',
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

    previewUrl: string = this.attraction.photoUrl;

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
