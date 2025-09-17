import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto, LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { AreaDto, CellDto } from '@apis/corporate/dtos';
import { AreaService } from '@apis/corporate';
import { IdentityRoleDto } from '@abp/ng.identity/proxy';
import { RoleService } from '@proxy/services';
import { LocalDowntimeReasonService } from '@apis/general';
import { RoleBoardSettingService } from '@apis/ticket/role-board-settings';
import { CellSettingDto, CreateUpdateRoleBoardSettingDto, MachineDowntimeSettingDto, OrderChangeSettingDto, RoleBoardSettingDto, RoleBoardSettingGetListInput } from '@apis/ticket/role-board-settings/dtos';
import { LocalDowntimeReasonDto } from '@apis/general/dtos';
import { debounceTime, firstValueFrom, Subject } from 'rxjs';

@Component({
  selector: 'app-role-board-settings',
  templateUrl: './role-board-settings.component.html',
  styleUrl: './role-board-settings.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'RoleBoardSettingsComponent',
    },
  ],
})
export class RoleBoardSettingsComponent
  extends ModelingBase<RoleBoardSettingService, RoleBoardSettingGetListInput, CreateUpdateRoleBoardSettingDto>
  implements OnInit {
  selected: RoleBoardSettingDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<RoleBoardSettingDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  areas: AreaDto[] = [];
  areaInput$ = new Subject<string | null>();
  debounceTime = 500;
  localDowntimeReasons: LocalDowntimeReasonDto[] = [];
  roles: IdentityRoleDto[] = [];
  cells: CellDto[] = [];
  columns = [
    { displayKey: '::Area', field: 'areaName' }
  ];
  mdSettings: MachineDowntimeSettingDto[] = [];
  orderChangeSettings: OrderChangeSettingDto[] = [];
  cellSettings: CellSettingDto[] = [];
  info: string;
  tenantInfo: any;
  isCollapse = false;

  constructor(
    public list: ListService<RoleBoardSettingGetListInput>,
    public service: RoleBoardSettingService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private areaService: AreaService,
    private localDowntimeReasonService: LocalDowntimeReasonService,
    private roleService: RoleService,
    private localizationService: LocalizationService,
  ) {
    super(service, list, 'role-board-setting');
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_RoleBoardSetting').subscribe(data => {
      this.info = data
    });
    this.areaInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.getAreas(searchItem);
      })
  }

  getDependentData() {
    this.getAreas();
    this.getLocalDowntimeReasons();
    this.getRoles();
  }

  areaChange(e) {
    if (!e) { return }
    if (e.cells) {
      this.cells = e.cells;
    } else {
      this.areaService.getTreeView(e.id)
        .subscribe(data => {
          this.cells = data.cells;
        });
    }

    if (e.name) {
      this.form.patchValue({ areaName: e.name })
    }
  }

  getRoles() {
    if (this.roles.length) { return }
    this.roleService
      .getList({
        maxResultCount: 1000,
      })
      .subscribe(data => {
        this.roles = data.items;
      });
  }

  getLocalDowntimeReasons() {
    this.localDowntimeReasonService
      .getList({
        maxResultCount: 10,
      })
      .subscribe(data => {
        this.localDowntimeReasons = data.items;
      });
  }

  getAreas(searchItem = '', ids = []) {
    this.areaService
      .getList({
        ids: ids,
        name: searchItem,
        maxResultCount: 10,
        tenantDataTierID: this.tenantInfo?.DataTierId,
        tenantDataTierType: this.tenantInfo?.DataTierType,
      })
      .subscribe(data => {
        this.areas = data.items;
      });
  }

  private hookToQuery() {
    this.list
      .hookToQuery((query: any) => {
        if (query.filter) {
          query.areaName = query.filter;
        }
        return this.service.getList(query)
      }
      )
      .subscribe(res => {
        this.data = res;
      });
  }

  buildForm() {
    this.form = this.fb.group({
      areaId: [this.selected?.areaId || null, Validators.required],
      areaName: [this.selected?.areaName || ''],
      fgCollectionWindow: [this.selected?.fgCollectionWindow ?? null, Validators.required],
      fgCollectionTaskRoleName: [this.selected.fgCollectionTaskRoleName || '', Validators.required],
      minorStoppageDurationMinutes: [this.selected?.minorStoppageDurationMinutes ?? null, Validators.required],
      minorStoppageCount: [this.selected?.minorStoppageCount ?? null, Validators.required],
      minorStoppageWithinDurationMinutes: [this.selected?.minorStoppageWithinDurationMinutes ?? null, Validators.required],
      minorStoppageTaskDisplayInstruction: [this.selected?.minorStoppageTaskDisplayInstruction || null, Validators.required],
      alertRemainingTimeMinutes: [this.selected?.alertRemainingTimeMinutes ?? null, Validators.required],
      machineDowntimeSettings: [this.selected?.machineDowntimeSettings || []],
      orderChangeSettings: [this.selected?.orderChangeSettings || []],
      cellSettings: [this.selected?.cellSettings || []],
      tenantId: [this.selected?.tenantId || null],
      fgCollectionDisplayInstruction: [this.selected?.fgCollectionDisplayInstruction || '', Validators.required],
      plcIssueDisplayInstruction: [this.selected?.plcIssueDisplayInstruction || '', Validators.required],
      autoConfirmationDisplayInstruction: [this.selected?.autoConfirmationDisplayInstruction || '', Validators.required],
      scrapIncreaseDisplayInstruction: [this.selected?.scrapIncreaseDisplayInstruction || '', Validators.required],
      materialLoadingDisplayInstruction: [this.selected?.materialLoadingDisplayInstruction || '', Validators.required],
    });
  }

  inputMaxLimit(e, limit, formcontrolName) {
    // just allow numbers
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    // limit the length
    if (e.target.value.length > limit) {
      e.target.value = e.target.value.slice(0, limit);
    }
    // convert to number
    e.target.value = e.target.value?.length ? +e.target.value : null;
    this.form.controls[formcontrolName].setValue(e.target.value);
  }

  add() {
    this.getDependentData();
    this.selected = {} as RoleBoardSettingDto;
    this.mdSettings = [];
    this.orderChangeSettings = [];
    this.cellSettings = [];
    this.buildForm();
    this.isModalVisible = true;
  }

  checkAndSetSettings() {
    // MD settings
    this.mdSettings = this.mdSettings.filter(x => x.localDownTimeReasonId && x.roleName);
    this.form.controls['machineDowntimeSettings'].setValue(this.mdSettings);
    // orderChangeSettings
    this.orderChangeSettings = this.orderChangeSettings.filter(x => x.roleName);
    this.form.controls['orderChangeSettings'].setValue(this.orderChangeSettings);
    // cellSettings
    this.cellSettings = this.cellSettings.filter(x => x.cellId);
    this.form.controls['cellSettings'].setValue(this.cellSettings);
  }

  save() {
    this.checkAndSetSettings();
    this.form.controls['minorStoppageDurationMinutes'].setValue(+(this.form.controls['minorStoppageDurationMinutes'].value ?? 0));
    this.form.controls['minorStoppageCount'].setValue(+(this.form.controls['minorStoppageCount'].value ?? 0));
    this.form.controls['minorStoppageWithinDurationMinutes'].setValue(+(this.form.controls['minorStoppageWithinDurationMinutes'].value ?? 0));
    this.form.controls['alertRemainingTimeMinutes'].setValue(+(this.form.controls['alertRemainingTimeMinutes'].value ?? 0));
    this.form.controls['fgCollectionWindow'].setValue(+(this.form.controls['fgCollectionWindow'].value ?? 0));
    this.mdSettings.forEach(setting => {
        setting.warningMinutes = +(setting.warningMinutes ?? 0);
        setting.alertMinutes = +(setting.alertMinutes ?? 0);
        setting.escalatedMinutes = +(setting.escalatedMinutes ?? 0);
    });
    this.orderChangeSettings.forEach(setting => {
        setting.warningMinutes = +(setting.warningMinutes ?? 0);
        setting.alertMinutes = +(setting.alertMinutes ?? 0);
    });
    this.cellSettings.forEach(setting => {
        setting.plcCountMonitorDurationMinutes = +(setting.plcCountMonitorDurationMinutes ?? 0);
        setting.scrapMonitorDurationMinutes = +(setting.scrapMonitorDurationMinutes ?? 0);
        setting.scrapPPM = +(setting.scrapPPM ?? 0);
    });
    if (this.form.invalid) {
      return;
    }
    const request = this.selected.id
      ? this.service.update(this.selected.id, this.form.value)
      : this.service.create(this.form.value);
    request.subscribe(() => {
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.form.value.areaName],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.areaName],
        });
      }
      this.isModalVisible = false;
      this.form.reset();
      this.list.get();
    });
  }

  edit(row) {
    this.getDependentData();
    this.service.get(row.id).subscribe(async data => {
      this.selected = data;
      this.mdSettings = data.machineDowntimeSettings || [];
      this.orderChangeSettings = data.orderChangeSettings || [];
      this.cellSettings = data.cellSettings || [];
      this.areaChange({ id: data.areaId });
      this.getAreas('', [data.areaId]);

    await Promise.all(
      this.mdSettings.map(async setting => {
      if (setting.localDownTimeReason == null) {
        const localDownTimeReasonDto = await firstValueFrom(
          this.localDowntimeReasonService.get(setting.localDownTimeReasonId)
        );
        setting.localDownTimeReason = localDownTimeReasonDto;
        if (!this.localDowntimeReasons.some(r => r.id === localDownTimeReasonDto.id)) {
          this.localDowntimeReasons.unshift(localDownTimeReasonDto);
        }
      }
    }));
      this.buildForm();
      this.isModalVisible = true;
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

  sort(data: any) {
    const { prop, dir } = data.sorts[0];
    this.list.sortKey = prop;
    this.list.sortOrder = dir;
  }

  search(e) {
    this.list.filter = e.target.value;
  }

  multiDelete(e) {
    var infos = this.insertSpaces(e.objectType);
    this.service.getList({ maxResultCount: 1000 }).subscribe(result => {
      const areaNames = result.items
        .filter(item => e.objectIds.includes(item.id))
        .map(item => item.areaName).join(',<br/>');
      this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [infos + '<br/>', areaNames],
      }).subscribe((status) => {
        if (status === Confirmation.Status.confirm) {
          this.service['multipleDeleteByIds'](e.objectIds).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
              messageLocalizationParams: [infos, areaNames],
            });
            this.list.get();
          });
        }
      });
    });
  }
}
