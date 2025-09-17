import { LocalizationService, ConfigStateService } from '@abp/ng.core';
import { ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CellDto } from '@apis/corporate/dtos';
import { ShiftService, CommentService } from '@apis/general';
import { ShiftPatternByDateDto, ShiftDto, ShiftByDataTierItemDto } from '@apis/general/dtos';
import { UserService } from '@proxy/services';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'app-add-comment-data',
  templateUrl: './add-comment-data.component.html',
  styleUrl: './add-comment-data.component.scss'
})
export class AddCommentDataComponent implements OnInit, OnChanges, OnDestroy {
  @Input() openModal: any;
  @Input() selectedComment: any;
  @Input() areaData: any;
  @Input() currentShift: ShiftPatternByDateDto;
  @Input() showInterval: boolean;
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshList: EventEmitter<boolean> = new EventEmitter();
  isModalVisible = false;
  modalBusy = false;
  form: FormGroup;
  info: string;
  shiftData: ShiftByDataTierItemDto[] = [];
  defaultDataTier = {
    area: '',
    cell: ''
  };
  cellData: CellDto[] = [];
  shiftIntervaltData: string[] = [];
  subscription: Subscription;

  constructor(private confirmation: ConfirmationService,
    private shiftService: ShiftService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private service: CommentService,
    private localizationService: LocalizationService,
    private toasterService: ToasterService,
    private userService: UserService,
    private configService: ConfigStateService
  ) {

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.openModal && changes.openModal.currentValue) {
      this.isModalVisible = true;
    }
    if (changes.currentShift && changes.currentShift.currentValue) {
      this.buildForm();
    }
  }

  ngOnInit(): void {
    if (!this.selectedComment?.id) {
      this.getDefaultUserDataTier();
    }
    this.localizationService.get('::Comment').subscribe(data => {
      this.info = data
    });
  }

  getDefaultUserDataTier() {
    const userId = this.configService.getOne('currentUser').id;
    this.userService.getUserDefaultDataTiersByIdByUserId(userId).subscribe(res => {
      if (res.area) {
        this.defaultDataTier['area'] = res.area.id;
        if (res.cell) {
          this.defaultDataTier['cell'] = res.cell.id;
        }
      }
      if (this.defaultDataTier.area) {
        this.form.controls['area'].setValue(this.defaultDataTier.area, { emitEvent: false });
        this.cellData = this.areaData.find(d => d.id == this.form.controls['area'].value)?.children;
      }
      if (this.defaultDataTier.cell) {
        this.form.controls['cell'].setValue(this.defaultDataTier.cell);
      }
    });
  }

  getShiftByDataTier(dataTier: { areaIds: string[], cellIds: string[], wrokCenterIds: string[] }) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.shiftService.getShiftByDataTier({ areaIds: dataTier.areaIds, cellIds: dataTier.cellIds, wrokCenterIds: dataTier.wrokCenterIds }).subscribe(res => {
      this.shiftData = res.items;
      if (this.selectedComment?.id && this.showInterval) {
        this.shiftIntervaltData = this.shiftData.find(x => x.shiftId === this.selectedComment.shiftId).shiftIncrementList;
      }
      if (!this.selectedComment?.id) {
        this.getCurrentShift(dataTier);
      }
    });
  }

  getCurrentShift(dataTier: { areaIds: string[], cellIds: string[], wrokCenterIds: string[] }) {
    this.shiftService.getShiftByDate(new Date().toISOString(), { areaIds: dataTier.areaIds, cellIds: dataTier.cellIds, wrokCenterIds: dataTier.wrokCenterIds }).subscribe((res) => {
      this.form.controls['shift'].setValue(res.shiftId);
      this.shiftIntervaltData = this.shiftData.find(x => x.shiftId === res.shiftId).shiftIncrementList;
      this.form.controls['productionDate'].setValue(new Date(res.productionDate));
    });
  }

  buildForm() {
    this.form = this.fb.group({
      productionDate: [new Date(this.selectedComment?.productionDate) || undefined, Validators.required],
      area: [this.selectedComment?.areaId || undefined, Validators.required],
      cell: [this.selectedComment?.cellId || undefined, Validators.required],
      shift: [this.selectedComment?.shiftId || undefined, Validators.required],
      comment: [this.selectedComment?.commentText || undefined, Validators.required],
      location: [this.selectedComment?.location || undefined]
    });
    if (this.showInterval) {
      this.form.addControl('shiftInterval', this.fb.control(this.selectedComment?.shiftIntervals || undefined));
    }

    this.form.controls['area'].valueChanges.subscribe(value => {
      if (value) {
        this.cellData = this.areaData.find(d => d.id == value)?.children
        this.getShiftByDataTier({ areaIds: [value], cellIds: [], wrokCenterIds: [] })
      } else {
        this.cellData = [];
        this.shiftData = [];
      }
      this.form.controls['cell'].setValue(undefined, { emitEvent: false });
      this.form.controls['shift'].setValue(undefined);
    });

    this.form.controls['cell'].valueChanges.subscribe(value => {
      if (value) {
        this.getShiftByDataTier({ areaIds: [this.form.controls['area'].value], cellIds: [value], wrokCenterIds: [] })
      } else {
        this.getShiftByDataTier({ areaIds: [this.form.controls['area'].value], cellIds: [], wrokCenterIds: [] })
      }
      this.form.controls['shift'].setValue(undefined);
    });

    this.form.controls['productionDate'].valueChanges.subscribe(value => {
      if (new Date(value).toDateString() !== new Date(this.currentShift.productionDate).toDateString() || this.selectedComment?.id) {
        this.form.controls['shift'].setValue(undefined);
        if (this.form.controls['shiftInterval']) {
          this.form.controls['shiftInterval'].setValue(undefined);
        }
        this.shiftIntervaltData = [];
      }
    });

    // only add
    if (!this.selectedComment?.id) {
      this.form.controls['productionDate'].setValue(new Date(this.currentShift.productionDate));
      this.form.controls['shift'].setValue(this.currentShift.shiftId);
      this.shiftIntervaltData = this.currentShift.intervalList;
    } else {
      this.cellData = this.areaData.find(d => d.id == this.selectedComment.areaId)?.children;
      this.getShiftByDataTier({ areaIds: [this.selectedComment.areaId], cellIds: [this.selectedComment.cellId], wrokCenterIds: [] });
    }

    this.form.controls['shift'].valueChanges.subscribe(value => {
      if (value) {
        this.shiftIntervaltData = this.shiftData.find(x => x.shiftId === value).shiftIncrementList;
      } else {
        this.shiftIntervaltData = [];
      }
      if (this.form.controls['shiftInterval']) {
        this.form.controls['shiftInterval'].setValue(undefined);
      }
    })
  }

  save() {
    if (this.form.invalid || this.modalBusy) {
      return;
    }
    const requestBody = {
      productionDate: this.datePipe.transform(this.form.value.productionDate, 'yyyy-MM-dd'),
      areaId: this.form.value.area,
      cellId: this.form.value.cell,
      shiftId: this.form.value.shift,
      shiftIntervals: this.form.value?.shiftInterval,
      commentText: this.form.value.comment,
      location: this.form.value.location,
      extraProperties: this.form.value.extraProperties,
      tenantId: this.selectedComment?.tenantId || ''
    }
    this.modalBusy = true;
    const request = this.selectedComment?.id
      ? this.service.update(this.selectedComment?.id, requestBody)
      : this.service.create(requestBody);
    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      this.modalBusy = false;
      if (!this.selectedComment?.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.form.value.comment],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selectedComment.commentText],
        });
      }
      this.isModalVisible = false;
      this.form.reset();
      this.refreshList.emit(true);
      this.close();
    });
  }

  close(event?: any) {
    if (!event) {
      this.isModalVisible = false;
      this.closeEvent.emit(true);
    }
  }

  selectChange(event, type) {
    if (type === 'area') {
      if (event?.id) {
        this.form.controls['area'].setValue(event.id);
      }
      else {
        this.form.controls['area'].setValue(undefined);
      }
    }

    if (type === 'cell') {
      if (event?.id) {
        this.form.controls['cell'].setValue(event.id);
      }
      else {
        this.form.controls['cell'].setValue(undefined);
      }
    }

    if (type === 'shift') {
      if (event?.shiftId) {
        this.form.controls['shift'].setValue(event.shiftId);
      }
      else {
        this.form.controls['shift'].setValue(undefined);
      }
    }
  }

}
