import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ConfigStateService, ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentPICMatrixDto } from '@apis/vms/dtos/department-pic';
import { DomesticGuestDto, DomesticGuestGetListDto } from '@apis/vms/dtos/domestic-guest';
import { DepartmentPICService } from '@apis/vms/services';
import { DomesticGuestService } from '@apis/vms/services/domestic-guest.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-domestic-guest',
  templateUrl: './domestic-guest.component.html',
  styleUrl: './domestic-guest.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'DomesticGuestManageComponent'
    }
  ]
})
export class DomesticGuestComponent {
  currentUserId: string;
  domesticGuests: PagedResultDto<DomesticGuestDto> = { items: [], totalCount: 0 };
  departments: DepartmentPICMatrixDto[] = [];
  quickFilters = {};
  selected: DomesticGuestDto;
  isModalVisible: boolean;
  info: string;
  form: FormGroup;
  userSearchInput$ = new Subject<string | null>();
  debounceTime = 500;
  users: any[] = [];
  currentTenantId: string;
  advancedFilter = {
    fullName: '',
    company: '',
    department: '',
    workDate: null as Date | null,
  }
  minDate = new Date('2024-01-01');
  maxDate = new Date('2050-12-31');

  constructor(
    private domesticGuestService: DomesticGuestService,
    private configService: ConfigStateService,
    private fb: FormBuilder,
    public list: ListService<DomesticGuestGetListDto>,
    private confirmationService: ConfirmationService,
    private toasterService: ToasterService,
    private localizationService: LocalizationService,
    private departmentService: DepartmentPICService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUserId = this.configService.getOne('currentUser')?.id;
    this.currentTenantId = this.configService.getOne('currentTenant')?.id;
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.hookToQuery();
    this.localizationService.get('::LABEL_DomesticGuest').subscribe(data => {
      this.info = data;
    });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => this.domesticGuestService.getList({
        ...query,
        fullName: this.advancedFilter?.fullName || null,
        company: this.advancedFilter?.company || null,
        department: this.advancedFilter?.department || null,
        workDate: this.advancedFilter.workDate 
        ? this.formatDateToYYYYMMDD(this.advancedFilter.workDate)
        : null,
        maxResultCount: 10,
        sorting: "workDate asc"
      }))
      .subscribe(res => {
        this.domesticGuests = res;
      });
  }

  private formatDateToYYYYMMDD(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDepartment(value: string): string {
    return value
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  loadDepartments() {
    this.departmentService
      .getList({ name: '', sorting: '', skipCount: 0, maxResultCount: 100 })
      .subscribe(res => (this.departments = res.items));
  }

  search() {
    this.list.get();
  }

  clearAdvancedFilter() {
    this.advancedFilter = {
      fullName: '',
      company: '',
      department: '',
      workDate: null,
    };
    this.list.get();
  }

  buildForm() {
    this.form = this.fb.group({
      fullName: this.selected?.fullName || '',
      company: this.selected?.company || '',
      department: this.selected?.department || '',
      purpose: this.selected?.purpose || '',
      workDate: this.selected?.workDate
        ? new Date(`${this.advancedFilter?.workDate}T00:00:00`).toISOString().split('T')[0]
        : null,
      tenantId: [this.selected?.tenantId || this.currentTenantId || ''],
    });

    this.form.get('workDate').valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });
  }
}
