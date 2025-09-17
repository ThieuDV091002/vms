import { Component, OnInit } from '@angular/core';
import { ModelingBase } from '../modeling-base';
import { CreateUpdateShiftPatternDto, ShiftDto, ShiftPatternDetailDto, ShiftPatternDto, ShiftPatternGetListInput } from '@apis/general/dtos/models';
import { ConfigStateService, ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { ShiftPatternService, ShiftService } from '@apis/general';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { UserService } from '@proxy/services';
import { AreaService } from '@apis/corporate';
import { AppUtils } from '../utils/app.utils';
enum Increments {
  '0.5 hours' = '00:30:00',
  '1 hours' = '01:00:00',
  '2 hours' = '02:00:00',
  '3 hours' = '03:00:00',
  '4 hours' = '04:00:00',
  '8 hours' = '08:00:00',
}
@Component({
  selector: 'app-shift-patterns',
  templateUrl: './shift-patterns.component.html',
  styleUrl: './shift-patterns.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'ShiftPatternsComponent',
    },
  ],
})

export class ShiftPatternsComponent
  extends ModelingBase<ShiftPatternService, ShiftPatternGetListInput, CreateUpdateShiftPatternDto>
  implements OnInit {
  selected: ShiftPatternDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<ShiftPatternDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  readonly Increments = Increments;
  increments = Object.keys(Increments);
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::DisplayName', field: 'displayName' },
    { displayKey: '::Description', field: 'description' }
  ];
  info: string;
  infos: string;
  shiftPatternDetails: ShiftPatternDetailDto[] = [];
  shifts: ShiftDto[] = [];
  dataTierTreeNode: any[] = [];
  haveAccessTreeNode: any[] = [];
  tenantInfo: any;
  isCollapse = false;

  constructor(
    public list: ListService<ShiftPatternGetListInput>,
    public service: ShiftPatternService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService,
    private shiftService: ShiftService,
    private userService: UserService,
    private areaService: AreaService,
    private configStateService: ConfigStateService
  ) {
    super(service, list, 'shift-pattern');
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.getDataTiers();
    this.localizationService.get('::LABEL_ShiftPattern').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::MENU_ShiftPattern').subscribe(data => {
      this.infos = data
    });
  }

  hasAssignedDataTiers() {
    return AppUtils.hasCheckedDataTier(this.dataTierTreeNode);
  }

  getDataTiers() {
    this.userService.getTreeviewDataTiersByUser(this.configStateService.getOne('currentUser').id).subscribe(res => {
      if (res && res.assignedDataTiers.length > 0) {
        const cellData = res.assignedDataTiers.filter(d => d.cellId && d.cellName)
          .map(d => ({ id: d.cellId, name: d.cellName, type: 'Cell', areaId: d.areaId, checked: false }))
          .filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.id === value.id && t.name === value.name
            ))
          );

        const areaData = res.assignedDataTiers
          .filter(d => d.areaId && cellData.some(cell => cell.areaId === d.areaId))
          .map(d => ({ id: d.areaId, name: d.areaName, type: 'Area', children: [], checked: false }))
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

        this.dataTierTreeNode = areaData;
        // just need show area/cell
        // this.areaService.getList({ids: areaData.map(d => d.id), maxResultCount: 1000, tenantDataTierID: this.tenantInfo?.DataTierId, tenantDataTierType: this.tenantInfo?.DataTierType }).subscribe(response => {
        //   AppUtils.initTreeData(response.items);
        //   this.dataTierTreeNode = response.items;
        //   this.initHaveAccessTreeNode(res.assignedDataTiers);
        // })
      }
    })
  }

  // initHaveAccessTreeNode(assignedDataTiers) {
  //   this.haveAccessTreeNode = AppUtils.initHasAccessTreeNode(
  //     this.dataTierTreeNode,
  //     assignedDataTiers
  //   );
  // }
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

  getShifts() {
    this.shiftService.getAllInstances().subscribe(data => {
      this.shifts = data;
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
      displayName: [this.selected?.displayName || '', Validators.required],
      description: [this.selected?.description || ''],
      timeIncrement: [this.selected?.timeIncrement || '', Validators.required],
      shiftPatternDetails: [this.selected?.shiftPatternDetails || []],
      // need at least one shift pattern detail
      assignedShiftPatternDataTiers: [this.selected?.assignedShiftPatternDataTiers || []],
      // startTime: [this.selected?.startTime || '', Validators.required],
      // timeInterval: [this.selected?.timeInterval || '', Validators.required],
      tenantId: [this.selected?.tenantId || ''],
    });
  }

  checkShiftPatternDetails() {
    return this.shiftPatternDetails.filter(s => s.shiftId && s.startTime).length > 0;
  }

  add() {
    if (this.shifts.length === 0) {
      this.getShifts();
    }
    this.shiftPatternDetails = [];
    this.initDataTierTree();
    this.selected = {} as ShiftPatternDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  getExtraValues() {
    // shift pattern details
    this.selected.shiftPatternDetails = this.shiftPatternDetails.filter(s => s.shiftId && s.startTime);
    this.form.patchValue({
      shiftPatternDetails: this.selected.shiftPatternDetails
    })
    // selected data tiers
    this.selected.assignedShiftPatternDataTiers = AppUtils.getCheckedTreeData(this.dataTierTreeNode).filter(d => d.type === 'Cell').map(d => ({ dataTierType: d.type, dataTierId: d.id }));

    this.form.patchValue({
      assignedShiftPatternDataTiers: this.selected.assignedShiftPatternDataTiers
    })
  }

  copyShiftPattern(e) {
    const info = this.removeLastS(e.objectType);
    e.data.shiftPatternDetails = this.shiftPatternDetails.map(s => ({ shiftId: s.shiftId, startTime: s.startTime }));
    e.data.assignedShiftPatternDataTiers = AppUtils.getCheckedTreeData(e.data.assignedShiftPatternDataTiers).filter(d => d.type === 'Cell').map(d => ({ dataTierType: d.type, dataTierId: d.id }));
    this.service.create({ ...e.data }).subscribe(res => {
      this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
        messageLocalizationParams: [info, res.name],
      });
      this.list.get();
      this.edit(res);
    });
  }

  save() {
    if (this.form.invalid || !this.checkShiftPatternDetails() || !this.hasAssignedDataTiers()) {
      return;
    }

    this.getExtraValues();

    const formValue = this.form.value;


    const request = this.selected.id
      ? this.service.update(this.selected.id, formValue)
      : this.service.create(formValue);

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
    });
  }

  edit(row) {
    if (this.shifts.length === 0) {
      this.getShifts();
    }
    this.service.get(row.id).subscribe(data => {
      this.selected = data;
      AppUtils.initTreeData(data.assignedShiftPatternDataTiers);
      this.shiftPatternDetails = data.shiftPatternDetails;
      this.setDataTierTree(data.assignedShiftPatternDataTiers);
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
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.infos + '<br/>', e.objectNames.join(',<br/>')],
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.service['multipleDeleteByIds'](e.objectIds).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.infos, e.objectNames],
          });
          this.list.get()
        });
      }
    });
  }
}
