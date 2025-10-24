import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent {
  menuOpen = false;

  toggleMenu(open: boolean) {
    this.menuOpen = open;
  }
}