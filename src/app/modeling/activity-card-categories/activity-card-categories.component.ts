import { Component, OnInit } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { LocalizationService } from '@abp/ng.core';
import { finalize } from 'rxjs';
import { ActivityCardCategoryService, ActivityCardTypeService } from '@apis/ticket';
import { ActivityCardCategoryDto, ActivityCardCategoryGetListInput, ActivityCardTypeDto, CreateUpdateActivityCardCategoryDto } from '@apis/ticket/dtos';

@Component({
  selector: 'app-activity-card-categories',
  templateUrl: './activity-card-categories.component.html',
  styleUrl: './activity-card-categories.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "ActivityCardCategoriesComponent",
    }
  ]
})
export class ActivityCardCategoriesComponent extends ModelingBase<ActivityCardCategoryService, ActivityCardCategoryGetListInput, CreateUpdateActivityCardCategoryDto> implements OnInit {

  data: PagedResultDto<ActivityCardCategoryDto> = { items: [], totalCount: 0 };
  selected: ActivityCardCategoryDto;
  isModalVisible = false;
  isHistoryModalVisible = false;
  activityCardCategoryForm: FormGroup;
  modalBusy = false;
  cardTypes: ActivityCardTypeDto[] = [];
  info: string;
  infos: string;
  form: any;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::DisplayName', field: 'displayName' },
    { displayKey: '::Description', field: 'description' },
    { displayKey: '::LABEL_CardType', field: 'cardTypeName' },
    { displayKey: '::LABEL_Color', field: 'color' }
  ];
  selectedColor: string;
  siteKPIIndicatorOptions = ['Safety', 'Quality', 'Productivity', 'Supply Chain'];
  constructor(public list: ListService<ActivityCardCategoryGetListInput>,
    public service: ActivityCardCategoryService,
    public activityCardTypeService: ActivityCardTypeService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private localizationService: LocalizationService) {
    super(service, list, 'activity-card-category');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_ActivityCardCategory').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::MENU_ActivityCardCategory').subscribe(data => {
      this.infos = data
    });
  }

  getActivityCardTypes() {
    this.activityCardTypeService
      .getList({
        maxResultCount: 1000,
      })
      .subscribe(res => {
        this.cardTypes = res.items;
      });
  }

  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res;
    });
  }

  delete(e: any) {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.info, e.name],
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.service.delete(e.id).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.info, e.name],
          });
          this.list.get();
        });
      }
    });
  }

  edit(row: any) {
    if (this.cardTypes.length === 0) {
      this.getActivityCardTypes();
    }
    this.service.get(row.id).subscribe((res) => {
      this.selected = res;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  add() {
    if (this.cardTypes.length === 0) {
      this.getActivityCardTypes();
    }
    this.selected = {} as ActivityCardCategoryDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.activityCardCategoryForm = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      tenantId: [this.selected.tenantId || ''],
      tenantName: [this.selected.tenantName || ''],
      cardTypeId: [this.selected.cardTypeId || '', Validators.required],
      reasonsDataSource: [this.selected.reasonsDataSource || ''],
      siteKPIIndicator: [this.selected.siteKPIIndicator || ''],
      // mtdLimit: [this.selected.mtdLimit || null],
      // ytdLimit: [this.selected.ytdLimit || null],
      color: [this.selected.color || ''],
    });
    this.selectedColor = this.selected?.color || '';
    this.activityCardCategoryForm.get('color').valueChanges.subscribe(color => {
      if (/^#[0-9A-F]{6}$/i.test(color)) {
        this.selectedColor = color;
      }
    });
  }
  updateColor(color, type) {
    this.activityCardCategoryForm.controls[type].patchValue(color, { emitEvent: false });
  }
  save() {
    if (this.activityCardCategoryForm.invalid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    const cardType = this.cardTypes.find(x => x.id === this.activityCardCategoryForm.value.cardTypeId);
    const request = this.selected.id
      ? this.service.update(this.selected.id, {...this.activityCardCategoryForm.value, cardTypeName: cardType?.name || ''})
      : this.service.create({...this.activityCardCategoryForm.value, cardTypeName: cardType?.name || ''});
    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      this.modalBusy = false;
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.activityCardCategoryForm.value.name],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.activityCardCategoryForm.reset();
      this.list.get();
    });
  }

  multiDelete(e) {
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.infos + '<br/>', e.objectNames.join(',<br/>')],      
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.service['multipleDeleteByIds'](e.objectIds).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.infos, e.objectNames],
          });
          this.list.get()
        });
      }
    });
  }
}
