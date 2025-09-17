import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-widget-container',
  templateUrl: './widget-container.component.html',
  styleUrls: ['./widget-container.component.scss']
})
export class WidgetContainerComponent {
  @Input() widget: any;
  @Input() index: number;
  @Input() selectedIndex: number;
  @Input() layoutClass: string;
  @Input() expandChart = false;
  @Input() isYesterdayInProductionReview: boolean;

  @Input() queryId: string;
  @Input() homePage = false;
  @Input() haveAccessTreeNode: any;
  @Input() selectedDataTier: any;
  @Input() assignedAndDefaultDataTiers: any;
  @Input() isFPY: any;
  @Input() isUPPH: any;
  @Input() defaultDataTierLevel: any;
  @Input() productionDataParams: any;
  @Output() widgetUpdate = new EventEmitter<any>();
  @Output() expandChange = new EventEmitter<any>();
  @Output() broadcastMsgListChange = new EventEmitter<void>();
}
