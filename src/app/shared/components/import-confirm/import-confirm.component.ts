import { Component, EventEmitter, Input, Output } from '@angular/core';
import { utils, writeFile } from 'xlsx-js-style';
import { AppUtils } from '../../../modeling/utils/app.utils';
import { FileType } from '@apis/ticket';
enum ImportType { ReplaceAll, SkipAll, CustomeCheck }
@Component({
  selector: 'app-import-confirm',
  template: `
  <abp-modal [(visible)]="importConfirmVisible" [options]="{size: 'lg'}" (visibleChange)="visibleChangeEvent($event)">
    <ng-template #abpHeader>
        <h3>{{'::LABEL_ReplaceOrSkipData' | abpLocalization}}</h3>
    </ng-template>
    <ng-template #abpBody>
    <div class="overall" *ngIf="!customeCheck">
      <h5 class="import-title">
        <i class="fa fa-warning me-1"></i>
        <a href="javascript:void(0)" (click)="download()">{{existingData.length}} {{'::LABEL_DuplicateImportRecords' | abpLocalization}}</a>

      </h5>
      <ul class="import-options">
        <li class="replace" (click)="importContinue(ImportType.ReplaceAll)"><i class="fa fa-check"></i> {{'::LABEL_ImportReplaceOption' | abpLocalization}}</li>
        <li class="skip" (click)="importContinue(ImportType.SkipAll)"><i class="fas fa-rotate-left"></i> {{'::LABEL_ImportSkipOption' | abpLocalization}}</li>
        <li class="custome-check" (click)="customeCheck = true;"><i class="fas fa-list-check"></i> {{'::LABEL_ImportCustomeOption' | abpLocalization}}</li>
      </ul>
    </div>
    <div class="custome-check-item" *ngIf="customeCheck">
      <h5 class="import-title">
        <i class="fa fa-warning me-1"></i>
        <a href="javascript:void(0)" (click)="download()">{{existingData.length}} {{'::LABEL_DuplicateImportRecords' | abpLocalization}}</a>

      </h5>
      <div class="mb-1">{{'::LABEL_ImportSelectReplaceTitle' | abpLocalization}}</div>
      <ul class="custome-check-options">
        @for(data of existingData; track data) {
          <li>
            <input type="checkbox" class="form-check-input" [id]="data[fieldName]" [(ngModel)]="data.selected" (change)="checkData()"/>
            <label [for]="data[fieldName]">{{data[fieldName]}}</label>
          </li>
        }
      </ul>
      <div class="check-all mt-1">
        <input type="checkbox" class="form-check-input" id="check-all" [(ngModel)]="checkAll" (click)="allDataCheck($event.target.checked)"/>
        <label for="check-all">{{'::LABEL_ReplaceAll' | abpLocalization}}</label>
      </div>
    </div>
    </ng-template>
    <ng-template #abpFooter>
        <button *ngIf="customeCheck" class="btn btn-primary" (click)="importContinue(ImportType.CustomeCheck)">
          {{'::Import' | abpLocalization}}
        </button>
        <button type="button" class="btn btn-outline-primary" abpClose>
            {{ 'AbpIdentity::Close' | abpLocalization }}
        </button>
    </ng-template>
</abp-modal>
  `,
  styles: [`
    .import-title i{
      color: var(--lpx-danger);
    }
    input[type="checkbox"] {
      margin-right: 10px;
    }
    ul, li {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
    .import-options li {
      font-size: .9rem;
      cursor: pointer;
      padding: .2rem 0 .2rem 1rem;
      &:hover {
        background-color: var(--lpx-light);
      }
      &.replace {
        i {
          color: var(--lpx-success);
        }
      }
      &.skip {
        i {
          color: var(--lpx-primary);
        }
      }
      &.custome-check {
        i {
          color: var(--lpx-info);
        }
      }
    }
    .custome-check-options {
      overflow: auto;
      max-height: calc(100vh - 320px);
      border: 1px solid var(--lpx-border-color);
      li {
        font-size: .9rem;
        cursor: pointer;
        padding: .2rem 0 .2rem 1rem;
      }
    }
  `]
})
export class ImportConfirmComponent {
  @Input() importConfirmVisible: boolean = false;
  @Output() importConfirmVisibleChange = new EventEmitter<boolean>();
  @Input() existingData: any[];
  @Input() objectType: string;
  @Output() customeImport = new EventEmitter<any>();
  customeCheck: boolean = false;
  ImportType = ImportType;
  checkAll = false;
  fieldName = 'Name';

  ngOnInit(): void {
    this.existingData.forEach(item => {
      item.selected = false;
    });
    if (this.objectType === 'Users') {
      this.fieldName = 'UserName';
    } else if (this.objectType === 'ActivityCardSettings') {
      this.fieldName = 'SiteName';
    } else if (this.objectType === 'SiteSettings') {
      this.fieldName = 'Site';
    } else if (this.objectType === 'AreaSettings') {
      this.fieldName = 'Area';
    } else if (this.objectType === 'WorkCenterSetting') {
      this.fieldName = 'WorkCenter';
    } else if (this.objectType === 'CellSettings') {
      this.fieldName = 'Cell';
    } else if (this.objectType === 'FocusedItems') {
      this.fieldName = 'WorkCenterName';
    } else if (this.objectType === 'NotificationSettings') {
      this.fieldName = 'API';
    }
  }

  download() {
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(JSON.parse(JSON.stringify(this.existingData))
    .map(item => {delete item.selected; return item;}));
    const range = utils.decode_range(worksheet['!ref']);
    // apply style to header
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = utils.encode_cell({ r: 0, c: C }); // Get cell address for the first row
        if (!worksheet[cellAddress]) continue; // Skip if the cell is undefined
        worksheet[cellAddress].s = {
          fill: { fgColor: { rgb: "000000" } },
          font: { color: { rgb: "FFFFFF" } }
        };
    }
    // Append the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate a binary string of the workbook and save it
    writeFile(workbook, AppUtils.generateFileName(`Duplicate_${this.objectType}`, FileType.Excel), { bookType: 'xlsx'});
  }

  allDataCheck(checkall: boolean) {
    this.existingData.forEach(item => {
      item.selected = checkall;
    });
  }

  checkData() {
    // if all existing data selected, set checkall to true, else false
    if (this.existingData.every(item => item.selected)) {
      this.checkAll = true;
    } else {
      this.checkAll = false;
    }
  }

  importContinue(type: ImportType) {
    this.customeCheck = false;
    if (type === ImportType.ReplaceAll) {
      this.customeImport.emit(this.existingData);
    } else if (type === ImportType.SkipAll) {
      this.customeImport.emit([]);
    } else if (type === ImportType.CustomeCheck) {
      const selectedData = this.existingData.filter(item => item.selected);
      this.customeImport.emit(selectedData);
      this.allDataCheck(false);
    }
  }

  visibleChangeEvent(e) {
    if (!e) {this.close()}
  }

  close() {
    this.importConfirmVisible = false;
    this.customeCheck = false;
    this.checkAll = false;
    this.importConfirmVisibleChange.emit(this.importConfirmVisible);
  }

}
