import { Component } from '@angular/core';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class HeadingComponent {
  cards = [
    {
      title: 'KOCH myTravel & Expense',
      desc: 'Access to see Guideline, Tools and Education',
      link: 'https://example.com/koch-mytravel',
      img: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop'
    },
    {
      title: 'KOCH Companies Travel Guideline',
      desc: 'Access to see Travel Guideline',
      link: 'https://example.com/koch-guideline',
      img: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop'
    }
  ];

  openLink(url: string) {
    window.open(url, '_blank');
  }
}