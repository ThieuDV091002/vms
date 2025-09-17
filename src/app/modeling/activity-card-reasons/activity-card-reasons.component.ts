import { Component, OnInit } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { LocalizationService } from '@abp/ng.core';
import { finalize } from 'rxjs';
import { ActivityCardCategoryService, ActivityCardReasonService } from '@apis/ticket';
import { ActivityCardCategoryDto, ActivityCardReasonDto, ActivityCardReasonGetListInput, CreateUpdateActivityCardReasonDto } from '@apis/ticket/dtos';

@Component({
  selector: 'app-activity-card-reasons',
  templateUrl: './activity-card-reasons.component.html',
  styleUrl: './activity-card-reasons.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "ActivityCardReasonsComponent",
    }
  ]
})
export class ActivityCardReasonsComponent extends ModelingBase<ActivityCardReasonService, ActivityCardReasonGetListInput, CreateUpdateActivityCardReasonDto> implements OnInit {

  data: PagedResultDto<ActivityCardReasonDto> = { items: [], totalCount: 0 };
  selected: ActivityCardReasonDto;
  isModalVisible = false;
  isHistoryModalVisible = false;
  activityCardReasonForm: FormGroup;
  modalBusy = false;
  cardCategories: ActivityCardCategoryDto[] = [];
  info: string;
  infos: string;
  form: any;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::DisplayName', field: 'displayName' },
    { displayKey: '::Description', field: 'description' },
    { displayKey: '::Category', field: 'cardCategoryName' },
  ];
  constructor(public list: ListService<ActivityCardReasonGetListInput>,
    public service: ActivityCardReasonService,
    public activityCardCategoryService: ActivityCardCategoryService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private localizationService: LocalizationService) {
    super(service, list, 'activity-card-reason');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_ActivityCardReason').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::MENU_ActivityCardReason').subscribe(data => {
      this.infos = data
    });
  }

  getActivityCardReasons() {
    this.activityCardCategoryService
      .getList({
        maxResultCount: 1000,
      })
      .subscribe(res => {
        this.cardCategories = res.items;
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
    if (this.cardCategories.length === 0) {
      this.getActivityCardReasons();
    }
    this.service.get(row.id).subscribe((res) => {
      this.selected = res;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  add() {
    if (this.cardCategories.length === 0) {
      this.getActivityCardReasons();
    }
    this.selected = {} as ActivityCardReasonDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.activityCardReasonForm = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      tenantId: [this.selected.tenantId || ''],
      tenantName: [this.selected.tenantName || ''],
      cardCategoryId: [this.selected.cardCategoryId || '', Validators.required],
    });
  }
  save() {
    if (this.activityCardReasonForm.invalid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    const cardCategory = this.cardCategories.find(x => x.id === this.activityCardReasonForm.value.cardCategoryId);
    const request = this.selected.id
      ? this.service.update(this.selected.id, {...this.activityCardReasonForm.value, cardCategoryName: cardCategory?.name || ''})
      : this.service.create({...this.activityCardReasonForm.value, cardCategoryName: cardCategory?.name || ''});
    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      this.modalBusy = false;
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.activityCardReasonForm.value.name],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.activityCardReasonForm.reset();
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
