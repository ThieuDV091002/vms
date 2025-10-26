import { Component } from '@angular/core';

@Component({
    selector: 'app-transport-recommend',
    templateUrl: './transport-recommend.component.html'
})
export class TransportRecommendComponent {

    openLink(url: string) {
        window.open(url, '_blank');
    }
}
