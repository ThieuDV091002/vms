import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApprovalListItem } from './checksheet-template.component';

@Component({
  selector: 'app-checksheet-approval-list',
  template: `
    <div class="row">
        <div class="col-5">{{'::LABEL_Order' | abpLocalization}}<span> * </span></div>
        <div class="col-5">{{'::LABEL_User' | abpLocalization}}<span> * </span></div>
    </div>
    <hr>
    <div *ngFor="let item of approvalList; let idx = index" class="row mb-2">
        <div class="col-5">
            <input type="number" class="form-control" [(ngModel)]="item.order" 
                   (change)="onApprovalListChange()" min="1" />
        </div>
        <div class="col-5">
            <ng-select [items]="users" [appendTo]="'body'" [(ngModel)]="item.userId" 
                       [bindLabel]="'displayName'" [bindValue]="'id'" 
                       (change)="onApprovalListChange()"></ng-select>
        </div>
        <div class="col-1 delete-item">
            <i class="fa fa-trash" (click)="removeItem(idx)"></i>
        </div>
    </div>
    <button class="btn btn-sm btn-primary" type="button" (click)="addItem()">{{'::Add' | abpLocalization }}</button>
  `,
  styles: [`
    hr {
        margin: .5rem 0;
    }
    .delete-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
 `],
})
export class ChecksheetApprovalListComponent {
  _approvalList: ApprovalListItem[];
  @Input()
  set approvalList(approvalList: ApprovalListItem[]) {
    if (!approvalList || (approvalList && approvalList.length === 0)) {
        this._approvalList = [];
        this._approvalList.push({
            order: 1,
            userId: ''
        });
    } else {
        this._approvalList = approvalList.sort((a, b) => a.order - b.order);
    }
  }

  get approvalList(): ApprovalListItem[] {
    return this._approvalList;
  }
  
  @Input() users: any[];
  @Output() approvalListChange: EventEmitter<ApprovalListItem[]> = new EventEmitter<ApprovalListItem[]>();

  addItem() {
    const maxOrder = this.getMaxOrder();
    this.approvalList.push({
        order: maxOrder + 1,
        userId: ''
    });
  }

  onApprovalListChange() {
    // filter items with empty userId or invalid order
    const filteredList = this.approvalList.filter(item => item.userId && item.order > 0);
    this.approvalListChange.emit(filteredList);
  }

  removeItem(index: number) {
    this.approvalList.splice(index, 1);
    this.onApprovalListChange();
  }

  getMaxOrder(): number {
    let max = 0;
    this.approvalList.forEach(item => {
        if (item.order > max) {
            max = item.order;
        }
    });
    return max;
  }
}

