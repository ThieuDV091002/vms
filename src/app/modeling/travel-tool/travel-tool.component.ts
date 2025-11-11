import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TravelToolDto } from '@apis/vms/dtos/travel-tool';
import { TravelToolService } from '@apis/vms/services';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-travel-tool',
  templateUrl: './travel-tool.component.html',
  styleUrl: './travel-tool.component.scss',
  providers: [
      ListService,
      {
        provide: EXTENSIONS_IDENTIFIER,
        useValue: 'TravelToolComponent',
      },
    ],
})
export class TravelToolComponent implements OnInit {
  selected: TravelToolDto;
  isModalVisible: boolean;
  data: PagedResultDto<TravelToolDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: 'vms::ToolType', field: 'toolType' },
  ];
  info: string;
  uploadFile: File;
  inProgress = false;
  photoUrl: string | ArrayBuffer | null = null;
  attachmentMap = new Map<string, string>();
  constructor(
      public list: ListService<PagedAndSortedResultRequestDto>,
      public service: TravelToolService,
      public fb: FormBuilder,
      public confirmationService: ConfirmationService,
      public toasterService: ToasterService,
      private localizationService: LocalizationService
    ) {
    }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('vms::LABEL_TravelTool').subscribe(data => {
      this.info = data
    });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(() => this.service.getList())
      .subscribe(res => {
        this.data = res;
      });
  }

    buildForm() {
      this.getPhotoUrl(this.selected?.photoId);
      this.form = this.fb.group({
        name: [this.selected?.name || '', Validators.required],
        toolType: [this.selected?.toolType || '', Validators.required],
        url: [this.selected?.url || '', Validators.required],
        photo: [null]
      });
    }

    types = [
      { id: 'Via CWT', displayName: 'Via CWT' },
      { id: 'Tools', displayName: 'Tools' },
      { id: 'Support', displayName: 'Support' },
    ];

    selectChange(event) {
      if (event?.id) {
        this.form.controls['toolType'].setValue(event.id);
      } else {
        this.form.controls['toolType'].setValue(undefined);
      }
    }

    add() {
      this.selected = {} as TravelToolDto;
      this.buildForm();
      this.isModalVisible = true;
    }
  
    save() {
      if (this.form.invalid) {
        return;
      }
      this.inProgress = true;
      const formData = new FormData();
      formData.append('name', this.form.value.name);
      formData.append('toolType', this.form.value.toolType);
      formData.append('url', this.form.value.url);
      if (this.uploadFile) {
        formData.append('photo', this.uploadFile, this.uploadFile.name);
      }
      else if (this.selected?.id && this.selected?.photoId) {
        formData.append('photoId', this.selected.photoId);
        formData.append('photoName', this.selected.photoName);
      }
      const request = this.selected.id
        ? this.service.update(this.selected.id, formData as any)
        : this.service.create(formData as any);
      request.pipe(finalize(() => (this.inProgress = false))).subscribe({
        next: (result: TravelToolDto) => {
          this.toasterService.success(
            this.selected.id ? '::LABEL_UpdatedSuccessfully' : '::LABEL_CreatedSuccessfully',
            '',
            {
              messageLocalizationParams: [this.info, this.form.value.name],
            }
          );
          this.isModalVisible = false;
          this.form.reset();
          this.uploadFile = null;
          this.photoUrl = null;
          this.list.get();
      },
      error: err => {
        this.toasterService.error(err.error?.message || '::LABEL_OperationFailed');
        this.inProgress = false;
      },
    });
    }
  
    edit(row) {
      this.service.get(row.id).subscribe(data => {
        this.selected = data;
        this.buildForm();
        this.isModalVisible = true;
      });
    }
  
    delete(row) {
      this.confirmationService
        .warn('::LABEL_DeletionConfirmationMessage', '', {
          messageLocalizationParams: [this.info, row.name],
        })
        .subscribe(status => {
          if (status === Confirmation.Status.confirm) {
            this.service.delete(row.id).subscribe(() => {
              this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
                messageLocalizationParams: [this.info, row.name],
              });
              this.list.get();
            });
          }
        });
    }

    onFileChange(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if (file) {
        this.uploadFile = file;
        this.previewPhoto(file);
      }
    }

  previewPhoto(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.photoUrl = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  getPhotoUrl(photoId: string) {
    if (!photoId) {
      this.photoUrl = null;
      return;
    }
    if (this.attachmentMap.has(photoId)) {
      this.photoUrl = this.attachmentMap.get(photoId)!;
      return;
    }

    this.service.getPhoto(photoId).subscribe({
      next: (res: any) => {
        let imageUrl: string;
        if (typeof res === 'string') {
          imageUrl = 'data:image/jpeg;base64,' + res;
        } else {
          const blob = this.convertBase64ToBlob(res, 'image/jpeg');
          imageUrl = URL.createObjectURL(blob);
        }
        this.photoUrl = imageUrl;
        this.attachmentMap.set(photoId, imageUrl);
      },
      error: err => {
        this.toasterService.error(err.error?.message || '::LABEL_PhotoLoadFailed');
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
