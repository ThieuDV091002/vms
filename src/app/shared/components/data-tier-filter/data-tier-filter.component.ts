import { ConfigStateService } from '@abp/ng.core';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AreaDto, CellDto, SiteDto, WorkCenterDto } from '@apis/corporate/dtos';
import { TreeviewUserWithAssignedDataTierDto } from '@proxy/dtos/assigned-data-tiers';
import { UserService } from '@proxy/services';

@Component({
  selector: 'app-data-tier-filter',
  templateUrl: './data-tier-filter.component.html',
  styleUrl: './data-tier-filter.component.scss',
})
export class DataTierFilterComponent implements OnInit {
  @Input() multiple = false;
  @Input() dataTierLevel;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private configStateService: ConfigStateService
  ) { }
  userDataTier: TreeviewUserWithAssignedDataTierDto
  sites: any[];
  areas: any[];
  cells: any[];
  workCenters: any[];
  dataTierFilter: FormGroup;
  @Output() siteChange: EventEmitter<SiteDto> = new EventEmitter<SiteDto>();
  @Output() areaChange: EventEmitter<AreaDto> = new EventEmitter<AreaDto>();
  @Output() cellChange: EventEmitter<CellDto> = new EventEmitter<CellDto>();
  @Output() workCenterChange: EventEmitter<WorkCenterDto> = new EventEmitter<WorkCenterDto>();

  ngOnInit(): void {
    this.userService.getTreeviewDataTiersByUser(this.configStateService.getOne('currentUser').id).subscribe(res => {
      if (res && res.assignedDataTiers.length > 0) {
        this.userDataTier = res;
        this.areas = res.assignedDataTiers
          .filter(d => d.areaId)
          .map(d => ({ id: d.areaId, type: 'Area', name: d.areaName }))
          .filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.id === value.id && t.name === value.name
            ))
          )
          .sort((a, b) => a.name?.localeCompare(b.name));
      }
      if (this.userDataTier?.defaultDataTier) {
        const area = this.areas.find(a => a.id === this.userDataTier.defaultDataTier.areaId);
        this.dataTierFilter.patchValue({ area: area });
        // if (this.multiple) {
          this.dataTierFilter.patchValue({ areas: [area] });
        // }
        if (this.userDataTier.defaultDataTier.cellId) {
          const cell = this.cells.find(c => c.id === this.userDataTier.defaultDataTier.cellId)
          this.dataTierFilter.patchValue({ cell: cell });
          // if (this.multiple) {
            this.dataTierFilter.patchValue({ cells: [cell] });
          // }
        }
        if (this.userDataTier.defaultDataTier.workCenterId) {
          const workCenter = this.workCenters.find(w => w.id === this.userDataTier.defaultDataTier.workCenterId)
          this.dataTierFilter.patchValue({ workCenter: workCenter });
          // if (this.multiple) {
            this.dataTierFilter.patchValue({ workCenters: [workCenter] });
          // }
        }
      }
    })

    this.dataTierFilter = this.fb.group({
      site: null,
      area: null,
      cell: null,
      workCenter: null,
      sites: null,
      areas: null,
      cells: null,
      workCenters: null
    });
    if (this.multiple) {
      this.dataTierFilter.controls.areas.valueChanges.subscribe(value => {
        this.onAreaChange(value);
      });
      this.dataTierFilter.controls.cells.valueChanges.subscribe(value => {
        this.onCellChange(value);
      });
      this.dataTierFilter.controls.workCenters.valueChanges.subscribe(value => {
        this.onWorkCenterChange(value);
      });
    } else {
      this.dataTierFilter.controls.area.valueChanges.subscribe(value => {
        this.onAreaChange(value);
      });
      this.dataTierFilter.controls.cell.valueChanges.subscribe(value => {
        this.onCellChange(value);
      });
      this.dataTierFilter.controls.workCenter.valueChanges.subscribe(value => {
        this.onWorkCenterChange(value);
      });
    }
  }

  onAreaChange(event: any) {
    if (this.multiple) {
      this.dataTierFilter.patchValue({ cells: null, workCenters: null, cell: null, workCenter: null }, { emitEvent: false });
      this.dataTierFilter.patchValue({ area: this.dataTierFilter.get('areas').value[0] }, { emitEvent: false });
      setTimeout(() => {
        this.areaChange.emit(this.dataTierFilter.value);
      }, 0);
      const areaIds = this.dataTierFilter.get('areas').value.map(a => a.id);
      this.cells = this.userDataTier.assignedDataTiers.filter(d => areaIds.includes(d.areaId) && d.cellName).map(d => ({ id: d.cellId, type: 'Cell', name: d.cellName })).filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.id === value.id && t.name === value.name
        ))
      ).sort((a, b) => a.name?.localeCompare(b.name));
    } else {
      this.dataTierFilter.patchValue({ cells: null, workCenters: null, cell: null, workCenter: null }, { emitEvent: false });
      this.dataTierFilter.patchValue({ areas: [this.dataTierFilter.get('area').value].filter(x => x) }, { emitEvent: false });
      setTimeout(() => {
        this.areaChange.emit(this.dataTierFilter.value);
      }, 0);
      const areaId = this.dataTierFilter.get('area').value?.id;
      this.cells = this.userDataTier.assignedDataTiers.filter(d => d.areaId == areaId && d.cellName).map(d => ({ id: d.cellId, type: 'Cell', name: d.cellName })).filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.id === value.id && t.name === value.name
        ))
      ).sort((a, b) => a.name?.localeCompare(b.name));
    }
  }

  onCellChange(event: any) {
    if (this.multiple) {
      this.dataTierFilter.patchValue({ workCenters: null, workCenter: null }, { emitEvent: false });
      this.dataTierFilter.patchValue({ cell: this.dataTierFilter.get('cells').value[0] }, { emitEvent: false });
      setTimeout(() => {
        this.cellChange.emit(this.dataTierFilter.value);
      }, 0);
      const cellIds =this.dataTierFilter.get('cells').value.map(c=>c.id);
      this.workCenters = this.userDataTier.assignedDataTiers.filter(d => cellIds.includes(d.cellId) && d.workCenterName).map(d => ({ id: d.workCenterId, type: 'WorkCenter', name: d.workCenterName })).filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.id === value.id && t.name === value.name
        ))
      ).sort((a, b) => a.name?.localeCompare(b.name));
    } else {
      this.dataTierFilter.patchValue({ workCenters: null, workCenter: null }, { emitEvent: false });
      this.dataTierFilter.patchValue({ cells: [this.dataTierFilter.get('cell').value].filter(x => x) }, { emitEvent: false });
      setTimeout(() => {
        this.cellChange.emit(this.dataTierFilter.value);
      }, 0);
      const cellId = this.dataTierFilter.get('cell').value?.id;
      this.workCenters = this.userDataTier.assignedDataTiers.filter(d => d.cellId == cellId && d.workCenterName).map(d => ({ id: d.workCenterId, type: 'WorkCenter', name: d.workCenterName })).filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.id === value.id && t.name === value.name
        ))
      ).sort((a, b) => a.name?.localeCompare(b.name));
    }
  }

  onWorkCenterChange(event: any) {
    // issue emit the value imeediately will emit old value, so use setTimeout to emit the latest value
    if (this.multiple) {
      this.dataTierFilter.patchValue({ workCenter: this.dataTierFilter.get('workCenters').value[0] }, { emitEvent: false });
    } else {
      this.dataTierFilter.patchValue({ workCenters: [this.dataTierFilter.get('workCenter').value].filter(x => x) }, { emitEvent: false });
    }
    setTimeout(() => {
      this.workCenterChange.emit(this.dataTierFilter.value);
    }, 0);
  }
}
