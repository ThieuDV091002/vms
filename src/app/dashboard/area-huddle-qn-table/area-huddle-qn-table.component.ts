import { LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AreaHuddleWithSnowflakeService } from '@apis/general';

@Component({
  selector: 'app-area-huddle-qn-table',
  templateUrl: './area-huddle-qn-table.component.html',
  styleUrl: './area-huddle-qn-table.component.scss'
})
export class AreaHuddleQnTableComponent implements OnInit, OnChanges {
  @Input() selected: any = { title: '', url: '', hideTitle: false };
  @Input() index = -1;
  @Input() selectedDataTier;
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() queryId;
  @Input() expandChart = false;
  widget: string;
  filterAreas = [];
  qnData = [
    {
      "qnType": "Internal",
      "yearlyTarget": 0,
      "yearToDateTotal": 0,
      "monthToDateTotal": 0,
      "openCount": 0
    },
    {
      "qnType": "External",
      "yearlyTarget": 0,
      "yearToDateTotal": 0,
      "monthToDateTotal": 0,
      "openCount": 0
    }
  ];

  constructor(private localizationService: LocalizationService,
    private confirmation: ConfirmationService,
    private areaHuddleWithSnowflakeService: AreaHuddleWithSnowflakeService,) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDataTier && changes.selectedDataTier.currentValue) {
      this.filterAreas = changes.selectedDataTier.currentValue.areas ? changes.selectedDataTier.currentValue.areas.map(area => area.id) : [];
      this.getQnData();
    }
  }

  ngOnInit(): void {
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widget = data;
    });
  }

  getQnData() {
    if (this.filterAreas) {
      this.areaHuddleWithSnowflakeService.getQnDataByAreaListByAreaIds(this.filterAreas).subscribe((res: any) => {
        this.qnData = res;
      });
    }
  }

  deleteWidget() {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.widget, this.selected.name]
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.updateChange.emit({ type: 'delete', widget: this.selected });
      }
    });
  }

  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
  }
}
