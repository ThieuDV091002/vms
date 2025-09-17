import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, PagedResultDto, PermissionService } from '@abp/ng.core';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommentService } from '@apis/general';
import { CommentDto, CommentGetListInput } from '@apis/general/dtos';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { FileType } from '@apis/dashboard';
import { saveAs } from 'file-saver';
import { AppUtils } from 'src/app/modeling/utils/app.utils';
import { ConfirmationService } from '@abp/ng.theme.shared';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-comment-entry',
  templateUrl: './comment-entry.component.html',
  styleUrl: './comment-entry.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'CommentEntryComponent',
    },
  ],
})
export class CommentEntryComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() shiftInfo: any;
  @Input() pageSizeFromSettings: any;
  @Input() expand: any;
  @Input() searchKeyword: any;
  @Input() selectedDataTier: any;
  @Input() listView = false;
  @Output() editOrDeleteEvent = new EventEmitter<any>();
  loading: any = false;
  subscription: Subscription;
  dataTier: any;

  @ViewChild('myTable') table: DatatableComponent;
  data: PagedResultDto<CommentDto> = { totalCount: 0, items: [] };
  pageSize = 10;
  keyword = '';

  constructor(public list: ListService<CommentGetListInput>,
    public service: CommentService,
    private confirmationService: ConfirmationService,
    private permissionService: PermissionService,
    private http: HttpClient, 
    private datePipe: DatePipe
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.expand) {
      setTimeout(() => {
        this.table.recalculate();
      }, 0);
    }

    if (changes.shiftInfo?.currentValue) {
      this.hookToQuery();
    }

    if (changes.searchKeyword) {
      this.keyword = changes.searchKeyword.currentValue;
      this.hookToQuery();
    }

    if (changes.pageSizeFromSettings?.currentValue) {
      this.pageSize = Number(changes.pageSizeFromSettings.currentValue) || 10;
      if (this.pageSize < 10) this.pageSize = 10;

      this.hookToQuery();
    }   
    if (changes.selectedDataTier && changes.selectedDataTier.currentValue) {
      this.dataTier = changes.selectedDataTier.currentValue;
      this.hookToQuery()
    }
  }

  ngAfterViewInit(): void {
    this.pageSize = Number(this.pageSizeFromSettings) || 10;
    if (this.pageSize < 10) this.pageSize = 10;

    this.table.limit = this.pageSize;
  }

  ngOnInit(): void {
    this.pageSize = Number(this.pageSizeFromSettings) || 10;
    if (this.pageSize < 10) this.pageSize = 10;
  }
  getBrowserLocalTime(date: Date | string): string {
    try {
      const utcDate = new Date(`${date}+00:00`);
      if (isNaN(utcDate.getTime())) return '';      
      return this.datePipe.transform(utcDate, 'dd MM yyyy, hh:mm:ss a') || '';
    } catch (e) {
      return this.datePipe.transform(date, 'dd MM yyyy, hh:mm:ss a') || '';
    }
  }

  hasEditOrDeletePermission() {
    return this.permissionService.getGrantedPolicy('Comment.Edit') || this.permissionService.getGrantedPolicy('Comment.Delete')
  }

  hookToQuery() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.list.hookToQuery((query) => {
      return this.service.getList(
        {
        ...query,
        productionDate: this.datePipe.transform(new Date(this.shiftInfo.productionDate), 'yyyy-MM-dd'),
        shiftId: this.shiftInfo.shiftId,
        keyword: this.keyword,
        cellId: this.dataTier?.cell?.id,
        areaId: this.dataTier?.area?.id,
        isShiftCommentOnly: false,
        maxResultCount: this.pageSize,
        skipCount: this.table.offset * this.pageSize,
      }
    )
    }).subscribe(res => {
      this.data = res;
    });
  }

  editOrDelete(id, comment, action) {
    this.editOrDeleteEvent.emit({ id: id, action: action, comment: comment });
  }

  download() {
    this.service.exportByFilterByInput(
      {
      productionDate: this.datePipe.transform(new Date(this.shiftInfo.productionDate), 'yyyy-MM-dd'),
      shiftId: this.shiftInfo.shiftId,
      keyword: this.keyword,
      cellId: this.dataTier?.cell?.id,
      areaId: this.dataTier?.area?.id,
      isShiftCommentOnly: false,
      skipCount: 0,
      maxResultCount: 100
    }
  ).subscribe({
      next: (res: any) => {
        saveAs(
          this.base64ToBlob(res, AppUtils.generateFileName('ShiftComment', FileType.Excel)),
          AppUtils.generateFileName('ShiftComment', FileType.Excel)
        );
      },
      error: error => {
        this.confirmationService.error(error.error.message, 'An error has occurred!', {
          hideCancelBtn: true,
          yesText: 'AbpAccount::Close',
        });
      },
    })
  }

  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
  
}
