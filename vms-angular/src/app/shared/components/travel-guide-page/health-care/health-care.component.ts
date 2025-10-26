import { Component } from '@angular/core';

@Component({
    selector: 'app-health-care',
    templateUrl: './health-care.component.html'
})
export class HealthCareComponent {

    openLink(url: string) {
        window.open(url, '_blank');
    }

    centers = [
        {
            region: 'Hà Nội',
            items: [
                { name: 'Vinmec Times City Hospital', link: 'https://vinmec.com' },
                { name: 'Bach Mai Hospital', link: 'https://bachmai.gov.vn' }
            ]
        },
        {
            region: 'Hưng Yên',
            items: [
                { name: 'Hung Yen General Hospital', link: 'https://soytehungyen.gov.vn' },
                { name: 'Pho Noi General Hospital', link: '#' }
            ]
        }
    ];
}
