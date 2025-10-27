import { Component } from '@angular/core';

@Component({
  selector: 'app-to-vietnam',
  templateUrl: './to-vietnam.component.html',
  styleUrls: ['./to-vietnam.component.scss']
})
export class ToVietnamComponent {
  openLink(url: string) {
    window.open(url, '_blank');
  }

  recommendedHotels = {
    title: 'Recommended hotels',
    img: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop',
    link: 'https://example.com/koch-mytravel'
  };

  bigImage = '/images/travel-guide/Screenshot%202025-09-25%20115459.png';

  transports = [
    {
      title: 'Grab App Installation',
      img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=Grab',
      link: 'https://angular.io'
    },
    {
      title: 'Xanh SM Instalation',
      img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=Xanh',
      link: 'https://angular.io'
    },
    {
      title: 'Hanoi Bus Map',
      img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=Bus',
      link: 'https://angular.io'
    },
    {
      title: 'Hanoi Metro Map',
      img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=Metro',
      link: 'https://angular.io'
    }
  ];

  aig = {
    img: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop',
    link: 'https://example.com/koch-mytravel'
  };

  centers = [
    {
      region: 'Hà Nội',
      items: [
        {
          title: 'Vinmec Times City Hospital',
          img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=Vinmec',
          link: 'https://vinmec.com'
        },
        {
          title: 'Bach Mai Hospital',
          img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=BachMai',
          link: 'https://bachmai.gov.vn'
        }
      ]
    },
    {
      region: 'Hưng Yên',
      items: [
        {
          title: 'Hung Yen General Hospital',
          img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=HungYen',
          link: 'https://soytehungyen.gov.vn'
        },
        {
          title: 'Pho Noi General Hospital',
          img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=PhoNoi',
          link: '#'
        }
      ]
    }
  ];
}