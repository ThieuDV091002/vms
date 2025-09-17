import { ChartComponent } from '@abp/ng.components/chart.js';
import { LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { LocalDowntimeReasonService } from '@apis/general';
import { LocalDowntimeReasonDto } from '@apis/general/dtos';
import { ProductionReviewDataService } from '@apis/general/services';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/shared/services/theme.service';

Chart.register(ChartDataLabels);
@Component({
  selector: 'app-top-downtime-reasons-chart-widget',
  template: `
  <div class="widget-page h-100" [ngClass]="{'widget-fullscreen': expandChart}">
    <abp-chart
        #chart
        [data]="chartOptions.data"
        [options]="chartOptions.options"
        [plugins]="y1Plugin"
        [width]="'100%'"
        height="100%">
    </abp-chart>
    <div class="actions widget-toolbar">
        <span (click)="initSelectedDowntimeReasons()"><i class="fa fa-filter me-1"></i></span>
        <span class="me-1 cursor-pointer" (click)="deleteWidget()" *abpPermission="'Dashboard.Update'">
                <i class="fa fa-trash"></i>
        </span>
        <span class="me-1 cursor-pointer" (click)="expand()">
            @if (expandChart) {
            <i class="fa fa-compress"></i>
            } @else {
            <i class="fa fa-expand"></i>
            }
        </span>
        <span (click)="initDowntimeReasonsSettings()"><i class="fa fa-cog"></i></span>
    </div>
  </div>
  <abp-modal [(visible)]="isFilterModalVisible">
        <ng-template #abpHeader>
            <h3>{{ 'AbpIdentity::Filter' | abpLocalization }}</h3>
        </ng-template>
        <ng-template #abpBody>
            <div class="form-group mb-2">
                <label for="exclude-downtime-reason">{{'::LABEL_ExcludeDowntimeReasons'|abpLocalization}}</label>
                <ng-select
                    [items]="downtimeReasons"
                    [appendTo]="'body'"
                    bindLabel="displayName"
                    bindValue="id"
                    [multiple]="true"
                    [closeOnSelect]="false"
                    [searchable]="true"
                    [clearable]="true"
                    [(ngModel)]="downtimeSettings.excludeDowntimeReasons">
                    <ng-template ng-label-tmp let-item="item" let-clear="clear">
                        <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
                        <span class="ng-value-label">{{item.displayName || item.name}}</span>
                    </ng-template>
                    <ng-template ng-option-tmp let-item="item">
                        <span>{{item.displayName || item.name}}</span>
                    </ng-template>
                </ng-select>

            </div>
            <div class="form-group mb-2">
                <label for="is-planned">{{'::LABEL_IsPlanned'|abpLocalization}}</label>
                <select class="form-select" [(ngModel)]="downtimeSettings.isPlanned" name="is-planned" id="is-planned">
                  <option value=null></option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
            </div>
            <div class="form-group mb-2">
                <label for="is-costed">{{'::LABEL_IsCosted'|abpLocalization}}</label>
                <select class="form-select" [(ngModel)]="downtimeSettings.isCosted" name="is-costed" id="is-costed">
                  <option value=null></option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
            </div>
            <div class="form-group">
              <label for="sort">{{'::LABEL_Sort' | abpLocalization}}</label>
              <select class="form-select" id="sort" [(ngModel)]="downtimeSettings.sort">
                <option value="desc">{{'::LABEL_Descending' | abpLocalization}}</option>
                <option value="asc">{{'::LABEL_Ascending' | abpLocalization}}</option>
              </select>
            </div>
        </ng-template>
        <ng-template #abpFooter>
            <button type="button" class="btn btn-outline-primary" abpClose>
                {{ 'AbpIdentity::Cancel' | abpLocalization }}
            </button>
            <abp-button iconClass="fa fa-check" (click)="isFilterModalVisible = false; applyFilter()">
                {{ 'AbpIdentity::Save' | abpLocalization }}
            </abp-button>
        </ng-template>
  </abp-modal>
  <abp-modal [(visible)]="isSettingsModalVisible">
        <ng-template #abpHeader>
            <h3>{{ 'AbpSettingManagement::Settings' | abpLocalization }}</h3>
        </ng-template>
        <ng-template #abpBody>
            <div class="form-group">
                <label for="widget-name">{{'::Name'|abpLocalization}}</label>
                <input type="text" id="widget-name" class="form-control" [(ngModel)]="downtimeSettings.name"/>
            </div>
            <div class="form-group">
                <div class="d-flex">
                    <label class="col-form-label text-start">
                        {{ '::Label_HideTitle' | abpLocalization }}
                    </label>
                    <div class="col-form-label ms-2">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="hide-title"
                                [(ngModel)]="downtimeSettings.hideTitle" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="refresh-rate">{{'::Refresh Rate(Min)'|abpLocalization}}</label>
                <input type="number" min="0" id="refresh-rate" class="form-control" [(ngModel)]="downtimeSettings.refreshRate" />
            </div>
        </ng-template>
        <ng-template #abpFooter>
            <button type="button" class="btn btn-outline-primary" abpClose>
                {{ 'AbpIdentity::Cancel' | abpLocalization }}
            </button>
            <abp-button iconClass="fa fa-check" [disabled]="!downtimeSettings?.name" (click)="saveSettings()">
                {{ 'AbpIdentity::Save' | abpLocalization }}
            </abp-button>
        </ng-template>
  </abp-modal>
  `,
  styles: [`
    :host {
        position: relative;
    }
    .actions {
        font-size: 1rem;
        position: absolute;
        top: 5px;
        right: 5px;
        display: flex;
        gap: 5px;
        span {
            cursor: pointer;
        }
    }
    abp-chart {
        width: 100%;
        height: 100%;
    }
      .widget-toolbar {
    display: none;
  }
  .widget-page:hover .widget-toolbar{
    display: block;
  }
`]
})
export class TopDowntimeReasonsChartWidgetComponent implements OnInit, OnChanges, OnDestroy{
  @ViewChild('chart') chart: ChartComponent;
  @Input() selectedDataTier: any;
  @Input() productionDataParams: any;
  @Input() selected: any;
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  subscription: Subscription;
  chartOptions = {
    options: {
      // animation: false,
      layout: {
        padding: 5
      },
      plugins: {
        tooltip: false,
        title: {
          display: true,
          text: '',
          padding: {
            top: 5,
            bottom: 0
          },
          color: this.themeService.isDarkTheme() ? '#f5f5f5' : '#212529',
          font: {
            size: 25,
          }
        },
        datalabels: {
          display: true,
          align: (context)=>{
            return context.dataset.type==='line' ? 'left' : 'end';
          },
          anchor: 'end',
          formatter: (value, context) => {
              return context.dataset.type==='line' ? `${(value*100).toFixed(0)}%` : (value/60).toFixed(1);
          },
          color: this.themeService.isDarkTheme() ? '#f5f5f5' : '#212529',
          font: {
              weight: 'bold',
              size: 15
          }
        },
        legend: {
          onClick: null,
        //   function (e, legendItem, legend) {
        //     const index = legendItem.datasetIndex;
        //     const ci = legend.chart;
        //     if (ci.isDatasetVisible(index)) {
        //         ci.hide(index);
        //         legendItem.hidden = true;
        //     } else {
        //         ci.show(index);
        //         legendItem.hidden = false;
        //     }
        //   },
          labels: {
            generateLabels: this.generateLabels.bind(this),
            // generateLabels: function(chart) {
            //   const datasets = chart.data.datasets;
            //   return datasets.map((dataset, i) => ({
            //       text: dataset.label,
            //       fillStyle: dataset.borderColor || dataset.backgroundColor[0],
            //       strokeStyle: dataset.borderColor || dataset.backgroundColor[0],
            //       hidden: !chart.isDatasetVisible(i),
            //       datasetIndex: i
            //   }));
            // },
            usePointStyle: true,
            pointStyle: 'circle',
            color: this.themeService.isDarkTheme() ? '#f5f5f5' : '#212529'
          }
        }
      },
      scales: {
        x: {
          type: 'category',
          display: true,
          barPercentage: 0.5,
          ticks: {
            padding: 0,
            backdropPadding: 0,
            color: this.themeService.isDarkTheme() ? '#9ca5b4' : '#325168'
          },
          grid: {
            display: false,
            drawBorder: false
          }
          // title: {
          //   display: true,
          //   text: ''
          // },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          max: null,
          ticks: {
            // stepSize: 1,
            padding: 0,
            backdropPadding: 0,
            color: this.themeService.isDarkTheme() ? '#9ca5b4' : '#325168',
            callback: function (value) {
              return (value/60).toFixed(1);
            }
          },
          title: {
            display: true,
            text: 'Downtime(hours)'
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: ''
          },
          min: 0,
          max: 1.2,
          ticks: {
            callback: function (value, index, values) {
              return value * 100 + '%'; // convert to percentage
            },
            padding: 0,
            backdropPadding: 0,
            color: this.themeService.isDarkTheme() ? '#9ca5b4' : '#325168'
          },
          grid: {
            drawOnChartArea: false,
            display: false,
            drawBorder: false
          }
        },
      },
    },
    data: {
      labels: [],
      datasets: [
        {
          type: 'bar',
          label: 'data',
          data: [],
          // set color based on planned/unplanned type, here is hard code
          backgroundColor: ["#156082", '#e97132', '#e97132', "#156082", "#156082"],
          yAxisID: 'y',
          order:2,
          categoryPercentage: 0.95,
          barPercentage: 1
        },
        {
          type: 'line',
          label: 'data',
          data: [],
          borderColor: "#0099d8",
          borderWidth: 5,
          fill: false,
          tension: 0.1,
          yAxisID: 'y1',
          order: 1
        }
      ],
    }
  };
  chartData: any = [];
  isSettingsModalVisible = false;
  isFilterModalVisible = false;
  downtimeReasons: LocalDowntimeReasonDto[] = [];
  initialDowntimeSettings = {
    name: '::LABEL_TopDowntimeReasonChartTitle',
    hideTitle: false,
    refreshRate: 1,
    excludeDowntimeReasons: [],
    isPlanned: null,
    isCosted: null,
    sort: 'desc'
  }
  downtimeSettings = {...this.initialDowntimeSettings};
  timer: any;
  expandChart = false;
  widget: string;
  
  constructor(
    private localDowntimeReasonService: LocalDowntimeReasonService,
    private productionReviewDataService: ProductionReviewDataService,
    private themeService: ThemeService,
    private abpLocalization: LocalizationService,
    private confirmation: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.abpLocalization.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widget = data;
    });
    // this.setChartOptions();
    // this.downtimeSettings = {...this.downtimeSettings, ...JSON.parse(localStorage.getItem('topDowntimeReasonsSettings'))};
    this.getDowntimeReasons();
    // this.getDowntimeReasonsData();
    this.applyTheme();
    this.themeService.listenToThemeChanges(this.applyTheme);
     this.abpLocalization.get(this.downtimeSettings.name).subscribe(title => {
      this.chartOptions.options.plugins.title.text = title;
      if (this.chart) {
        this.chart.refresh();
      }
    });
  }

  applyTheme = () => {
    const isDarkTheme = this.themeService.isDarkTheme();
    const dataColor = isDarkTheme ? '#f5f5f5' : '#212529';
    this.chartOptions.options.plugins.title.color = dataColor;
    this.chartOptions.options.plugins.legend.labels.color = dataColor;
    this.chartOptions.options.plugins.datalabels.color = dataColor;
    this.chartOptions.data.datasets[0].backgroundColor = this.chartData.map(x => x.isPlanned === 'Yes' ? (isDarkTheme ? '#9e7100' : '#fff1cf') : (isDarkTheme ? '#76021b' : '#febccb'));
    const tickColor = isDarkTheme ? '#9ca5b4' : '#325168'
    this.chartOptions.options.scales.x.ticks.color = tickColor;
    this.chartOptions.options.scales.y.ticks.color = tickColor;
    this.chartOptions.options.scales.y1.ticks.color = tickColor;
    if (this.chart) {
      this.chart.refresh();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getIntervalDowntimeReasonsData();
    if (changes.selected) {
      this.downtimeSettings = {
        name: changes.selected.currentValue?.name,
        hideTitle: changes.selected.currentValue?.extraProperties?.hideTitle ?? false,
        refreshRate: changes.selected.currentValue?.extraProperties?.refreshRate ?? 1,
        excludeDowntimeReasons: changes.selected.currentValue?.extraProperties?.excludeDowntimeReasons ?? [],
        isPlanned: changes.selected.currentValue?.extraProperties?.isPlanned ?? null,
        isCosted: changes.selected.currentValue?.extraProperties?.isCosted ?? null,
        sort: changes.selected.currentValue?.extraProperties?.sort ?? 'desc'
      };
      this.applySettings();
    }
  }

  getIntervalDowntimeReasonsData() {
    this.getDowntimeReasonsData();
    clearInterval(this.timer);
    if (this.downtimeSettings.refreshRate && this.downtimeSettings.refreshRate > 0) {
      this.timer = setInterval(() => {
        this.getDowntimeReasonsData();
      }, this.downtimeSettings.refreshRate * 60 * 1000)
    }
  }

  getDowntimeReasonsData() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    const isPlanned = this.downtimeSettings.isPlanned === 'Yes' ? true : this.downtimeSettings.isPlanned === 'No' ? false : null;
    const isCosted = this.downtimeSettings.isCosted === 'Yes' ? true : this.downtimeSettings.isCosted === 'No' ? false : null;
    this.subscription = this.productionReviewDataService.getTopFiveDowntimeReasons({
      areaIds: this.selectedDataTier?.area?.id ? [this.selectedDataTier.area.id] : [],
      cellIds: this.selectedDataTier?.cell?.id ? [this.selectedDataTier?.cell?.id] : [],
      workCenterIds: this.selectedDataTier?.workCenter?.id ? [this.selectedDataTier.workCenter.id] : [],
      startDate: this.productionDataParams?.startDate,
      endDate: this.productionDataParams?.endDate,
      productSerieIds: this.productionDataParams?.productSerieIds.length > 0 ? [this.productionDataParams.productSerieIds] : [],
      productFamilyIds: this.productionDataParams?.productFamilyIds.length > 0 ? [this.productionDataParams.productFamilyIds] : [],
      productIds: this.productionDataParams?.productIds.length > 0 ? [this.productionDataParams.productIds] : [],
      excludeDowntimeReasonIds: this.downtimeSettings.excludeDowntimeReasons,
      isPlanned: isPlanned,
      isCosted: isCosted,
      workOrders: [],
      operations: [],
    }).subscribe(res => {
      res.sort((a, b) => this.downtimeSettings.sort === 'asc' ? a.minutes - b.minutes : b.minutes - a.minutes);
      // generate random chart data for testing, qty 100-500
      // const randomData = [10, 20, 30, 40, 50];
      // const random = () => randomData[Math.floor(Math.random() * randomData.length)];
      // const randomBool = () => isPlanned == null ? (Math.random() < 0.5 ? 'Yes' : 'No') : (isPlanned ? 'Yes' : 'No');
      // const data = [{downtimeReason: 'rea1', isPlanned: randomBool(), minutes: random()}, {downtimeReason: 'rea2', isPlanned: randomBool(), minutes: random()},
      //   {downtimeReason: 'res3', isPlanned: randomBool(), minutes: random()}, {downtimeReason: 'rea4', isPlanned: randomBool(), minutes: random()}, {downtimeReason: 'rea5', isPlanned: randomBool(), minutes: random()}]
      // data.sort((a, b) => this.downtimeSettings.sort === 'asc' ? a.minutes - b.minutes : b.minutes - a.minutes);
      // this.chartData = data;
      this.chartData = res;
      this.setChartOptions(res);
    })
  }

  getDowntimeReasons() {
    this.localDowntimeReasonService.getAllInstances()
    .subscribe(res => {
      this.downtimeReasons = res;

    });
  }

  initSelectedDowntimeReasons() {
    this.isFilterModalVisible = true;
  }

  initDowntimeReasonsSettings() {
    this.isSettingsModalVisible = true;
  }

  saveSettings() {
    this.isSettingsModalVisible = false;
    this.saveSettingsAndFilter();
    this.applySettings();
    this.getIntervalDowntimeReasonsData();
  }

  applySettings() {
    this.chartOptions.options.plugins.title.text = this.downtimeSettings.name;
    this.chartOptions.options.plugins.title.display = !this.downtimeSettings.hideTitle;
    if (this.chart) {
      this.chart.refresh();
    }
  }

  applyFilter() {
    this.saveSettingsAndFilter();
    this.getIntervalDowntimeReasonsData();
  }

  saveSettingsAndFilter() {
    const requestBody: any = {
      dashboardId: this.selected.dashboardId,
      seq: this.selected.seq,
      widgetName: this.selected.widgetName,
      name: this.downtimeSettings.name,
      description: this.selected.description,
      tenantId: this.selected.tenantId,
      displayName: this.selected.displayName,
      id: this.selected.id,
      extraProperties: {
        hideTitle: this.downtimeSettings.hideTitle,
        refreshRate: this.downtimeSettings.refreshRate,
        excludeDowntimeReasons: this.downtimeSettings.excludeDowntimeReasons,
        isPlanned: this.downtimeSettings.isPlanned,
        isCosted: this.downtimeSettings.isCosted,
        sort: this.downtimeSettings.sort
      }
    };
    this.updateChange.emit({ type: 'update', widget: requestBody });
  }

  generateLabels() {
    let isPlanned;
    if (this.downtimeSettings) {
      isPlanned = this.downtimeSettings.isPlanned === 'Yes' ? true : this.downtimeSettings.isPlanned === 'No' ? false : null;
    } else { isPlanned = null; }
    let colors;
    let labels;
    const isDarkTheme = this.themeService.isDarkTheme()
    if (isPlanned == null) {
      colors = [(isDarkTheme ? '#9e7100' : '#fff1cf'), (isDarkTheme ? '#76021b' : '#febccb'), '#0099d8'];
       labels = [
        this.abpLocalization.instant('::LABEL_PlannedDT') || 'Planned DT',
        this.abpLocalization.instant('::LABEL_UnplannedDTLedgend') || 'Unplanned DT',
        this.abpLocalization.instant('::LABEL_CumulativePercent') || 'Cumulative %'
      ];
    } else if (isPlanned) {
      colors = [(isDarkTheme ? '#9e7100' : '#fff1cf'), '#0099d8'];
      this.abpLocalization.instant('::LABEL_PlannedDT') || 'Planned DT',
      this.abpLocalization.instant('::LABEL_CumulativePercent') || 'Cumulative %'
    } else {
      colors = [(isDarkTheme ? '#76021b' : '#febccb'), '#0099d8'];
      labels = [
        this.abpLocalization.instant('::LABEL_UnplannedDTLedgend') || 'Unplanned DT',
        this.abpLocalization.instant('::LABEL_CumulativePercent') || 'Cumulative %'
      ];
    }

    return labels.map((label, index) => ({
      text: label,
      fillStyle: colors[index],
      strokeStyle: colors[index],
      hidden: false,
      datasetIndex: index
    }));
  }

  setChartOptions(data: any) {
    // chart options
    this.chartOptions.data.labels = data.map(x => x.downtimeReason);
    this.chartOptions.data.datasets[0].data = data.map(x => x.minutes);
    this.chartOptions.data.datasets[0].backgroundColor = data.map(x => x.isPlanned === 'Yes' ? (this.themeService.isDarkTheme() ? '#9e7100' : '#fff1cf') : (this.themeService.isDarkTheme() ? '#76021b' : '#febccb'));
    const total = data.map(x => x.minutes).reduce((a, b) => a + b, 0);
    // should accumulated value percentage
    this.chartOptions.data.datasets[1].data = data.map((x, index) => {
      const accumulatedValue = data.slice(0, index + 1).map(y => y.minutes).reduce((a, b) => a + b, 0);
      return accumulatedValue / total;
    });
    const maxY = Math.max(...data.map(x => x.minutes));
    this.chartOptions.options.scales.y.max = 1.2*maxY;
    this.abpLocalization.get(this.downtimeSettings.name).subscribe(title => {
    this.chartOptions.options.plugins.title.text = title;
    if (this.chart) {
      this.chart.refresh();
    }
  });
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  y1Plugin = [
    {
      afterDraw: (chart) => {
        const y1Scale = chart.scales['y1'];
        if (y1Scale) {
          const ctx = chart.ctx;
          ctx.save();
          ctx.fillStyle = chart.options.scales.y.title.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const x = y1Scale.right-10 ;
          const yStart = y1Scale.bottom;
          const yEnd = y1Scale.top;

          ctx.translate(x, (yStart + yEnd) / 2);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText('Cumulative %', 0, 0);
          ctx.restore();
        }
      },
    },
  ];

  expand() {
    this.expandChart = !this.expandChart;
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
}
