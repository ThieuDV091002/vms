import { LocalizationService } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BroadcastMessageService, MessageCategoryService } from '@apis/general';
import { BroadcastMessageDto, MessageCategoryDto } from '@apis/general/dtos';
import { UserService } from '@proxy/services';
import { finalize } from 'rxjs';
import { AppUtils } from 'src/app/modeling/utils/app.utils';
import { FileService } from '../../dashboard/services/file.service';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { Camera, CameraResultType } from '@capacitor/camera';

enum AttachmentType {
  General = 'General'
}

@Component({
  selector: 'app-broadcast-message-entry',
  templateUrl: './broadcast-message-entry.component.html',
  styleUrl: './broadcast-message-entry.component.scss'
})
export class BroadcastMessageEntryComponent implements OnInit, OnChanges {
  @Input() openModal: boolean = false;
  @Input() areaData: any
  @Input() selectedMessage: BroadcastMessageDto;

  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshList: EventEmitter<boolean> = new EventEmitter();
  isModalVisible = false;
  modalBusy = false;
  form: FormGroup;
  info: string;
  selected: BroadcastMessageDto;
  messageCategoryData: MessageCategoryDto[] = [];
  dataTierTreeNode: any[] = [];
  isCollapse = false;

  uploadFile: File;
  readonly AttachmentType = AttachmentType;
  uploadType = AttachmentType.General;
  attachmentMap = new Map<string, string>();
  attachments: any[] = [];
  isAttachementPreviewOpen = false;
  previewAttchmentId: string;
  inProgress = false;
  selectedAttachments: string[] = [];
  isUploadModalOpen = false;
  isWeb = true;

  constructor(
    private localizationService: LocalizationService,
    private toasterService: ToasterService,
    private fb: FormBuilder,
    private service: BroadcastMessageService,
    private messageCategoryService: MessageCategoryService,
    private userService: UserService,
    private fileService: FileService,
    private platformService: PlatformService
  ) {
    this.isWeb = this.platformService.isWeb();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) {
      this.buildForm();
    }
    if (changes.openModal && changes.openModal.currentValue) {
      this.isModalVisible = true;
    }
    if (changes.areaData && changes.areaData.currentValue) {
      this.areaData = changes.areaData.currentValue;
      this.dataTierTreeNode = this.areaData.map(a => { return { id: a.id, name: a.name, type: 'Area', children: [], checked: false } });
    }
    if (changes.selectedMessage && changes.selectedMessage.currentValue) {
      if (Object.keys(changes.selectedMessage.currentValue).length > 0) {
        this.selected = changes.selectedMessage.currentValue
        const selected = changes.selectedMessage.currentValue;
        this.form.controls['datatiers'].setValue(selected.datatiers.map(d => d.dataTierId));
        this.form.controls['messageCategoryId'].setValue(selected.messageCategoryId, { emitEvent: false });
        this.form.controls['message'].setValue(selected.message);
        this.form.controls['expiryTime'].setValue(AppUtils.getLocalDate(selected.expiryTime));
        this.form.controls['tenantId'].setValue(selected.tenantId);
        this.setDataTierTree(this.form.controls['datatiers'].value);
        this.loadAttachmentsFromExtraProperties(selected);
      }
    }
  }

  ngOnInit(): void {
    this.getMessageCategoryData();
    this.localizationService.get('::LABEL_BroadcastMessage').subscribe(data => {
      this.info = data
    });
  }

  getMessageCategoryData() {
    this.messageCategoryService.getAllInstances().subscribe(res => {
      this.messageCategoryData = res;
    })
  }

  loadAttachmentsFromExtraProperties(selected: BroadcastMessageDto) {
    this.attachments = [];
    this.attachmentMap.clear();
    this.selectedAttachments = [];

    if (selected.extraProperties && selected.extraProperties.attachments) {
      this.attachments = selected.extraProperties.attachments;

      this.attachments.forEach(attachment => {
        if (attachment.fileId) {
          this.fileService.get(attachment.fileId)
            .subscribe((res: any) => {
              let imageUrl;
              if (typeof res === 'string') {
                imageUrl = 'data:image/jpeg;base64,' + res;
              } else {
                const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                imageUrl = URL.createObjectURL(blob);
              }

              this.attachmentMap.set(attachment.fileId, imageUrl);
            });
        }
      });
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

  buildForm() {
    this.form = this.fb.group({
      datatiers: [undefined],
      messageCategoryId: [undefined, Validators.required],
      messageCategoryName: [''],
      message: ['', Validators.required],
      expiryTime: [this.getExpiryTime(), Validators.required],
      tenantId: ['']
    });
    this.form.get('messageCategoryId').valueChanges.subscribe(value => {
      if (value) {
        const category = this.messageCategoryData.find(c => c.id === value);
        this.form.get('messageCategoryName').setValue(category.name);
      } else {
        this.form.get('messageCategoryName').setValue('');
      }
    });
  }

  getExpiryTime(): Date {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 7);
    return currentDate;
  }

  close(event?: any) {
    if (!event) {
      this.isModalVisible = false;
      this.closeEvent.emit(true);
    }
  }

  hasAssignedDataTiers() {
    return AppUtils.hasCheckedDataTier(this.dataTierTreeNode);
  }

  initDataTierTree() {
    // set all checked to false
    this.dataTierTreeNode.forEach(area => {
      area.checked = false;
    });
  }

  setDataTierTree(assignedDataTiers) {
    // set checked true, if cell in assigned list
    this.initDataTierTree();
    this.dataTierTreeNode.forEach(area => {
      area.checked = assignedDataTiers.some(d => d === area.id);
    });
  }

  onFileChange(e: Event) {
    const htmlEl = e.target as HTMLInputElement;
    const file = htmlEl.files[0];
    if (file) {
      this.uploadFile = file;
    }
    this.uploadImage(htmlEl);
  }

  uploadImage(el) {
    if (this.uploadFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const arrayBuffer = reader.result.split(',')[1];
          this.inProgress = true;
          this.fileService.create(this.uploadFile.name, arrayBuffer).subscribe({
            next: res => {
              this.inProgress = false;

              const attachment = {
                messageId: this.selectedMessage?.id,
                attachmentType: this.uploadType,
                fileId: res.url,
                mimeType: this.uploadFile.type
              };

              this.attachmentMap.set(res.url, <string>reader.result);
              this.attachments = [...this.attachments, attachment];

              this.isUploadModalOpen = false;
              if (el) {
                el.value = '';
              }
            },
            error: err => {
              this.inProgress = false;
              this.toasterService.error(err.error?.message || '::LABEL_UploadFailed');
            }
          });
        }
      };
      reader.readAsDataURL(this.uploadFile);
    }
  }

  takePhoto(isEdit: boolean, attachmentType: AttachmentType) {
    Camera.getPhoto({
      quality: 90,
      allowEditing: isEdit,
      resultType: CameraResultType.Uri
    }).then((result) => {
      if (result.webPath) {
        this.convertWebPathToFile(result.webPath).then(file => {
          this.uploadFile = file;
          this.uploadType = attachmentType;
          this.uploadImage(null);
        });
      }
    });
  }

  async convertWebPathToFile(webPath: string): Promise<File> {
    const response = await fetch(webPath);
    const blob = await response.blob();
    const fileName = `photo_${new Date().getTime()}.jpg`;
    return new File([blob], fileName, { type: 'image/jpeg' });
  }

  selectedAttchmentsChange(e, id: string) {
    if (e.target.checked) {
      this.selectedAttachments = [...this.selectedAttachments, id];
    } else {
      this.selectedAttachments = this.selectedAttachments.filter((item) => item !== id);
    }
  }

  attachmentDelete(type: string) {
    this.attachments = this.attachments.filter((item) => !this.selectedAttachments.includes(item.fileId));

    this.selectedAttachments = [];
  }

  save() {
    if (this.form.invalid || this.modalBusy || !this.hasAssignedDataTiers()) {
      return;
    }
    this.modalBusy = true;
    let input = this.form.value;
    input.datatiers = AppUtils.getCheckedTreeData(this.dataTierTreeNode).map(item => { return { dataTierType: 'Area', dataTierId: item.id } });
    input.messageCategoryName = this.messageCategoryData.find(c => c.id === input.messageCategoryId)?.name;

    if (!input.extraProperties) {
      input.extraProperties = {};
    }
    input.extraProperties.attachments = this.attachments;

    if (this.selected?.id) {
      this.service.update(this.selected.id, input).pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.message],
        });
        this.close();
        this.refreshList.emit(true);
      });
    } else {
      this.service.create(input).pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.form.value.message],
        });
        this.close();
        this.refreshList.emit(true);
      });
    }
  }
}
