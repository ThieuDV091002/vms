import { Component } from '@angular/core';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss']
})
export class AssignmentComponent {
  openLink(url: string) {
    window.open(url, '_blank');
  }

  card = {
    title: 'Assignment Flow',
    img: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop',
    link: 'https://example.com/assignment-flow'
  };

  myHrImage = '/images/travel-guide/Screenshot%202025-09-25%20112529.png';
}