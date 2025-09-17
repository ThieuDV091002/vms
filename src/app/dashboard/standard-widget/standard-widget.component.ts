import { ConfigStateService, CurrentUserDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppUtils } from 'src/app/modeling/utils/app.utils';
import { FileService } from '../services/file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { finalize, forkJoin, Subscription } from 'rxjs';
import { DashboardUtils } from '../utils';
import { LocalizationService } from '@abp/ng.core';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { UserStandardDto, CreateUpdateStandardDto, MstStandardCategoryDto } from '@apis/general/dtos/widget';
import { StandardService, StandardMediaService, MstStandardCategoryService } from '@apis/general/services/widget';

@Component({
  selector: 'app-standard-widget',
  templateUrl: './standard-widget.component.html',
  styleUrl: './standard-widget.component.scss'
})

export class StandardWidgetComponent implements OnInit, OnChanges, OnDestroy {
  @Input() selected: any = { title: '', url: '', hideTitle: false };
  @Input() index = -1;
  @Input() dataTierTreeNode;
  @Input() selectedDataTier;
  editStandardWidget = false;
  @Input() expandChart = false;

  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  standMedias = [];
  items = 2;
  layoutClass = 'col-6';
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  standards: UserStandardDto[] = [];
  selectedStandard = { name: '', standMedias: [] };
  editStandard = false;
  editStandardObj = null;
  currentWidgets: UserStandardDto[] = [];
  currentPage = 1;
  addStandardModal = false;
  newStandard: CreateUpdateStandardDto;
  selectedIndex = -1;
  selectedMediaIndex = -1;
  @Input() queryId;
  currentUser: CurrentUserDto;
  editStandMediasObj = [{}];
  addMediaModal = false;
  selectedMedia;
  mediaContent: any;
  mediaType = '';
  uploading = false;
  isWeb = true;
  isCollapse = false;
  categories: MstStandardCategoryDto[];
  selectedCategories: MstStandardCategoryDto[];
  totalCount: number = 0;
  lastSearchValue = '';
  widgetInfo: string;
  categoryFilters = [];
  filterShow = true;
  subscription: Subscription;
  loading = false;
  constructor(private confirmationService: ConfirmationService,
    private toasterService: ToasterService, private standardService: StandardService, private configService: ConfigStateService,
    private fileService: FileService, private domSanitizer: DomSanitizer, private platformService: PlatformService,
    private standardMediaService: StandardMediaService, private standardCategoryService: MstStandardCategoryService,
    private localizationService: LocalizationService) {


  }

  ngOnInit(): void {
    this.currentUser = this.configService.getOne('currentUser');
    this.isWeb = this.platformService.isWeb();
    this.getStandardCategories();
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widgetInfo = data;
    });
  }

  getStandardCategories() {
    this.standardCategoryService.getList({ maxResultCount: 100 }).subscribe(categories => {
      this.categories = categories.items;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getStandards();
  }

  search(value: string) {
    if (value !== this.lastSearchValue) {
      this.lastSearchValue = value;
      this.getStandards(value);
    }
  }

  getStandards(filter = null) {
    if (!this.currentUser) {
      this.currentUser = this.configService.getOne('currentUser');
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.loading = true;
    const selectedAreas = this.selectedDataTier?.areas && this.selectedDataTier.areas.length > 0 ?
      this.selectedDataTier.areas.map(a => ({ type: 'Area', id: a.id })) :
      this.selectedDataTier?.area?.id ? [{type: 'Area', id: this.selectedDataTier?.area?.id}] : [];
    const selectedCells = this.selectedDataTier?.cells && this.selectedDataTier.cells.length > 0 ?
      this.selectedDataTier.cells.map(c => ({ type: 'Cell', id: c.id })) :
      this.selectedDataTier?.cell?.id ? {type: 'Cell', id: this.selectedDataTier?.cell?.id} : [];
    const selectedWorkCenters = this.selectedDataTier?.workCenters && this.selectedDataTier.workCenters.length > 0 ?
      this.selectedDataTier.workCenters.map(w => ({ type: 'WorkCenter', id: w.id })) :
      this.selectedDataTier?.workCenter?.id ? [{type: 'WorkCenter', id: this.selectedDataTier?.workCenter?.id}] : [];
    this.subscription = this.standardService.getStandardsByDataTier({
      userId: this.currentUser.id,
      filter: filter,
      dataTierList: [...selectedAreas, ...selectedCells, ...selectedWorkCenters],
      categoryIds: this.categoryFilters || [],
      skipCount: (this.currentPage - 1) * Math.pow(this.items, 2),
      maxResultCount: Math.pow(this.items, 2),
    }).subscribe(res => {
      this.loading = false;
      // make sure same data not draw the page again.
      if (this.standards.map(t => t.id).sort().join('') !== res.items.map(t => t.id).sort().join('') ||
        (this.layoutClass !== `col-${12 / this.items}`)) {
        this.standards = res.items;
        this.totalCount = res.totalCount;
        this.layoutClass = `col-${12 / this.items}`;
      }
    })
  }

  filterByCategory(id: string) {
    if (this.categoryFilters.includes(id)) {
      this.categoryFilters = this.categoryFilters.filter(c => c !== id);
    } else {
      this.categoryFilters.push(id);
    }
    this.getStandards();
  }

  categoryFilterActive(id: string) {
    return this.categoryFilters.includes(id);
  }

  standExpandChange(index: number) {
    this.selectedIndex = index;
  }

  getPagedData(next = false) {
    next ? this.currentPage++ : this.currentPage--;
    this.getStandards();
  }

  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
  }

  delete() {

  }

  pageButtonDisable(next = false) {
    const pages = Math.ceil(this.totalCount / Math.pow(this.items, 2));
    if (next) {
      return this.currentPage < pages;
    } else {
      return this.currentPage > 1;
    }
  }

  layoutChange(e) {
    this.currentPage = 1;
    this.getStandards();
  }

  addMedia() {
    this.editStandMediasObj.push({})
  }

  deleteMedia(index: number) {
    this.editStandMediasObj.splice(index, 1);
    if (this.editStandMediasObj.length === 0) {
      this.editStandMediasObj.push({})
    }
  }

  addMediaContent(media, type) {
    this.selectedMedia = media;
    this.addMediaModal = true;
    this.mediaType = type;
    this.mediaContent = media.mediaUrl;
  }

  onFileChange(e: Event) {
    const htmlEl = e.target as HTMLInputElement;
    const file = htmlEl.files[0];
    if (file) {
      this.mediaContent = file;
    }
  }

  getSafeUrl(url) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  setSingleMedia(standMedia) {
    this.fileService.get(standMedia.mediaUrl).pipe(finalize(() => this.uploading = false))
      .subscribe((res: any) => {
        const url = URL.createObjectURL(DashboardUtils.convertBase64ToBlob(res));
        standMedia.mediaAccessUrl = url;
        standMedia.isImage = DashboardUtils.isImageFile(standMedia.fileName);
      })
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

  deleteStandWidget() {
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '',{
        messageLocalizationParams: [this.widgetInfo,this.selected.name],
      }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.updateChange.emit({type: 'delete', widget: this.selected});
      }
    });
  }

  openEditWidgetModal() {
    this.editStandardWidget = true;
    this.editStandardObj = JSON.parse(JSON.stringify(this.selected));
  }

  saveWidget() {
    this.editStandardWidget = false;
    this.selected = this.editStandardObj;
    this.updateChange.emit({type: 'update', widget: this.selected});
  }

  openAddStandardModal() {
    this.addStandardModal = true;
    this.newStandard = { name: '', description: '', displayName: '' };
    this.selectedCategories = [];
    this.editStandMediasObj = [{}];
    AppUtils.initTreeDataState(this.dataTierTreeNode, []);
  }

  addStandard() {
    this.addStandardModal = false;
    this.standardService.create(this.newStandard).subscribe(res => {
      this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
        messageLocalizationParams: [this.selected.name, this.newStandard.name],
      });
      const standMedias = this.editStandMediasObj.filter((s: any) => s?.mediaType);
      if (standMedias.length > 0) {
        this.saveStandMedia(standMedias, res.id);
      }
      this.saveDataTier(res.id);
      // save category
      this.saveCategories(res.id);
    })
  }

  saveStandMedia(standMedias, standardId: string) {
    const timeStamps = new Date().getTime() + '';
    const requests = standMedias.map((item, index) => { item.standardId = standardId; item.name = timeStamps + '-' + index; item.displayName = ''; item.seq = index, item.description = ''; return this.standardMediaService.create(item) });
    if (requests.length !== 0) {
      forkJoin(requests).subscribe(res => {
      })
    }
  }


  hasAssignedDataTiers() {
    return AppUtils.hasCheckedDataTier(this.dataTierTreeNode);
  }


  treeViewCheckChange() {

  }


  saveDataTier(standardId: string) {
    const assignDataTiers = AppUtils.getCheckedTreeData(this.dataTierTreeNode, true).map(d => {
      const item = { standardId: standardId, dataTierType: d.type, dataTierId: d.id };
      return item;
    });
    if (assignDataTiers.length > 0) {
      this.standardService.assignDataTierToStandardByStandardIdAndDataTiers(standardId, assignDataTiers).subscribe(res => {
        this.getStandards();
      })
    } else {
      this.getStandards();
    }
  }

  saveCategories(standardId: string) {
    this.standardService.assignCategoriesToStandardByStandardIdAndStandardCategories(standardId, this.selectedCategories.map(item => ({ standardId: standardId, categoryId: item.id }))).subscribe(res => {
      this.selectedCategories = [];
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
