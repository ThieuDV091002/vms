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
    selector: 'app-transportation-list',
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
    templateUrl: './transportation-list.html',
    styles: ``
})
export class TransportationListComponent {
    constructor(public modal: ModalService) {}

    isOpen = false;
    openModal() { this.isOpen = true; }
    closeModal() { this.isOpen = false; }

    transport ={
        Name: 'string',
        downloadUrl: 'https://www.grab.com/vn/download/?af_sub1=download_app&pid=organic_web&is_retargeting=true&af_js_web=true&af_adset=grab_website&af_ad=/vn/&af_channel=homepage&c=organic_web&af_ss_ver=2_7_3',
        photoUrl: '/images/grid-image/image-01.png',
        status: "Active",
        actions: { delete: true , edit: true },
    }

    tableData = [
        {
            id: 1,
            Name: 'Transportation 1',
            downloadUrl: 'https://maps.google.com/transportation1',
            photoUrl: '/images/grid-image/image-01.png',
            status: 'Active',
            actions: { delete: true, edit: true },
        },
        {
            id: 2,
            Name: 'Transportation 2',
            downloadUrl: 'https://maps.google.com/transportation2',
            photoUrl: '/images/grid-image/image-01.png',
            status: 'Active',
            actions: { delete: true, edit: true },
        },
        {
            id: 3,
            Name: 'Transportation 3',
            downloadUrl: 'https://maps.google.com/transportation3',
            photoUrl: '/images/grid-image/image-01.png',
            status: 'Active',
            actions: { delete: true, edit: true },
        },
        {
            id: 4,
            Name: 'Transportation 4',
            downloadUrl: 'https://maps.google.com/transportation4',
            photoUrl: '/images/grid-image/image-01.png',
            status: 'Active',
            actions: { delete: true, edit: true },
        },
        {
            id: 5,
            Name: 'Transportation 5',
            downloadUrl: 'https://maps.google.com/transportation5',
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

    previewUrl: string = this.transport.photoUrl;

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
