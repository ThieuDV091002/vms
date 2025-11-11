import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextDto } from '@apis/vms/dtos/text';
import { TextService } from '@apis/vms/services/text.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrl: './text.component.scss',
  providers: [
      ListService,
      {
        provide: EXTENSIONS_IDENTIFIER,
        useValue: 'TextComponent',
      },
    ],
})
export class TextComponent implements OnInit {
  selected: TextDto;
  isModalVisible: boolean;
  data: PagedResultDto<TextDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Section', field: 'section' },
    { displayKey: '::Content', field: 'content' }
  ];
  info: string;
  constructor(
      public list: ListService<PagedAndSortedResultRequestDto>,
      public service: TextService,
      public fb: FormBuilder,
      public confirmationService: ConfirmationService,
      public toasterService: ToasterService,
      private localizationService: LocalizationService
    ) {
    }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('vms::LABEL_Text').subscribe(data => {
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
      this.form = this.fb.group({
        section: [this.selected?.section || '', Validators.required],
        content: [this.selected?.content || '', Validators.required]
      });
    }
    sections = [
      { id: 'Heading', displayName: 'Heading' },
      { id: 'Hotels, Transportation', displayName: 'Hotels, Transportation' },
      { id: 'Food Recommendation', displayName: 'Food Recommendation' },
      { id: 'myHR Process Updates', displayName: 'myHR Process Updates' }
    ];

    add() {
      this.selected = {} as TextDto;
      this.buildForm();
      this.isModalVisible = true;
    }
  
    save() {
      if (this.form.invalid) {
        return;
      }
      const request = this.selected.id
        ? this.service.update(this.selected.id, this.form.value)
        : this.service.create(this.form.value);
      request.subscribe(() => {
        if (!this.selected.id) {
          this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
            messageLocalizationParams: [this.info, this.form.value.section],
          });
        }
        else {
          this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
            messageLocalizationParams: [this.info, this.selected.section],
          });
        }
        this.isModalVisible = false;
        this.form.reset();
        this.list.get();
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

    selectChange(event) {
    if (event?.id) {
      this.form.controls['section'].setValue(event.id);
    } else {
      this.form.controls['section'].setValue(undefined);
    }
  }
}
