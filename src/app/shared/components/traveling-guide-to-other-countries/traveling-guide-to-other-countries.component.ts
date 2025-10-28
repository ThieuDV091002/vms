import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ImageLinkService, ImageService, LocalAdminService, TravelToolService } from '@apis/vms/services';

@Component({
  selector: 'app-traveling-guide-to-other-countries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traveling-guide-to-other-countries.component.html',
  styleUrl: './traveling-guide-to-other-countries.component.scss',
})
export class TravelingGuideToOtherCountriesComponent {
  passportCards: {
    heading: string;
    body: string;
    url: string;
    img: string;
  }[] = [];
  corporateCards: {
    heading: string;
    body: string;
    url: string;
    img: string;
  }[] = [];
  viaCWTs: {
    name: string;
    toolType: string;
    url: string;
    img: string;
  }[] = [];
  tools: {
    name: string;
    toolType: string;
    url: string;
    img: string;
  }[] = [];
  supports: {
    name: string;
    toolType: string;
    url: string;
    img: string;
  }[] = [];
  mxvadmins: {
    fullName: string;
    kochID: string;
    site: string;
    title: string;
    img: string;
  }[] = [];
  mxhyadmins: {
    fullName: string;
    kochID: string;
    site: string;
    title: string;
    img: string;
  }[] = [];

  constructor(
    private imageService: ImageService, 
    private imageLinkService: ImageLinkService,
    private toolService: TravelToolService,
    private localAdminService: LocalAdminService
  ) {}
  ngOnInit(): void {
    this.loadPassportCards('Passport And Visa Application');
    this.loadCorporateCards('Corporate Card Application');
    this.loadViaCWTs('ViaCWT');
    this.loadTools('Tools');
    this.loadSupports('Supports');
    this.loadMXVAdmins('MXV');
    this.loadMXHYAdmins('MXHY');
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  loadViaCWTs(toolType: string): void {
    this.toolService.getByToolType(toolType).subscribe({
      next: cardsResponse => {
        this.viaCWTs = cardsResponse.map((card: any) => ({
          name: card.name,
          toolType: card.toolType,
          url: card.url,
          img: '',
        }));

        this.viaCWTs.forEach((card, index) => {
          this.imageService.getPhoto(cardsResponse[index].photoId).subscribe({
            next: (res: any) => {
              if (typeof res === 'string') {
                this.viaCWTs[index].img = 'data:image/jpeg;base64,' + res;
              } else {
                const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                this.viaCWTs[index].img = URL.createObjectURL(blob);
              }
            },
            error: () => {
              this.viaCWTs[index].img = '';
            },
          });
        });
      },
      error: () => {
        this.viaCWTs = [];
      },
    });
  }

  loadTools(toolType: string): void {
    this.toolService.getByToolType(toolType).subscribe({
      next: cardsResponse => {
        this.tools = cardsResponse.map((card: any) => ({
          name: card.name,
          toolType: card.toolType,
          url: card.url,
          img: '',
        }));

        this.tools.forEach((card, index) => {
          this.imageService.getPhoto(cardsResponse[index].photoId).subscribe({
            next: (res: any) => {
              if (typeof res === 'string') {
                this.tools[index].img = 'data:image/jpeg;base64,' + res;
              } else {
                const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                this.tools[index].img = URL.createObjectURL(blob);
              }
            },
            error: () => {
              this.tools[index].img = '';
            },
          });
        });
      },
      error: () => {
        this.tools = [];
      },
    });
  }

  loadSupports(toolType: string): void {
    this.toolService.getByToolType(toolType).subscribe({
      next: cardsResponse => {
        this.supports = cardsResponse.map((card: any) => ({
          name: card.name,
          toolType: card.toolType,
          url: card.url,
          img: '',
        }));

        this.supports.forEach((card, index) => {
          this.imageService.getPhoto(cardsResponse[index].photoId).subscribe({
            next: (res: any) => {
              if (typeof res === 'string') {
                this.supports[index].img = 'data:image/jpeg;base64,' + res;
              } else {
                const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                this.supports[index].img = URL.createObjectURL(blob);
              }
            },
            error: () => {
              this.supports[index].img = '';
            },
          });
        });
      },
      error: () => {
        this.supports = [];
      },
    });
  }

  loadMXVAdmins(site: string): void {
    this.localAdminService.getBySite(site).subscribe({
      next: cardsResponse => {
        this.mxvadmins = cardsResponse.map((card: any) => ({
          fullName: card.fullName,
          kochID: card.kochID,
          site: card.site,
          title: card.title,
          img: '',
        }));

        this.mxvadmins.forEach((card, index) => {
          this.imageService.getPhoto(cardsResponse[index].photoId).subscribe({
            next: (res: any) => {
              if (typeof res === 'string') {
                this.mxvadmins[index].img = 'data:image/jpeg;base64,' + res;
              } else {
                const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                this.mxvadmins[index].img = URL.createObjectURL(blob);
              }
            },
            error: () => {
              this.mxvadmins[index].img = '';
            },
          });
        });
      },
      error: () => {
        this.mxvadmins = [];
      },
    });
  }

  loadMXHYAdmins(site: string): void {
    this.localAdminService.getBySite(site).subscribe({
      next: cardsResponse => {
        this.mxhyadmins = cardsResponse.map((card: any) => ({
          fullName: card.fullName,
          kochID: card.kochID,
          site: card.site,
          title: card.title,
          img: '',
        }));

        this.mxhyadmins.forEach((card, index) => {
          this.imageService.getPhoto(cardsResponse[index].photoId).subscribe({
            next: (res: any) => {
              if (typeof res === 'string') {
                this.mxhyadmins[index].img = 'data:image/jpeg;base64,' + res;
              } else {
                const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                this.mxhyadmins[index].img = URL.createObjectURL(blob);
              }
            },
            error: () => {
              this.mxhyadmins[index].img = '';
            },
          });
        });
      },
      error: () => {
        this.mxhyadmins = [];
      },
    });
  }

  loadPassportCards(section: string): void {
    this.imageLinkService.getBySection(section).subscribe({
      next: cardsResponse => {
        this.passportCards = cardsResponse.map((card: any) => ({
          heading: card.heading,
          body: card.body,
          url: card.url,
          img: '',
        }));

        this.passportCards.forEach((card, index) => {
          this.imageService.getPhoto(cardsResponse[index].photoId).subscribe({
            next: (res: any) => {
              if (typeof res === 'string') {
                this.passportCards[index].img = 'data:image/jpeg;base64,' + res;
              } else {
                const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                this.passportCards[index].img = URL.createObjectURL(blob);
              }
            },
            error: () => {
              this.passportCards[index].img = '';
            },
          });
        });
      },
      error: () => {
        this.passportCards = [];
      },
    });
  }

  loadCorporateCards(section: string): void {
    this.imageLinkService.getBySection(section).subscribe({
      next: cardsResponse => {
        this.passportCards = cardsResponse.map((card: any) => ({
          heading: card.heading,
          body: card.body,
          url: card.url,
          img: '',
        }));

        this.corporateCards.forEach((card, index) => {
          this.imageService.getPhoto(cardsResponse[index].photoId).subscribe({
            next: (res: any) => {
              if (typeof res === 'string') {
                this.corporateCards[index].img = 'data:image/jpeg;base64,' + res;
              } else {
                const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                this.corporateCards[index].img = URL.createObjectURL(blob);
              }
            },
            error: () => {
              this.corporateCards[index].img = '';
            },
          });
        });
      },
      error: () => {
        this.corporateCards = [];
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
}
