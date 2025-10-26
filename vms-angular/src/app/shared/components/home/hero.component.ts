import {Component, HostListener} from '@angular/core';
import {NgClass} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-hero',
    templateUrl: './hero.component.html',
    imports: [
        NgClass,
        RouterLink
    ],
    styleUrls: ['./hero.component.css']
})
export class HeroComponent {
    navOpen = false;
    isScrolled = false;

    toggleMenu() {
        this.navOpen = !this.navOpen;
    }

    closeMenu() {
        this.navOpen = false;
    }

    scrollTo(elementId: string): void {
        const element = document.getElementById(elementId);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth',
            });
        }
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.isScrolled = window.scrollY > 10;
    }
}
