import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mobile-layout',
  templateUrl: './mobile-layout.component.html',
  styleUrls: ['./mobile-layout.component.scss']
})
export class MobileLayoutComponent {
  @Input() hideBackButton: boolean = false;
  @Input() title: string;
  @Input() showMenu: boolean = true;
  isMenuOpen = false;

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
