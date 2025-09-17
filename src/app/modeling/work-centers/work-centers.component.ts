import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';


import { LocalizationService } from '@abp/ng.core';
import { debounceTime, finalize, Subject } from 'rxjs';
import { AreaService, CellService, WorkCenterService } from '@apis/corporate';
import { AreaDto, CellDto, CreateUpdateWorkCenterDto, WorkCenterDto, WorkCenterGetListInput } from '@apis/corporate/dtos';
import { ModelingHistoryDto } from '@proxy/dtos/modeling';

@Component({
  selector: 'app-work-centers',
  templateUrl: './work-centers.component.html',
  styleUrl: './work-centers.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'WorkCentersComponent',
    },
  ],
})
export class WorkCentersComponent
  extends ModelingBase<WorkCenterService, WorkCenterGetListInput, CreateUpdateWorkCenterDto>
  implements OnInit {
  protected readonly cellService = inject(CellService);
  protected readonly areaService = inject(AreaService);

  data: PagedResultDto<WorkCenterDto> = { items: [], totalCount: 0 };
  selected: WorkCenterDto;
  form: FormGroup;
  filterForm: FormGroup;
  historys: PagedResultDto<ModelingHistoryDto>;
  isModalVisible = false;
  isHistoryModalVisible = false;
  isMoveModalVisible = false;
  selectedWorkCenterIdList: string[];
  cellData: CellDto[] = [];
  cellOptinons: CellDto[] = [];
  areaData: AreaDto[] = [];
  moveToCell = '';
  isCollapse = false;
  filterName = '';
  modalBusy = false;
  info: string;
  infos: string;
  cellInfo: string;
  tenantInfo: any;
  filterSearchHasValue: boolean = false;
  areaInput$ = new Subject<string | null>();
  cellInput$ = new Subject<string | null>();
  debounceTime = 500;

  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    public list: ListService<WorkCenterGetListInput>,
    public service: WorkCenterService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'work-center');
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit(): void {
    this.buildFilterForm();
    this.hookToQuery();
    this.getArea();
    this.areaInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.getArea(searchItem);
      });
    this.cellInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.getCell(searchItem);
      });
    this.localizationService.get('::LABEL_WorkCenter').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::LABEL_WorkCenters').subscribe(data => {
      this.infos = data
    });
    this.localizationService.get('::Cell').subscribe(data => {
      this.cellInfo = data
    });
  }

  getCell(searchItem = '') {
    this.cellService.getList({ name: searchItem, maxResultCount: 10, tenantDataTierID: this.tenantInfo?.DataTierId, tenantDataTierType: this.tenantInfo?.DataTierType }).subscribe((res) => {
      // const filteredCells = this.cellData.filter(cell => !res.items.some(item => item.id === cell.id));
      // this.cellData = [...res.items, ...filteredCells];
      this.cellData = res.items;
    });
  }

  getArea(searchItem = '') {
    this.areaService.getList({ name: searchItem, ids: [], maxResultCount: 10, tenantDataTierID: this.tenantInfo?.DataTierId, tenantDataTierType: this.tenantInfo?.DataTierType }).subscribe(res => {
      this.areaData = res.items;
    });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => {
        return this.service.getList({
          ...query,
          tenantDataTierID: this.tenantInfo?.DataTierId,
          tenantDataTierType: this.tenantInfo?.DataTierType,
          name: this.filterName,
          area: this.filterForm.controls['area'].value,
          cell: this.filterForm.controls['cell'].value,
          creationTimeFrom: this.filterForm.controls['creationDate'].value
            ? new Date(this.filterForm.controls['creationDate'].value[0]).toLocaleString()
            : '',
          creationTimeTo: this.filterForm.controls['creationDate'].value
            ? new Date(this.filterForm.controls['creationDate'].value[1]).toLocaleString()
            : '',
          modificationTimeFrom: this.filterForm.controls['modificationDate'].value
            ? new Date(this.filterForm.controls['modificationDate'].value[0]).toLocaleString()
            : '',
          modificationTimeTo: this.filterForm.controls['modificationDate'].value
            ? new Date(this.filterForm.controls['modificationDate'].value[1]).toLocaleString()
            : '',
        });
      })
      .subscribe(res => {
        this.data = res;
      });
  }

  add() {
    this.getCell();
    this.selected = {} as WorkCenterDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      cell: [this.selected.cell || '', Validators.required],
      cellName: [''],
    });
    this.form.get('cell').valueChanges.subscribe(selectedId => {
      const selectItem = this.cellData.find(c => c.id === selectedId);
      if (selectItem) {
        this.form.get('cellName').setValue(selectItem.name);
      }
    });
  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      area: [undefined],
      cell: [undefined],
      creationDate: [undefined],
      modificationDate: [undefined],
    });
    this.filterForm.get('area').valueChanges.subscribe(area => {
      if (!area) {
        this.filterForm.get('cell').setValue(undefined);
        this.cellOptinons = [];
        return;
      }
      this.areaService.getTreeView(area).subscribe(res => {
        let map = new Map();
        for (let item of res.cells) {
          if (!map.has(item.id)) {
            map.set(item.id, item);
          }
        }
        this.cellOptinons = [...map.values()];
      });
    });
  }

  edit(row: any) {
    this.getCell();
    this.service.get(row.id).subscribe(workCenter => {
      this.selected = workCenter;
      this.cellService.get(workCenter.cell, { skipHandleError: true }).subscribe({
        next: cell => {
          this.cellData = [...this.cellData, cell];
          this.form.controls['cellName'].setValue(cell.name);
        },
        error: error => {
          this.form.controls['cellName'].setValue('');
        }
      });
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  delete(e: any) {
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
    if (this.form.invalid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    const request = this.selected.id
      ? this.service.update(this.selected.id, this.form.value)
      : this.service.create(this.form.value);
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

  move(e) {
    this.getCell();
    this.isMoveModalVisible = true;
    this.moveToCell = '';
    this.selectedWorkCenterIdList = e.objectIds;
  }

  moveToNewCell() {
    if ([null, ''].includes(this.moveToCell) || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    let needToUpdate = {};
    const cellName = this.cellData.find(d => d.id === this.moveToCell)?.name || '';
    this.selectedWorkCenterIdList.forEach(id => {
      const selectedData = this.data.items.filter((item: AreaDto) => {
        item.site = this.moveToCell;
        return item.id === id;
      })[0];
      const record = {
        name: selectedData.name,
        description: selectedData.description,
        displayName: selectedData.displayName,
        cell: this.moveToCell,
        cellName: cellName
      };
      needToUpdate[id] = record;
    });
    const { name: nameValue } = needToUpdate[Object.keys(needToUpdate)[0]] || {};
    this.service.multipleUpdate(needToUpdate).pipe(finalize(() => { this.modalBusy = false; })).subscribe(res => {
      this.modalBusy = false;
      this.toasterService.success('::LABEL_MovedSuccessfully', '', {
        messageLocalizationParams: [this.info, nameValue, this.cellInfo, cellName],
      });
      this.isMoveModalVisible = false;
      this.list.get();
    });
  }

  searchByfilter(event: string) {
    this.filterName = event;
    this.list.get();
  }

  clearAdvancedFilter() {
    this.filterForm.reset();
    this.list.get();
    this.filterSearchHasValue = false;
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

  filterSearch() {
    this.list.get();
    const { area, cell, creationDate, modificationDate } = this.filterForm.value;
    this.filterSearchHasValue = !!(area || cell || creationDate || modificationDate);
  }
}
