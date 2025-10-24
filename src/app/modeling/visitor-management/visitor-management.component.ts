import { Component } from '@angular/core';
import { ContractorComponent } from 'src/app/shared/components/contractor-component/contractor-component.component';
import { GuestComponent } from 'src/app/shared/components/guest-component/guest-component.component';
import { HeroSectionComponent } from 'src/app/shared/components/hero-section/hero-section.component';
import { TopBarComponent } from 'src/app/shared/components/top-bar/top-bar.component';
import { VisitFeaturesComponent } from 'src/app/shared/components/visit-features/visit-features.component';
import { VisitFooterComponent } from 'src/app/shared/components/visit-footer/visit-footer.component';

@Component({
  selector: 'app-visitor-management',
  standalone: true,
  imports: [
    TopBarComponent,
    HeroSectionComponent,
    GuestComponent,
    ContractorComponent,
    VisitFeaturesComponent,
    VisitFooterComponent
  ],
  templateUrl: './visitor-management.component.html',
  styleUrl: './visitor-management.component.scss'
})
export class VisitorManagementComponent {
}
