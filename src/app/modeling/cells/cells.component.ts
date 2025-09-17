import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { debounceTime, finalize, Subject } from 'rxjs';
import { CellService, AreaService } from '@apis/corporate';
import { CellGetListInput, CreateUpdateCellDto, CellDto, AreaDto, ModelingHistoryDto } from '@apis/corporate/dtos';

@Component({
  selector: 'app-cells',
  templateUrl: './cells.component.html',
  styleUrl: './cells.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'CellsComponent',
    },
  ],
})
export class CellsComponent
  extends ModelingBase<CellService, CellGetListInput, CreateUpdateCellDto>
  implements OnInit {
  protected readonly areaService = inject(AreaService);

  data: PagedResultDto<CellDto> = { items: [], totalCount: 0 };
  selected: CellDto;
  form: FormGroup;
  historys: PagedResultDto<ModelingHistoryDto>;
  isModalVisible = false;
  isHistoryModalVisible = false;
  isMoveModalVisible = false;
  selectedCellsIdList: string[];
  areaData: AreaDto[] = [];
  moveToArea = '';
  modalBusy = false;
  searchName = '';
  info: string;
  infos: string;
  areaInfo: string;
  tenantInfo: any;
  areaInput$ = new Subject<string | null>();
  debounceTime = 500;

  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    public list: ListService<CellGetListInput>,
    public service: CellService,
    private localizationService: LocalizationService,
  ) {
    super(service, list, 'cell');
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::Cell').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::Cells').subscribe(data => {
      this.infos = data
    });
    this.localizationService.get('::Area').subscribe(data => {
      this.areaInfo = data
    });
    this.areaInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.getAreas(searchItem);
      });
  }

  getAreas(searchItem = '', ids = []) {
    this.areaService
      .getList({
        ids: ids,
        name: searchItem,
        maxResultCount: 10,
        tenantDataTierID: this.tenantInfo?.DataTierId,
        tenantDataTierType: this.tenantInfo?.DataTierType
      })
      .subscribe(data => {
        // const filteredAreas = this.areaData.filter(area => !data.items.some(item => item.id === area.id));
        // this.areaData = [...data.items, ...filteredAreas];
        this.areaData = data.items;
      });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => {
        return this.service.getList({ ...query, name: this.searchName, tenantDataTierID: this.tenantInfo?.DataTierId, tenantDataTierType: this.tenantInfo?.DataTierType });
      })
      .subscribe(res => {
        this.data = res;
      });
  }

  add() {
    this.getAreas();
    this.selected = {} as CellDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      area: [this.selected.area || undefined, Validators.required],
      areaName: [this.areaData.find(c => c.id === this.selected?.area)?.name || ''],
    });
    this.form.get('area').valueChanges.subscribe(selectedId => {
      const selectItem = this.areaData.find(c => c.id === selectedId);
      if (selectItem) {
        this.form.get('areaName').setValue(selectItem.name);
      }
    });
  }

  edit(row: any) {
    this.getAreas();
    this.service.get(row.id).subscribe(cell => {
      this.getAreas('', [cell.area]);
      this.selected = cell;
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
    this.getAreas();
    this.isMoveModalVisible = true;
    this.moveToArea = undefined;
    this.selectedCellsIdList = e.objectIds;
  }

  moveToNewArea() {
    if ([null, ''].includes(this.moveToArea) || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    let needToUpdate = {};
    const areaName = this.areaData.find(d => d.id === this.moveToArea)?.name || '';
    this.selectedCellsIdList.forEach(id => {
      const selectedData = this.data.items.filter((item: CellDto) => {
        item.area = this.moveToArea;
        return item.id === id;
      })[0];
      const record = {
        name: selectedData.name,
        description: selectedData.description,
        displayName: selectedData.displayName,
        area: this.moveToArea,
        areaName: areaName
      };
      needToUpdate[id] = record;
    });
    const { name: nameValue } = needToUpdate[Object.keys(needToUpdate)[0]] || {};
    this.service.multipleUpdate(needToUpdate).pipe(finalize(() => { this.modalBusy = false; })).subscribe(res => {
      this.modalBusy = false;
      this.toasterService.success('::LABEL_MovedSuccessfully', '', {
        messageLocalizationParams: [this.info, nameValue, this.areaInfo, areaName],
      });
      this.isMoveModalVisible = false;
      this.list.get();
    });
  }

  searchByfilter(event: string) {
    this.searchName = event;
    this.list.get();
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

  selectChange(event) {
    if (event?.id) {
      this.form.controls['area'].setValue(event.id);
    } else {
      this.form.controls['area'].setValue(undefined);
    }
  }
}
