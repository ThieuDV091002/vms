import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ImageLinkService, ImageService, TextService } from '@apis/vms/services';

@Component({
  selector: 'app-traveling-guide-assignments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traveling-guide-assignments.component.html',
  styleUrl: './traveling-guide-assignments.component.scss',
})
export class TravelingGuideAssignmentsComponent implements OnInit {
  contentList: string[] = [];
  myHrImage: string | null = null;
  assignmentCards: {
    heading: string;
    body: string;
    url: string;
    img: string;
  }[] = [];
  constructor(
    private textService: TextService,
    private imageService: ImageService,
    private imageLinkService: ImageLinkService
  ) {}

  ngOnInit(): void {
    this.loadIntroContent('myHR Process Updates');
    this.loadMyHrImage('myHR Process Updates');
    this.loadAssignmentCards('Assignment Flow');
  }

  loadAssignmentCards(section: string): void {
    this.imageLinkService.getBySection(section).subscribe({
      next: cardsResponse => {
        this.assignmentCards = cardsResponse.map((card: any) => ({
          heading: card.heading,
          body: card.body,
          url: card.url,
          img: '',
        }));

        this.assignmentCards.forEach((card, index) => {
          this.imageService.getPhoto(cardsResponse[index].photoId).subscribe({
            next: (res: any) => {
              if (typeof res === 'string') {
                this.assignmentCards[index].img = 'data:image/jpeg;base64,' + res;
              } else {
                const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                this.assignmentCards[index].img = URL.createObjectURL(blob);
              }
            },
            error: () => {
              this.assignmentCards[index].img = '';
            },
          });
        });
      },
      error: () => {
        this.assignmentCards = [];
      },
    });
  }

  loadIntroContent(section: string): void {
    this.textService.getBySection(section).subscribe({
      next: (responseArray) => {
        if (Array.isArray(responseArray) && responseArray.length > 0) {
          const rawContent = responseArray[0].content || '';
          this.contentList = rawContent
            .split('\n')
            .map(item => item.trim())
            .filter(item => item !== '');
        } else {
          this.contentList = [];
        }
      },
      error: () => {
        this.contentList = ['Failed to load content. Please try again later.'];
      },
    });
  }

  loadMyHrImage(section: string): void {
    this.imageService.getBySection(section).subscribe({
      next: (images) => {
        if (Array.isArray(images) && images.length > 0) {
          const photoId = images[0].photoId;
          if (photoId) {
            this.getPhotoUrl(photoId);
          } else {
            this.myHrImage = null;
          }
        }
      },
      error: () => {
        this.myHrImage = null;
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
        this.myHrImage = imageUrl;
      },
      error: () => {
        this.myHrImage = null;
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
