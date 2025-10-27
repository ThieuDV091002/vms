import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-other-information',
  templateUrl: './other-information.component.html',
  styleUrls: ['./other-information.component.scss']
})
export class OtherInformationComponent {
  openLink(url: string) {
    window.open(url, '_blank');
  }

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

  images = [
    {
      src: 'https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&h=800&w=800&auto=format&fit=crop',
      title: 'Pho bo (Beef Noodle Soup) - Must Try',
      link: 'https://unsplash.com/photos/1719368472026'
    },
    {
      src: 'https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=800&w=800&auto=format&fit=crop',
      title: 'Cha Ca Hang Son (Grilled Fish with Dill and Turmeric)',
      link: 'https://unsplash.com/photos/1649265825072'
    },
    {
      src: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=800&w=800&auto=format&fit=crop',
      title: 'Project Three',
      link: 'https://unsplash.com/photos/1555212697'
    },
    {
      src: 'https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&h=800&w=800&auto=format&fit=crop',
      title: 'Project Four',
      link: 'https://unsplash.com/photos/1729086046027'
    },
    {
      src: 'https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=800&w=800&auto=format&fit=crop',
      title: 'Project Five',
      link: 'https://unsplash.com/photos/1601568494843'
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