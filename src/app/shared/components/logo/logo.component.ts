import { Component, ElementRef, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { ContextMenuComponent } from '@volosoft/ngx-lepton-x/lib/components/context-menu/context-menu.component';

interface App {
  name: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})

export class LogoComponent {
  @ViewChild('menu') menu: ContextMenuComponent;
  isOpen: boolean = false;
  apps: App[] = [
    { name: 'App1', icon: 'assets/images/grid.svg', link: 'https://www.baidu.com' },
    { name: 'App2', icon: 'assets/images/grid.svg', link: 'https://www.baidu.com' },
    { name: 'App3', icon: 'assets/images/grid.svg', link: 'https://www.baidu.com' },
    { name: 'App4', icon: 'assets/images/grid.svg', link: 'https://www.baidu.com' },
    { name: 'App5', icon: 'assets/images/grid.svg', link: 'https://www.baidu.com' }
  ];

  constructor(private eRef: ElementRef) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.menu.open();
    } else {
      this.menu.close();
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.menu.close();
    }
  }
}
