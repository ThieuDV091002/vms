import { Component } from '@angular/core';

@Component({
    selector: 'app-features',
    templateUrl: './features.component.html',
    styles: ''
})
export class FeaturesComponent {
    features = [
        {
            title: 'Guest Visitor Registration',
            description: 'Invite and register visitors easily with streamlined approval workflows, ensuring smooth and secure access to our facilities.',
            image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-1.png'
        },
        {
            title: 'Contractor Permit Management',
            description: 'Facilitate contractors to renew or apply for new permits efficiently, ensuring compliance and uninterrupted work on site.',
            image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-2.png'
        },
        {
            title: 'Monitoring and Reporting',
            description: 'Track and monitor all visitor and contractor activities with real-time reporting to maintain safety and operational oversight.',
            image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-3.png'
        }
    ];
}
