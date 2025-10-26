import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-attraction-recommend',
    templateUrl: './attraction-recommend.component.html',
    styleUrls: ['./attraction-recommend.component.css']
})
export class AttractionRecommendComponent {
    slides = [
        {
            src: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide1.png',
            topText: 'Top Right 1',
            bottomSubText: 'Text',
            bottomText: 'Bottom Right 1',
            link: 'https://angular.io'
        },
        {
            src: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide2.png',
            topText: 'Top Right 2',
            bottomSubText: 'Text',
            bottomText: 'Bottom Right 2',
            link: 'https://tailwindcss.com'
        },
        {
            src: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide3.png',
            topText: 'Top Right 3',
            bottomSubText: 'Text',
            bottomText: 'Bottom Right 3',
            link: 'https://nestjs.com'
        },
        {
            src: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide4.png',
            topText: 'Top Right 4',
            bottomSubText: 'Text',
            bottomText: 'Bottom Right 4',
            link: 'https://react.dev'
        },
        {
            src: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide5.png',
            topText: 'Top Right 5',
            bottomSubText: 'Text',
            bottomText: 'Bottom Right 5',
            link: 'https://vuejs.org'
        }
    ];

    currentSlide = 0;
    private slideInterval: any;

    ngOnInit() {
        this.startAutoSlide();
    }

    ngOnDestroy() {
        this.stopAutoSlide();
    }

    openLink(url: string) {
        window.open(url, '_blank');
    }

    goToSlide(index: number) {
        this.currentSlide = index;
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    }

    startAutoSlide() {
        this.slideInterval = setInterval(() => this.nextSlide(), 3000);
    }

    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }

    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }

    @HostListener('window:resize')
    onResize() {
        this.goToSlide(this.currentSlide);
    }
}
