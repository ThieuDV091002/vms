import { Component, Input } from '@angular/core';
import { FailedImportResultItemDto } from '@proxy/dtos';

@Component({
  selector: 'app-modeling-import-detail',
  template: `
    <h5 class="import-title"><i class="fa fa-warning"></i> {{'::TITLE_ImportDetails' | abpLocalization}}</h5>
    <ngx-datatable default [rows]="items" [count]="items.length" [headerHeight]="40"
        [reorderable]="true" [columnMode]="'force'">
        <ngx-datatable-column [name]="'::Name' | abpLocalization" prop="name">
        </ngx-datatable-column>
        <ngx-datatable-column [name]="'::errorMessage' | abpLocalization" prop="errorMessage">
          <ng-template let-row="row" ngx-datatable-cell-template>
            <span class="error-detail" *ngIf="row.errorMessage">{{row.errorMessage}}</span>
          </ng-template>
        </ngx-datatable-column>
    </ngx-datatable>
  `,
  styles: [`
    .import-title {
      color: var(--lpx-danger);
    }
    span.error-detail {
      word-break: break-all;
    }
  `]
})
export class ImportDetailComponent {
  @Input() items: FailedImportResultItemDto[];

}
