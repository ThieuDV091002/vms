import { Component } from '@angular/core';
import { TopBarComponent } from 'src/app/shared/components/top-bar/top-bar.component';
import { TravelingGuideAssignmentsComponent } from 'src/app/shared/components/traveling-guide-assignments/traveling-guide-assignments.component';
import { TravelingGuideFaqComponent } from 'src/app/shared/components/traveling-guide-faq/traveling-guide-faq.component';
import { TravelingGuideHeadingComponent } from 'src/app/shared/components/traveling-guide-heading/traveling-guide-heading.component';
import { TravelingGuideOtherInformationComponent } from 'src/app/shared/components/traveling-guide-other-information/traveling-guide-other-information.component';
import { TravelingGuideToOtherCountriesComponent } from 'src/app/shared/components/traveling-guide-to-other-countries/traveling-guide-to-other-countries.component';
import { TravelingGuideVietnamComponent } from 'src/app/shared/components/traveling-guide-vietnam/traveling-guide-vietnam.component';
import { VisitFooterComponent } from 'src/app/shared/components/visit-footer/visit-footer.component';

@Component({
  selector: 'app-travel-guide-page',
  standalone: true,
  imports: [
    TopBarComponent, 
    VisitFooterComponent,
    TravelingGuideHeadingComponent,
    TravelingGuideToOtherCountriesComponent,
    TravelingGuideVietnamComponent,
    TravelingGuideAssignmentsComponent,
    TravelingGuideOtherInformationComponent,
    TravelingGuideFaqComponent
  ],
  templateUrl: './travel-guide-page.component.html',
  styleUrl: './travel-guide-page.component.scss'
})
export class TravelGuidePageComponent {

}
