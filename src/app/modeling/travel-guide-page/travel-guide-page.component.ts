import { Component } from '@angular/core';
import { TopBarComponent } from 'src/app/shared/components/top-bar/top-bar.component';

@Component({
  selector: 'app-travel-guide-page',
  standalone: true,
  imports: [TopBarComponent],
  templateUrl: './travel-guide-page.component.html',
  styleUrl: './travel-guide-page.component.scss'
})
export class TravelGuidePageComponent {

}
