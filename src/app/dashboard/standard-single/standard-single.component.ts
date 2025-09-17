import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { DashboardUtils } from '../utils';
import { finalize, forkJoin, of, switchMap } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { AppUtils } from 'src/app/modeling/utils/app.utils';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { CurrentUserDto, LocalizationService} from '@abp/ng.core';
import { FileService } from '../services/file.service';
import { UserStandardDto, MstStandardCategoryDto, StandardCategoryDto, UserFavoriteStandardDto } from '@apis/general/dtos/widget';
import { StandardService, StandardMediaService, UserFavoriteStandardService } from '@apis/general/services/widget';

@Component({
  selector: 'app-standard-single',
  templateUrl: './standard-single.component.html',
  styleUrl: './standard-single.component.scss'
})
export class StandardSingleComponent implements OnInit {
  @HostBinding('class.expand-widget') get expandWidget() { return this.expandChart; }
  @Input() selected: UserStandardDto;
  @Input() dataTierTreeNode;
  @Input() index = -1;
  @Input() currentUser: CurrentUserDto;
  @Input() categories: MstStandardCategoryDto[];
  @Input() expandChart = false;

  @Output() deleteChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  standMedias = [];
  addMediaModal = false;
  editStandardMediaModal = false;
  selectedMedia;
  selectedCategories: StandardCategoryDto[] = [];
  editStandardObj: any = {};
  editStandMediasObj = [];
  editDataTier = {};
  mediaContent: any;
  mediaType = '';
  @Input() queryId;
  selectedIndex = -1;
  uploading = false;
  isWeb = true;
  assignDataTiers: any[];
  // isFavorite = false;
  userFavoriteStandard: UserFavoriteStandardDto;
  favoriteUpdating = false;
  editCateogries: StandardCategoryDto[] = [];
  widgetInfo: string;
  previewModalVisible = false;
  previewImage = '';

  constructor(private confirmationService: ConfirmationService, private standardService: StandardService,
    private toasterService: ToasterService, private standardMediaService: StandardMediaService,
    private domSanitizer: DomSanitizer, private fileService: FileService, private platformService: PlatformService,
    private userFavoriteStanfardService: UserFavoriteStandardService,
    private localizationService: LocalizationService
  ) {
    this.isWeb = this.platformService.isWeb();


  }

  getSafeUrl(url) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {
    this.getCurrentStand();
    this.localizationService.get('::LABEL_StandardWidget').subscribe(data => {
      this.widgetInfo = data;
    });
  }

  getCurrentStand() {
    // set current stand medias
    this.standMedias = this.selected.standardMediaDtos;
    this.standMedias.sort((a, b) => a.seq - b.seq);
    this.setstandardMedia();
    if (this.standMedias.length === 0) {
      this.standMedias.push({ seq: 0 })
    }
  }

  getStandardMedias() {
    this.standardMediaService.getList({ maxResultCount: 3, standardId: this.selected.id }).subscribe(res => {
      this.standMedias = res.items;
      this.standMedias.sort((a, b) => a.seq - b.seq);
      this.setstandardMedia();
      if (this.standMedias.length === 0) {
        this.standMedias.push({})
      }
    })
  }

  setstandardMedia() {
    for (let standMidia of this.standMedias) {
      if (standMidia.mediaType === 'link') {
        standMidia.safeUrl = this.getSafeUrl(standMidia.mediaUrl);
      } else if (standMidia.mediaType === 'file' && standMidia.mediaUrl) {
        standMidia.loading = true;
        this.fileService.get(standMidia.mediaUrl,DashboardUtils.isImageFile(standMidia.fileName)).pipe(finalize(() => delete standMidia.loading))
          .subscribe((res: any) => {
            const url = URL.createObjectURL(DashboardUtils.convertBase64ToBlob(res));
            standMidia.mediaAccessUrl = url;
            standMidia.isImage = DashboardUtils.isImageFile(standMidia.fileName);
          })
      }
    }
  }

  setSingleMedia(standMedia) {
    this.fileService.get(standMedia.mediaUrl,DashboardUtils.isImageFile(standMedia.fileName)).pipe(finalize(() => this.uploading = false))
      .subscribe((res: any) => {
        const url = URL.createObjectURL(DashboardUtils.convertBase64ToBlob(res));
        standMedia.mediaAccessUrl = url;
        standMedia.isImage = DashboardUtils.isImageFile(standMedia.fileName);
      })
  }

  favorite() {
    if (this.favoriteUpdating) { return }
    this.favoriteUpdating = true;
    if (this.selected.isFavorite) {
      of(this.userFavoriteStandard).pipe(
        // if null, call get api to get and then delete api, if not null, directly call delete API
        switchMap(res => {
          if (res) {
            return this.userFavoriteStanfardService.delete(res.id);
          } else {
            return this.userFavoriteStanfardService.getList({ standardId: this.selected.id, userId: this.currentUser.id, maxResultCount: 1 }).pipe(
              switchMap(res => {
                if (res.items?.length === 0) {
                  throw new Error('No favorite standard found');
                } else {
                  return this.userFavoriteStanfardService.delete(res.items[0]?.id);
                }
              })
            )
          }
        })
      ).subscribe({
        next: () => {
          this.selected.isFavorite = false;
          this.userFavoriteStandard = null;
          this.favoriteUpdating = false;
          this.toasterService.success('::LABEL_UpdatedSuccessfully','',{
            messageLocalizationParams: [this.widgetInfo,this.selected.name],
          });
        },
        error: (err) => {
          this.favoriteUpdating = false;
          if (err.message === 'No favorite standard found') {
            this.toasterService.error('::LABEL_FavoriteStandardNotFound');
          }
        }
      })
    } else {
      this.userFavoriteStanfardService.create({ standardId: this.selected.id, userId: this.currentUser.id }).subscribe(
        res => {
          this.selected.isFavorite = true;
          this.userFavoriteStandard = res;
          this.favoriteUpdating = false;
          this.toasterService.success('::LABEL_UpdatedSuccessfully','',{
            messageLocalizationParams: [this.widgetInfo,this.selected.name],
          });
        }
      )
    }
  }

  addMedia() {
    const len = this.editStandMediasObj.length;
    const maxSeq = len === 0 ? 0 : (this.editStandMediasObj[len - 1].seq ? this.editStandMediasObj[len - 1].seq + 1 : len);
    this.editStandMediasObj.push({ seq: maxSeq });
  }

  openEditStandardMediaModal() {
    this.standardService.get(this.selected.id).subscribe(res => {
      this.assignDataTiers = res.standardDataTierDtos;
      this.selectedCategories = res.standardCatetoryDtos.map(item => this.categories.find(c => c.id === item.categoryId));
      this.editStandardMediaModal = true;
      this.editStandardObj = Object.assign({}, this.selected);
      this.editStandMediasObj = JSON.parse(JSON.stringify(this.standMedias));
      this.editCateogries = Object.assign([], this.selectedCategories);
      AppUtils.initTreeDataState(this.dataTierTreeNode, this.assignDataTiers);
      for (let standMidia of this.editStandMediasObj) {
        if (standMidia.mediaType === 'link') {
          standMidia.safeUrl = this.getSafeUrl(standMidia.mediaUrl);
        }
      }
    })
  }

  saveStandard() {
    this.editStandardMediaModal = false;
    // 1. save standard general info
    this.standardService.update(this.editStandardObj.id, this.editStandardObj).subscribe(res => {
      this.selected.name = this.editStandardObj.name;
    })
    // 2. save standMidia
    const { toAdd, toUpdate, toDelete } = DashboardUtils.findArrayDifference(this.standMedias, this.editStandMediasObj);
    // standard media create/update/delete
    const timeStamps = new Date().getTime() + '';
    const requests = [...toAdd.map((item, index) => { item.standardId = this.selected.id; item.name = timeStamps + '-' + index; item.description = item.displayName = ''; return this.standardMediaService.create(item) }),
    ...toUpdate.map(item => { return this.standardMediaService.update(item.id, item) }),
    ...toDelete.map(item => this.standardMediaService.delete(item.id))];
    if (requests.length !== 0) {
      forkJoin(requests).subscribe(res => {
        this.toasterService.success('::LABEL_UpdatedSuccessfully','',{
          messageLocalizationParams: [this.widgetInfo,this.selected.name],
        });
        this.getStandardMedias();
        if (toDelete.length > 0) {
          toDelete.forEach(item => {
            if (item.mediaType === 'file' && item.mediaUrl) {
              this.fileService.delete(item.mediaUrl).subscribe(res => {})
            }
          })
        }
      })
    }

    // 3. data tier access
    this.saveDataTier();
    // 4. save categories
    this.saveCategories();

  }

  hasAssignedDataTiers() {
    return AppUtils.hasCheckedDataTier(this.dataTierTreeNode);
  }

  saveDataTier() {
    const assignDataTiers = AppUtils.getCheckedTreeData(this.dataTierTreeNode, true).map(d => {
      const item = { standardId: this.selected.id, dataTierType: d.type, dataTierId: d.id };
      return item;
    });
    this.standardService.assignDataTierToStandardByStandardIdAndDataTiers(this.selected.id, assignDataTiers).subscribe(res => {
      // this.getCurrentStand();
    })
  }

  saveCategories() {
    this.standardService.assignCategoriesToStandardByStandardIdAndStandardCategories(this.selected.id, this.editCateogries.map(item => ({ standardId: this.selected.id, categoryId: item.id }))).subscribe(res => {
      // this.selectedCategories = [];
    })
  }

  addMediaContent(media, type) {
    this.selectedMedia = media;
    this.addMediaModal = true;
    this.mediaType = type;
    this.mediaContent = media.mediaUrl;
    if (this.mediaType === 'link' && media.mediaType !== type) {
      this.mediaContent = '';
    }
  }

  deleteMedia(index: number) {
    this.editStandMediasObj.splice(index, 1);
    if (this.editStandMediasObj.length === 0) {
      this.editStandMediasObj.push({})
    }
  }

  saveMedia() {
    this.addMediaModal = false;
    this.selectedMedia.mediaType = this.mediaType;

    if (this.selectedMedia.mediaType === 'link') {
      this.selectedMedia.mediaUrl = this.mediaContent;
      this.selectedMedia.safeUrl = this.getSafeUrl(this.selectedMedia.mediaUrl);
    } else if (this.selectedMedia.mediaType === 'file') {
      if (this.mediaContent instanceof File) {
        this.uploading = true;
        if (this.mediaContent) {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              const arrayBuffer = reader.result.split(',')[1];
              this.fileService.create(this.mediaContent.name, arrayBuffer).subscribe({
                next: res => {
                  this.selectedMedia.fileName = res.name;
                  this.selectedMedia.mediaUrl = res.url;
                  if (this.selectedMedia.mediaUrl) {
                    this.setSingleMedia(this.selectedMedia);
                  }
                },
                error: () => {
                  this.uploading = false;
                }
              })
            }

          };
          reader.readAsDataURL(this.mediaContent);
        }

      }
    }
  }

  onFileChange(e: Event) {
    const htmlEl = e.target as HTMLInputElement;
    const file = htmlEl.files[0];
    if (file) {
      this.mediaContent = file;
    }
  }

  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
  }

  deleteStandard() {
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '',{
      messageLocalizationParams: [this.widgetInfo,this.selected.name],
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.standardService.delete(this.selected.id).subscribe(res => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted','',{
              messageLocalizationParams: [this.widgetInfo,this.selected.name],
            });
          this.deleteChange.emit();
        })
      }
    });
  }

async getPreviewImage(id: string) {
  this.previewModalVisible=true;
  const res = await this.fileService.get(id).toPromise();
  this.previewImage= URL.createObjectURL(DashboardUtils.convertBase64ToBlob(res as any));
}
}
