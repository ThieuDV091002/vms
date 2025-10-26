import { Component } from '@angular/core';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html'
})
export class FaqComponent {

    openLink(url: string) {
        window.open(url, '_blank');
    }
}
