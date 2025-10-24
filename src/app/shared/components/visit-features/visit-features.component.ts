import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-visit-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visit-features.component.html',
  styleUrl: './visit-features.component.scss'
})
export class VisitFeaturesComponent {
  features = [
    {
      image: './assets/images/vms/guest2.jpg',
      title: 'Visitor Registration',
      description: 'Invite and register visitors easily with streamlined approval workflows, ensuring smooth and secure access to our facilities.'
    },
    {
      image: 'https://images02.vietnamworks.com//companyprofile/molex-vietnam/en/Screenshot_2022-02-23_173406.jpg?v=1745563491" class="img-fluid" alt="Vendor Management',
      title: 'Contractor Permit Management',
      description: 'Facilitate contractors to renew or apply for new permits efficiently, ensuring compliance and uninterrupted work on site.'
    },
    {
      image: './assets/images/vms/automation.jpg',
      title: 'Monitoring and Reporting',
      description: 'Track and monitor all visitor and contractor activities with real-time reporting to maintain safety and operational oversight.'
    }
  ];
}
