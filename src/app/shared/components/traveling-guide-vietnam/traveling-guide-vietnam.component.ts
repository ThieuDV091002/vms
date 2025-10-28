import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ImageLinkService,
  ImageService,
  MedicalCareCenterService,
  TextService,
  TransportationAppService,
} from '@apis/vms/services';

@Component({
  selector: 'app-traveling-guide-vietnam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traveling-guide-vietnam.component.html',
  styleUrl: './traveling-guide-vietnam.component.scss',
})
export class TravelingGuideVietnamComponent implements OnInit {
  content: string = '';
  eVisaPhotoUrl: string | null = null;
  transportPhotoUrl: string | null = null;
  hotelCards: {
    heading: string;
    body: string;
    url: string;
    img: string;
  }[] = [];
  healthCards: {
    heading: string;
    body: string;
    url: string;
    img: string;
  }[] = [];
  transports: { name: string; img: string; link: string }[] = [];
  hnMedicalCenters: { name: string; city: string; img: string; link: string }[] = [];
  hyMedicalCenters: { name: string; city: string; img: string; link: string }[] = [];
  constructor(
    private textService: TextService,
    private imageService: ImageService,
    private imageLinkService: ImageLinkService,
    private transportationAppService: TransportationAppService,
    private medicalCareCenterService: MedicalCareCenterService
  ) {}

  ngOnInit(): void {
    this.loadIntroContent('Hotels, Transportation');
    this.loadeVisaPhoto('eVisa');
    this.loadTransportPhoto('Hotels, Transportation');
    this.loadHotelCards('Hotels, Transportation');
    this.loadHealthCards('Health Services');
    this.loadTransports();
    this.loadHNMedicalCenters('Ha Noi');
  }

  loadHNMedicalCenters(city: string): void {
    this.medicalCareCenterService.getByCity(city).subscribe({
      next: cardsResponse => {
        this.hnMedicalCenters = cardsResponse.map((card: any) => ({
          name: card.name,
          city: card.city,
          link: card.downloadUrl,
          img: '',
        }));

        this.hnMedicalCenters.forEach((card, index) => {
          this.imageService.getPhoto(cardsResponse[index].photoId).subscribe({
            next: (res: any) => {
              if (typeof res === 'string') {
                this.hnMedicalCenters[index].img = 'data:image/jpeg;base64,' + res;
              } else {
                const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                this.hnMedicalCenters[index].img = URL.createObjectURL(blob);
              }
            },
            error: () => {
              this.hnMedicalCenters[index].img = '';
            },
          });
        });
      },
      error: () => {
        this.hnMedicalCenters = [];
      },
    });
  }

  loadHYMedicalCenters(city: string): void {
    this.medicalCareCenterService.getByCity(city).subscribe({
      next: cardsResponse => {
        this.hyMedicalCenters = cardsResponse.map((card: any) => ({
          name: card.name,
          city: card.city,
          link: card.downloadUrl,
          img: '',
        }));

        this.hyMedicalCenters.forEach((card, index) => {
          this.imageService.getPhoto(cardsResponse[index].photoId).subscribe({
            next: (res: any) => {
              if (typeof res === 'string') {
                this.hyMedicalCenters[index].img = 'data:image/jpeg;base64,' + res;
              } else {
                const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                this.hyMedicalCenters[index].img = URL.createObjectURL(blob);
              }
            },
            error: () => {
              this.hyMedicalCenters[index].img = '';
            },
          });
        });
      },
      error: () => {
        this.hyMedicalCenters = [];
      },
    });
  }

  loadTransports(): void {
    this.transportationAppService.getList().subscribe({
      next: response => {
        this.transports = response.items.map((item: any) => ({
          name: item.name,
          link: item.downloadUrl,
          img: '',
        }));

        this.transports.forEach((transport, index) => {
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
                this.transports[index].img = imageUrl;
              },
              error: () => {
                this.transports[index].img = '';
              },
            });
          } else {
            this.transports[index].img = '';
          }
        });
      },
      error: () => {
        this.transports = [];
      },
    });
  }

  loadHotelCards(section: string): void {
    this.imageLinkService.getBySection(section).subscribe({
      next: cardsResponse => {
        this.hotelCards = cardsResponse.map((card: any) => ({
          heading: card.heading,
          body: card.body,
          url: card.url,
          img: '',
        }));

        this.hotelCards.forEach((card, index) => {
          this.imageService.getPhoto(cardsResponse[index].photoId).subscribe({
            next: (res: any) => {
              if (typeof res === 'string') {
                this.hotelCards[index].img = 'data:image/jpeg;base64,' + res;
              } else {
                const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                this.hotelCards[index].img = URL.createObjectURL(blob);
              }
            },
            error: () => {
              this.hotelCards[index].img = '';
            },
          });
        });
      },
      error: () => {
        this.hotelCards = [];
      },
    });
  }

  loadHealthCards(section: string): void {
    this.imageLinkService.getBySection(section).subscribe({
      next: cardsResponse => {
        this.healthCards = cardsResponse.map((card: any) => ({
          heading: card.heading,
          body: card.body,
          url: card.url,
          img: '',
        }));

        this.healthCards.forEach((card, index) => {
          this.imageService.getPhoto(cardsResponse[index].photoId).subscribe({
            next: (res: any) => {
              if (typeof res === 'string') {
                this.healthCards[index].img = 'data:image/jpeg;base64,' + res;
              } else {
                const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                this.healthCards[index].img = URL.createObjectURL(blob);
              }
            },
            error: () => {
              this.healthCards[index].img = '';
            },
          });
        });
      },
      error: () => {
        this.healthCards = [];
      },
    });
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

  loadeVisaPhoto(section: string): void {
    this.imageService.getBySection(section).subscribe({
      next: images => {
        if (Array.isArray(images) && images.length > 0) {
          const photoId = images[0].photoId;
          if (photoId) {
            this.geteVisaPhotoUrl(photoId);
          } else {
            this.eVisaPhotoUrl = null;
          }
        }
      },
      error: () => {
        this.eVisaPhotoUrl = null;
      },
    });
  }

  loadTransportPhoto(section: string): void {
    this.imageService.getBySection(section).subscribe({
      next: images => {
        if (Array.isArray(images) && images.length > 0) {
          const photoId = images[0].photoId;
          if (photoId) {
            this.getTransportPhotoUrl(photoId);
          } else {
            this.transportPhotoUrl = null;
          }
        }
      },
      error: () => {
        this.transportPhotoUrl = null;
      },
    });
  }

  geteVisaPhotoUrl(photoId: string): void {
    this.imageService.getPhoto(photoId).subscribe({
      next: (res: any) => {
        let imageUrl: string;
        if (typeof res === 'string') {
          imageUrl = 'data:image/jpeg;base64,' + res;
        } else {
          const blob = this.convertBase64ToBlob(res, 'image/jpeg');
          imageUrl = URL.createObjectURL(blob);
        }
        this.eVisaPhotoUrl = imageUrl;
      },
      error: () => {
        this.eVisaPhotoUrl = null;
      },
    });
  }

  getTransportPhotoUrl(photoId: string): void {
    this.imageService.getPhoto(photoId).subscribe({
      next: (res: any) => {
        let imageUrl: string;
        if (typeof res === 'string') {
          imageUrl = 'data:image/jpeg;base64,' + res;
        } else {
          const blob = this.convertBase64ToBlob(res, 'image/jpeg');
          imageUrl = URL.createObjectURL(blob);
        }
        this.transportPhotoUrl = imageUrl;
      },
      error: () => {
        this.transportPhotoUrl = null;
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

  recommendedHotels = {
    title: 'Recommended hotels',
    img: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop',
    link: 'https://example.com/koch-mytravel',
  };

  aig = {
    img: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop',
    link: 'https://example.com/koch-mytravel',
  };

  centers = [
    {
      region: 'Hà Nội',
      items: [
        {
          title: 'Vinmec Times City Hospital',
          img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=Vinmec',
          link: 'https://vinmec.com',
        },
        {
          title: 'Bach Mai Hospital',
          img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=BachMai',
          link: 'https://bachmai.gov.vn',
        },
      ],
    },
    {
      region: 'Hưng Yên',
      items: [
        {
          title: 'Hung Yen General Hospital',
          img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=HungYen',
          link: 'https://soytehungyen.gov.vn',
        },
        {
          title: 'Pho Noi General Hospital',
          img: 'https://placehold.co/96x96/3b82f6/ffffff/png?text=PhoNoi',
          link: '#',
        },
      ],
    },
  ];
}
