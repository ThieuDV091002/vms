import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { ContentTemplateService } from '@apis/notification';
import { ContentTemplateDto, ContentTemplateGetListInput, CreateUpdateContentTemplateDto } from '@apis/notification/dtos/content-templates';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';

@Component({
  selector: 'app-content-template',
  templateUrl: './content-template.component.html',
  styleUrl: './content-template.component.scss',
    providers: [
      ListService,
      {
        provide: EXTENSIONS_IDENTIFIER,
        useValue: "ContentTemplateComponent",
      },
    ]
})

export class ContentTemplateComponent extends ModelingBase<ContentTemplateService, ContentTemplateGetListInput, CreateUpdateContentTemplateDto>
  implements OnInit {
  currentContentTemplate: ContentTemplateDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<ContentTemplateDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::DisplayName', field: 'displayName' },
    { displayKey: '::Description', field: 'description' },
    { displayKey: '::LABEL_Subject', field: 'subject' }
  ];
  info: string;
  isCollapse = false;

  constructor(
    public list: ListService<ContentTemplateGetListInput>,
    public service: ContentTemplateService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'content-template');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_ContentTemplate').subscribe(data => {
      this.info = data
    });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => this.service.getList(query))
      .subscribe(res => {
        this.data = res;
      });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.currentContentTemplate?.name || '', Validators.required],
      displayName: [this.currentContentTemplate?.displayName || '', Validators.required],
      description: [this.currentContentTemplate?.description || ''],
      subject: [this.currentContentTemplate?.subject || ''],
      content: [this.currentContentTemplate?.content || '', Validators.required],
      tenantId: [this.currentContentTemplate.tenantId || ''],
    });
  }

  add() {
    this.currentContentTemplate = {} as ContentTemplateDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  edit(row) {
    this.service.get(row.id).subscribe(data => {
      this.currentContentTemplate = data;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const request = this.currentContentTemplate.id
      ? this.service.update(this.currentContentTemplate.id, this.form.value)
      : this.service.create(this.form.value);

    request.subscribe(() => {
      if (!this.currentContentTemplate.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.form.value.name],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.currentContentTemplate.name],
        });
      }
      this.isModalVisible = false;
      this.form.reset();
      this.list.get();
    });
  }

  delete(row) {
    this.confirmationService
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info,row.name],
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

  search(e) {
    this.list.filter = e.target.value;
  }
}


