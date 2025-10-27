import { Component } from '@angular/core';

@Component({
  selector: 'app-other-country',
  templateUrl: './other-country.component.html',
  styleUrls: ['./other-country.component.scss']
})
export class OtherCountryComponent {
  openLink(url: string) {
    window.open(url, '_blank');
  }

  admins = [
    {
      name: 'Nguyen, Nguyen Hanh',
      role: 'Manager, General Affairs',
      site: 'MXHY Site',
      img: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    {
      name: 'Khuat, Thi Thuy',
      role: 'Supervisor, General Affairs',
      site: 'MXV Site',
      img: 'https://randomuser.me/api/portraits/women/32.jpg'
    }
  ];

  tools = [
    {
      title: 'CWT App installation',
      img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=CWT',
      link: '#'
    },
    {
      title: 'ISOS App installation',
      img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=ISOS',
      link: '#'
    }
  ];

  supports = [
    {
      title: 'International Travel Insurance Support',
      img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=ITI',
      link: '#'
    },
    {
      title: 'Submit an Expense in Concur',
      img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=SEC',
      link: '#'
    },
    {
      title: 'Matador Travel Security',
      img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=MTS',
      link: '#'
    }
  ];

  cwt = {
    title: 'Hotel Arrangements | myTravel',
    img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=HA',
    link: '#'
  };
}