import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ApplicationsDto } from '@apis/corporate/molex/uef/dtos';
import { ApplicationsService } from '@apis/corporate/molex/uef/services';
import { ContextMenuComponent } from '@volosoft/ngx-lepton-x';
import { tap } from 'rxjs';
import { FileService } from 'src/app/dashboard/services/file.service';

@Component({
  selector: 'app-application-selector',
  templateUrl: './application-selector.component.html',
  styleUrls: ['./application-selector.component.scss']
})
export class ApplicationSelectorComponent implements OnInit {
  attachmentMap = new Map<string, string>();
  applications: Array<ApplicationsDto> = [];
  isActive = false;
  isOpen = false;

    @ViewChild('applicationmenu') menu: ContextMenuComponent;
  constructor(private applicationsService:ApplicationsService,private fileService: FileService,private el: ElementRef,private renderer: Renderer2) { }

  ngOnInit() {
    this.applicationsService.getUserApplications().pipe(
      tap(applications => {
         this.applications = applications;
        for (let app of this.applications) {
          this.getUrl(app);
        }
      })
    ).subscribe();
  }
  openApp(app:ApplicationsDto){
    window.open(app.url,'_blank');
  }
    getUrl(app: ApplicationsDto) {
    if (!app.icon) {
      app['iconUrl'] = null;
      return;
    }
    if (this.attachmentMap.has(app.icon)) {
      return this.attachmentMap.get(app.icon);
    }

    this.fileService.get(app.icon,false,{skipHandleError:true})
      .subscribe((res: any) => {
        let imageUrl;
        if (typeof res === 'string') {
          imageUrl = 'data:image/jpeg;base64,' + res;
        } else {
          const blob = this.convertBase64ToBlob(res, 'image/jpeg');
          imageUrl = URL.createObjectURL(blob);
        }
        app['iconUrl'] = imageUrl;
        this.attachmentMap.set(app.icon, imageUrl);
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
  show() {
    this.isActive = !this.isActive;
    this.toggleMenu();
  }
   toggleMenu() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.menu.open();
    } else {
      this.menu.close();
    }
  }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
      if (!this.el.nativeElement.contains(event.target)) {
        this.isActive = false;
        this.renderer.removeClass(this.el.nativeElement, 'active');
        if (this.isOpen) {
          this.toggleMenu();
        }
      }
    }
}
