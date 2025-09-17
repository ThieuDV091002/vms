import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ConfigStateService, ListService, PagedResultDto, PermissionService } from '@abp/ng.core';
import { IdentityUserService } from '@abp/ng.identity/proxy';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { finalize, Subject, Subscription } from 'rxjs';
import { AppUtils } from 'src/app/modeling/utils/app.utils';
import { PlatformService } from '../../services/platform.service';
import { LocalizationService } from '@abp/ng.core';
import { JobFunctionDto, SupportShiftDto, SupportTeamDto, SupportTeamGetListInput } from '@apis/general/support-teams/dtos';
import { JobFunctionService, SupportShiftService, SupportTeamService } from '@apis/general/support-teams';
@Component({
  selector: 'app-support-team-page',
  templateUrl: './support-team-page.component.html',
  styleUrl: './support-team-page.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'SupportTeamWidgetComponent',
    },
  ],
})
export class SupportTeamPageComponent implements OnInit, OnChanges {
  protected list = inject(ListService<SupportTeamGetListInput>);
  protected readonly jobFunctionlService = inject(JobFunctionService);
  protected readonly supportShiftService = inject(SupportShiftService);
  protected readonly userService = inject(IdentityUserService);
  protected service = inject(SupportTeamService);

  @Input() dataTierTreeNode;
  @Input() selectedDataTier;
  @Input() isWidget;
  @Input() widget = { name: '', extraProperties: { pageSize: 10 } };
  @ViewChild('myTable') table: DatatableComponent;
  data: PagedResultDto<any> = { totalCount: 0, items: [] };
  userSelectOptions = [];
  jobFunctionData: JobFunctionDto[];
  supportShiftData: SupportShiftDto[];
  form: FormGroup;
  isModalVisible = false;
  isCollapse = false;
  modalBusy = false;
  selected: any;
  pageSize = 10;
  cellColumns = [];
  hasAccessCellColumns = [];
  subscription: Subscription;
  userSubscription: Subscription;
  searchKeyword = '';
  isWeb = this.platformService.isWeb();
  supportTeamDataTierTreeNode: any;
  input$ = new Subject<string | null>();
  info: string;
  selectedUser: any;
  jobFunctionColorMap: any = {};

  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private toasterService: ToasterService,
    private readonly platformService: PlatformService,
    private localizationService: LocalizationService,
    private permissionService: PermissionService,
    private configStateService: ConfigStateService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const selectedDataTier = changes.selectedDataTier?.currentValue;
    if (selectedDataTier || changes.widget) {
      this.pageSize = this.widget.extraProperties?.pageSize;
      if (selectedDataTier) {
        this.cellColumns = [];
        if (selectedDataTier.cell) {
          this.cellColumns.push(selectedDataTier.cell);
        } else {
          if (selectedDataTier.area) {
            this.supportTeamDataTierTreeNode.find(d => d.id === selectedDataTier.area.id)?.children.forEach(item => {
              if (!item.disabled) {
                this.cellColumns.push(item);
              }
            });
          } else {
            this.cellColumns = this.hasAccessCellColumns;
          }
        }
      }
      this.hookToQuery();
    }

    if (changes.dataTierTreeNode?.currentValue) {
      this.hasAccessCellColumns = [];
      this.supportTeamDataTierTreeNode = JSON.parse(JSON.stringify(this.dataTierTreeNode)).map(
        item => {
          item.children.map(subItem => {
            const isValidCell = !subItem.disabled || (subItem.children?.length > 0 &&
              subItem.children.some(workcenter => !workcenter.disabled));
            if (isValidCell && !this.hasAccessCellColumns.find(existing => existing.id === subItem.id)) {
              this.hasAccessCellColumns.push(subItem);
            }
            subItem.disabled = !isValidCell;
            delete subItem.children;
            return subItem;
          });
          if (item.children.some(subItem => !subItem.disabled)) {
            return item;
          }
          return null;
        }
      ).filter(item => item !== null);
      if (this.cellColumns.length === 0) {
        this.cellColumns = this.hasAccessCellColumns;
      }
    }
    this.cellColumns.sort((a, b) => a.name.localeCompare(b.name));
  }

  ngOnInit(): void {
    if (!this.isWidget) {
      this.hookToQuery();
    }
    this.getJobFunction();
    this.getSupportShift();
    this.getUser();
    this.input$.subscribe(newTerm => {
      this.getUser(newTerm);
    });
    this.localizationService.get('::LABEL_SupportTeam').subscribe(data => {
      this.info = data
    });
  }

  hookToQuery() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    setTimeout(() => {
      this.table.limit = this.pageSize;
    }, 0);
    this.subscription = this.list
      .hookToQuery(query => {
        return this.service.getSupportTeamViewList({
          ...query,
          userId: this.configStateService.getOne('currentUser').id,
          skipCount: this.table.offset * this.pageSize,
          maxResultCount: this.pageSize,
          keyword: this.searchKeyword,
          areaId: this.selectedDataTier?.area?.id,
          cellId: this.selectedDataTier?.cell?.id,
        },
          { skipHandleError: true });
      })
      .subscribe(res => {
        this.data = res;
        this.caclulateJobFunctionState();
      });
  }

  getUser(userName?) {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    this.userSubscription = this.userService
      .getList({ filter: userName, maxResultCount: 10 })
      .subscribe(res => {
        this.userSelectOptions = [];
        res.items.forEach(user => {
          if (user.userName !== null) {
            this.userSelectOptions.push({
              id: user.id,
              name: user.name,
              surname: user.surname,
              userName: user.userName,
              email: user.email,
              phone: user.phoneNumber,
            });
          }
        });
      });
  }

  getUserDisplayName(user: any) {
    return AppUtils.getUserDisplayName(user);
  }

  getJobFunction() {
    this.jobFunctionlService.getAllInstances({ skipHandleError: true }).subscribe(res => {
      this.jobFunctionData = res;
    });
  }

  getSupportShift() {
    this.supportShiftService.getAllInstances({ skipHandleError: true }).subscribe(res => {
      this.supportShiftData = res;
    });
  }

  delete(id, userName) {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.info, userName]
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.service.delete(id).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.info, userName],
          });
          this.list.get();
        });
      }
    });
  }

  add() {
    this.selected = {};
    this.input$.next('');
    this.buildForm();
    this.form.controls['dataTier'].setValue([]);
    AppUtils.initTreeDataState(this.supportTeamDataTierTreeNode, []);
    this.isModalVisible = true;
  }

  edit(id) {
    this.service.getFullSupportTeamWithDataTiersByIdById(id).subscribe(res => {
      this.selected = res;
      this.userService.get(res.userId).subscribe(user => {
        this.userSelectOptions = [
          {
            id: user.id,
            name: user.name,
            surname: user.surname,
            userName: user.userName,
            email: user.email,
            phone: user.phoneNumber,
          },
          ...this.userSelectOptions
        ]
      })
      this.buildForm();
      this.isModalVisible = true;
      AppUtils.initTreeDataState(this.supportTeamDataTierTreeNode, res.assignedDataTiers);
      this.treeViewCheckChange();
    });
  }

  buildForm() {
    this.form = this.fb.group({
      user: [this.selected.userId || undefined, Validators.required],
      email: [{ value: this.selected.email || '', disabled: true }],
      phone: [{ value: this.selected.phoneNumber || '', disabled: true }],
      jobFunction: [this.selected.jobFunctionId || '', Validators.required],
      supportShift: [this.selected.supportShiftId || ''],
      dataTier: [[], Validators.required],
    });
    this.form.controls['user'].valueChanges.subscribe(userChange => {
      if (![null, ''].includes(userChange)) {
        const selectedUser = this.userSelectOptions.find(user => user.id === userChange);
        this.selectedUser = selectedUser;
        this.form.controls['email'].setValue(selectedUser.email);
        this.form.controls['phone'].setValue(selectedUser.phone);
      } else {
        this.form.controls['email'].setValue('');
        this.form.controls['phone'].setValue('');
      }
    });
  }

  save() {
    if (this.form.invalid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    const saveBtn = document.querySelector('abp-button') as HTMLButtonElement;
    if (saveBtn) {
      saveBtn.disabled = true;
    }
    const requestBody = {
      user: this.form.controls['user'].value,
      jobFunction: this.form.controls['jobFunction'].value,
      supportShift: this.form.controls['supportShift'].value,
      assignedDataTiers: [
        ...this.form.controls['dataTier'].value.map(item => {
          return {
            parent: this.form.controls['user'].value,
            dataTierType: item.type,
            dataTierId: item.id,
            isDefault: true,
          };
        }),
      ],
      tenantId: this.selected?.tenantId || ''
    };
    const request = this.selected.id
      ? this.service.update(this.selected.id, requestBody)
      : this.service.create(requestBody);
    request.pipe(finalize(() => {
      this.modalBusy = false;
      const saveBtn = document.querySelector('abp-button') as HTMLButtonElement;
      if (saveBtn) {
        saveBtn.disabled = false;
      }
    })).subscribe(() => {
      this.modalBusy = false;
      const userName = !this.selected.id ?
        (this.selectedUser?.name || '') :
        (this.selected?.userName || '');

      const message = !this.selected.id ?
        this.localizationService.instant('::LABEL_CreatedSuccessfully', this.info || '', userName) :
        this.localizationService.instant('::LABEL_UpdatedSuccessfully', this.info || '', userName);

      this.toasterService.success(message, '');

      this.isModalVisible = false;
      this.form.reset();
      this.list.get();
    });
  }

  isAssignedCell(cell, assignedDataTiers) {
    return assignedDataTiers.find(item => (item.dataTierId === cell) || (item.dataTierType === 'Area' && this.supportTeamDataTierTreeNode.find(d => d.id === item.dataTierId)?.children?.find(c => c.id === cell)));
  }

  treeViewCheckChange() {
    this.form.controls['dataTier'].setValue(
      AppUtils.getCheckedTreeData(this.supportTeamDataTierTreeNode, true)
    );
  }

  hasEditOrDeletePermission() {
    return this.permissionService.getGrantedPolicy('SupportTeam.Edit') || this.permissionService.getGrantedPolicy('SupportTeam.Delete');
  }

  private calculateTextColor(hexColor: string) {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#ffffff';
  }

  caclulateJobFunctionState() {
    this.data.items.forEach(item => {
      const hexRegex = /^#([0-9A-F]{6})$/i;
      if (item.jobFunctionColor && hexRegex.test(item.jobFunctionColor)) {
        this.jobFunctionColorMap[item.id] = {
          'background-color': item.jobFunctionColor,
          'color': this.calculateTextColor(item.jobFunctionColor)
        }
      }
    });
    this.data.items = [...this.data.items];
  }

  hasAssignedDataTiers() {
    return AppUtils.hasCheckedDataTier(this.supportTeamDataTierTreeNode);
  }
}
