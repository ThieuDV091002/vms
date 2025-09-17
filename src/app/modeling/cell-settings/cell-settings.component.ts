import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { CellSettingService } from '@apis/general/production-review';
import { CellSettingDto, CellSettingGetListInput, CreateUpdateCellSettingDto } from '@apis/general/production-review/dtos';
import { CellDto } from '@proxy/dtos/master-data';
import { CellService } from '@apis/corporate';
import { debounceTime, Subject } from 'rxjs';
enum KpiReviewType {
  MachineFocus = 'Machine Focus',
  LaborFocus = 'Labor Focus'
}
enum QualityReviewType {
  FPY = 'FPY',
  SPPM = 'SPPM'
}
@Component({
  selector: 'app-cell-settings',
  templateUrl: './cell-settings.component.html',
  styleUrl: './cell-settings.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'CellSettingsComponent',
    },
  ],
})
export class CellSettingsComponent
  extends ModelingBase<CellSettingService, CellSettingGetListInput, CreateUpdateCellSettingDto>
  implements OnInit {
  selected: CellSettingDto;
  isModalVisible: boolean;
  readonly KpiReviewType = KpiReviewType;
  readonly QualityReviewType = QualityReviewType;
  kpiReviewTypes = Object.keys(KpiReviewType);
  qualityReviewTypes = Object.keys(QualityReviewType);
  isHistoryModalVisible: boolean;
  data: PagedResultDto<CellSettingDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::LABEL_Cell', field: 'name' },
    { displayKey: '::LABEL_KPIReviewType', field: 'kpiReviewType' },
    { displayKey: '::LABEL_QualityReviewType', field: 'qualityReviewType' }
  ];
  info: string;
  selectedColor: string;
  cells: CellDto[] = [];
  tenantInfo: any;
  cellInput$ = new Subject<string | null>();
  debounceTime = 500;

  constructor(
    public list: ListService<CellSettingGetListInput>,
    public service: CellSettingService,
    private cellService: CellService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService,
  ) {
    super(service, list, 'cell-setting');
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_CellSetting').subscribe(data => {
      this.info = data
    });
    this.cellInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.getCells(searchItem);
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
        // const filteredCells = this.cells.filter(cell => !data.items.some(item => item.id === cell.id));
        // this.cells = [...data.items, ...filteredCells];
        // this.cells = data.items;

        // save selected cell if it exists
      const selectedCellId = this.form?.value?.cellId;
      // const selectedCell = this.cells.find(cell => cell.id === selectedCellId);

      if (selectedCellId && !data.items.some(item => item.id === selectedCellId)) {
        this.cellService.get(selectedCellId).subscribe(selectedCell => {
          this.cells = [selectedCell, ...data.items];
        });
      } else {
        this.cells = data.items;
      }
      });
  }


  private hookToQuery() {
    this.list
      .hookToQuery(query => this.service.getList(query))
      .subscribe(res => {
        this.data = res;
        // set cell name
        this.data.items.forEach(x => {
          x.cellName = x.name;
        });
      });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || ''],
      cellName: [this.selected.cellName || ''],
      cellId: [this.selected.cellId || undefined, Validators.required],
      kpiReviewType: [this.selected.kpiReviewType || '', Validators.required],
      qualityReviewType: [this.selected.qualityReviewType || '', Validators.required],
      tenantId: [this.selected.tenantId || '']
    });
  }

  add() {
    this.getCells();
    this.selected = {} as CellSettingDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  copyModalOpen(event: any) {
    this.getCells();
  }

  copySetting(e) {
    const info = this.removeLastS(e.objectType);
    this.cellService.get(e.data.cellId).subscribe(cell => {
      this.service.create({ ...e.data, cellName: cell?.name, name: cell?.name, displayName: cell?.name }).subscribe(res => {
        this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
          messageLocalizationParams: [info, res.name],
        });
        this.list.get();
        this.edit(res);
      });
    })
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const cell = this.cells.find(x => x.id === this.form.value.cellId);
    const request = this.selected.id
      ? this.service.update(this.selected.id, { ...this.form.value, name: cell?.name, cellName: cell?.name || '', displayName: cell?.name })
      : this.service.create({ ...this.form.value, name: cell?.name, cellName: cell?.name || '', displayName: cell?.name });
    request.subscribe(() => {
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, cell.name],
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
    this.service.get(row.id).subscribe(data => {
      this.getCells(data.name);
      this.selected = data;
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
}
