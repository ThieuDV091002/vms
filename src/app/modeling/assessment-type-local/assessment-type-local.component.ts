import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ConfigStateService, CurrentUserDto, ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { UserService } from '@proxy/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivityCardCategoryDto, ActivityCardTypeDto, ModelingHistoryDto } from '@apis/ticket/dtos';
import { AssessmentTypeService } from '@apis/ticket/assessment-management';
import { AssessmentGuidelineDto, AssessmentTypeDto, AssessmentTypeGetListInput, CreateUpdateAssessmentTypeDto, CreateUpdateAssessmentTypeRevisionDto } from '@apis/ticket/assessment-management/dtos';
import { StandardService } from '@apis/general/services/widget';
import { ToasterService } from '@abp/ng.theme.shared';
import { finalize } from 'rxjs';
import { ModelingInput } from '@apis/general/dtos';

@Component({
  selector: 'app-assessment-type-local',
  templateUrl: './assessment-type-local.component.html',
  styleUrl: './assessment-type-local.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'AssessmentTypeLocalComponent'
    }
  ]
})

export class AssessmentTypeLocalComponent implements OnInit {
  pageSize = 10;
  currentAssessmentType: AssessmentTypeDto;
  selected = [];
  data: PagedResultDto<AssessmentTypeDto> = { items: [], totalCount: 0 };
  // userMap: { [key: string]: string } = {};
  isModalVisible: boolean = false;
  form: FormGroup;
  guidelineForm: FormGroup;
  revisionsOptions: string[] = [];
  question: string;
  guidelineList: AssessmentGuidelineDto[] = [];
  pageGuidelineList: AssessmentGuidelineDto[] = [];
  info: string;
  activityCardTypes: ActivityCardTypeDto[];
  activityCardCategories: ActivityCardCategoryDto[];
  selectedGuideline: AssessmentGuidelineDto;
  isGuidelineModalVisible: boolean = false;
  standardList = [];
  currentUser: CurrentUserDto;
  currentGuidelineStandards: string[] = [];
  isHistoryModalVisible: boolean = false;
  historys: PagedResultDto<ModelingHistoryDto>;
  isUpdate: boolean = false;
  createUpdateDto: CreateUpdateAssessmentTypeDto;

  constructor(
    public list: ListService<AssessmentTypeGetListInput>,
    private userService: UserService,
    private service: AssessmentTypeService,
    private fb: FormBuilder,
    private localizationService: LocalizationService,
    private standardService: StandardService,
    private configService: ConfigStateService,
    private toasterService: ToasterService
  ) {

  }

  ngOnInit(): void {
    this.adjustPageSize();
    this.hookToQuery();
    this.currentUser = this.configService.getOne('currentUser');
    this.localizationService.get('::LABEL_AssessmentGlobalGuidelineQuestion').subscribe(data => {
      this.question = data;
    });
    this.localizationService.get('::LABEL_AssessmentType').subscribe(data => {
      this.info = data;
    });
  }

  getStandardList() {
    this.standardService.getList({
      userId: this.currentUser.id,
      dataTierList: [],
      categoryIds: [],
      maxResultCount: 1000
    }).subscribe(res => {
      this.standardList = res.items.map(item => ({
        id: item.id,
        name: item.name
      }));
    });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => {
        return this.service.getList(query);
      })
      .subscribe(res => {
        this.data = res;
        // this.loadUserNames();
      });
  }

  edit(event) {
    if (this.standardList.length === 0) {
      this.getStandardList();
    }
    var searchRevision = event.activeRevision ? event.activeRevision : "1";
    this.service.getByNameAndRevision(event.name, searchRevision).subscribe(assessment => {
      this.currentAssessmentType = assessment;
      this.guidelineList = assessment.guideLines.sort((a, b) => a.questionNo - b.questionNo);
      this.buildForm();
      this.createUpdateDto = {
        name: assessment.name,
        displayName: assessment.displayName,
        description: assessment.description,
        globalId: assessment.globalId,
        tenantId: assessment.tenantId,
        stateModelId: assessment.stateModelId,
        initialStatusId: assessment.initialStatusId,
        activityCardTypeId: assessment.activityCardTypeId,
        activityCardCategoryId: assessment.activityCardCategoryId,
        lastRevision: assessment.lastRevision,
        activeRevision: assessment.activeRevision,
        globalActiveRevision: assessment.globalActiveRevision,
        lastPublishTime: assessment.lastPublishTime,
        revisions: [] as CreateUpdateAssessmentTypeRevisionDto[],
        guidelines: this.guidelineList.map(item => {
          return {
            globalID: assessment.globalId,
            questionNo: item.questionNo,
            question: item.question,
            longDescription: item.longDescription,
            answerType: item.answerType,
            questionLocal: item.questionLocal,
            longDescriptionLocal: item.longDescriptionLocal,
            revisionId: item.revisionId,
            standards: item.standards.map(standard => {
              return {
                guidelineId: item.id,
                standardId: String(standard.standardId),
                tenantId: this.currentAssessmentType.tenantId
              }
            }
          )}
        }),
        extraProperties: {}
      };

      this.isModalVisible = true;
    });
  }

  onRevisionChange(selectedValue: string) {
    if (this.standardList.length === 0) {
      this.getStandardList();
    }
    var searchRevision = this.currentAssessmentType.activeRevision ? selectedValue : "1";
    this.service.getByNameAndRevision(this.currentAssessmentType.name, searchRevision).subscribe(assessment => {
      this.currentAssessmentType = assessment;
      this.guidelineList = assessment.guideLines.sort((a, b) => a.questionNo - b.questionNo);
      this.form.controls['activeRevision'].setValue(selectedValue);
      this.createUpdateDto = {
        name: assessment.name,
        displayName: assessment.displayName,
        description: assessment.description,
        globalId: assessment.globalId,
        tenantId: assessment.tenantId,
        stateModelId: assessment.stateModelId,
        initialStatusId: assessment.initialStatusId,
        activityCardTypeId: assessment.activityCardTypeId,
        activityCardCategoryId: assessment.activityCardCategoryId,
        lastRevision: assessment.lastRevision,
        activeRevision: assessment.activeRevision,
        globalActiveRevision: assessment.globalActiveRevision,
        lastPublishTime: assessment.lastPublishTime,
        revisions: [] as CreateUpdateAssessmentTypeRevisionDto[],
        guidelines: this.guidelineList.map(item => {
          return {
            globalID: assessment.globalId,
            questionNo: item.questionNo,
            question: item.question,
            longDescription: item.longDescription,
            answerType: item.answerType,
            questionLocal: item.questionLocal,
            longDescriptionLocal: item.longDescriptionLocal,
            revisionId: item.revisionId,
            standards: item.standards.map(standard => {
              return {
                guidelineId: item.id,
                standardId: String(standard.standardId),
                tenantId: this.currentAssessmentType.tenantId
              }
            }
          )}
        }),
        extraProperties: {}
      };

      this.isModalVisible = true;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      activeRevision: [this.currentAssessmentType.activeRevision || "1", Validators.required],
    });
  }

  save() {
    if(this.form.invalid) {
      return;
    }
    this.createUpdateDto.guidelines = this.guidelineList;
    this.createUpdateDto.lastRevision = this.form.controls['activeRevision'].value;
    this.service.update(this.currentAssessmentType.id, this.createUpdateDto).subscribe(() => {
      this.isModalVisible = false;
      this.list.get();
      this.form.reset();
      this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
        messageLocalizationParams: [this.info, this.currentAssessmentType.name],
      });
    });
  }

  editGuideline(index) {
    this.selectedGuideline = this.guidelineList.find(item => item.questionNo === index);
    this.buildGuidelineForm();
    this.isGuidelineModalVisible = true;
  }

  buildGuidelineForm() {
    this.guidelineForm = this.fb.group({
      id: [this.selectedGuideline.id],
      globalID: [this.selectedGuideline.globalID],
      questionNo: [this.selectedGuideline.questionNo],
      question: [this.selectedGuideline.question],
      longDescription: [this.selectedGuideline.longDescription],
      answerType: [this.selectedGuideline.answerType],
      questionLocal: [this.selectedGuideline.questionLocal],
      longDescriptionLocal: [this.selectedGuideline.longDescriptionLocal],
      standards: [[]],
      revisionId: [this.selectedGuideline.revisionId]
    });
    this.guidelineForm.controls['standards'].setValue(this.selectedGuideline.standards.map(item => { return item.standardId }));
  }

  saveGuideline() {
    if (this.guidelineForm.invalid) {
      return;
    }
    const index = this.guidelineList.findIndex(item => item.questionNo === this.selectedGuideline.questionNo);
    this.guidelineList[index].questionLocal = this.guidelineForm.controls['questionLocal'].value;
    this.guidelineList[index].longDescriptionLocal = this.guidelineForm.controls['longDescriptionLocal'].value;
    this.guidelineList[index].standards = this.guidelineForm.controls['standards'].value.map(standardId => {
      return {
        guidelineId: this.guidelineList[index].id,
        standardId: String(standardId),
        tenantId: this.currentAssessmentType.tenantId
      }
    });
    this.guidelineList = [...this.guidelineList];
    this.isGuidelineModalVisible = false;
    this.guidelineForm.reset();
  }

  activeRevision() {
    this.service.activateByIdAndRevision(this.currentAssessmentType.id, this.form.controls['activeRevision'].value).subscribe(() => {
      this.toasterService.success('::LABEL_ActivateSuccessfully', '', {
        messageLocalizationParams: [this.info, this.currentAssessmentType.name],
      });
      this.isModalVisible = false;
      this.list.get();
    });
  }

  search(searchText: string) {
    const trimmedSearchText = searchText.trim();
    this.list
      .hookToQuery(query => {
        return this.service.getList({
          ...query,
          filter: trimmedSearchText
        });
      })
      .subscribe(res => {
        this.data = res;
      });
  }

  viewHistory(event) {
    let input: ModelingInput<string> = {
      id: event.id,
      maxResultCount: 1000,
      skipCount: 0,
      sorting: "executionTime desc"
    };
    this.service.getModelingHistoryByInput(input).subscribe((historys) => {
      this.historys = historys;
      this.isHistoryModalVisible = true;
    });
  }

  formatDate(date: any) {
    return new Date(date?.toString() + '+00:00').toLocaleString();
  }

  selectedStandardChanges(event) {
    if (event.length === 0) {
      this.guidelineForm.controls['standards'].setValue([]);
    } else {
      this.guidelineForm.controls['standards'].setValue(event.map(item => { return item.id }));
    }
  }

  adjustPageSize() {
    const width = window.screen.height;
    if (width >= 1440) {
      this.list.maxResultCount = 30;
      this.pageSize = 30;
    } else if (width >= 1080) {
      this.list.maxResultCount = 20;
      this.pageSize = 20;
    }
    else if (width >= 864) {
      this.list.maxResultCount = 15;
      this.pageSize = 15;
    }
    else {
      this.list.maxResultCount = 10;
      this.pageSize = 10;
    }
  }

  pageChange(event) {
    this.pageSize = Number(event);
    this.list.maxResultCount = this.pageSize;
  }

  getTooltipMessage(globalActiveRevision: string, activeRevision: string): string {
    let message = '';
    if (!globalActiveRevision && activeRevision) {
      this.localizationService.get('::LABEL_GlobalActiveRevisionEmptyActiveRevisionHasValue').subscribe(data => {
        message = data;
      });
    } else if (globalActiveRevision && activeRevision && globalActiveRevision !== activeRevision) {
      this.localizationService.get('::LABEL_GlobalActiveRevisionAndActiveRevisionDifferent').subscribe(data => {
        message = data;
      });
    } else if (globalActiveRevision && !activeRevision) {
      this.localizationService.get('::LABEL_GlobalActiveRevisionHasValueActiveRevisionEmpty').subscribe(data => {
        message = data;
      });
    }
    return message;
  }
}
