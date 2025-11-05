import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ImageLinkService, ImageService, TextService } from '@apis/vms/services';

@Component({
  selector: 'app-traveling-guide-heading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traveling-guide-heading.component.html',
  styleUrl: './traveling-guide-heading.component.scss'
})
export class TravelingGuideHeadingComponent implements OnInit {
  cards: {
    heading: string;
    body: string;
    url: string;
    img: string;
  }[] = [];

  content: string = '';
  bigCardPhotoUrl: string | null = null;
  constructor(
    private textService: TextService,
    private imageService: ImageService,
    private imageLinkService: ImageLinkService
  ) 
  {}

  ngOnInit(): void {
    this.loadIntroContent('Heading');
    this.loadBigCardPhoto('Heading');
    this.loadCards('Heading');
  }

  loadCards(section: string): void {
  this.imageLinkService.getBySection(section).subscribe({
    next: (cardsResponse) => {
      this.cards = cardsResponse.map((card: any) => ({
        heading: card.heading,
        body: card.body,
        url: card.url,
        img: '',
      }));

      this.cards.forEach((card, index) => {
        this.imageService.getPhoto(cardsResponse[index].photoId).subscribe({
          next: (res: any) => {
            if (typeof res === 'string') {
              this.cards[index].img = 'data:image/jpeg;base64,' + res;
            } else {
              const blob = this.convertBase64ToBlob(res, 'image/jpeg');
              this.cards[index].img = URL.createObjectURL(blob);
            }
          },
          error: () => {
            this.cards[index].img = '';
          },
        });
      });
    },
    error: () => {
      this.cards = [];
    },
  });
}

  loadIntroContent(section: string): void {
    this.textService.getBySection(section).subscribe({
      next: (responseArray) => {
      if (Array.isArray(responseArray) && responseArray.length > 0) {
        this.content = (responseArray[0].content || '').replace(/\n/g, '<br>');
      } else {
        this.content = '';
      }
    },
      error: (err) => {
        this.content = 'Failed to load content. Please try again later.';
      },
    });
  }

  loadBigCardPhoto(section: string): void {
    this.imageService.getBySection(section).subscribe({
      next: (images) => {
        if (Array.isArray(images) && images.length > 0) {
          const photoId = images[0].photoId;
          if (photoId) {
            this.getPhotoUrl(photoId);
          } else {
            this.bigCardPhotoUrl = null;
          }
        }
      },
      error: () => {
        this.bigCardPhotoUrl = null;
      }
    });
  }

  getPhotoUrl(photoId: string): void {
    this.imageService.getPhoto(photoId).subscribe({
      next: (res: any) => {
        let imageUrl: string;
        if (typeof res === 'string') {
          imageUrl = 'data:image/jpeg;base64,' + res;
        } else {
          const blob = this.convertBase64ToBlob(res, 'image/jpeg');
          imageUrl = URL.createObjectURL(blob);
        }
        this.bigCardPhotoUrl = imageUrl;
      },
      error: () => {
        this.bigCardPhotoUrl = null;
      }
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
