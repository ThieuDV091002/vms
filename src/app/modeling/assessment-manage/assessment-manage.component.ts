import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ConfigStateService, ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { IdentityUserService } from '@abp/ng.identity/proxy';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssessmentService, AssessmentTypeService } from '@apis/ticket/assessment-management';
import { AssessmentDto, AssessmentGetListInput, AssessmentTypeDto } from '@apis/ticket/assessment-management/dtos';
import { UserService } from '@proxy/services';
import { debounceTime, Subject } from 'rxjs';
import { AppUtils } from '../utils/app.utils';
import { UserGroupService } from '@proxy';
import { UserGroupDto } from '@proxy/dtos/user-group';

@Component({
  selector: 'app-assessment-manage',
  templateUrl: './assessment-manage.component.html',
  styleUrl: './assessment-manage.component.scss',
  providers: [
      ListService,
      {
        provide: EXTENSIONS_IDENTIFIER,
        useValue: 'AssessmentManageComponent'
      }
    ]
})
export class AssessmentManageComponent {
  currentUserId: string;
  assessments: PagedResultDto<AssessmentDto> = { items: [], totalCount: 0 };
  assessmentTypes: AssessmentTypeDto[] = [];
  quickFilters = {'assessmentType': [], 'ownerType': []};
  selected: AssessmentDto;
  isModalVisible: boolean;
  info: string;
  form: FormGroup;
  dataTierTypes = ['Area', 'Cell'];
  // isPerformModalVisible = false;
  areas: any[] = [];
  cells: any[] = [];
  userSearchInput$ = new Subject<string | null>();
  debounceTime = 500;
  users: any[] = [];
  defaultUsers: any[] = [];
  userGroups: UserGroupDto[] = [];
  currentTenantId: string;
  selectedDataTier = {type: '', id: ''};
  advancedFilter = {
    assessmentType: '',
    owner: '',
    userGroup: '',
    startDate: '',
    endDate: '',
  }
  minDate = new Date('2024-01-01');
  maxDate = new Date('2050-12-31');
  constructor(
    private assessmentService: AssessmentService,
    private configService: ConfigStateService,
    private fb : FormBuilder,
    public list: ListService<AssessmentGetListInput>,
    private assessmentTypeService: AssessmentTypeService,
    private confirmationService: ConfirmationService,
    private toasterService: ToasterService,
    private localizationService: LocalizationService,
    private userService: UserService,
    private identityUserService: IdentityUserService,
    private userGroupService: UserGroupService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUserId = this.configService.getOne('currentUser')?.id;
    this.currentTenantId = this.configService.getOne('currentTenant')?.id;
  }

  ngOnInit(): void {
    this.getAssignedDataTiers();
    this.getAssessmentTypes();
    this.registSearchDebounce();
    this.localizationService.get('::LABEL_Assessment').subscribe(data => {
      this.info = data;
    });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => this.assessmentService.getList({
        ...query,
        userId: this.currentUserId,
        ownerId: this.advancedFilter?.owner || null,
        assessmentTypeIds: this.advancedFilter?.assessmentType ? [this.advancedFilter?.assessmentType] : this.quickFilters['assessmentType'],
        // if quickFilters select both isowner and isteammember, then isowner and isteammember should set null
        isOwner: this.quickFilters['ownerType'].length ===1 && this.quickFilters['ownerType'].includes('Owner') || null,
        isTeamMember: this.quickFilters['ownerType'].length ===1 && this.quickFilters['ownerType'].includes('Team Member') || null,
        maxResultCount: 10,
        dataTierType: this.selectedDataTier.type,
        dataTierId: this.selectedDataTier.id,
        userGroupId: this.advancedFilter?.userGroup || null,
        assessmentDateStart: this.advancedFilter?.startDate ? new Date(`${this.advancedFilter?.startDate}T00:00:00`).toISOString() : null,
        assessmentDateEnd: this.advancedFilter?.endDate? new Date(`${this.advancedFilter?.endDate}T00:00:00`).toISOString() : null,
        sorting: "assessmentdate asc"
      }))
      .subscribe(res => {
        this.assessments = res;
      });
  }

  getAssessmentTypes() {
    if (this.assessmentTypes.length === 0) {
      this.assessmentTypeService.getList({maxResultCount: 100}).subscribe((response) => {
        this.assessmentTypes = response.items.filter(x => x.activeRevision && x.globalActiveRevision);
      });
    }
  }

  // closeAssessmentCard() {
  //   this.isPerformModalVisible = false;
  //   this.list.get();
  // }

  getUserGroups() {
    if (this.userGroups.length === 0) {
      this.userGroupService.getAllInstances().subscribe(res => {
        this.userGroups = res;
      });
    }
  }

  search() {
    // clear quick filters
    this.quickFilters['assessmentType'] = [];
    this.quickFilters['ownerType'] = [];
    this.list.get();
  }

  clearAdvancedFilter() {
    this.advancedFilter = {
      assessmentType: '',
      owner: '',
      userGroup: '',
      startDate: '',
      endDate: '',
    };
  }

  getAssignedDataTiers() {
    this.userService.getTreeviewDataTiersByUser(this.currentUserId).subscribe(res => {
      if (res && res.assignedDataTiers.length > 0) {
        // this.userDataTier = res;
        this.areas = res.assignedDataTiers
          .filter(d => d.areaId)
          .map(d => ({ id: d.areaId, type: 'Area', name: d.areaName }))
          .filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.id === value.id && t.name === value.name
            ))
          )
          .sort((a, b) => a.name?.localeCompare(b.name));
        this.cells = res.assignedDataTiers
          .filter(d => d.cellId)
          .map(d => ({ id: d.cellId, type: 'Cell', name: d.cellName }))
          .filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.id === value.id && t.name === value.name
            ))
          )
          .sort((a, b) => a.name?.localeCompare(b.name));
      }
      // call it when userDataTier ready, void extra request when userDataTier not ready
      setTimeout(() => {
        this.hookToQuery();
      }, 50)
    })
  }

  dataTierChange(event: any): void {
    if (event.cell) {
      this.selectedDataTier.type = event.cell?.type;
      this.selectedDataTier.id = event.cell?.id;
    } else if (event.area) {
      this.selectedDataTier.type = event.area?.type;
      this.selectedDataTier.id = event.area?.id;
    } else {
      this.selectedDataTier.type = '';
      this.selectedDataTier.id = '';
    }
    this.list.get();
  }

  onDataTierTypeChange(event: any): void {
    // clear dataTierId when dataTierType change
    this.form.patchValue({ dataTierId: '' });
  }

  getDataTiers() {
    const dataTierType = this.form.get('dataTierType').value;
    if (dataTierType === 'Area') {
      return this.areas;
    } else if (dataTierType === 'Cell') {
      return this.cells;
    } else {
      return;
    }
  }

  quickFilterActive(type, value) {
    return this.quickFilters[type].includes(value);
  }

  filterCard(type, value) {
    // clear advanced filters
    this.advancedFilter = {
      assessmentType: '',
      owner: '',
      userGroup: '',
      startDate: '',
      endDate: '',
    };
    if (this.quickFilters[type].includes(value)) {
      this.quickFilters[type] = this.quickFilters[type].filter(item => item !== value);
    } else {
      this.quickFilters[type].push(value);
    }
    this.list.get();
  }

  buildForm() {
    let assessmentTimeValue = null;
    if (this.selected?.assessmentTime) {

      const [hours, minutes] = this.selected.assessmentTime.split(':').map(Number);
    assessmentTimeValue = new Date();
    assessmentTimeValue.setHours(hours);
    assessmentTimeValue.setMinutes(minutes);
    assessmentTimeValue.setSeconds(0);
    }
    this.form = this.fb.group({
      typeId: [this.selected?.typeId || '', Validators.required],
      dataTierType: [this.selected?.dataTierType || ' ', Validators.required],
      dataTierId: [this.selected?.dataTierId || ' ', Validators.required],
      ownerId: [this.selected?.ownerId || '', Validators.required],
      userGroupId: [this.selected?.userGroupId || ''],
      assessmentDate: [this.selected?.assessmentDate ? new Date(this.selected.assessmentDate.split('T')[0]) : '', Validators.required],
      assessmentTime: [assessmentTimeValue, Validators.required],
      tenantId: [this.selected?.tenantId || this.currentTenantId || ''],
      assessmentDuration: [this.selected?.assessmentDuration || 1],
      name: [this.selected?.name || ''],
      schedulingRuleId: [this.selected?.schedulingRuleId || ''],
      status: [this.selected?.status || ''],
    });
    
    this.form.get('assessmentDate').valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  getUsers(userSearchItem = ''): void {
    if (userSearchItem === '' && this.defaultUsers.length > 0) {
      this.users = this.defaultUsers;
      return;
    }
    this.identityUserService.getList({ filter: userSearchItem, maxResultCount: 10 }).subscribe((res) => {
      this.users = res.items;
      if (userSearchItem === '') {
        this.defaultUsers = res.items;
      }
    });
  }

  getUserDisplayName(user: any) {
      return AppUtils.getUserDisplayName(user);
  }

  formatTime(time: string): string {
    // HH:mm:ss to HH:mm AM/PM
    const [hour, minute, second] = time.split(':');
    const ampm = +hour >= 12 ? 'PM' : 'AM';
    const formattedHour = +hour % 12 || 12; // Convert to 12-hour format
    const formattedMinute = minute.padStart(2, '0');
    return `${formattedHour}:${formattedMinute} ${ampm}`;
  }

  getFormattedDateTime(): string {
    const dateValue = this.form?.get('assessmentDate')?.value;
    if (!dateValue) return '';
    
    const [year, month, day] = dateValue.split('-').map(Number);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(day).padStart(2, '0')} ${months[month-1]} ${year}`;
  }

  private formatDate(date: Date, format: string): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  add() {
    this.getUserGroups();
    this.getUsers();
    this.selected = {} as AssessmentDto;
    this.buildForm();
    if (this.users.length === 1) {
      this.getUsers();
    }
    this.isModalVisible = true;
  }

  registSearchDebounce() {
      // user input search input debounce
      this.userSearchInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
          this.getUsers(searchItem);
      })
  }

  // perform(row) {
  //   this.selected = row;
  //   this.isPerformModalVisible = true;
  // }

  save() {
    if (this.form.invalid) {
      return;
    }

    const dateValue = this.form.value.assessmentDate;
    const timeValue = this.form.value.assessmentTime;
    const assessmentDateStr = dateValue; 
    
    let hours = 0, minutes = 0;
    if (timeValue instanceof Date) {
      hours = timeValue.getHours();
      minutes = timeValue.getMinutes();
    } else if (typeof timeValue === 'string') {
      const [h, m] = timeValue.split(':').map(Number);
      hours = h;
      minutes = m;
    }
    
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

    const request = this.selected.id
      ? this.assessmentService.update(this.selected.id, {
        ...this.form.value,
        assessmentDate: assessmentDateStr, 
        assessmentTime: timeStr,
        name: this.generateAssessmentName()
      })
      : this.assessmentService.create({
        ...this.form.value,
        assessmentDate: assessmentDateStr, 
        assessmentTime: timeStr,
        name: this.generateAssessmentName(),
      });
    request.subscribe((res) => {
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully','',{
          messageLocalizationParams: [this.info,res.name],
        });
      }
      else{
        this.toasterService.success('::LABEL_UpdatedSuccessfully','',{
          messageLocalizationParams: [this.info,res.name],
        });
      }
      this.isModalVisible = false;
      this.form.reset();
      this.list.get();
    });
  }

  generateAssessmentName() {
    const typeName = this.assessmentTypes.find(t => t.id === this.form.value.typeId)?.displayName;
    const dataTierName = [...this.areas, ...this.cells].find(t => t.id === this.form.value.dataTierId)?.name;
    return `${typeName}-${this.form.value.dataTierType}-${dataTierName}-${this.form.value.assessmentDate}`;
  }

  edit(row) {
    this.getUserGroups();
    this.assessmentService.get(row.id).subscribe((response) => {
      this.selected = response;
      const user = this.users.find(u => u.id === response.ownerId);
      if (user) {
        this.users = [user];
      } else {
        this.getUserById(response.ownerId);
      }
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  getUserById(id: string) {
    this.identityUserService.get(id).subscribe((res) => {
      this.users = [res];
    });
  }

  delete(row) {
    this.confirmationService
        .warn('::LABEL_DeletionConfirmationMessage', '', {
          messageLocalizationParams: [this.info,row.name],
        })
        .subscribe(status => {
          if (status === Confirmation.Status.confirm) {
            this.assessmentService.delete(row.id).subscribe(() => {
              this.toasterService.success('::LABEL_SuccessfullyDeleted','',{
                messageLocalizationParams: [this.info,row.name],
              });
              this.list.get();
            });
          }
        });
  }
}
