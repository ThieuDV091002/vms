import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ConfigStateService, ListService, LocalizationService, PagedResultDto, SessionStateService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AreaService } from '@apis/corporate';
import { BroadcastMessageService, MessageCategoryService } from '@apis/general';
import { BroadcastMessageDto, BroadcastMessageGetListInput, MessageCategoryDto } from '@apis/general/dtos';
import { FileService } from '@apis/general/services';
import { UserService } from '@proxy/services';
import { Subscription } from 'rxjs';
import { AppUtils } from 'src/app/modeling/utils/app.utils';

@Component({
  selector: 'app-broadcast-message-view',
  templateUrl: './broadcast-message-view.component.html',
  styleUrl: './broadcast-message-view.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'BroadcastMessageViewComponent'
    }
  ]
})
export class BroadcastMessageViewComponent implements OnInit, OnChanges {
  @Input() selected: any = { title: '', url: '', hideTitle: false };
  @Input() index = -1;
  @Input() type: string;
  @Input() selectedDataTier;
  @Input() assignedAndDefaultDataTiers: any
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() broadcastMsgListChange: EventEmitter<void> = new EventEmitter<void>();
  @Input() queryId;
  @Input() expandChart = false;
  @Input() siteHuddleView = false;
  widget: string;
  isSettingsModalVisible = false;
  messageCategoryData: MessageCategoryDto[] = [];
  hideTitle = false;
  widgetTitle: string;
  messageCategory = '';
  messageCategoryName = '';
  isAutoPlay = false;
  displayTime = 10;
  subscription: Subscription;
  dataTiers = [];
  data: PagedResultDto<BroadcastMessageDto> = { totalCount: 0, items: [] };
  activeSlideIndex = 0;
  isHovered = false;
  autoPlay = true;
  settingsInterval = 0;
  openModal = false;
  areaData: any[] = [];
  allAreaData: any[] = [];
  language: string;
  safetyCategory: MessageCategoryDto = null;
  tenantInfo: any;
  imageMap = new Map<string, string>();
  messageImageGroups: { [messageId: string]: any[][] } = {};
  messageImageIntervals: { [messageId: string]: number } = {};
  isImagePreviewOpen = false;
  previewImageUrl: string = '';
  previewImageInfo: string = '';

  constructor(
    private confirmation: ConfirmationService,
    private localizationService: LocalizationService,
    private service: BroadcastMessageService,
    public list: ListService<BroadcastMessageGetListInput>,
    private messageCategoryService: MessageCategoryService,
    private configService: ConfigStateService,
    private areaSevice: AreaService,
    private session: SessionStateService,
    private fileService: FileService,

  ) {
    this.tenantInfo = this.configService.getOne('extraProperties');
    this.language = session.getLanguage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected && changes.selected.currentValue) {
      this.widgetTitle = this.localizationService.instant(this.selected.name ? this.selected.name : '');
      this.hideTitle = this.selected.extraProperties?.hideTitle;
      this.autoPlay = this.selected.extraProperties?.autoPlay;
      this.isAutoPlay = this.autoPlay;
      this.displayTime = this.selected.extraProperties?.displayTime;
      if (this.autoPlay) {
        this.settingsInterval = this.selected.extraProperties?.displayTime > 0 ? this.selected.extraProperties?.displayTime * 1000 : 10000;
      } else {
        this.settingsInterval = 0;
      }
    }
    if (changes.assignedAndDefaultDataTiers && changes.assignedAndDefaultDataTiers.currentValue) {
      this.allAreaData = changes.assignedAndDefaultDataTiers.currentValue.assignedDataTiers
        // area maybe not have cell, so remove child cell check
        .filter(d => d.areaId && d.areaName)
        .map(d => ({ id: d.areaId, name: d.areaName }))
        .filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.id === value.id && t.name === value.name
          ))
        );
      this.areaData = changes.assignedAndDefaultDataTiers.currentValue.assignedDataTiers.filter(item => item.dataTierType === 'Area').map(a => { return { name: a.areaName, id: a.areaId } });
      // following logic fix following issue
      // when assisn some cells/workcenters under area but not all, then area not checked. when delete unchecked ones. Then area should be checked automatically
      // so for those missed area, we need check them again to make sure display correctly
      const missedAreas = this.allAreaData.filter(area => !this.areaData.some(a => a.id === area.id));
      this.areaSevice.getTreeViewList({
        ids: missedAreas.map(a => a.id),
        tenantDataTierID: this.tenantInfo?.DataTierId,
        tenantDataTierType: this.tenantInfo?.DataTierType
      }).subscribe(res => {
        const missedAreasData: any = res || [];
        AppUtils.initTreeData(missedAreasData);
        AppUtils.initTreeDataState(missedAreasData, changes.assignedAndDefaultDataTiers.currentValue.assignedDataTiers);
        // reset status, if all child checked, then parent should be checked
        // if
        missedAreasData.forEach(area => {
          area.checked = area.children?.every(child => {
            if (!child.checked && child.children && child.children.length > 0) {
              return child.children.every(c => c.checked);
            } else {
              return child.checked;
            }
          });
        });
        // if missedAreasData is empty, then areaData should reset to empty
        if (missedAreas.length === 0) {
          this.areaData = [];
        }
        missedAreasData.filter(area => area.checked).forEach(area => this.areaData = [...this.areaData, { id: area.id, name: area.displayName }]);
      })
    }
    else{
      this.allAreaData = [...this.allAreaData];
    }
    if (this.selectedDataTier && this.selectedDataTier.area) {
      this.dataTiers = this.selectedDataTier.areas.map(a => a.id);
    } else {
      this.dataTiers = [];
    }
    this.hookToQuery();
  }

  ngOnInit(): void {
    this.getMessageCategoryData();
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widget = data;
    });
  }

  hookToQuery() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // if siteHuddleView is true, then get the message category id for safety
    if (this.siteHuddleView) {
      if (!this.safetyCategory) {
        this.messageCategoryService.getByName('Safety').subscribe(res => {
          this.safetyCategory = res || {};
          this.messageCategory = this.safetyCategory?.id;
          this.getMessageList();
        });
      } else {
        this.messageCategory = this.safetyCategory?.id;
        this.getMessageList();
      }
    } else {
      this.getMessageList();
    }
  }

  getMessageList() {
    const userId = this.configService.getOne('currentUser')?.id;
    this.subscription = this.list.hookToQuery((query) => {
      return this.service.getList(
        {
          ...query,
          userId: userId,
          areas: this.dataTiers,
          isExcludeExpiredMessage: true,
          categoryId: this.messageCategory,
          maxResultCount: 500,
          skipCount: 0,
          sorting: 'lastModificationTime desc'
        }
      )
    }).subscribe(res => {
      this.data = res;
      this.activeSlideIndex = 0;
      this.prepareMessageImages();
      this.loadAllImages();
    });
  }

  loadAllImages() {
    this.imageMap.clear();
    for (const msg of this.data.items) {
      const attachments = msg.extraProperties?.attachments || [];
      for (const att of attachments) {
        if (att.fileId && !att.fileId.startsWith('data:') && !this.imageMap.has(att.fileId)) {
          this.fileService.get(att.fileId).subscribe((res: any) => {
            let imageUrl;
            if (typeof res === 'string') {
              imageUrl = 'data:image/jpeg;base64,' + res;
            } else {
              imageUrl = URL.createObjectURL(this.convertBase64ToBlob(res, 'image/jpeg'));
            }
            this.imageMap.set(att.fileId, imageUrl);
          });
        }
      }
    }
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

  prepareMessageImages() {
    this.messageImageGroups = {};
    this.messageImageIntervals = {};
    for (const msg of this.data.items) {
      const attachments = msg.extraProperties?.attachments || [];
      const images = attachments
        .filter(a => a.mimeType?.startsWith('image'))
        .map(a => ({
          fileId: a.fileId,
          mimeType: a.mimeType
        }));
      this.messageImageGroups[msg.id] = [];
      for (let i = 0; i < images.length; i += 3) {
        this.messageImageGroups[msg.id].push(images.slice(i, i + 3));
      }
      const pageCount = this.messageImageGroups[msg.id].length || 1;
      const interval = this.displayTime > 0 ? (this.displayTime * 1000) / pageCount : 10000;
      this.messageImageIntervals[msg.id] = interval;
    }
  }

  onImageClick(url: string, img: HTMLImageElement) {
    this.previewImageUrl = url;
    this.isImagePreviewOpen = true;
  }

  getImageCarouselInterval(index: number, messageId: string): number {
    if (!this.autoPlay) {
      return 0;
    }
    return this.activeSlideIndex === index ? this.messageImageIntervals[messageId] : 0;
  }

  trackByMessageId(index: number, item: any) {
    return item.id;
  }

  getMessageCategoryData() {
    this.messageCategoryService.getAllInstances().subscribe(res => {
      this.messageCategoryData = res;
      this.messageCategory = this.messageCategoryData.find(m => m.displayName === this.selected.extraProperties?.category)?.id || '';
      this.messageCategoryName = this.messageCategoryData.find(m => m.id === this.messageCategory)?.displayName;
    })
  }

  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
  }

  deleteBroadcastMessageViewWidget() {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.widget, this.selected.name]
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.updateChange.emit({ type: 'delete', widget: this.selected });
      }
    });
  }

  openSettings() {
    this.isSettingsModalVisible = true;
  }

  playOrPause() {
    if (this.data.items.length === 0) {
      return;
    }
    if (this.settingsInterval > 0) {
      this.settingsInterval = 0;
      this.autoPlay = false;
    } else {
      this.settingsInterval = this.selected.extraProperties?.displayTime > 0 ? this.selected.extraProperties?.displayTime * 1000 : 10000;
      this.autoPlay = true;
    }
  }

  add() {
    this.openModal = true;
  }

  close() {
    this.openModal = false;
  }

  saveSettings() {
    if (this.widgetTitle === '' || this.widgetTitle === undefined || this.widgetTitle === null) {
      return;
    }
    const requestBody: any = {
      dashboardId: this.selected.dashboardId,
      seq: this.selected.seq,
      widgetName: this.selected.widgetName,
      name: this.widgetTitle,
      description: this.selected.description,
      tenantId: this.selected.tenantId,
      displayName: this.selected.displayName,
      id: this.selected.id,
      extraProperties: {
        hideTitle: this.hideTitle,
        category: this.messageCategoryData.find(m => m.id === this.messageCategory)?.displayName,
        autoPlay: this.isAutoPlay,
        displayTime: this.displayTime
      }
    }

    this.updateChange.emit({ type: 'update', widget: requestBody });
    this.isSettingsModalVisible = false;
    this.selected = requestBody;
    this.autoPlay = this.isAutoPlay;
    if (this.autoPlay) {
      this.settingsInterval = this.displayTime > 0 ? this.displayTime * 1000 : 10000;
    } else {
      this.settingsInterval = 0;
    }
    if (this.messageCategory) {
      this.messageCategoryName = this.messageCategoryData.find(m => m.id === this.messageCategory)?.displayName;
    }
  }


  formatDate(date: any) {
    return new Date(date?.toString() + '+00:00').toLocaleString();
  }
}
