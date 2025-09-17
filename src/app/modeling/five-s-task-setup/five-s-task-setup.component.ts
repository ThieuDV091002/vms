import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ConfigStateService, ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserGroupUsersDto } from '@proxy/dtos/user-group';
import { IdentityUserDto, IdentityUserService } from '@abp/ng.identity/proxy';
import { UserService } from '@proxy/services';
import { debounceTime, finalize, Subject } from 'rxjs';
import { LocalizationService } from '@abp/ng.core';
import { ShiftPatternService, ShiftService } from '@apis/general';
import { ShiftDto } from '@apis/general/dtos';
import { CronLocalization, Tab } from '@sbzen/ng-cron';
import { StandardService } from '@apis/general/services/widget';
import { AppUtils } from '../utils/app.utils';
import { ToDoListSetupService, ToDoTypeService } from '@apis/ticket/to-do-setups';
import { CreateUpdateToDoListSetupDto, ToDoListSetupDto, ToDoListSetupGetListInput, ToDoTypeDto, CreateUpdateToDoListSetupDetailDto, CreateUpdateToDoListSetupShiftDto} from '@apis/ticket/to-do-setups/dtos';
import { ModelingBase } from '../modeling-base';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-five-s-task-setup',
  templateUrl: './five-s-task-setup.component.html',
  styleUrl: './five-s-task-setup.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'FiveSTaskSetupComponent',
    },
  ],
})
export class FiveSTaskSetupComponent extends ModelingBase<ToDoListSetupService, ToDoListSetupGetListInput, CreateUpdateToDoListSetupDto> implements OnInit {
  data: PagedResultDto<ToDoListSetupDto> = { items: [], totalCount: 0 };
  isModalVisible = false;
  modalBusy = false;
  form: FormGroup;
  selected: ToDoListSetupDto;
  isCollapse = false;
  statement = true;
  scopeOptions = [
    { label: '::Site', value: 'Site' },
    { label: '::Area', value: 'Area' },
    { label: '::Cell', value: 'Cell' }
  ];
  assigneeList = [
    // { userId: undefined, expiryDateTime: new Date('2099/12/31 00:00'), dataTierType: undefined, dataTier: undefined }
  ];
  toDoList = [
    // { toDo: undefined, standards: [], links: [] }
  ];
  users: IdentityUserDto[] | UserGroupUsersDto[] = [];
  userSearchInput$ = new Subject<string | null>();
  debounceTime = 500;
  linksOptions = [];
  linkName = '';
  linkUrl = '';
  shiftData: ShiftDto[] = [];
  readonly tabs = [Tab.DAY];
  activeTab = Tab.DAY;
  standardsData = [];
  dataTierTreeNode: any[] = [];
  info: string;
  toDoTypesData: ToDoTypeDto[] = [];
  localizationUFE: any = this.localizationService.getResource('UFE');
  today: Date = new Date();

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
      }
    },
    quartz: {
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
      }
    }
  };


  constructor(private fb: FormBuilder,
    private userService: UserService,
    private identityUserService: IdentityUserService,
    private localizationService: LocalizationService,
    private shiftService: ShiftService,
    private standardService: StandardService,
    public list: ListService<ToDoListSetupGetListInput>,
    public service: ToDoListSetupService,
    private confirmation: ConfirmationService,
    public toDoTypeService: ToDoTypeService,
    private shiftPatternService: ShiftPatternService,
    private datePipe: DatePipe,
    private configStateService: ConfigStateService
  ) {
    super(service, list, 'to-do-list-setup');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.getDataTiers();
    this.registSearchDebounce();
    this.localizationService.get('::LABEL_ToDoSetup').subscribe(data => {
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

  hasAssignedDataTiers() {
    return AppUtils.hasCheckedDataTier(this.dataTierTreeNode);
  }

  initDataTierTree() {
    // set all checked to false
    this.dataTierTreeNode.forEach(area => {
      area.checked = false;
      area.children.forEach(cell => {
        cell.checked = false;
      });
    });
  }

  setDataTierTree(assignedDataTiers) {
    // set checked true, if cell in assigned list
    this.initDataTierTree();
    this.dataTierTreeNode.forEach(area => {
      area.children.forEach(cell => {
        cell.checked = assignedDataTiers.some(d => d.dataTierId === cell.id);
      });
    });
  }

  registSearchDebounce() {
    // user input search input debounce
    this.userSearchInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.getUsers(searchItem);
      })
  }

  getDataTiers() {
    this.userService.getTreeviewDataTiersByUser(this.configStateService.getOne('currentUser').id).subscribe(res => {
      if (res && res.assignedDataTiers.length > 0) {
        const areaData = res.assignedDataTiers
          .filter(d => d.areaId)
          .map(d => ({ id: d.areaId, name: d.areaName, type: 'Area', children: [], checked: false }))
          .filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.id === value.id && t.name === value.name
            ))
          );

        const cellData = res.assignedDataTiers.filter(d => d.cellId && d.cellName)
          .map(d => ({ id: d.cellId, name: d.cellName, type: 'Cell', areaId: d.areaId, checked: false }))
          .filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.id === value.id && t.name === value.name
            ))
          );
        // generate area/cell treenode
        areaData.forEach(area => {
          area.children = cellData
            .filter(d => d.areaId === area.id)
        });

        this.dataTierTreeNode = areaData.filter(area => area.children && area.children.length > 0);
      }
    })
  }

  getStandards() {
    this.standardService.getList({
      userId: this.configService.getOne('currentUser').id,
      dataTierList: AppUtils.getCheckedTreeData(this.dataTierTreeNode),
      categoryIds: [],
      maxResultCount: 1000
    }).subscribe(res => {
      this.standardsData = res.items.map(item => ({
        id: item.id,
        name: item.name
      }));
    });
  }

  getShifts() {
    this.shiftService.getAllInstances().subscribe((res) => {
      this.shiftData = res;
    });
  }

  getUsers(userSearchItem = ''): void {
    this.identityUserService.getList({ filter: userSearchItem, maxResultCount: 10 }).subscribe((res) => {
      this.users = res.items;
    });
  }

  getToDoTypes() {
    this.toDoTypeService.getAllInstances().subscribe((res) => {
      this.toDoTypesData = res;
    });
  }

  add() {
    this.getUsers();
    if (this.shiftData.length === 0 || this.standardsData.length === 0 || this.toDoTypesData.length === 0) {
      this.getShifts();
      this.getStandards();
      this.getToDoTypes();
    }
    this.selected = {} as ToDoListSetupDto;
    this.linksOptions = [];
    this.assigneeList = [];
    this.toDoList = [];
    this.initDataTierTree();
    this.buildForm();
    this.isModalVisible = true;
    this.filterDataTierByShift([]);
  }

  edit(row: any) {
    this.getUsers();
    if (this.shiftData.length === 0 || this.standardsData.length === 0 || this.toDoTypesData.length === 0) {
      this.getShifts();
      this.getStandards();
      this.getToDoTypes();
    }
    this.service.get(row.id).subscribe(setup => {
      this.linksOptions = [];
      this.assigneeList = [];
      this.toDoList = [];
      this.selected = setup;
      this.buildForm();
      this.isModalVisible = true;
      const selectedShifts = setup.toDoListSetupShifts?.map(s => s.shiftId) || [];
      this.filterDataTierByShift(selectedShifts);
    });
  }

  deleteData(e: any) {
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
    if (this.form.invalid || this.modalBusy || this.checkToDolist() || !this.hasAssignedDataTiers()) {
      return;
    }
    const formData = this.form.value;
    const requestBody: CreateUpdateToDoListSetupDto = {
      name: formData.name,
      displayName: formData.displayName,
      description: formData.description,
      tenantId: formData.tenantId,
      toDoTypeId: formData.toDoTypeId,
      toDoTypeName: this.toDoTypesData.find(c => c.id === formData.toDoTypeId)?.name,
      scope: formData.scope,
      toDoListSetupShifts: formData.shift.map(shift => {
        const existingShift = this.selected?.toDoListSetupShifts?.find(s => s.shiftId === shift);
        return existingShift ? {
          id: existingShift.id,
          parentId: existingShift.parentId,
          shiftId: shift
        } : { shiftId: shift } as CreateUpdateToDoListSetupShiftDto;
      }),
      scheduleCompletionDate: this.datePipe.transform(formData.scheduleCompletionDate, 'yyyy-MM-dd'),
      scheduleStartDate: this.datePipe.transform(formData.scheduleStartDate, 'yyyy-MM-dd'),
      scheduleCronExpression: formData.scheduleCronExpression,
      toDoListSetupDetails: this.toDoList.map((item, index) => {
        return {
          id: item.id,
          parentId: item.parentId,
          toDoTask: item.toDo,
          order: index,
          toDoListSetupStandards: item.standards.map(stansard => { return { standardId: stansard, standardName: this.standardsData.find(x => x.id === stansard)?.name } }),
          toDoListSetupLinks: item.links.map(link => { return { url: link, displayName: this.linksOptions.find(x => x.value === link)?.label } })
        } as CreateUpdateToDoListSetupDetailDto
      }),
      extraProperties: {},
      toDoListSetupUsers: this.assigneeList.filter(item => ![null, undefined, ''].includes(item.userId)).length > 0 ?
        this.assigneeList.map(item => {
          if (item?.userId) {
            return {
              id: item.id,
              parentId: item.parentId,
              userId: item?.userId,
              expiryTime: item.expiryDateTime ? new Date(item.expiryDateTime).toISOString() : '',
            }
          }
        }) :
        [],
      toDoListSetupDataTiers: AppUtils.getCheckedTreeData(this.dataTierTreeNode).filter(d => d.type === 'Cell').map(d => {
        const existingTier = this.selected?.toDoListSetupDataTiers?.find(t => t.dataTierId === d.id);
        return existingTier ? {
          id: existingTier.id,
          parentId: existingTier.parentId,
          dataTierType: d.type,
          dataTierId: d.id
        } : {
          dataTierType: d.type,
          dataTierId: d.id
        };
      })
    }

    this.modalBusy = true;
    const request = this.selected.id
      ? this.service.update(this.selected.id, requestBody)
      : this.service.create(requestBody);
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

  buildForm(): void {
    const defaultStartDate = this.selected?.id 
    ? (this.selected.scheduleStartDate ? new Date(this.selected.scheduleStartDate) : null) 
    : new Date(); 
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      toDoTypeId: [this.selected.toDoTypeId || '', Validators.required],
      toDoTypeName: [this.toDoTypesData.find(c => c.id === this.selected?.toDoTypeId)?.name || ''],
      scope: ['Cell', Validators.required], // Hide the Scope from the UI. Default to Cell
      shift: [this.selected.toDoListSetupShifts?.map(item => item.shiftId), Validators.required],
      scheduleCompletionDate: [this.selected.scheduleCompletionDate ? new Date(this.selected.scheduleCompletionDate) : ''],
      scheduleStartDate: [defaultStartDate, Validators.required],
      scheduleCronExpression: [this.selected.scheduleCronExpression || '0 0 0 ? * * *'],
      toDoListSetupDetails: [undefined],
      toDoListSetupUsers: [undefined],
      toDoListSetupDataTiers: [undefined],
      tenantId: [this.selected.tenantId || '']
    });
    if (this.selected?.id) {
      const linksSet = new Set();
      this.toDoList = this.selected.toDoListSetupDetails.sort((a, b) => a.order - b.order).map(x => {
        x.toDoListSetupLinks.forEach(link => {
          const linkKey = `${link.displayName}-${link.url}`;
          if (!linksSet.has(linkKey)) {
            linksSet.add(linkKey);
            this.linksOptions.push({ label: link.displayName, value: link.url });
          }
        });
        return {
          id: x.id,
          parentId: x.parentId,
          order: x.order,
          toDo: x.toDoTask,
          standards: x.toDoListSetupStandards.map(s => s.standardId),
          links: x.toDoListSetupLinks.map(l => l.url)
        }
      });

      this.assigneeList = this.selected.toDoListSetupUsers.map(user => {
        if (!this.users.find(u => u.id === user.userId)) {
          this.identityUserService.get(user.userId).subscribe((res) => {
            this.users = [...this.users, res];
          });
        }
        return {
          id: user.id,
          parentId: user.parentId,
          userId: user.userId, expiryDateTime: AppUtils.getLocalDate(user.expiryTime), dataTierType: user.dataTierType, dataTier: user.dataTierName
        }
      });

      this.setDataTierTree(this.selected.toDoListSetupDataTiers)
    }
  }

  create(type) {
    if (type === 'toDo') {
      if (this.checkToDolist()) {
        return;
      }
      this.toDoList = [...this.toDoList, {
        toDo: undefined,
        standards: [],
        links: []
      }];
    } else {
      if (this.checkAssignlist()) {
        return;
      }
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      this.assigneeList = [...this.assigneeList, {
        userId: undefined,
        expiryDateTime: expiryDate,
        dataTierType: undefined,
        dataTier: undefined
      }];
    }
  }

  addLinkOptions() {
    const existingOption = this.linksOptions.find(option => option.label === this.linkName);
    if (existingOption) {
      return;
    }
    this.linksOptions = [...this.linksOptions, {
      label: this.linkName,
      value: this.linkUrl
    }];
    this.linkName = '';
    this.linkUrl = '';
  }

  multipleSelectedChanges(event, row, type) {
    if (type === 'standards') {
      if (event.length === 0) {
        row.standards = [];
      } else {
        row.standards = event.map(item => { return item.id });
      }
    }
  }

  selectedChanges(event) {
    if (event.length > 0) {
      this.form.controls['shift'].setValue(event.map(e => e.id));
      this.filterDataTierByShift(event.map(e => e.id));
    } else {
      this.form.controls['shift'].setValue([]);
      this.filterDataTierByShift([]);
    }
  }

  delete(index, type) {
    if (type === 'toDo') {
      if (index > -1 && index < this.toDoList.length) {
        this.toDoList.splice(index, 1);
        this.toDoList = [...this.toDoList];
      }
    } else {
      if (index > -1 && index < this.assigneeList.length) {
        this.assigneeList.splice(index, 1);
        this.assigneeList = [...this.assigneeList];
      }
    }
  }

  checkToDolist() {
    return this.toDoList.length === 0 ? false : this.toDoList.some(item => ['', null, undefined].includes(item.toDo))
  }

  checkAssignlist() {
    return this.assigneeList.length === 0 ? false : this.assigneeList.some(item => ['', null, undefined].includes(item.userId))
  }

  getUserDisplayName(user: any) {
    return AppUtils.getUserDisplayName(user);
  }

  copyModalOpen(event: any) {
    if (this.toDoTypesData.length === 0) {
      this.getToDoTypes();
    }
  }

  copy(e) {
    this.service.get(e.data.id).subscribe((setup: any) => {
      const requestBody: any = {
        name: e.data.name,
        displayName: e.data.displayName,
        description: setup.description,
        tenantId: setup.tenantId,
        toDoTypeId: setup.toDoTypeId,
        toDoTypeName: this.toDoTypesData.find(c => c.id === setup.toDoTypeId)?.name,
        scope: setup.scope,
        toDoListSetupShifts: setup.toDoListSetupShifts.map(shift => { return { shiftId: shift.shiftId } }),
        scheduleCompletionDate: this.datePipe.transform(setup.scheduleCompletionDate, 'yyyy-MM-dd'),
        scheduleCronExpression: setup.scheduleCronExpression,
        toDoListSetupDetails: setup.toDoListSetupDetails.map(item => {
          return {
            toDoTask: item.toDoTask,
            toDoListSetupStandards: item.toDoListSetupStandards.map(stansard => { return { standardId: stansard.standardId, standardName: stansard.standardName } }),
            toDoListSetupLinks: item.toDoListSetupLinks.map(link => { return { url: link.url, displayName: link.displayName } })
          }
        }),
        toDoListSetupUsers: setup.toDoListSetupUsers.map(item => {
          return {
            userId: item.userId,
            expiryTime: item.expiryTime ? item.expiryTime : '',
          }
        }),
        toDoListSetupDataTiers: setup.toDoListSetupDataTiers.map(d => ({ dataTierType: d.dataTierType, dataTierId: d.dataTierId }))
      }

      this.service['create'](requestBody).subscribe(res => {
        this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
          messageLocalizationParams: [this.info, e.data.name],
        });
        this.list.get();
        this.edit(res);
      });
    })
  }

  importData(e) {
    e.data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (item[key] !== null && typeof (item[key]) !== 'object') {
          item[key] = item[key].toString();
        }
      });

      item.ToDoListSetupDetails.forEach(detail => {
        detail.ToDoListSetupStandards.forEach(standard => {
          if (!standard.StandardId) {
            standard['StandardId'] = this.standardsData.find(x => x.name === standard.StandardName)?.id;
          }
        });
      });
    });

    this.import(e);
  }

  selectUser(event: any, row: any) {
    const isDuplicate = this.assigneeList.some(item => item.userId === event && item !== row);
    if (isDuplicate) {
      setTimeout(() => {
        this.assigneeList = this.assigneeList.map(item => {
          if (item === row) {
            item.userId = undefined;
          }
          return item;
        });
      }, 0);
      this.toasterService.error('::UserAlreadySelected');
    }
  }

  generateToDoList(event) {
    this.service.generateTasksBySetupIdByIdAndStartDateAndEndDate(event.id, '', '').subscribe(data => {
      this.toasterService.success(data.message, '', {
        messageLocalizationParams: [this.info, event.name]
      });
    });
  }

  filterDataTierByShift(shifts: string[]) {
    if (!shifts || shifts.length === 0) {
      this.dataTierTreeNode.forEach(area => {
        area.disabled = true;
        area.expanded = false;
        area.children.forEach(cell => cell.disabled = true);
      });
      this.statement = true;
      return;
    }
    this.shiftPatternService.getDataTierListByShiftsByShifts(shifts).subscribe(cellList => {
      const allowedCellIds = cellList;
      this.dataTierTreeNode.forEach(area => {
        let allCellsDisabled = true;
        let hasDisabledCell = false;
        area.children.forEach(cell => {
          cell.disabled = !allowedCellIds.includes(cell.id);
          if (!cell.disabled) {
            allCellsDisabled = false;
          } else {
            hasDisabledCell = true;
          }
        });
        area.disabled = allCellsDisabled;
        if (!allCellsDisabled && hasDisabledCell) {
          area.expanded = true;
        } 
        else {
          area.expanded = false;
        }
      });
      this.statement = !this.dataTierTreeNode.every(area => area.disabled === false);
    });
  }
}
