import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  openLink(url: string) {
    window.open(url, '_blank');
  }

  faqs = [
    {
      title: 'myTravel - FAQ',
      img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=MT',
      link: 'https://angular.io'
    },
    {
      title: 'myExpense & Citi Corporate Card FAQs',
      img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=ME',
      link: 'https://angular.io'
    }
  ];
}