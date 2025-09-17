import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProductionReviewBoardSettingService } from '@apis/general';
import { CreateUpdateProductionReviewBoardSettingDto, ProductionReviewBoardSettingDto, ProductionReviewBoardSettingGetListInput } from '@apis/general/dtos';
import { ModelingBase } from '../modeling-base';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-production-review-board-setting',
  templateUrl: './production-review-board-setting.component.html',
  styleUrl: './production-review-board-setting.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "ProductionReviewBoardSettingComponent",
    }
  ]
})

export class ProductionReviewBoardSettingComponent extends ModelingBase<ProductionReviewBoardSettingService, ProductionReviewBoardSettingGetListInput, CreateUpdateProductionReviewBoardSettingDto> implements OnInit {
  data: PagedResultDto<ProductionReviewBoardSettingDto> = { items: [], totalCount: 0 };
  selected: ProductionReviewBoardSettingDto;
  isModalVisible = false;
  isHistoryModalVisible = false;
  productionReviewBoardSettingForm: FormGroup;
  modalBusy = false;
  defaultEmptyGuid = '00000000-0000-0000-0000-000000000000';
  info: string;
  infos: string;
  form: any;
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::DisplayName', field: 'displayName' },
    { displayKey: '::Description', field: 'description' },
  ];
  isCollapse = false;

  // Group List state (5 fixed rows)
  groupLevels: string[] = ['Level 1', 'Level 2', 'Level 3'];
  groupRows: Array<{ fieldName: string; localization: string; groupLevel: string; displaySeq: number | null }> = [
    { fieldName: 'FamilySerialId', localization: '::LABEL_ProductSeriesProductFamilies', groupLevel: '', displaySeq: null },
    { fieldName: 'ProductId', localization: '::LABEL_Product', groupLevel: '', displaySeq: null },
    { fieldName: 'WorkOrder', localization: '::LABEL_WorkOrder', groupLevel: '', displaySeq: null },
    { fieldName: 'WorkCenterId', localization: '::LABEL_WorkCenter', groupLevel: '', displaySeq: null },
    { fieldName: 'Operation', localization: '::LABEL_Operation', groupLevel: '', displaySeq: null },
  ];
  

  // Display List state
  displayFieldOptions: string[] = [
    '::LABEL_StartTime',
    '::LABEL_EndTime',
    '::LABEL_Shift',

    '::Label_StaffNeeded',
    '::Label_StaffActual',

    '::LABEL_WorkCenter',
    '::LABEL_Product',
    '::Label_WorkOrder',
    '::LABEL_Operation',

    '::LABEL_Plan',
    '::LABEL_Actual',
    '::LABEL_Diff',
    '::LABEL_CumDiff',
    '::Label_PlannedQty',
    '::LABEL_ActualQty',
    '::LABEL_Difference',

    '::LABEL_UPPH',
    '::LABEL_PerformancePercentage',
    '::LABEL_POEE',

    '::LABEL_PlannedDowntimeMinutes',
    '::LABEL_UnplannedDowntimeMinutes',
    '::LABEL_PlannedDowntimeHours',
    '::LABEL_UnplannedDowntimeHours',
    '::LABEL_DowntimePercentage',
    '::LABEL_AvailabilityPercentage',

    '::LABEL_ScrapQty',
    '::Label_ReworkQty',
    '::LABEL_CellSettingScrapPPM',
    '::LABEL_QualityPercentage',
  ];

  selectedDisplayFields: string[] = [];
  addDisplayFieldSelection = '';
  hoveredIndex: number | null = null;

  constructor(
    public list: ListService<ProductionReviewBoardSettingGetListInput>,
    public service: ProductionReviewBoardSettingService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private localizationService: LocalizationService) {
    super(service, list, 'production-review-board-setting');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_ProductionReviewBoardSetting').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::MENU_ProductionReviewBoardSetting').subscribe(data => {
      this.infos = data
    });
  }

  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList(query) }).subscribe(res => {
      this.data = res;
    });
  }

  delete(e: any) {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.info, e.name],
    }).subscribe((status) => {
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

  edit(row: any) {
    this.service.get(row.id).subscribe((res) => {
      this.selected = res;
      this.buildForm();
      this.initGroupRowsFromSelected();
      this.initDisplayListFromSelected();
      this.isModalVisible = true;
    });
  }

  add() {
    this.selected = {} as ProductionReviewBoardSettingDto;
    this.buildForm();
    this.resetGroupRows();
    this.selectedDisplayFields = [];
    this.isModalVisible = true;
  }

  buildForm() {
    this.productionReviewBoardSettingForm = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      tenantId: [this.selected.tenantId || ''],
      tenantName: [this.selected.tenantName || ''],
      reviewType: [this.selected.reviewType || '', Validators.required],
      l1GroupList: [this.selected.l1GroupList || ''],
      l2GroupList: [this.selected.l2GroupList || ''],
      l3GroupList: [this.selected.l3GroupList || ''],
      displayList: [this.selected.displayList || ''],
    });
  }

  // Initialize Group Rows and Display List from existing selected item
  private resetGroupRows() {
    this.groupRows = [
    { fieldName: 'Product Series / Product Families', localization: '::LABEL_ProductSeriesProductFamilies', groupLevel: '', displaySeq: null },
    { fieldName: 'Product', localization: '::LABEL_Product', groupLevel: '', displaySeq: null },
    { fieldName: 'Work Order', localization: '::LABEL_WorkOrder', groupLevel: '', displaySeq: null },
    { fieldName: 'Work Center', localization: '::LABEL_WorkCenter', groupLevel: '', displaySeq: null },
    { fieldName: 'Operation', localization: '::LABEL_Operation', groupLevel: '', displaySeq: null },
    ];
  }

  private initGroupRowsFromSelected() {
    this.resetGroupRows();
    const applyLevel = (listStr: string | undefined, level: string) => {
      if (!listStr) return;
      const items = listStr.split(';').map((s) => s.trim()).filter(Boolean);
      items.forEach((name, idx) => {
        const row = this.groupRows.find((r) => r.fieldName === name);
        if (row) {
          row.groupLevel = level;
          row.displaySeq = idx + 1;
        }
      });
    };
    applyLevel(this.selected?.l1GroupList, 'Level 1');
    applyLevel(this.selected?.l2GroupList, 'Level 2');
    applyLevel(this.selected?.l3GroupList, 'Level 3');
  }

  private initDisplayListFromSelected() {
    const listStr = this.selected?.displayList || '';
    this.selectedDisplayFields = listStr
      ? listStr.split(';').map((s) => s.trim()).filter(Boolean)
      : [];
  }

  // Display List handlers
  addDisplayField(value: string) {
    if (!value) return;
    if (!this.selectedDisplayFields.includes(value)) {
      this.selectedDisplayFields.push(value);
    }
    this.addDisplayFieldSelection = '';
  }

  removeDisplayField(index: number) {
    this.selectedDisplayFields.splice(index, 1);
  }

  dropDisplay(event: CdkDragDrop<string[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.selectedDisplayFields, event.previousIndex, event.currentIndex);
    }
  }

  save() {
    if (this.productionReviewBoardSettingForm.invalid || this.modalBusy) {
      return;
    }

    // Group validation: each row must have level and sequence
    const invalidRow = this.groupRows.find(
      (r) => !r.groupLevel || r.displaySeq === null || r.displaySeq === undefined || isNaN(Number(r.displaySeq))
    );
    if (invalidRow) {
      this.toasterService.warn('::LABEL_PleaseCompleteGroupList', '');
      return;
    }

    // Display Sequence cannot be negative
    const hasNegative = this.groupRows.some(r => Number(r.displaySeq) < 0);
    if (hasNegative) {
      this.toasterService.warn('::LABEL_DisplaySequenceCannotBeNegative', '');
      return;
    }

    const selectedRows = this.groupRows.filter(r => !!r.groupLevel);
    const hasL1 = selectedRows.some(r => r.groupLevel === 'Level 1');
    const hasL2 = selectedRows.some(r => r.groupLevel === 'Level 2');
    const hasL3 = selectedRows.some(r => r.groupLevel === 'Level 3');

    // At least one Level 1 is required
    if (!hasL1) {
      this.toasterService.warn('::LABEL_AtLeastOneLevelOneRequired', '');
      return;
    }

    // Level hierarchy continuity: Level 3 requires Level 2; Level 2/3 requires Level 1
    if (hasL3 && !hasL2) {
      this.toasterService.warn('::LABEL_Level3RequiresLevel2', '');
      return;
    }

    if ((hasL2 || hasL3) && !hasL1) {
      this.toasterService.warn('::LABEL_Level2Or3RequiresLevel1', '');
      return;
    }

    // Duplicate Display Sequence check within same Group Level
    for (const lv of this.groupLevels) {
      const seqs = selectedRows
        .filter(r => r.groupLevel === lv)
        .map(r => Number(r.displaySeq));
      const dups = this.findDuplicates(seqs);
      if (dups.length) {
        this.toasterService.warn('::LABEL_DisplaySequenceDuplicateError', '', { 
          life: 1000,
          messageLocalizationParams: [lv, dups.join(', ')]
        });
        return;
      }
    }

    // Ensure at least one Display field is selected
    if (!this.selectedDisplayFields || this.selectedDisplayFields.length === 0) {
      this.toasterService.warn('::LABEL_PleaseSelectAtLeastOneDisplayField', '');
      return;
    }

    // Aggregate Group Lists by level and sort by display sequence
    const byLevel = (level: string) =>
      this.groupRows
        .filter((r) => r.groupLevel === level)
        .sort((a, b) => Number(a.displaySeq) - Number(b.displaySeq))
        .map((r) => r.fieldName)
        .join(';');

    const l1 = byLevel('Level 1');
    const l2 = byLevel('Level 2');
    const l3 = byLevel('Level 3');

    // Display list aggregation
    const displayList = this.selectedDisplayFields.join(';');

    this.productionReviewBoardSettingForm.patchValue({
      l1GroupList: l1,
      l2GroupList: l2,
      l3GroupList: l3,
      displayList: displayList,
    });
    this.modalBusy = true;
    const request = this.selected.id
      ? this.service.update(this.selected.id, this.productionReviewBoardSettingForm.value)
      : this.service.create(this.productionReviewBoardSettingForm.value);

    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      this.modalBusy = false;
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.productionReviewBoardSettingForm.value.name],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.productionReviewBoardSettingForm.reset();
      this.list.get();
    });
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

  private findDuplicates(numbers: number[]): number[] {
    const seen = new Set<number>();
    const dup = new Set<number>();
    numbers.forEach(n => {
      if (seen.has(n)) dup.add(n);
      else seen.add(n);
    });
    return Array.from(dup.values());
  }

}
