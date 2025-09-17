import { ChartComponent } from '@abp/ng.components/chart.js';
import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LocalScrapReasonService } from '@apis/general';
import { LocalScrapReasonDto } from '@apis/general/dtos';
import { ProductionReviewDataService } from '@apis/general/services';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/shared/services/theme.service';
import {LocalizationService } from '@abp/ng.core';

Chart.register(ChartDataLabels);
@Component({
  selector: 'app-top-scrap-reasons-chart',
  template: `
  <div class="widget-page h-100">
    <abp-chart
        #chart
        [data]="chartOptions.data"
        [options]="chartOptions.options"
        [plugins]="y1Plugin"
        width="100%"
        height="100%">
    </abp-chart>
    <div class="actions widget-toolbar">
        <span (click)="initSelectedScrapReasons()"><i class="fa fa-filter me-1"></i></span>
        <!-- <span ><i class="fa fa-expand"></i></span> -->
        <span (click)="initScrapReasonsSettings()"><i class="fa fa-cog"></i></span>
    </div>
  </div>
    <abp-modal [(visible)]="isFilterModalVisible">
        <ng-template #abpHeader>
            <h3>{{ 'AbpIdentity::Filter' | abpLocalization }}</h3>
        </ng-template>
        <ng-template #abpBody>
            <div class="form-group mb-2">
                <label for="exclude-scrap-reason">{{'::LABEL_ExcludeScrapReasons'|abpLocalization}}</label>
                <ng-select
                    [items]="scrapReasons"
                    [appendTo]="'body'"
                    bindLabel="displayName"
                    bindValue="id"
                    [multiple]="true"
                    [closeOnSelect]="false"
                    [searchable]="true"
                    [clearable]="true"
                    [(ngModel)]="scrapSettings.excludeScrapReasons">
                    <ng-template ng-label-tmp let-item="item" let-clear="clear">
                        <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
                        <span class="ng-value-label">{{item.displayName || item.name}}</span>
                    </ng-template>
                    <ng-template ng-option-tmp let-item="item">
                        <span>{{item.displayName || item.name}}</span>
                    </ng-template>
                </ng-select>

            </div>
            <div class="form-group">
              <label for="sort">{{'::LABEL_Sort' | abpLocalization}}</label>
              <select class="form-select" id="sort" [(ngModel)]="scrapSettings.sort">
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
                <input type="text" id="widget-name" class="form-control" [(ngModel)]="scrapSettings.name"/>
            </div>
            <div class="form-group">
                <div class="d-flex">
                    <label class="col-form-label text-start">
                        {{ '::Label_HideTitle' | abpLocalization }}
                    </label>
                    <div class="col-form-label ms-2">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="hide-title"
                                [(ngModel)]="scrapSettings.hideTitle" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="refresh-rate">{{'::Refresh Rate(Min)'|abpLocalization}}</label>
                <input type="number" min="0" id="refresh-rate" class="form-control" [(ngModel)]="scrapSettings.refreshRate" />
            </div>
        </ng-template>
        <ng-template #abpFooter>
            <button type="button" class="btn btn-outline-primary" abpClose>
                {{ 'AbpIdentity::Cancel' | abpLocalization }}
            </button>
            <abp-button iconClass="fa fa-check" [disabled]="!scrapSettings?.name" (click)="saveSettings()">
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
export class TopScrapReasonsChartComponent implements OnInit, OnChanges, OnDestroy{
  @ViewChild('chart') chart: ChartComponent;
  @Input() areaIds: string[] = [];
  @Input() cellIds: string[] = [];
  @Input() workCenterIds: string[] = [];
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() productSerieIds: string[] = [];
  @Input() productFamilyIds: string[] = [];
  @Input() productIds: string[] = [];
  subscription: Subscription;

  chartOptions = {
    options: {
    //   animation: false,
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
              return context.dataset.type==='line' ? `${(value*100).toFixed(0)}%` : value.toFixed(0);
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
              return value.toFixed(1);
            }
          },
          title: {
            display: true,
            text: 'Number of scrap'
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
          backgroundColor: this.themeService.isDarkTheme() ? '#004d6c' : '#ccebf7',
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
          grid: {
            drawOnChartArea: false,
          },
          order: 1
        }
      ],
    }
  };
  isSettingsModalVisible = false;
  isFilterModalVisible = false;
  scrapReasons: LocalScrapReasonDto[] = [];
  initialScrapSettings = {
    name: '::LABEL_TopScrapReasonChartTitle',
    hideTitle: false,
    refreshRate: 1,
    excludeScrapReasons: [],
    sort: 'desc'
  };
  scrapSettings = {...this.initialScrapSettings};
  timer: any;

  constructor(
    private localScrapReasonService: LocalScrapReasonService,
    private productionReviewDataService: ProductionReviewDataService,
    private themeService: ThemeService,
    private abpLocalization: LocalizationService
  ) {}

  ngOnInit(): void {
    // this.setChartOptions();
    this.getScrapReasons();
    this.scrapSettings = {...this.initialScrapSettings, ...JSON.parse(localStorage.getItem('topScrapReasonsSettings'))};
    // this.getScrapReasonsData();
    this.applyTheme();
    this.themeService.listenToThemeChanges(this.applyTheme);
    this.abpLocalization.get(this.scrapSettings.name).subscribe(title => {
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
    this.chartOptions.data.datasets[0].backgroundColor = isDarkTheme ? '#004d6c' : '#ccebf7';
    const tickColor = isDarkTheme ? '#9ca5b4' : '#325168'
    this.chartOptions.options.scales.x.ticks.color = tickColor;
    this.chartOptions.options.scales.y.ticks.color = tickColor;
    this.chartOptions.options.scales.y1.ticks.color = tickColor;
    if (this.chart) {
      this.chart.refresh();
    }
  }

  ngOnChanges(): void {
    this.getIntervalScrapReasonsData();
  }

  getIntervalScrapReasonsData() {
    this.getScrapReasonsData();
    clearInterval(this.timer);
    if (this.scrapSettings.refreshRate && this.scrapSettings.refreshRate > 0) {
      this.timer = setInterval(() => {
        this.getScrapReasonsData();
      }, this.scrapSettings.refreshRate * 60 * 1000);
    }
  }

  getScrapReasonsData() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.productionReviewDataService.getTopFiveScrapReasons({
      areaIds: this.areaIds,
      cellIds: this.cellIds,
      workCenterIds: this.workCenterIds,
      startDate: this.startDate,
      endDate: this.endDate,
      productSerieIds: this.productSerieIds,
      productFamilyIds: this.productFamilyIds,
      productIds: this.productIds,
      excludeScrapReasonIds: this.scrapSettings.excludeScrapReasons,
      workOrders: [],
      operations: [],
    }).subscribe(res => {
      res.sort((a, b) => this.scrapSettings.sort === 'asc' ? a.qty - b.qty : b.qty - a.qty);
      // generate random chart data for testing, qty 100-500
      // const randomData = [100, 200, 300, 400, 500];
      // const random = () => randomData[Math.floor(Math.random() * randomData.length)];
      // const data = [{scrapReason: 'aaa', qty: random()}, {scrapReason: 'bbb', qty: random()}, {scrapReason: 'ccc', qty: random()}, {scrapReason: 'ddd', qty: random()}, {scrapReason: 'eee', qty: random()}]
      // data.sort((a, b) => b.qty - a.qty);
      this.setChartOptions(res);
    })
  }

  getScrapReasons() {
    this.localScrapReasonService.getAllInstances()
    .subscribe(res => {
      this.scrapReasons = res;
      this.scrapSettings = {...this.initialScrapSettings, ...JSON.parse(localStorage.getItem('topScrapReasonsSettings'))};
      this.applySettings();
    });
  }

  initSelectedScrapReasons() {
    this.scrapSettings = {...this.initialScrapSettings, ...JSON.parse(localStorage.getItem('topScrapReasonsSettings'))};
    this.isFilterModalVisible = true;
  }

  initScrapReasonsSettings() {
    this.scrapSettings = {...this.initialScrapSettings, ...JSON.parse(localStorage.getItem('topScrapReasonsSettings'))};
    this.isSettingsModalVisible = true;
  }

  saveSettings() {
    localStorage.setItem('topScrapReasonsSettings', JSON.stringify(this.scrapSettings));
    this.isSettingsModalVisible = false;
    this.applySettings();
    this.getIntervalScrapReasonsData();
  }

  applySettings() {
    this.chartOptions.options.plugins.title.text = this.scrapSettings.name;
    this.chartOptions.options.plugins.title.display = !this.scrapSettings.hideTitle;
    if (this.chart) {
      this.chart.refresh();
    }
  }

  applyFilter() {
    localStorage.setItem('topScrapReasonsSettings', JSON.stringify(this.scrapSettings));
    this.getIntervalScrapReasonsData();
  }

  generateLabels() {
      const colors = [(this.themeService.isDarkTheme() ? '#004d6c' : '#ccebf7'), '#0099d8'];

  const scrapQtyText = this.abpLocalization.instant('::LABEL_ScrapQty') || 'Scrap Qty';
  const cumulativeText = this.abpLocalization.instant('::LABEL_CumulativePercent') || 'Cumulative %';

  const labels = [scrapQtyText, cumulativeText];

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
    // let data = [{scrapReason: 'aaa', qty: 200}, {scrapReason: 'bbb', qty: 200}, {scrapReason: 'ccc', qty: 300}, {scrapReason: 'ddd', qty: 400}, {scrapReason: 'eee', qty: 300}];
    this.chartOptions.data.labels = data.map(x => x.scrapReason);
    this.chartOptions.data.datasets[0].data = data.map(x => x.qty);
    const total = data.map(x => x.qty).reduce((a, b) => a + b, 0);
    // should accumulated value percentage
    this.chartOptions.data.datasets[1].data = data.map((x, index) => {
      const accumulatedValue = data.slice(0, index + 1).map(y => y.qty).reduce((a, b) => a + b, 0);
      return accumulatedValue / total;
    });
    const maxY = Math.max(...data.map(x => x.qty));
    this.chartOptions.options.scales.y.max = 1.2*maxY;
    this.abpLocalization.get(this.scrapSettings.name).subscribe(title => {
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
}
