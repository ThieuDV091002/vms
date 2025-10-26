import { Component } from '@angular/core';

@Component({
    selector: 'app-travel-to-other-country',
    templateUrl: './to-other-country.component.html',
    styles: ''
})
export class TravelToothCountryComponent {
    openLink(url: string) {
        window.open(url, '_blank');
    }

    admins = [
        {
            name: 'Nguyen, Nguyen Hanh',
            role: 'Manager, General Affairs',
            site: 'MXHY Site',
            img: 'https://randomuser.me/api/portraits/women/65.jpg'
        },
        {
            name: 'Khuat, Thi Thuy',
            role: 'Supervisor, General Affairs',
            site: 'MXV Site',
            img: 'https://randomuser.me/api/portraits/women/32.jpg'
        }
    ];

    tools = [
        { name: 'CWT App installation', icon: '🌐', link: '#' },
        { name: 'ISOS App installation', icon: '📱', link: '#' }
    ];

    supports = [
        { name: 'International Travel Insurance Support', icon: '🛡️', link: '#' },
        { name: 'Submit an Expense in Concur', icon: '💳', link: '#' },
        { name: 'Matador Travel Security', icon: '⚙️', link: '#' }
    ];
}
