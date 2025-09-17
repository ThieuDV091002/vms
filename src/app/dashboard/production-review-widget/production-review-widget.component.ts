import { LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-production-review-widget',
  templateUrl: './production-review-widget.component.html',
  styleUrl: './production-review-widget.component.scss'
})
export class ProductionReviewWidgetComponent implements OnInit {
  @Input() selected: any;
  @Input() index = -1;
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  editWidget = false;
  @Input() expandChart = false;

  widgetInfo: string;
  editObj = {name: '', extraProperties: {hideName: false}};
  addModal = false;

  constructor(
    private confirmationService: ConfirmationService,
    private localizationService: LocalizationService
  ) {


   }

  ngOnInit(): void {
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widgetInfo = data;
    });
  }

  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
  }

  openAddModal() {
    this.addModal = true;
  }

  deleteWidget() {
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '',{
        messageLocalizationParams: [this.widgetInfo,this.selected?.name],
      }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.updateChange.emit({type: 'delete', widget: this.selected});
      }
    });
  }

  openEditWidgetModal() {
    this.editWidget = true;
    this.editObj = JSON.parse(JSON.stringify(this.selected)) || {};
    this.editObj.name = '';
    this.editObj.extraProperties = {hideName: false};
  }

}
