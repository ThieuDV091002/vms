import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent {
    @Input() year = new Date().getFullYear();
    @Input() company = 'molex';
    @Input() companyUrl = '';

    links = [
        { label: 'Home', url: '' },
        { label: 'Travel Guide', url: '#' }
    ];
}
