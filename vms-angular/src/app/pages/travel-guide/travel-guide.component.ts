import {Component, HostListener} from '@angular/core';
import {TravelingGuideComponent} from "../../shared/components/travel-guide-page/traveling-guide.component";
import {NgClass} from "@angular/common";
import {FooterComponent} from "../../shared/components/home/footer.component";
import {AccordionComponent} from "../../shared/components/travel-guide-page/accordion/accordion.component";

@Component({
    selector: 'app-travel-guide',
    imports: [
        TravelingGuideComponent,
        NgClass,
        AccordionComponent,
        FooterComponent,
    ],
    templateUrl: './travel-guide.component.html',
})
export class TravelComponent {
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
