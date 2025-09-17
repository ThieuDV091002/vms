import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { AssessmentSchedulingRuleService } from '@apis/ticket';
import { AssessmentSchedulingRuleDto, AssessmentSchedulingRuleGetListInput, AssessmentTeamDto, CreateUpdateAssessmentSchedulingRuleDto, ModelingHistoryDto } from '@apis/ticket/dtos';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { debounceTime, finalize, forkJoin, Subject } from 'rxjs';
import { AssessmentTypeDto } from '@apis/ticket/assessment-management/dtos';
import { AreaDto, CellDto } from '@proxy/dtos/master-data';
import { AssessmentTypeService } from '@apis/ticket/assessment-management';
import { AreaService, CellService } from '@apis/corporate';
import { ModelingInput } from '@apis/general/dtos';


@Component({
  selector: 'app-assessment-scheduling-rule',
  templateUrl: './assessment-scheduling-rule.component.html',
  styleUrl: './assessment-scheduling-rule.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'AssessmentTypeGlobalComponent'
    }
  ]
})



export class AssessmentSchedulingRuleComponent
  extends ModelingBase<AssessmentSchedulingRuleService, AssessmentSchedulingRuleGetListInput, CreateUpdateAssessmentSchedulingRuleDto>
  implements OnInit {
  data: PagedResultDto<AssessmentSchedulingRuleDto> = { items: [], totalCount: 0 };
  selected: AssessmentSchedulingRuleDto;
  form: FormGroup;
  isModalVisible = false;
  pageSize = 10;
  info: string;
  isCollapse = false;
  assessmentTypeList: AssessmentTypeDto[] = [];
  initAssessmentTypeList: AssessmentTypeDto[] = [];
  areaList: AreaDto[] = [];
  cellList: CellDto[] = [];
  dataTierTypeOptions: string[] = ['Area', 'Cell'];
  scheduleTypeOptions: string[] = ['ONCE', 'WEEKLY', 'MONTHLY'];
  teams: AssessmentTeamDto[] = [];
  noOfAssessmentPerDataTierOptions: number[] = [1, 2, 3, 4, 5, 6];
  weekDaysOnly: boolean;
  days = [
    { label: 'M', control: 'atMonday', isWeekday: true },
    { label: 'T', control: 'atTuesday', isWeekday: true },
    { label: 'W', control: 'atWednesday', isWeekday: true },
    { label: 'T', control: 'atThursday', isWeekday: true },
    { label: 'F', control: 'atFriday', isWeekday: true },
    { label: 'S', control: 'atSaturday', isWeekday: false },
    { label: 'S', control: 'atSunday', isWeekday: false }
  ];
  today = new Date();
  historys: PagedResultDto<ModelingHistoryDto>;
  tenantInfo: any;
  areaInput$ = new Subject<string | null>();
  cellInput$ = new Subject<string | null>();
  debounceTime = 500;

  @ViewChild('track') track!: ElementRef; 
  @ViewChild('thumb') thumb!: ElementRef; 

  constructor(
    public list: ListService<AssessmentSchedulingRuleGetListInput>,
    public service: AssessmentSchedulingRuleService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private localizationService: LocalizationService,
    private assessmentTypeService: AssessmentTypeService,
    private areaService: AreaService,
    private cellService: CellService,
  ) {
    super(service, list, 'assessment-scheduling-rule');
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.getAssessmentTypes();
    this.localizationService.get('::LABEL_AssessmentSchedulingRule').subscribe(data => {
      this.info = data;
    });
    this.areaInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.getAreas(searchItem);
      });
    this.cellInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.getCells(searchItem);
      });
    this.adjustPageSize();
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

  private hookToQuery() {
    this.list
      .hookToQuery(query => {
        return this.service.getList(query);
      })
      .subscribe(res => {
        this.data = res;
      });
  }

  getCells(searchItem = '') {
    this.cellService
      .getList({
        name: searchItem,
        maxResultCount: 10,
        tenantDataTierID: this.tenantInfo?.DataTierId,
        tenantDataTierType: this.tenantInfo?.DataTierType
      })
      .subscribe(data => {
        if (data.items.length === 0) {
          this.cellList = [];
        } else {
          const selectedCells = this.getSelectedDataTiers('Cell');
          const combinedList = [...selectedCells, ...data.items];
          this.cellList = this.distinctById(combinedList);
        }
      });
  }

  getAreas(searchItem = '', ids = []) {
    this.areaService
      .getList({
        ids: ids,
        name: searchItem,
        maxResultCount: 10,
        tenantDataTierID: this.tenantInfo?.DataTierId,
        tenantDataTierType: this.tenantInfo?.DataTierType
      })
      .subscribe(data => {
        if (data.items.length === 0) {
          this.areaList = [];
        } else {
          const selectedAreas = this.getSelectedDataTiers('Area');
          const combinedList = [...selectedAreas, ...data.items];
          this.areaList = this.distinctById(combinedList);
        }
      });
  }

  distinctById(items: any[]): any[] {
    const map = new Map();
    return items.filter((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, true);
        return true;
      }
      return false;
    });
  }

  getSelectedDataTiers(type: string): any[] {
    const selectedDataTiers = this.form.controls['dataTiers'].value || [];
    if (!selectedDataTiers || selectedDataTiers.length === 0) {
      return [];
    }
    let list = type === 'Area' ? this.areaList : this.cellList;
    return list.filter(item => selectedDataTiers.includes(item.id));
  }

  getAssessmentTypes() {
    this.assessmentTypeService.getList({ maxResultCount: this.pageSize }).subscribe(res => {
      this.initAssessmentTypeList = res.items.filter(x => x.activeRevision && x.globalActiveRevision);
      this.assessmentTypeList = this.initAssessmentTypeList;
    });
  }

  selectscheduleTypeChange(event) {
    if (event?.id) {
      this.form.controls['assessmentType'].setValue(event.id);
    }
    else {
      this.form.controls['assessmentType'].setValue(undefined);
    }
    this.assessmentTypeList = this.initAssessmentTypeList;
  }

  assessmentTypeFilterChange(value) {
    if (value) {
      this.assessmentTypeService.getList({ maxResultCount: this.pageSize, filter: value }).subscribe(res => {
        this.assessmentTypeList = res.items.filter(x => x.activeRevision && x.globalActiveRevision && x.displayName.toLowerCase().includes(value.toLowerCase()));
      });
    } else {
      this.assessmentTypeList = this.initAssessmentTypeList;
    }
  }

  add() {
    this.selected = {} as AssessmentSchedulingRuleDto;
    this.cellList = [];
    this.areaList = [];
    this.teams = [];
    this.buildForm();
    this.isModalVisible = true;
  }

  edit(event) {
    this.service.get(event.id).subscribe(res => {
      if (res.dataTierType === 'Area') {
        this.getAreas('', res.dataTiers.map(item => item.dataTierId));
      } else {
        res.dataTiers.forEach(item => {
          this.getCells(item.dataTierName);
        });
      }
      this.selected = res;
      this.teams = this.selected.teams;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      tenantId: [this.selected.tenantId || ''],
      assessmentType: [this.selected.assessmentType || '', Validators.required],
      assessmentTypeName: [this.selected.assessmentTypeName || ''],
      teams: [this.selected.teams || [], Validators.required],
      scheduleType: [this.selected.scheduleType || '', Validators.required],
      dataTierType: [this.selected.dataTierType || '', Validators.required],
      dataTiers: [this.selected.dataTiers || [], Validators.required],
      startDate: [this.selected && this.selected.startDate ? new Date(this.selected.startDate.split('T')[0]) : '', Validators.required],
      startTime: [this.selected.startTime || '', Validators.required],
      asssessmentDuration: [this.selected.asssessmentDuration || 1],
      repeatEvery: [this.selected.repeatEvery || 1],
      weekDaysOnly: [this.selected.weekDaysOnly || false],
      atMonday: [this.selected.atMonday || false],
      atTuesday: [this.selected.atTuesday || false],
      atWednesday: [this.selected.atWednesday || false],
      atThursday: [this.selected.atThursday || false],
      atFriday: [this.selected.atFriday || false],
      atSaturday: [this.selected.atSaturday || false],
      atSunday: [this.selected.atSunday || false],
      autoScheduling: [this.selected.isAutoScheduling || false],
      noOfAssessmentPerDataTier: [this.selected.noOfAssessmentPerDataTier || 1]
    }, { validators: this.atLeastOneDaySelectedIfNeeded });
    if (this.selected.dataTiers && this.selected.dataTiers.length > 0) {
      this.form.controls['dataTiers'].setValue(this.selected.dataTiers.map(item => item.dataTierId));
    }
    this.form.controls.dataTierType.valueChanges.subscribe(value => {
      if (value === 'Area') {
        this.form.controls['dataTiers'].setValue([]);
        this.getAreas();
      } else {
        this.form.controls['dataTiers'].setValue([]);
        this.getCells();
      }
    });

    this.form.get('scheduleType').valueChanges.subscribe(() => {
      this.form.updateValueAndValidity();
    });
  }

  atLeastOneDaySelectedIfNeeded = (control: AbstractControl): ValidationErrors | null => {
    const scheduleType = control.get('scheduleType')?.value;
    if (scheduleType === 'ONCE') {
      return null;
    }
    const days = ['atMonday', 'atTuesday', 'atWednesday', 'atThursday', 'atFriday', 'atSaturday', 'atSunday'];
    const isAnyDaySelected = days.some(day => control.get(day)?.value);
    return isAnyDaySelected ? null : { atLeastOneDayRequired: true };
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

  save() {
    if (this.form.invalid || !this.isTeamVaild()) {
      return;
    }
    const tenantId = this.configService.getOne('currentUser').tenantId;
    const isAutoScheduling = this.form.controls['autoScheduling'].value;
    const requestBody: CreateUpdateAssessmentSchedulingRuleDto = {
      name: this.form.value.name,
      displayName: this.form.value.displayName,
      description: this.form.value.description,
      tenantId: this.form.value.tenantId,
      assessmentType: this.form.value.assessmentType,
      assessmentTypeName: this.assessmentTypeList.find(item => item.id === this.form.value.assessmentType).name,
      teams: this.form.value.teams.map(team => ({
        ...team,
        name: team.owner + '-' + team.userGroupName,
        displayName: team.owner + '-' + team.userGroupName,
        tenantId: tenantId
      })),
      scheduleType: this.form.value.scheduleType,
      dataTierType: this.form.value.dataTierType,
      dataTiers: this.form.value.dataTiers.map(dataTier => {
        const list = this.form.value.dataTierType === 'Area' ? this.areaList : this.cellList;
        const matchedItem = list.find(item => item.id === dataTier);
        return {
          dataTierId: matchedItem.id,
          dataTierName: matchedItem.name,
          name: matchedItem.name,
          displayName: matchedItem.name,
          tenantId: tenantId
        };
      }),
      startDate: this.form.value.startDate,
      startTime: new Date(this.form.value.startTime).toLocalISOString(),
      asssessmentDuration: this.form.value.asssessmentDuration,
      repeatEvery: this.form.value.repeatEvery,
      weekDaysOnly: this.form.value.weekDaysOnly,
      atMonday: this.form.value.atMonday,
      atTuesday: this.form.value.atTuesday,
      atWednesday: this.form.value.atWednesday,
      atThursday: this.form.value.atThursday,
      atFriday: this.form.value.atFriday,
      atSaturday: this.form.value.atSaturday,
      noOfAssessmentPerDataTier: this.form.value.noOfAssessmentPerDataTier,
      extraProperties: {},
      isAutoScheduling: this.form.value.autoScheduling 
    };

    const request = this.selected.id
      ? this.service.update(this.selected.id, requestBody)
      : this.service.create(requestBody);

    request.subscribe(() => {
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
      this.teams = [];
    });
  }
   onAutoSchedulingChange(checked: boolean) {
    this.form.controls['autoScheduling'].setValue(checked);
    this.form.markAsDirty(); 
    this.form.updateValueAndValidity();
    this.handleSwitchChange(checked);  
  }

   handleSwitchChange(checked: boolean) {
    if (this.track && this.thumb) {
      if (checked) {
        this.track.nativeElement.style.borderColor
      }
    }
  }
  isTeamVaild(): boolean {
    return this.teams.every(team => ![null, undefined, ''].includes(team.owner));
  }

  onTeamsChange(updatedTeams: AssessmentTeamDto[]): void {
    const isValid = updatedTeams.every(team =>
      team.owner !== undefined
    );
    if (isValid) {
      this.form.controls['teams'].setValue(updatedTeams);
      this.teams = updatedTeams;
    }
  }

  selectedDataTiersChanges(event) {
    if (event.length === 0) {
      this.form.controls['dataTiers'].setValue([]);
    } else {
      this.form.controls['dataTiers'].setValue(event.map(item => { return item.id }));
    }
  }

  get hasScheduleType(): boolean {
    return this.form && this.form.get('scheduleType')?.value;
  }

  get currentScheduleType(): string {
    return this.form.get('scheduleType')?.value;
  }

  toggleAutoScheduling() {
  const control = this.form.get('autoScheduling');
  if (control) {
    control.setValue(!control.value);
    this.onAutoSchedulingChange(control.value);
  }
}
  weekdaysOnlyChange(event) {
    const isChecked = event.target.checked;
    this.form.controls['weekDaysOnly'].setValue(isChecked);
  }

  toggleDay(day: string) {
    const currentValue = this.form.get(day).value;
    this.form.patchValue({ [day]: !currentValue });
  }

  viewHistory(event) {
    this.isHistoryModalVisible = true;
    let input: ModelingInput<string> = {
      id: event.id,
      maxResultCount: 1000,
      skipCount: 0,
      sorting: 'executionTime desc',
    };
    this.service.getModelingHistoryByInput(input).subscribe(historys => {
      this.historys = historys;
      this.isHistoryModalVisible = true;
    });
  }
}
