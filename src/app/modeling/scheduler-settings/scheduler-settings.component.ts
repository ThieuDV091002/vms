import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { SchedulerSettingService } from '@apis/scheduler/services';
import { CreateUpdateSchedulerSettingDto, SchedulerExecutionHistoryDto, SchedulerSettingDto, SchedulerSettingGetListInput } from '@apis/scheduler/dtos';
import { ApiNames } from 'src/app/shared/interfaces/api-definition';
import { ControllerActionDto } from 'src/app/shared/models/controller-action.model';
import { ApiDefinitionService } from 'src/app/shared/services/api-definition.service';
import { CronLocalization } from '@sbzen/ng-cron';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { OverridingMode } from '@proxy/overriding-mode.enum';

@Component({
  selector: 'app-scheduler-settings',
  templateUrl: './scheduler-settings.component.html',
  styleUrl: './scheduler-settings.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "SchedulerSettingsComponent",
    },
  ]
})

export class SchedulerSettingsComponent
  extends ModelingBase<SchedulerSettingService, SchedulerSettingGetListInput, CreateUpdateSchedulerSettingDto>
  implements OnInit {
  selected: SchedulerSettingDto;
  executionHistorys: PagedResultDto<SchedulerExecutionHistoryDto>;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  isExecutionHistoryModalVisible: boolean = false;
  data: PagedResultDto<SchedulerSettingDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::LABEL_ScheduleCron', field: 'scheduleCron' },
    { displayKey: '::LABEL_RunningStatus', field: 'runningStatus' },
    { displayKey: '::LABEL_PreviousFireTime', field: 'previousFireTime' ,type: 'date'},
    { displayKey: '::LABEL_NextFireTime', field: 'nextFireTime', type: 'date' },];
  info: string;
  isCollapse = false;
  modalBusy = false;
  microserviceSelectList = [
    { 'name': 'Permission', 'value': ApiNames.Permission },
    { 'name': 'Corporate', 'value': ApiNames.Corporate },
    { 'name': 'Dashboard', 'value': ApiNames.Dashboard },
    { 'name': 'General', 'value': ApiNames.General },
    { 'name': 'Ticket', 'value': ApiNames.Ticket },
    { 'name': 'Notification', 'value': ApiNames.Notification },
    { 'name': 'Scheduler', 'value': ApiNames.Scheduler }
  ];
  objectSelectList = [];
  actionSelectList = [];
  apiSelectList = [];
  allActions: ControllerActionDto[] = [];
  localizationUFE: any = this.localizationService.getResource('UFE');
  searchFilter: string = '';
  readonly localization: CronLocalization = {
    common: {
      dayOfWeek: {
        sunday: this.localizationUFE.LABEL_sunday,
        monday: this.localizationUFE.LABEL_monday,
        tuesday: this.localizationUFE.LABEL_tuesday,
        wednesday: this.localizationUFE.LABEL_wednesday,
        thursday: this.localizationUFE.LABEL_thursday,
        friday: this.localizationUFE.LABEL_friday,
        saturday: this.localizationUFE.LABEL_saturday
      },
      dayOfMonth: {
        '1st': this.localizationUFE.LABEL_1st,
        '2nd': this.localizationUFE.LABEL_2nd,
        '3rd': this.localizationUFE.LABEL_3rd,
        '4th': this.localizationUFE.LABEL_4th,
        '5th': this.localizationUFE.LABEL_5th,
        '6th': this.localizationUFE.LABEL_6th,
        '7th': this.localizationUFE.LABEL_7th,
        '8th': this.localizationUFE.LABEL_8th,
        '9th': this.localizationUFE.LABEL_9th,
        '10th': this.localizationUFE.LABEL_10th,
        '11th': this.localizationUFE.LABEL_11th,
        '12th': this.localizationUFE.LABEL_12th,
        '13th': this.localizationUFE.LABEL_13th,
        '14th': this.localizationUFE.LABEL_14th,
        '15th': this.localizationUFE.LABEL_15th,
        '16th': this.localizationUFE.LABEL_16th,
        '17th': this.localizationUFE.LABEL_17th,
        '18th': this.localizationUFE.LABEL_18th,
        '19th': this.localizationUFE.LABEL_19th,
        '20th': this.localizationUFE.LABEL_20th,
        '21st': this.localizationUFE.LABEL_21st,
        '22nd': this.localizationUFE.LABEL_22nd,
        '23rd': this.localizationUFE.LABEL_23rd,
        '24th': this.localizationUFE.LABEL_24th,
        '25th': this.localizationUFE.LABEL_25th,
        '26th': this.localizationUFE.LABEL_26th,
        '27th': this.localizationUFE.LABEL_27th,
        '28th': this.localizationUFE.LABEL_28th,
        '29th': this.localizationUFE.LABEL_29th,
        '30th': this.localizationUFE.LABEL_30th,
        '31st': this.localizationUFE.LABEL_31st
      },
      month: {
        january: this.localizationUFE.LABEL_January,
        february: this.localizationUFE.LABEL_February,
        march: this.localizationUFE.LABEL_March,
        april: this.localizationUFE.LABEL_April,
        may: this.localizationUFE.LABEL_May,
        june: this.localizationUFE.LABEL_June,
        july: this.localizationUFE.LABEL_July,
        august: this.localizationUFE.LABEL_August,
        september: this.localizationUFE.LABEL_September,
        october: this.localizationUFE.LABEL_October,
        november: this.localizationUFE.LABEL_November,
        december: this.localizationUFE.LABEL_December
      }
    },
    tabs: {
      seconds: this.localizationUFE.LABEL_Seconds,
      minutes: this.localizationUFE.LABEL_Minutes,
      hours: this.localizationUFE.LABEL_Hours,
      day: this.localizationUFE.LABEL_Day,
      month: this.localizationUFE.LABEL_Month,
      year: this.localizationUFE.LABEL_Year
    },
    quartz: {
      second: {
        every: {
          label: this.localizationUFE.LABEL_EverySecond
        },
        increment: {
          label1: this.localizationUFE.LABEL_Every,
          label2: this.localizationUFE.LABEL_SecondsStartingAtSecond
        },
        and: {
          label: this.localizationUFE.LABEL_SpecificSecond
        },
        range: {
          label1: this.localizationUFE.LABEL_EverySecondBetween,
          label2: this.localizationUFE.LABEL_AndSecond
        }
      },
      minute: {
        every: {
          label: this.localizationUFE.LABEL_EveryMinute
        },
        increment: {
          label1: this.localizationUFE.LABEL_Every,
          label2: this.localizationUFE.LABEL_MinutesStartingAtMinute
        },
        and: {
          label: this.localizationUFE.LABEL_SpecificMinute
        },
        range: {
          label1: this.localizationUFE.LABEL_EveryMinuteBetween,
          label2: this.localizationUFE.LABEL_AndMinute
        }
      },
      hour: {
        every: {
          label: this.localizationUFE.LABEL_EveryHour
        },
        increment: {
          label1: this.localizationUFE.LABEL_Every,
          label2: this.localizationUFE.LABEL_HoursStartingAtHour
        },
        and: {
          label: this.localizationUFE.LABEL_SpecificHour
        },
        range: {
          label1: this.localizationUFE.LABEL_EveryHourBetween,
          label2: this.localizationUFE.LABEL_AndHour
        }
      },
      day: {
        every: {
          label: this.localizationUFE.LABEL_EveryDay
        },
        dayOfWeekIncrement: {
          label1: this.localizationUFE.LABEL_Every,
          label2: this.localizationUFE.LABEL_DaysStartingOn
        },
        dayOfMonthIncrement: {
          label1: this.localizationUFE.LABEL_Every,
          label2: this.localizationUFE.LABEL_DayStartingOnThe,
          label3: this.localizationUFE.LABEL_OfTheMonth
        },
        dayOfWeekAnd: {
          label: this.localizationUFE.LABEL_SpecificDayOfWeek
        },
        dayOfWeekRange: {
          label1: this.localizationUFE.LABEL_EveryDayBetween,
          label2: this.localizationUFE.LABEL_And
        },
        dayOfMonthAnd: {
          label: this.localizationUFE.LABEL_SpecificDayOfMonth
        },
        dayOfMonthLastDay: {
          label: this.localizationUFE.LABEL_OnTheLastDayOfTheMonth
        },
        dayOfMonthLastDayWeek: {
          label: this.localizationUFE.LABEL_OnTheLastWeekdayOfTheMonth
        },
        dayOfWeekLastNTHDayWeek: {
          label1: this.localizationUFE.LABEL_OnTheLast,
          label2: this.localizationUFE.LABEL_OfTheMonth
        },
        dayOfMonthDaysBeforeEndMonth: {
          label: this.localizationUFE.LABEL_BeforeTheEndOfTheMonth
        },
        dayOfMonthNearestWeekDayOfMonth: {
          label1: this.localizationUFE.LABEL_NearestWeekday,
          label2: this.localizationUFE.LABEL_OfTheMonth
        },
        dayOfWeekNTHWeekDayOfMonth: {
          label1: this.localizationUFE.LABEL_OnThe,
          label2: this.localizationUFE.LABEL_OfTheMonth
        }
      },
      month: {
        every: {
          label: this.localizationUFE.LABEL_EveryMonth
        },
        increment: {
          label1: this.localizationUFE.LABEL_Every,
          label2: this.localizationUFE.LABEL_MonthsStartingAtMonth
        },
        and: {
          label: this.localizationUFE.LABEL_SpecificMonth
        },
        range: {
          label1: this.localizationUFE.LABEL_EveryMonthBetween,
          label2: this.localizationUFE.LABEL_AndMonth
        }
      },
      year: {
        every: {
          label: this.localizationUFE.LABEL_EveryYear
        },
        increment: {
          label1: this.localizationUFE.LABEL_Every,
          label2: this.localizationUFE.LABEL_YearsStartingAtYear
        },
        and: {
          label: this.localizationUFE.LABEL_SpecificYear
        },
        range: {
          label1: this.localizationUFE.LABEL_EveryYearBetween,
          label2: this.localizationUFE.LABEL_AndYear
        }
      }
    }
  };

  constructor(
    public list: ListService<SchedulerSettingGetListInput>,
    public service: SchedulerSettingService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService,
    private apiDefinitionService: ApiDefinitionService,
    private http: HttpClient
  ) {
    super(service, list, 'scheduler-setting');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_Schedule').subscribe(data => {
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
      name: [this.selected?.name || '', Validators.required],
      description: [this.selected?.description || ''],
      displayName: [this.selected?.displayName || ''],
      tenantId: [this.selected?.tenantId || ''],
      microService: [this.selected?.microService || '', Validators.required],
      object: [this.selected?.object || '', Validators.required],
      action: [this.selected?.action || '', Validators.required],
      api: [this.selected?.api || '', Validators.required],
      username: [this.selected?.username || ''],
      password: [ ''],
      scheduleCron: [this.selected?.scheduleCron || '0 0 0 ? * * *'],
      payload:[this.selected?.payload || ''],
      url:[this.selected?.url || ''],
      timeout:[this.selected?.timeout || 90,Validators.required],
    });

    this.form.controls['microService'].valueChanges.subscribe(() => {
      const selectedMicroservice = this.microserviceSelectList.find(x => x.name === this.form.controls['microService'].value)?.value;
      this.form.controls['url'].setValue(
      `${environment.apis[selectedMicroservice].url}/${this.form.controls['api'].value || ''}`
      );
    });

    this.form.controls['api'].valueChanges.subscribe(() => {
      const selectedMicroservice = this.microserviceSelectList.find(x => x.name === this.form.controls['microService'].value)?.value;
      this.form.controls['url'].setValue(
      `${environment.apis[selectedMicroservice].url}/${this.form.controls['api'].value || ''}`
      );
    });
  }

  add() {
    this.selected = {} as SchedulerSettingDto;
    this.resetSelectLists();
    this.buildForm();
    this.isModalVisible = true;
  }

  edit(row) {
    this.service.get(row.id).subscribe(data => {
      this.selected = data;
      this.buildForm();
      const selectedMicroservice = this.microserviceSelectList.find(x => x.name === data.microService)?.value;
      if (selectedMicroservice) {
        this.loadActions(selectedMicroservice, data.object);
      }
      this.isModalVisible = true;
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    this.modalBusy = true;
    this.form.controls['displayName'].setValue(this.form.controls['api'].value);

    const request = this.selected.id
      ? this.service.update(this.selected.id, this.form.value)
      : this.service.create(this.form.value);

    request.subscribe({
      next: () => {
        if (!this.selected.id) {
          this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
            messageLocalizationParams: [this.info, this.form.value.api],
          });
        } else {
          this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
            messageLocalizationParams: [this.info, this.selected.api],
          });
        }

        this.modalBusy = false;
        this.isModalVisible = false;
        this.form.reset();
        this.list.get();
      }
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

  viewExecutionHistory(row) {
    this.service.getExecutionHistoryByInput({
      schedulerId: row.id,
      maxResultCount: 10,
    }).subscribe(data => {
      this.executionHistorys = data;
      this.isExecutionHistoryModalVisible = true;
    });
  }

  start(row) {
    this.service.startSchedulerJobBySchedulerId(row.id).subscribe(data => {
      this.toasterService.success('::LABEL_StartedSuccessfully', '', {
        messageLocalizationParams: [this.info, data.api],
      });
      this.list.get();
    });
  }

  stop(row) {
    this.service.stopSchedulerJobBySchedulerId(row.id).subscribe(data => {
      this.toasterService.success('::LABEL_StoppedSuccessfully', '', {
        messageLocalizationParams: [this.info, data.api],
      });
      this.list.get();
    });
  }


  executeHistory(row) {
    this.service.get(row.id).subscribe(data => {
      this.selected = data;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  search(e) {
    this.list.filter = e.target.value;
  }

  onMicroserviceChange(event) {
    this.resetFormControls(['object', 'action', 'api']);
    if (event) {
      this.loadActions(event.value);
    } else {
      this.resetSelectLists();
    }
  }

  onObjectChange(selectedObject) {
    this.resetFormControls(['action', 'api']);
    if (selectedObject) {
      this.updateSelectLists(selectedObject, 'Object');
    } else {
      this.resetSelectLists(['action', 'api']);
    }
  }

  onActionChange(selectedAction) {
    if (selectedAction) {
      this.updateSelectLists(selectedAction, 'Action');
    } else {
      this.resetFormControls(['api']);
      this.updateSelectLists(this.form.controls['object'].value, 'Object');
    }
  }

  onApiChange(selectedApi) {
    if (selectedApi) {
      this.updateSelectLists(selectedApi, 'API');
    } else {
      this.resetFormControls(['action']);
      this.updateSelectLists(this.form.controls['object'].value, 'Object');
    }
  }

  private resetFormControls(controls: string[]) {
    controls.forEach(control => this.form.controls[control].setValue(''));
  }

  private resetSelectLists(exclude: string[] = []) {
    if (!exclude.includes('object')) this.objectSelectList = [];
    if (!exclude.includes('action')) this.actionSelectList = [];
    if (!exclude.includes('api')) this.apiSelectList = [];
  }

  private loadActions(microservice: ApiNames, object: string = '') {
    const filterAppModule = microservice !== ApiNames.Permission;
    this.apiDefinitionService.getControllerAction(microservice, {skipHandleError:true}, filterAppModule).subscribe(actions => {
      this.allActions = actions;
      this.updateSelectLists(object, 'Object');
    });
  }

  private updateSelectLists(selectedValue: string, type: 'Object' | 'Action' | 'API') {
    const filteredActions = this.allActions.filter(action => action[type] === selectedValue);
    if (type === 'Object') {
      this.objectSelectList = [...new Set(this.allActions.map(action => action.Object))];
      this.apiSelectList = [...new Set(filteredActions.map(action => action.API))];
      this.actionSelectList = [...new Set(filteredActions.map(action => action.Action))];
    } else if (type === 'Action') {
      this.apiSelectList = filteredActions.filter(action => action.Object === this.form.controls["object"].value).map(action => action.API);
    } else if (type === 'API') {
      this.actionSelectList = [...new Set(filteredActions.map(action => action.Action))];
    }
  }

  importDataFunc(data: any) {
    if (data.length === 0) {
      this.toasterService.info('::NoDataAvailableInDatatable');
      return;
    }
    this.service['importByEntitiesAndMode'](data, OverridingMode.Overwrite).subscribe((res) => {
      if (res.items?.length > 0) {
        this.importResult = res.items;
        this.isImportDetailsVisible = true;
      } else {
        this.toasterService.success('::LABEL_SuccessfullyImported');
      }
      if (res.items?.length !== data.length) {
        this.list.get();
      }
    });
  }

}

