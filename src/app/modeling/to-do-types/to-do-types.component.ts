import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { ToDoTypeService } from '@apis/ticket/to-do-setups';
import { CreateUpdateToDoTypeDto, ToDoTypeDto, ToDoTypeGetListInput } from '@apis/ticket/to-do-setups/dtos';
import { ModelingBase } from '../modeling-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { ActivityCardCategoryService, ActivityCardTypeService, StateModelService } from '@apis/ticket';
import { ActivityCardCategoryDto, ActivityCardTypeDto, StateModelDto } from '@apis/ticket/dtos';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-to-do-types',
  templateUrl: './to-do-types.component.html',
  styleUrl: './to-do-types.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'ToDoTypesComponent',
    },
  ],
})
export class ToDoTypesComponent extends ModelingBase<ToDoTypeService, ToDoTypeGetListInput, CreateUpdateToDoTypeDto> implements OnInit {

  data: PagedResultDto<ToDoTypeDto> = { items: [], totalCount: 0 };
  selected: ToDoTypeDto;
  form: FormGroup;
  isModalVisible = false;
  info: string;
  modalBusy = false;

  stateModelData: StateModelDto[] = [];
  cardTypesData: ActivityCardTypeDto[] = [];
  cardCategoriesData: ActivityCardCategoryDto[] = [];

  constructor(
    public list: ListService<ToDoTypeGetListInput>,
    public service: ToDoTypeService,
    private localizationService: LocalizationService,
    private confirmation: ConfirmationService,
    private fb: FormBuilder,
    public stateModelService: StateModelService,
    private cardTypeService: ActivityCardTypeService,
    private cardCategoriesService: ActivityCardCategoryService,
  ) {
    super(service, list, 'to-do-type');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_ToDoType').subscribe(data => {
      this.info = data
    });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => {
        return this.service.getList(query);
      })
      .subscribe(res => {
        this.data = res;
      });
  }

  getModelingData() {
    this.getCardTypesData();
    this.getStateModelData();
  }

  getStateModelData() {
    this.stateModelService.getList({
      maxResultCount: 1000,
      ids: []
    }).subscribe(res => {
      this.stateModelData = res.items;
    });
  }

  getCardTypesData() {
    this.cardTypeService.getList({ maxResultCount: 100 }).subscribe((res) => {
      this.cardTypesData = res.items;
    });
  }

  getCardCategoriesData() {
    this.cardCategoriesService.getList({ cardTypeId: this.form.controls['cardTypeId'].value, maxResultCount: 100 }).subscribe((res) => {
      this.cardCategoriesData = res.items;
      if (this.selected.id) {
        const selectItem = this.cardCategoriesData.find(c => c.id === this.selected.cardCategoryId);
        if (selectItem) {
          this.form.get('cardCategoryName').setValue(selectItem.name);
        }
      }
    })
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      stateModelId: [this.selected.stateModelId || '', Validators.required],
      stateModelName: [this.stateModelData.find(c => c.id === this.selected?.stateModelId)?.name || ''],
      cardTypeId: [this.selected.cardTypeId || '', Validators.required],
      cardTypeName: [this.cardTypesData.find(c => c.id === this.selected?.cardTypeId)?.name || ''],
      cardCategoryId: [this.selected.cardCategoryId || '', Validators.required],
      cardCategoryName: [this.cardCategoriesData.find(c => c.id === this.selected?.cardCategoryId)?.name || ''],
      tenantId: [this.selected.tenantId || '']
    });

    if (this.selected.id) {
      this.getCardCategoriesData();
    }

    this.form.controls['cardTypeId'].valueChanges.subscribe((value) => {
      if (value) {
        this.getCardCategoriesData();
        this.form.controls['cardTypeName'].setValue(this.cardTypesData.find(c => c.id === value)?.name || '');
      } else {
        this.cardCategoriesData = [];
        this.form.controls['cardCategoryId'].setValue('');
        this.form.controls['cardCategoryName'].setValue('');
      }
    });

    this.form.controls['stateModelId'].valueChanges.subscribe(selectedId => {
      const selectItem = this.stateModelData.find(c => c.id === selectedId);
      if (selectItem) {
        this.form.get('stateModelName').setValue(selectItem.name);
      } else {
        this.form.get('stateModelName').setValue('');
      }
    });

    this.form.controls['cardCategoryId'].valueChanges.subscribe(selectedId => {
      const selectItem = this.cardCategoriesData.find(c => c.id === selectedId);
      if (selectItem) {
        this.form.get('cardCategoryName').setValue(selectItem.name);
      } else {
        this.form.get('cardCategoryName').setValue('');
      }
    });

  }

  add() {
    if (this.stateModelData.length === 0 || this.cardTypesData.length === 0) {
      this.getModelingData();
    }
    this.selected = {} as ToDoTypeDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  edit(row: any) {
    if (this.stateModelData.length === 0 || this.cardTypesData.length === 0) {
      this.getModelingData();
    }
    this.service.get(row.id).subscribe(toDoType => {
      this.selected = toDoType;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  delete(e: any) {
    this.confirmation
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info, e.name],
      })
      .subscribe(status => {
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

  save() {
    if (this.form.invalid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    const request = this.selected.id
      ? this.service.update(this.selected.id, this.form.value)
      : this.service.create(this.form.value);
    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      this.modalBusy = false;
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.form.value.name],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.form.reset();
      this.list.get();
    });
  }

}
