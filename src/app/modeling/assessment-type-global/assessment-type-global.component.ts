import { PagedResultDto, ListService, LocalizationService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivityCardCategoryService, ActivityCardTypeService, StateModelService, StateService } from '@apis/ticket';
import { ActivityCardCategoryDto, ActivityCardTypeDto, StateDto, StateModelDto } from '@apis/ticket/dtos';
import { TenantDto } from '@abp/ng.tenant-management/proxy';
import { TenantService } from '@proxy/services';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { finalize } from 'rxjs';
import { AssessmentTypeGlobalService } from '@apis/ticket/assessment-management';
import { AssessmentGlobalGuidelineDto, AssessmentTypeGlobalDto, AssessmentTypeGlobalGetListInput, CreateUpdateAssessmentTypeGlobalDto } from '@apis/ticket/assessment-management/dtos';

@Component({
  selector: 'app-assessment-type-global',
  templateUrl: './assessment-type-global.component.html',
  styleUrl: './assessment-type-global.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'AssessmentTypeGlobalComponent'
    }
  ]
})
export class AssessmentTypeGlobalComponent extends ModelingBase<AssessmentTypeGlobalService, AssessmentTypeGlobalGetListInput, CreateUpdateAssessmentTypeGlobalDto> implements OnInit {
  data: PagedResultDto<AssessmentTypeGlobalDto> = { items: [], totalCount: 0 };
  selected: AssessmentTypeGlobalDto;
  selectedGuideline: AssessmentGlobalGuidelineDto;
  form: FormGroup;
  guidelineForm: FormGroup;

  stateModels: StateModelDto[] = [];
  states: StateDto[] = [];
  activityCardTypes: ActivityCardTypeDto[] = [];
  activityCardCategories: ActivityCardCategoryDto[] = [];
  tenants: TenantDto[] = [];

  isModalVisible = false;
  isGuidelineModalVisible = false;
  modalBusy = false;
  guidelineList: (AssessmentGlobalGuidelineDto & { isDirty?: boolean })[] = [];
  pageGuidelineList: AssessmentGlobalGuidelineDto[] = [];
  answerTypeOptions = [
    { label: '::LABEL_Rating', value: 'Rating (0 ~ 5)' },
    { label: '::LABEL_YesorNo', value: 'Yes or No' },
    { label: '::LABEL_CommentText', value: 'Comment' }
  ];
  revisionsOptions: string[] = [];
  question: string;
  info: string;
  pageSize = 20;
  isCollapse = false;
  publisButtondisable = false;

  constructor(public list: ListService<AssessmentTypeGlobalGetListInput>,
    public service: AssessmentTypeGlobalService,
    private stateModelService: StateModelService,
    private stateService: StateService,
    private activityCardTypeService: ActivityCardTypeService,
    private activitycardCategoryService: ActivityCardCategoryService,
    private fb: FormBuilder,
    private tenantService: TenantService,
    private confirmation: ConfirmationService,
    private localizationService: LocalizationService,
  ) {
    super(service, list, 'assessment-type-global');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_AssessmentGlobalGuidelineQuestion').subscribe(data => {
      this.question = data;
    });
    this.localizationService.get('::LABEL_AssessmentTypeGlobal').subscribe(data => {
      this.info = data;
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
    this.getStateModelData();
    this.getStateData();
    this.getActivityCardTypeData();
    this.getTenants()
  }

  getTenants() {
    this.tenantService.getList({ maxResultCount: 1000 }).subscribe(res => {
      if (res.items.length > 0) {
        res.items.forEach(item => {
          if (item.name && item.extraProperties?.Description) {
            item.name = item.name + ' - ' + item.extraProperties.Description
          }
        });
      }
      this.tenants = res.items;
    })
  }

  getActivityCardTypeData() {
    this.activityCardTypeService.getAllInstances().subscribe((res) => {
      this.activityCardTypes = res;
    });
  }

  getActivityCardCategoryData(cardTypeId: string) {
    this.activitycardCategoryService.getList({cardTypeId: cardTypeId, maxResultCount: 50}).subscribe((res) => {
      this.activityCardCategories = res.items;
    });
  }

  getStateModelData() {
    this.stateModelService.getAllInstances().subscribe((res) => {
      this.stateModels = res;
    });
  }

  getStateData() {
    this.stateService.getAllInstances().subscribe((res) => {
      this.states = res;
    });
  }

  add() {
    if (this.stateModels.length === 0 || this.states.length === 0 || this.activityCardTypes.length === 0 || this.tenants.length === 0) {
      this.getModelingData();
    }
    this.selected = {} as AssessmentTypeGlobalDto;
    this.guidelineList = [];
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      tenantId: [this.selected.tenantId || ''],
      stateModelId: [this.selected.stateModelId || undefined, Validators.required],
      initialStatusId: [this.selected.initialStatusId || undefined, Validators.required],
      activityCardTypeId: [this.selected.activityCardTypeId || undefined],
      activityCardCategoryId: [this.selected.activityCardCategoryId || undefined],
      revision: [this.selected.lastRevision || '1', Validators.required],
      activeRevision: [this.selected.activeRevision || ''],
      tenants: [[]],
    });
    if (this.selected?.id && this.selected.activityCardTypeId) {
      this.getActivityCardCategoryData(this.selected.activityCardTypeId);
    }
    if (this.selected.revisions && this.selected.revisions.length > 0) {
      this.revisionsOptions = this.selected.revisions.sort((a, b) => Number(a) - Number(b));
    }
    if (this.selected.guideLines && this.selected.guideLines.length > 0) {
      this.guidelineList = this.selected.guideLines.sort((a, b) => a.questionNo - b.questionNo);
    }
    if (this.selected.tenants && this.selected.tenants.length > 0) {
      this.form.controls['tenants'].setValue(this.selected.tenants.map(item => item.tenantId));
    }

    this.form.controls['revision'].valueChanges.subscribe(value => {
      if (value) {
        this.service.getRevision(this.selected.id, value).subscribe(assessment => {
          this.guidelineList = assessment.guideLines.sort((a, b) => a.questionNo - b.questionNo);
        });
      }
    });
    this.form.controls['activityCardTypeId'].valueChanges.subscribe(value => {
      if (value) {
        this.getActivityCardCategoryData(value);
      } else {
        this.activityCardCategories = [];
      }
      this.form.controls['activityCardCategoryId'].setValue(undefined);
    });
  }

  buildGuidelineForm() {
    this.guidelineForm = this.fb.group({
      questionNo: [this.selectedGuideline.questionNo >= 0 ? this.selectedGuideline.questionNo : this.guidelineList.length],
      question: [this.selectedGuideline.question || '', Validators.required],
      longDescription: [this.selectedGuideline.longDescription || ''],
      answerType: [this.selectedGuideline.answerType || '', Validators.required],
    });
  }

  edit(event) {
    if (this.stateModels.length === 0 || this.states.length === 0 || this.activityCardTypes.length === 0 || this.tenants.length === 0) {
      this.getModelingData();
    }
    this.service.get(event.id).subscribe(assessment => {
      this.selected = assessment;
      this.buildForm();
      this.publisButtondisable = false;
      this.isModalVisible = true;
    });
  }

  delete(event) {
    this.confirmation
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info, event.name],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service.delete(event.id).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
              messageLocalizationParams: [this.info, event.name],
            });
            this.list.get();
          });
        }
      });
  }

  createGuidelie() {
    this.selectedGuideline = {} as AssessmentGlobalGuidelineDto;
    this.buildGuidelineForm();
    this.isGuidelineModalVisible = true;
  }

  saveGuideline() {
    if (this.guidelineForm.invalid) {
      return;
    }
    this.isGuidelineModalVisible = false;
    if (Object.keys(this.selectedGuideline).length > 0) {
      const index = this.guidelineList.findIndex(item => item.questionNo === this.selectedGuideline.questionNo);
      this.guidelineList[index] = { ...this.guidelineForm.value, isDirty: true };
      this.guidelineList = [...this.guidelineList];
    } else {
      this.guidelineList = [...this.guidelineList, { ...this.guidelineForm.value, isDirty: true }];
    }
  }

  editGuideline(event) {
    this.selectedGuideline = this.guidelineList[event];
    this.buildGuidelineForm();
    this.isGuidelineModalVisible = true;
  }

  deleteGuideline(row, rowIndex) {
    this.confirmation
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.question, row.question],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.guidelineList.splice(rowIndex, 1);
          this.guidelineList.forEach((item, index) => {
            item.questionNo = index;
          });
          this.guidelineList = [...this.guidelineList];
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.question, row.question],
          });
        }
      });
  }

  moveUpGuideline(rowIndex) {
    if (rowIndex > 0) {
      let temp = this.guidelineList[rowIndex - 1];
      temp.questionNo += 1;
      this.guidelineList[rowIndex - 1] = this.guidelineList[rowIndex];
      this.guidelineList[rowIndex - 1].questionNo -= 1
      this.guidelineList[rowIndex] = temp;
      this.guidelineList = [...this.guidelineList];
    }
  }

  moveDownGuideline(rowIndex) {
    if (rowIndex < this.guidelineList.length - 1) {
      let temp = this.guidelineList[rowIndex + 1];
      temp.questionNo -= + 1;
      this.guidelineList[rowIndex + 1] = this.guidelineList[rowIndex];
      this.guidelineList[rowIndex + 1].questionNo += 1
      this.guidelineList[rowIndex] = temp;
      this.guidelineList = [...this.guidelineList];
    }
  }

  save() {
    if (this.form.invalid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;

    const requestBody: CreateUpdateAssessmentTypeGlobalDto = {
      name: this.form.controls['name'].value,
      displayName: this.form.controls['displayName'].value,
      description: this.form.controls['description'].value,
      tenantId: this.selected.tenantId || '',
      stateModelId: this.form.controls['stateModelId'].value,
      stateModelName: this.stateModels.find(x => x.id === this.form.controls['stateModelId'].value).name,
      initialStatusId: this.form.controls['initialStatusId'].value,
      initialStatusName: this.states.find(x => x.id === this.form.controls['initialStatusId'].value).name,
      activityCardTypeId: this.form.controls['activityCardTypeId'].value,
      activityCardTypeName: this.activityCardTypes.find(x => x.id === this.form.controls['activityCardTypeId'].value)?.name || '',
      activityCardCategoryId: this.form.controls['activityCardCategoryId'].value,
      activityCardCategoryName: this.activityCardCategories.find(x => x.id === this.form.controls['activityCardCategoryId'].value)?.name || '',
      lastRevision: this.form.controls['revision'].value,
      revisions: [],
      guidelines: this.guidelineList.map(item => {
        return {
          questionNo: item.questionNo,
          question: item.question,
          longDescription: item.longDescription,
          answerType: item.answerType
        }
      }),
      tenants: this.form.controls['tenants'].value.map(item => {
        const tenant = this.tenants.find(x => x.id === item)
        return {
          tenantId: tenant.id,
          tenantName: tenant.name
        }
      }),
      extraProperties: {}
    };

    const request = this.selected.id
      ? this.service.update(this.selected.id, requestBody)
      : this.service.create(requestBody);

    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
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

  selectedTenantChanges(event) {
    if (event.length === 0) {
      this.form.controls['tenants'].setValue([]);
    } else {
      this.form.controls['tenants'].setValue(event.map(item => { return item.id }));
    }
  }

  getNewRevisionButtonStatus() {
    return this.revisionsOptions.includes((Number(this.selected.activeRevision) + 1).toString());
  }

  newRevision() {
    if (!this.revisionsOptions.includes((Number(this.selected.activeRevision) + 1).toString())) {
      this.revisionsOptions.push((Number(this.selected.activeRevision) + 1).toString());
      this.service.getRevision(this.selected.id, this.selected.activeRevision).subscribe(assessment => {
       this.guidelineList = assessment.guideLines.sort((a, b) => a.questionNo - b.questionNo);
     });
      this.form.controls['revision'].setValue((Number(this.selected.activeRevision) + 1).toString(), { emitEvent: false });
      this.publisButtondisable = true;
    }
  }

  publishRevision() {
    if (this.form.invalid || this.modalBusy || this.guidelineList.length === 0 || this.form.controls['tenants'].value?.length === 0) {
      return;
    }
    this.service.publishByIdAndRevision(this.selected.id, this.form.controls['revision'].value).subscribe(() => {
      this.toasterService.success('::LABEL_PublisedSuccessfully', '', {
        messageLocalizationParams: [this.info, this.selected.name],
      });
      this.isModalVisible = false;
      this.form.reset();
      this.list.get();
    });
  }

}
