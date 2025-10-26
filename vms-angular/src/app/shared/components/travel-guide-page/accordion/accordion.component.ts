import { Component } from '@angular/core';
import {FoodRecommendComponent} from "../food-recommend/food-recommend.component";
import {AttractionRecommendComponent} from "../attraction-recommend/attraction-recommend.component";
import {TransportRecommendComponent} from "../transport-recommend/transport-recommend.component";
import {FaqComponent} from "../faq/faq.component";
import {HealthCareComponent} from "../health-care/health-care.component";
import {TravelToothCountryComponent} from "../to-other-country/to-other-country.component";

@Component({
    selector: 'app-accordion',
    imports: [
        FoodRecommendComponent,
        AttractionRecommendComponent,
        FaqComponent,
        TransportRecommendComponent,
        HealthCareComponent,
        TravelToothCountryComponent
    ],
    templateUrl: './accordion.component.html'
})
export class AccordionComponent {
    card =
        {
            title: '\n' +
                'Assignment flow + RREs ',
            link: 'https://example.com/koch-mytravel',
            img: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop'
        }
        ;
    activeIndex: number | null = null; // mở sẵn accordion #1

    toggle(index: number) {
        this.activeIndex = this.activeIndex === index ? null : index;
    }

    openLink(url: string) {
        window.open(url, '_blank');
    }
}
