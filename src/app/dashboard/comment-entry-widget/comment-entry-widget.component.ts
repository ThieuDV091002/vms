import { LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommentService, ShiftService } from '@apis/general';
import { CommentEntryComponent } from '../comment-entry/comment-entry.component';
import { AppUtils } from 'src/app/modeling/utils/app.utils';
import { DatePipe } from '@angular/common';
import { ShiftPatternByDateDto } from '@apis/general/dtos';
import { catchError, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-comment-entry-widget',
  templateUrl: './comment-entry-widget.component.html',
  styleUrl: './comment-entry-widget.component.scss'
})
export class CommentEntryWidgetComponent implements OnInit, OnChanges {
  @Input() selected: any = { title: '', url: '', hideTitle: false };
  @Input() index = -1;
  @Input() selectedDataTier;
  private _dataTierTreeNode: any[] = [];
  @Input()
  set dataTierTreeNode(value: any[]) {
    this._dataTierTreeNode = value;
    const userAssignedDataTier = JSON.parse(JSON.stringify(AppUtils.getAccessTreNode(value)));
    userAssignedDataTier.forEach(element => {
      if (element.disabled) {
        element.disabled = false;
      }
      element.children = element.children.filter(x => !x.disabled);
    });
    this.areaData = userAssignedDataTier.filter(x => x.children.length > 0);
  }

  get dataTierTreeNode(): any[] {
    return this._dataTierTreeNode;
  }
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren(CommentEntryComponent) commentEntryComponent!: QueryList<CommentEntryComponent>;
  @Input() expandChart = false;
  @Input() queryId;
  listView = false;

  isSettingsModalVisible = false;
  searchKeyword = '';
  nextShift: any;
  allShiftInfoList = [];
  currentShiftInfoList = [];
  isModalVisible = false;
  modalBusy = false;
  selectedComment: any;
  form: FormGroup;
  areaData: any[] = [];
  currentShift: ShiftPatternByDateDto;
  currentIndex = 0;
  hideTitle = false;
  pageSize: number;
  widgetTitle: string;
  info: string;
  widget: string;
  dataTier: any;
  currentShiftSubscription: Subscription;
  previousShiftSubscription: Subscription;
  noShiftParrernConfigedError = '';


  constructor(private confirmation: ConfirmationService,
    private shiftService: ShiftService,
    private service: CommentService,
    private localizationService: LocalizationService,
    private toasterService: ToasterService,
    private datePipe: DatePipe
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected?.currentValue) {
      this.widgetTitle = this.selected.name;
      this.pageSize = Number(this.selected.extraProperties?.pageSize) || 10;
      if (this.pageSize < 10) this.pageSize = 10;

      this.hideTitle = this.selected.extraProperties?.hideTitle;
    }

    if (changes.selectedDataTier) {
      this.dataTier = {
        workCenters: [],
        cells: [],
        areas: []
      };
      if (changes.selectedDataTier.currentValue) {
        const selectedDataTier = changes.selectedDataTier.currentValue;
        if (selectedDataTier.workCenters?.length > 0) {
          this.dataTier.workCenters = selectedDataTier.workCenters.map(x => x.id);
        }
        if (selectedDataTier.cells?.length > 0) {
          this.dataTier.cells = selectedDataTier.cells.map(x => x.id);
        }
        if (selectedDataTier.areas?.length > 0) {
          this.dataTier.areas = selectedDataTier.areas.map(x => x.id);
        }
      }
      this.allShiftInfoList = [];
      this.getCurrentShift();
    }
  }

  ngOnInit(): void {
    this.localizationService.get('::Comment').subscribe(data => {
      this.info = data
    });

    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widget = data;
    });
  }

  getCurrentShift() {
    if (this.currentShiftSubscription) {
      this.currentShiftSubscription.unsubscribe();
    }
    this.currentShiftSubscription = this.shiftService.getShiftByDate(new Date().toISOString(), {
      areaIds: this.dataTier.areas,
      cellIds: this.dataTier.cells,
      wrokCenterIds: this.dataTier.workCenters
    }).pipe(
      catchError((error) => {
        this.noShiftParrernConfigedError = error.error.error.message;
        return of(null);
      })
    ).subscribe((res) => {
      if (res) {
        res['isCurrent'] = true;
        this.currentShift = res;
        this.allShiftInfoList.push(res);
        this.getPreviousShift(res.productionDate, res.shiftId);
      }
    });
  }

  getPreviousShift(productionDate, shiftId) {
    if (this.previousShiftSubscription) {
      this.previousShiftSubscription.unsubscribe();
    }
    this.previousShiftSubscription = this.shiftService.getPreviousShift(productionDate, shiftId, {
      areaIds: this.dataTier.areas,
      cellIds: this.dataTier.cells,
      wrokCenterIds: this.dataTier.workCenters
    }).subscribe((res) => {
      this.allShiftInfoList.unshift(res);
      this.editcurrentCommentEntryInfoList('previous');
    })
  }

  // getNextShift(productionDate, shiftName) {
  //   this.shiftService.getNextShift(productionDate, shiftName, {
  //     areaIds: this.dataTier.areas,
  //     cellIds: this.dataTier.cells,
  //     wrokCenterIds: this.dataTier.workCenters
  //   }).subscribe((res) => {
  //     this.allShiftInfoList.push(res);
  //     this.editcurrentCommentEntryInfoList('next');
  //   })
  // }

  editcurrentCommentEntryInfoList(action) {
    if (this.allShiftInfoList.length > 2) {
      this.currentShiftInfoList = this.allShiftInfoList.slice(this.currentIndex, this.currentIndex + 2);
    } else {
      this.currentShiftInfoList = this.allShiftInfoList;
    }
  }

  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
  }

  toggleView() {

    const currentWidgetName = this.selected.widgetName;
    const isShiftComment = currentWidgetName === 'shiftComment';

    sessionStorage.setItem('shiftCommentWidgetName', this.selected.name);

    const rawName = sessionStorage.getItem('commentWidgetName');
    const commentName = (!rawName || rawName === 'null') ? 'Comments' : rawName;

    const newWidget = {
      ...this.selected,
      widgetName: isShiftComment ? 'commentPage' : 'shiftComment',
      name: isShiftComment ? commentName : 'Shift Comments',
      displayName: isShiftComment ? 'Comments' : 'Shift Comments',
      _isToggleViewAction: true
    };

    this.updateChange.emit({
      type: 'update',
      widget: newWidget,
      _isToggleViewAction: true,
      skipNotification: true
    });
  }

  deleteShiftCommentWidget() {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.widget, this.selected.name]
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.updateChange.emit({ type: 'delete', widget: this.selected });
      }
    });
  }

  goToPrevious() {
    if (this.currentIndex !== 0) {
      this.currentIndex = this.currentIndex - 1;
      this.editcurrentCommentEntryInfoList('previous')
    } else {
      const param = this.currentShiftInfoList[0];
      this.getPreviousShift(param.productionDate, param.shiftId);
    }

  }

  goToNext() {
    this.currentIndex = this.currentIndex + 1;
    this.editcurrentCommentEntryInfoList('next');
  }

  openSettings() {
    this.isSettingsModalVisible = true;
  }

  add() {
    this.selectedComment = {};
    this.isModalVisible = true;
  }

  closeAddModal() {
    this.isModalVisible = false;
  }

  refreshTableList() {
    this.commentEntryComponent.first.list.get();
    this.commentEntryComponent.last.list.get();
  }

  saveSettings() {
    if (this.widgetTitle === '' || [null, 0].includes(this.pageSize)) {
      return;
    }
    const requestBody: any = {
      dashboardId: this.selected.dashboardId,
      seq: this.selected.seq,
      widgetName: this.selected.widgetName,
      name: this.widgetTitle,
      description: this.selected.description,
      tenantId: this.selected.tenantId,
      displayName: this.selected.displayName,
      id: this.selected.id,
      extraProperties: {
        pageSize: this.pageSize.toString(),
        hideTitle: this.hideTitle
      }
    }

    this.updateChange.emit({ type: 'update', widget: requestBody });
    this.isSettingsModalVisible = false;
    this.selected = requestBody;
  }

  editOrDelete(event) {
    if (event.action === 'edit') {
      this.service.get(event.id).subscribe(res => {
        this.selectedComment = res;
        this.isModalVisible = true;
      })
    } else {
      this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info, event.comment]
      }).subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service.delete(event.id).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
              messageLocalizationParams: [this.info, event.comment],
            });
            this.commentEntryComponent.first.list.get();
            this.commentEntryComponent.last.list.get();
          });
        }
      });
    }
  }
}
