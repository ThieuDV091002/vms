import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ImageLinkService, ImageService } from '@apis/vms/services';

@Component({
  selector: 'app-traveling-guide-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traveling-guide-faq.component.html',
  styleUrl: './traveling-guide-faq.component.scss'
})
export class TravelingGuideFaqComponent implements OnInit {
  faqCards: {
    heading: string;
    body: string;
    url: string;
    img: string;
  }[] = [];
  constructor(
      private imageService: ImageService,
      private imageLinkService: ImageLinkService
    ) {}
  ngOnInit(): void {
    this.loadFaqCards('FAQ');
  }
  loadFaqCards(section: string): void {
    this.imageLinkService.getBySection(section).subscribe({
      next: cardsResponse => {
        this.faqCards = cardsResponse.map((card: any) => ({
          heading: card.heading,
          body: card.body,
          url: card.url,
          img: '',
        }));

        this.faqCards.forEach((card, index) => {
          this.imageService.getPhoto(cardsResponse[index].photoId).subscribe({
            next: (res: any) => {
              if (typeof res === 'string') {
                this.faqCards[index].img = 'data:image/jpeg;base64,' + res;
              } else {
                const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                this.faqCards[index].img = URL.createObjectURL(blob);
              }
            },
            error: () => {
              this.faqCards[index].img = '';
            },
          });
        });
      },
      error: () => {
        this.faqCards = [];
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
  openLink(url: string) {
    window.open(url, '_blank');
  }
}
