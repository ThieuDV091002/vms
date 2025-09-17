import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { StandardDto, UserStandardDto } from '@apis/general/dtos/widget';
import { ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EventEmitter, HostBinding, Output } from '@angular/core';
import { finalize, forkJoin, of, switchMap } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { AppUtils } from 'src/app/modeling/utils/app.utils';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { CurrentUserDto, LocalizationService } from '@abp/ng.core';
import { MstStandardCategoryDto, StandardCategoryDto, UserFavoriteStandardDto } from '@apis/general/dtos/widget';
import { StandardService, StandardMediaService, UserFavoriteStandardService } from '@apis/general/services/widget';
import { FileService } from '@apis/general/services';


@Component({
  selector: 'app-view-standards',
  templateUrl: './view-standards.component.html',
  styleUrl: './view-standards.component.scss'
})

export class ViewStandardsComponent implements OnInit, OnChanges {
  @Input() selected: StandardDto;
  @Input() expandChart = false;
  @Input() index = -1;
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();

  standMedias = [];
  selectedMedia;
  mediaContent: any;
  mediaType = '';
  selectedIndex = -1;
  isWeb = true;
  userFavoriteStandard: UserFavoriteStandardDto;
  previewModalVisible = false;
  previewImage = '';
  widgetInfo: string;
  uploading = false;

  constructor(
    private confirmationService: ConfirmationService,
    private standardService: StandardService,
    private toasterService: ToasterService,
    private standardMediaService: StandardMediaService,
    private domSanitizer: DomSanitizer,
    private fileService: FileService,
    private platformService: PlatformService,
    private userFavoriteStanfardService: UserFavoriteStandardService,
    private localizationService: LocalizationService
  ) {
    this.isWeb = this.platformService.isWeb();
  }

  ngOnInit() {
    this.getCurrentStand();
    this.localizationService.get('::LABEL_StandardWidget').subscribe(data => {
      this.widgetInfo = data;
    });
  }

  ngOnChanges(changes) {
    if (changes.selected && !changes.selected.firstChange) {
      this.getCurrentStand();
    }
  }

  getSafeUrl(url) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getCurrentStand() {
    this.standMedias = this.selected.standardMediaDtos;
    this.standMedias.sort((a, b) => a.seq - b.seq);
    this.setstandardMedia();
    if (this.standMedias.length === 0) {
      this.standMedias.push({ seq: 0 });
    }
  }

  setstandardMedia() {
    for (let standMidia of this.standMedias) {
      if (standMidia.mediaType === 'link') {
        standMidia.safeUrl = this.getSafeUrl(standMidia.mediaUrl);
      } else if (standMidia.mediaType === 'file' && standMidia.mediaUrl) {
        standMidia.loading = true;
        this.fileService.get(standMidia.mediaUrl).pipe(finalize(() => delete standMidia.loading))
          .subscribe((res: any) => {
            const url = URL.createObjectURL(this.convertBase64ToBlob(res));
            standMidia.mediaAccessUrl = url;
            standMidia.isImage = this.isImageFile(standMidia.fileName);
          })
      }
    }
  }

  setSingleMedia(standMedia) {
    this.fileService.get(standMedia.mediaUrl).pipe(finalize(() => this.uploading = false))
      .subscribe((res: any) => {
        const url = URL.createObjectURL(this.convertBase64ToBlob(res));
        standMedia.mediaAccessUrl = url;
        standMedia.isImage = this.isImageFile(standMedia.fileName);
      })
  }

  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
  }

  isImageFile(fileName: string): boolean {
    if (!fileName) { return false }
    // List of known image file extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff'];

    // Extract the file extension from the filename
    const extension = fileName.split('.').pop()?.toLowerCase();

    // Check if the extracted extension is in the list of image extensions
    return extension ? imageExtensions.includes(extension) : false;
  }

  convertBase64ToBlob(base64Str: string) {
    const byteCharacters = atob(base64Str);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    return blob;
  }
}
