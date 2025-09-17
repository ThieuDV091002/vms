import { ListService } from '@abp/ng.core';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-datatable-footer',
  templateUrl: './datatable-footer.component.html',
  styleUrl: './datatable-footer.component.scss',
  host: {
    class: 'datatable-footer'
  }
})
export class DatatableFooterComponent implements OnChanges, OnInit {

  maxResultCount = 10;
  showPageSizeSelect = false;
  @Input() list: ListService;
  footerHeight: number = 50;
  @Input() rowCount: number;
  @Input() pageSize: number;
  @Input() offset: number;
  @Input() adjustPageSize: boolean = true;
  pagerLeftArrowIcon: string = 'datatable-icon-left';
  pagerRightArrowIcon: string = 'datatable-icon-right';
  pagerPreviousIcon: string = 'datatable-icon-prev';
  pagerNextIcon: string = 'datatable-icon-skip';
  totalMessage: string = 'total';
  selectedMessage: string | boolean = 'selected';
  @Input() selectedCount: number;
  @Output() page: EventEmitter<number> = new EventEmitter();
  get curPage(): number {
    return this.offset + 1;
  }

  get isVisible(): boolean {
    return this.rowCount / this.pageSize > 1;
  }

  ngOnInit(): void {
    if(this.adjustPageSize) {
      this.adjustMaxResultCount();
    }
  }

  adjustMaxResultCount() {
    const width = window.screen.height;

    if (width >= 1440) {
      this.maxResultCount = 30;
    } else if (width >= 1080) {
      this.maxResultCount = 20;
    }
    else if (width >= 864) {

      this.maxResultCount = 15;
    }
    else {
      this.maxResultCount = 10; // 默认值
    }

    this.list.maxResultCount = this.maxResultCount;
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rowCount?.currentValue > 10) {
      this.showPageSizeSelect = true;
    }
  }

  pageChange(event) {
    this.list.page = event.page - 1;
  }

  maxResultCountChange() {
    this.list.maxResultCount = this.maxResultCount;
    this.page.emit(this.maxResultCount)
  }


}
