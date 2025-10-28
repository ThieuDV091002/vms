import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { AttractionService, FoodService, ImageService, TextService } from '@apis/vms/services';

@Component({
  selector: 'app-traveling-guide-other-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traveling-guide-other-information.component.html',
  styleUrl: './traveling-guide-other-information.component.scss',
})
export class TravelingGuideOtherInformationComponent implements OnInit {
  content: string = '';
  attractions: { name: string; description: string; img: string; link: string }[] = [];
  foods: { name: string; img: string; link: string }[] = [];
  constructor(
    private textService: TextService,
    private imageService: ImageService,
    private attractionService: AttractionService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.startAutoSlide();
    this.loadIntroContent('Food Recommendation');
    this.loadAttractions();
    this.loadFoods();
  }

  loadIntroContent(section: string): void {
    this.textService.getBySection(section).subscribe({
      next: responseArray => {
        if (Array.isArray(responseArray) && responseArray.length > 0) {
          this.content = responseArray[0].content || '';
        } else {
          this.content = '';
        }
      },
      error: err => {
        this.content = 'Failed to load content. Please try again later.';
      },
    });
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  loadAttractions(): void {
    this.attractionService.getList().subscribe({
      next: response => {
        this.attractions = response.items.map((item: any) => ({
          name: item.name,
          description: item.description,
          link: item.locationUrl,
          img: '',
        }));

        this.attractions.forEach((transport, index) => {
          const photoId = response.items[index].photoId;
          if (photoId) {
            this.imageService.getPhoto(photoId).subscribe({
              next: (res: any) => {
                let imageUrl: string;
                if (typeof res === 'string') {
                  imageUrl = 'data:image/jpeg;base64,' + res;
                } else {
                  const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                  imageUrl = URL.createObjectURL(blob);
                }
                this.attractions[index].img = imageUrl;
              },
              error: () => {
                this.attractions[index].img = '';
              },
            });
          } else {
            this.attractions[index].img = '';
          }
        });
      },
      error: () => {
        this.attractions = [];
      },
    });
  }

  loadFoods(): void {
    this.foodService.getList().subscribe({
      next: response => {
        this.foods = response.items.map((item: any) => ({
          name: item.name,
          link: item.locationUrl,
          img: '',
        }));

        this.foods.forEach((transport, index) => {
          const photoId = response.items[index].photoId;
          if (photoId) {
            this.imageService.getPhoto(photoId).subscribe({
              next: (res: any) => {
                let imageUrl: string;
                if (typeof res === 'string') {
                  imageUrl = 'data:image/jpeg;base64,' + res;
                } else {
                  const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                  imageUrl = URL.createObjectURL(blob);
                }
                this.foods[index].img = imageUrl;
              },
              error: () => {
                this.foods[index].img = '';
              },
            });
          } else {
            this.foods[index].img = '';
          }
        });
      },
      error: () => {
        this.foods = [];
      },
    });
  }

  convertBase64ToBlob(base64Data: string, contentType: string = 'application/octet-stream'): Blob {
    const sliceSize = 512;
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  currentSlide = 0;
  private slideInterval: any;

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.attractions.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.attractions.length) % this.attractions.length;
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
