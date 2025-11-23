import { Component, EventEmitter, Input, Output, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { RowItem } from './checksheet-template.component';
import { FileService } from '../../dashboard/services/file.service';
import { ToasterService } from '@abp/ng.theme.shared';
import { Camera, CameraResultType } from '@capacitor/camera';
import { PlatformService } from 'src/app/shared/services/platform.service';

@Component({
  selector: 'app-checksheet-row',
  template: `
    <div class="row">
        <div class="col-3">{{'::LABEL_Title' | abpLocalization}}<span> * </span></div>
        <div class="col-3">{{'::LABEL_Subtitle' | abpLocalization}}</div>
        <div class="col-2">{{'::LABEL_Type' | abpLocalization}}<span> * </span></div>
    </div>
    <hr>
    <div *ngFor="let row of rows; let idx = index" class="row mb-2">
        <div class="col-3">
            <input type="text" class="form-control" [(ngModel)]="row.title" 
                   (change)="onRowsChange()" />
        </div>
        <div class="col-3">
            <input type="text" class="form-control" [(ngModel)]="row.subtitle" 
                   (change)="onRowsChange()" />
        </div>
        <div class="col-2">
            <select class="form-control form-select" [(ngModel)]="row.type" 
                    (change)="onRowsChange()">
                <option value="text">Text</option>
                <option value="okng">OK/NG</option>
            </select>
        </div>
        <div class="col-3" *ngIf="row.type === 'okng'">
            <div class="d-flex align-items-center mb-2">
                <i class="fas fa-camera-retro fa-lg cursor-pointer me-2" style="color: #fc276b;"
                   [title]="'::LABEL_CapturePhoto' | abpLocalization"
                   (click)="takePhoto(false, idx)"></i>
                <i class="fas fa-cloud-upload-alt cursor-pointer fa-lg" style="color: #74C0FC;"
                   [title]="'::LABEL_UploadPictures' | abpLocalization"
                   (click)="triggerFileInput(idx)"></i>
                <input #fileInput type="file" class="form-control"
                       (change)="onFileChange($event, idx)"
                       accept="image/*" style="display: none;" [attr.data-index]="idx" />
            </div>
            <div class="attachment-content" *ngIf="row.images && row.images.length > 0">
                <div class="attachment-title d-flex justify-content-end">
                    <i class="fa fa-trash cursor-pointer delete-icon" 
                       [class.disabled]="!getSelectedImages(idx).length"
                       (click)="getSelectedImages(idx).length ? deleteImages(idx) : null"></i>
                </div>
                <div class="attchment-contains">
                    <div class="row">
                        <div class="col-3 img-container" *ngFor="let image of row.images; let imgIdx = index">
                            <img (click)="previewImage(image.url)" [src]="image.url" style="width: 100%; height: 100px; object-fit: cover; cursor: pointer;" />
                            <input type="checkbox" name="image-{{idx}}-{{imgIdx}}"
                                   (change)="selectedImagesChange($event, idx, imgIdx)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-1 delete-item">
            <i class="fa fa-trash" (click)="removeRow(idx)"></i>
        </div>
    </div>
    <button class="btn btn-sm btn-primary" type="button" (click)="addRow()">{{'::Add' | abpLocalization }}</button>

    <!-- Image Preview Modal -->
    <abp-modal [(visible)]="isPreviewOpen" [options]="{size: 'fullscreen'}" (keydown.esc)="isPreviewOpen = false">
        <ng-template #abpHeader>
        </ng-template>
        <ng-template #abpBody>
            <div class="attachment-preview">
                <img [src]="previewImageUrl" style="max-width: 100%; max-height: 100%;" />
            </div>
        </ng-template>
    </abp-modal>
  `,
  styles: [`
    hr {
        margin: .5rem 0;
    }
    .delete-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .attachment-content {
      margin-top: 10px;
    }
    .img-container {
      position: relative;
      margin-bottom: 10px;
    }
    .img-container input[type="checkbox"] {
      position: absolute;
      top: 5px;
      right: 5px;
    }
    .delete-icon.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
 `],
})
export class ChecksheetRowComponent {
  _rows: RowItem[];
  @Input()
  set rows(rows: RowItem[]) {
    if (!rows || (rows && rows.length === 0)) {
        this._rows = [];
        this._rows.push({
            title: '',
            subtitle: '',
            type: 'text',
            images: []
        });
    } else {
        this._rows = rows.map(row => ({
          ...row,
          images: row.images || []
        }));
    }
  }

  get rows(): RowItem[] {
    return this._rows;
  }
  
  @Output() rowsChange: EventEmitter<RowItem[]> = new EventEmitter<RowItem[]>();
  @ViewChildren('fileInput') fileInputs: QueryList<ElementRef<HTMLInputElement>>;

  uploadFile: File;
  inProgress = false;
  selectedImagesMap = new Map<number, number[]>(); // rowIndex -> imageIndex[]
  isPreviewOpen = false;
  previewImageUrl: string;
  isWeb = true;

  constructor(
    private fileService: FileService,
    private toasterService: ToasterService,
    private platformService: PlatformService
  ) {
    this.isWeb = this.platformService.isWeb();
  }

  addRow() {
    this.rows.push({
        title: '',
        subtitle: '',
        type: 'text',
        images: []
    });
  }

  onRowsChange() {
    // filter rows with empty title or invalid type
    const filteredRows = this.rows.filter(row => row.title && row.type);
    this.rowsChange.emit(filteredRows);
  }

  removeRow(index: number) {
    this.rows.splice(index, 1);
    this.selectedImagesMap.delete(index);
    // Update map indices after removal
    const newMap = new Map<number, number[]>();
    this.selectedImagesMap.forEach((value, key) => {
      if (key < index) {
        newMap.set(key, value);
      } else if (key > index) {
        newMap.set(key - 1, value);
      }
    });
    this.selectedImagesMap = newMap;
    this.onRowsChange();
  }

  triggerFileInput(rowIndex: number) {
    setTimeout(() => {
      const inputs = this.fileInputs.toArray();
      const input = inputs.find((el, index) => {
        const attrIndex = el.nativeElement.getAttribute('data-index');
        return attrIndex && parseInt(attrIndex) === rowIndex;
      });
      if (input) {
        input.nativeElement.click();
      }
    }, 0);
  }

  onFileChange(e: Event, rowIndex: number) {
    const htmlEl = e.target as HTMLInputElement;
    const file = htmlEl.files[0];
    if (file) {
      this.uploadFile = file;
      this.uploadImage(htmlEl, rowIndex);
    }
  }

  uploadImage(el: HTMLInputElement, rowIndex: number) {
    if (this.uploadFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const arrayBuffer = reader.result.split(',')[1];
          this.inProgress = true;
          this.fileService.create(this.uploadFile.name, arrayBuffer).subscribe({
            next: res => {
              this.inProgress = false;

              const image = {
                fileId: res.url,
                url: reader.result as string,
                mimeType: this.uploadFile.type
              };

              if (!this.rows[rowIndex].images) {
                this.rows[rowIndex].images = [];
              }
              this.rows[rowIndex].images.push(image);
              this.onRowsChange();

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

  takePhoto(isEdit: boolean, rowIndex: number) {
    Camera.getPhoto({
      quality: 90,
      allowEditing: isEdit,
      resultType: CameraResultType.Uri
    }).then((result) => {
      if (result.webPath) {
        this.convertWebPathToFile(result.webPath).then(file => {
          this.uploadFile = file;
          this.uploadImage(null, rowIndex);
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

  selectedImagesChange(e: Event, rowIndex: number, imageIndex: number) {
    const target = e.target as HTMLInputElement;
    if (!this.selectedImagesMap.has(rowIndex)) {
      this.selectedImagesMap.set(rowIndex, []);
    }
    const selected = this.selectedImagesMap.get(rowIndex);
    
    if (target.checked) {
      selected.push(imageIndex);
    } else {
      const index = selected.indexOf(imageIndex);
      if (index > -1) {
        selected.splice(index, 1);
      }
    }
    this.selectedImagesMap.set(rowIndex, selected);
  }

  getSelectedImages(rowIndex: number): number[] {
    return this.selectedImagesMap.get(rowIndex) || [];
  }

  deleteImages(rowIndex: number) {
    const selected = this.getSelectedImages(rowIndex);
    if (selected.length > 0 && this.rows[rowIndex].images) {
      // Remove images in reverse order to maintain indices
      selected.sort((a, b) => b - a).forEach(index => {
        this.rows[rowIndex].images.splice(index, 1);
      });
      this.selectedImagesMap.set(rowIndex, []);
      this.onRowsChange();
    }
  }

  previewImage(url: string) {
    this.previewImageUrl = url;
    this.isPreviewOpen = true;
  }
}

