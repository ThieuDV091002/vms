import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalizationService } from '@abp/ng.core';
import { SupportTeamPageComponent } from 'src/app/shared/components/support-team-page/support-team-page.component';

@Component({
  selector: 'app-support-team-widget',
  templateUrl: './support-team-widget.component.html',
  styleUrl: './support-team-widget.component.scss'
})
export class SupportTeamWidgetComponent {

  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() index = -1;
  @Input() selectedWidget: any = { title: '', url: '', hideTitle: false };
  @Input() dataTierTreeNode;
  @Input() selectedDataTier;
  @ViewChild('supportTeamPage') supportTeamPage: SupportTeamPageComponent;
  @Input() expandChart = false;
  @Input() queryId;

  isSettingsModalVisible = false;
  form: FormGroup;
  pageSize: number;
  widgetTitle: string;
  widgetInfo: string;

  constructor(
    private confirmation: ConfirmationService,
    private toasterService: ToasterService,
    private localizationService: LocalizationService
  ) {


  }

  ngOnInit(): void {
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widgetInfo = data;
    });
  }
  add() {
    this.supportTeamPage.add();
  }

  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
    setTimeout(() => {
      this.supportTeamPage.table.recalculate();
    }, 0);
  }

  deleteSupportTeamWidget() {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '',{
        messageLocalizationParams: [this.widgetInfo,this.selectedWidget.name],
      }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.updateChange.emit({type: 'delete', widget: this.selectedWidget});
      }
    });
  }

  openSettings() {
    this.pageSize = this.selectedWidget.extraProperties.pageSize;
    this.widgetTitle = this.selectedWidget.name;
    this.isSettingsModalVisible = true;
  }

  saveSettiings() {
    if (this.widgetTitle === '' || [null, 0].includes(this.pageSize)) {
      return;
    }
    const requestBody: any = {
      dashboardId: this.selectedWidget.dashboardId,
      seq: this.selectedWidget.seq,
      widgetName: this.selectedWidget.widgetName,
      name: this.widgetTitle,
      description: this.selectedWidget.description,
      tenantId: this.selectedWidget.tenantId,
      displayName: this.selectedWidget.displayName,
      id: this.selectedWidget.id,
      extraProperties: {
        pageSize: this.pageSize.toString()
      }
    }

    this.updateChange.emit({type: 'update', widget: requestBody});
    this.selectedWidget = requestBody;
    this.isSettingsModalVisible = false;
    setTimeout(() => {
      this.supportTeamPage.hookToQuery();
    }, 0);
  }
}
