import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ShiftDto, ShiftPatternDetailDto } from "@apis/general/dtos";

@Component({
    selector: "app-shift-pattern-details",
    template: `
        <div class="action-bar">
            <button type="button" class="btn btn-primary btn-sm me-1" (click)="add()">
                <i class="fas fa-plus me-1"></i>
                {{'::Create' | abpLocalization}}
            </button>
            <button type="button" class="btn btn-danger btn-sm" (click)="delete()" [disabled]="selectedshiftPatternDetails?.length === 0">
                <i class="fas fa-trash me-1"></i>
                {{'::Delete' | abpLocalization}}
            </button>
        </div>
        <ngx-datatable [rows]="shiftPatternDetails" [count]="shiftPatternDetails?.length" [limit]="'10'" [displayCheck]="displayCheck"
          [selectionType]="'checkbox'" [selected]="selectedshiftPatternDetails" (select)="onSelect($event)" default>
          <ngx-datatable-column name="" [checkboxable]="true" [headerCheckboxable]="shiftPatternDetails?.length" [width]="25"
            [sortable]="false" [canAutoResize]="false">
          </ngx-datatable-column>
            <ngx-datatable-column [name]="('::LABEL_Shift' | abpLocalization) + ' *'" [sortable]="false" [canAutoResize]="false" [width]="160">
                <ng-template let-row="row" ngx-datatable-cell-template>
                    <ng-select [items]="shifts" appendTo="body" bindValue="id" bindLabel="displayName" [(ngModel)]="row.shiftId"></ng-select>
                </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column [name]="('::LABEL_StartTime' | abpLocalization) + ' *'" [sortable]="false" [canAutoResize]="false" [width]="150">
                <ng-template let-row="row" ngx-datatable-cell-template>
                    <ng-select [items]="startTimeOptions" appendTo="body" bindValue="name" bindLabel="name" [(ngModel)]="row.startTime"></ng-select>
                </ng-template>
            </ngx-datatable-column>
        </ngx-datatable>
    `,
    styles: [`
        :host {
            position: relative;
        }
        ngx-datatable ng-select {
            line-height: 1.3rem;
        }
        .action-bar {
            display: inline-block;
            float: right;
        }
        @media (max-width: 992px) {
            .action-bar {
                display: flex;
                justify-content: flex-end;
                float: none;
            }
        }
    `]
}) export class ShiftPatternDetailsComponent implements OnInit {
    @Input() shiftPatternDetails: ShiftPatternDetailDto[] = [];
    @Output() shiftPatternDetailsChange = new EventEmitter<ShiftPatternDetailDto[]>();
    @Input() shifts: ShiftDto[] = [];
    selectedshiftPatternDetails: ShiftPatternDetailDto[] = [];
    startTimeOptions = [];

    ngOnInit(): void {
        // generate starttime options  00:00:00 - 23:30:00 every half hour
        for (let i = 0; i < 48; i++) {
            const hour = (Math.floor(i / 2) + '').padStart(2, '0');
            const minute = i % 2 === 0 ? '00' : '30';
            this.startTimeOptions.push({
                name: `${hour}:${minute}:00`
            });
        }
    }

    displayCheck() {
        return true;
      }

      add() {
        this.shiftPatternDetails = [...this.shiftPatternDetails, {
            shiftId: '',
            startTime: ''
        }];
        this.shiftPatternDetailsChange.emit(this.shiftPatternDetails);
      }
      onSelect({ selected }) {
        if (selected && Array.isArray(selected)) {
            this.selectedshiftPatternDetails = selected;
        }
      }

      delete() {
        this.shiftPatternDetails = this.shiftPatternDetails.filter(x => !this.selectedshiftPatternDetails.includes(x));
        this.shiftPatternDetailsChange.emit(this.shiftPatternDetails);
        this.selectedshiftPatternDetails = [];
      }
 }
