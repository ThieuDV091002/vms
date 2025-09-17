import { ChartComponent } from '@abp/ng.components/chart.js';
import { DecimalPipe } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductionReviewDataService } from '@apis/general/services';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/shared/services/theme.service';
import {LocalizationService } from '@abp/ng.core';

Chart.register(ChartDataLabels);
@Component({
  selector: 'app-top-performance-products-chart',
  template: `
  <div class="widget-page h-100">
    <abp-chart
        #chart
        [data]="chartOptions.data"
        [options]="chartOptions.options"
        width="100%"
        height="100%">
    </abp-chart>
    <div class="actions widget-toolbar">
        <span (click)="initSelectedPerformanceProducts()"><i class="fa fa-filter me-1"></i></span>
        <!-- <span ><i class="fa fa-expand"></i></span> -->
          <span (click)="initPerformanceSettings(); this.isSettingsModalVisible = true"><i class="fa fa-cog"></i>        </span>
            <span class="info-icon"
              [title]="'::MSG_PerformanceGapDetail' | abpLocalization">
          <i class="fa fa-info-circle"></i>
        </span>
    </div>
  </div>
    <abp-modal [(visible)]="isFilterModalVisible">
        <ng-template #abpHeader>
            <h3>{{ 'AbpIdentity::Filter' | abpLocalization }}</h3>
        </ng-template>
        <ng-template #abpBody>
            <div class="form-group">
              <label for="sort">{{'::LABEL_Sort' | abpLocalization}}</label>
              <select class="form-select" id="sort" [(ngModel)]="performanceSettings.sort">
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
                <input type="text" id="widget-name" class="form-control" [(ngModel)]="performanceSettings.name"/>
            </div>
            <div class="form-group">
                <div class="d-flex">
                    <label class="col-form-label text-start">
                        {{ '::Label_HideTitle' | abpLocalization }}
                    </label>
                    <div class="col-form-label ms-2">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="hide-title"
                                [(ngModel)]="performanceSettings.hideTitle" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="refresh-rate">{{'::Refresh Rate(Min)'|abpLocalization}}</label>
                <input type="number" min="0" id="refresh-rate" class="form-control" [(ngModel)]="performanceSettings.refreshRate" />
            </div>
        </ng-template>
        <ng-template #abpFooter>
            <button type="button" class="btn btn-outline-primary" abpClose>
                {{ 'AbpIdentity::Cancel' | abpLocalization }}
            </button>
            <abp-button iconClass="fa fa-check" [disabled]="!performanceSettings?.name" (click)="saveSettings()">
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
`],
  providers: [DecimalPipe]
})
export class TopPerformanceProductsChartComponent implements OnInit, OnChanges, OnDestroy{
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
          align: 'end',
          anchor: 'end',
          formatter: (value) => {
              return `${this.decimalPipe.transform(value, '1.0-1')}%`;
          },
          // color: (context)=>{
          //   return context.dataset.type==='line' ? '#444444' : '#777777'
          // },
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
            color: this.themeService.isDarkTheme() ? '#506d1c' : '#0099d8'
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
            text: 'Performance Gap'
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        // y1: {
        //   type: 'linear',
        //   display: true,
        //   position: 'right',
        //   title: {
        //     display: true,
        //     text: ''
        //   },
        //   min: 0,
        //   max: 1.2,
        //   ticks: {
        //     callback: function (value, index, values) {
        //       return value * 100 + '%'; // convert to percentage
        //     },
        //     padding: 0,
        //     backdropPadding: 0,
        //     color: this.themeService.isDarkTheme() ? '#9ca5b4' : '#325168'
        //   },
        //   grid: {
        //     drawOnChartArea: false,
        //     display: false,
        //     drawBorder: false
        //   }
        // },
      },
    },
    data: {
      labels: [],
      datasets: [
        {
          type: 'bar',
          label: 'data',
          data: [],
          backgroundColor: this.themeService.isDarkTheme() ? '#506d1c' : '#e6f3d0',
          yAxisID: 'y',
          order:2,
          categoryPercentage: 0.95,
          barPercentage: 1
        }
      ],
    }
  };
  isSettingsModalVisible = false;
  isFilterModalVisible = false;
  initialPerformanceSettings = {
    name: '::LABEL_TopPerformanceChartTitle',
    hideTitle: false,
    refreshRate: 1,
    sort: 'desc'
  };
  performanceSettings = {...this.initialPerformanceSettings};
  timer: any;

  constructor(private productionReviewDataService: ProductionReviewDataService,
    private themeService: ThemeService,
    private decimalPipe: DecimalPipe,
    private abpLocalization: LocalizationService
  ) {}

  ngOnInit(): void {
    // this.setChartOptions();
    this.initPerformanceSettings();
    this.applyTheme();
    this.themeService.listenToThemeChanges(this.applyTheme);

    this.abpLocalization.get(this.performanceSettings.name).subscribe(title => {
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
    //this.chartOptions.data.datasets[0].backgroundColor = isDarkTheme ? '#506d1c' : '#e6f3d0';
    const tickColor = isDarkTheme ? '#9ca5b4' : '#325168';
    this.chartOptions.options.scales.x.ticks.color = tickColor;
    this.chartOptions.options.scales.y.ticks.color = tickColor;
    // this.chartOptions.options.scales.y1.ticks.color = tickColor;
    if (this.chart) {
      this.chart.refresh();
    }
  }

  initSelectedPerformanceProducts() {
    this.performanceSettings = {...this.initialPerformanceSettings, ...JSON.parse(localStorage.getItem('topPerformanceSettings'))};
    this.isFilterModalVisible = true;
  }

  initPerformanceSettings() {
    this.performanceSettings = {...this.initialPerformanceSettings, ...JSON.parse(localStorage.getItem('topPerformanceSettings'))};
  }

  ngOnChanges(changes: any): void {
    this.getIntervalPerformanceData();
  }

  getIntervalPerformanceData() {
    this.getPerformanceData();
    clearInterval(this.timer);
    if (this.performanceSettings.refreshRate && this.performanceSettings.refreshRate > 0) {
      this.timer = setInterval(() => {
        this.getPerformanceData();
      }, this.performanceSettings.refreshRate * 60 * 1000);
    }
  }

  getPerformanceData() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.productionReviewDataService.getTopFivePerformedProducts({
      areaIds: this.areaIds,
      cellIds: this.cellIds,
      workCenterIds: this.workCenterIds,
      startDate: this.startDate,
      endDate: this.endDate,
      productSerieIds: this.productSerieIds,
      productFamilyIds: this.productFamilyIds,
      productIds: this.productIds,
      workOrders: [],
      operations: [],
    }).subscribe(res => {
      res.sort((a, b) => this.performanceSettings.sort === 'asc' ?
      a.performanceGap - b.performanceGap :
      b.performanceGap - a.performanceGap
    );
      // generate random chart data for testing, qty 100-500
      // const randomData = [10, 20, 100, 100.0001, 50];
      // const random = () => randomData[Math.floor(Math.random() * randomData.length)];
      // const data = [{product: 'p1', performance: random()}, {product: 'p2', performance: random()}, {product: 'p3', performance: random()}, {product: 'p4', performance: random()}, {product: 'p5', performance: random()}]
      // data.sort((a, b) => b.performance - a.performance);
      this.setChartOptions(res);
    })
  }

  saveSettings() {
    localStorage.setItem('topPerformanceSettings', JSON.stringify(this.performanceSettings));
    this.isSettingsModalVisible = false;
    setTimeout(() => {
      this.applySettings();
    }, 50);
    this.getIntervalPerformanceData();
  }

  applySettings() {
    this.chartOptions.options.plugins.title.text = this.performanceSettings.name;
    this.chartOptions.options.plugins.title.display = !this.performanceSettings.hideTitle;
    if (this.chart) {
      this.chart.refresh();
    }
  }

  applyFilter() {
    localStorage.setItem('topPerformanceSettings', JSON.stringify(this.performanceSettings));
    this.getIntervalPerformanceData();
  }

  generateLabels() {
    const aboveTargetText = this.abpLocalization.instant('::LABEL_AboveTargetPerformance') || 'Gap Above Target Performance';
    const belowTargetText = this.abpLocalization.instant('::LABEL_BelowTargetPerformance') || 'Gap Below Target Performance';

        return [
    {
      text: aboveTargetText,
      fillStyle: '#9DCF46',
      strokeStyle: '#9DCF46',
      hidden: false,
      datasetIndex: 0
    },
    {
      text: belowTargetText,
      fillStyle: '#EA0437',
      strokeStyle: '#EA0437',
      hidden: false,
      datasetIndex: 0
    }
  ];
  }

  setChartOptions(data: any) {
    // chart options
    this.chartOptions.data.labels = data.map(x => x.product);
    this.chartOptions.data.datasets[0].data = data.map(x => x.performanceGap);
    //Set the color of each column based on performance
      this.chartOptions.data.datasets[0].backgroundColor = data.map(x =>
      x.performance >= 100 ? '#9DCF46' : '#EA0437'
  );

    const maxY = Math.max(Math.max(...data.map(x => x.performanceGap  )), 1);
    this.chartOptions.options.scales.y.max = 1.2*maxY;

    this.abpLocalization.get(this.performanceSettings.name).subscribe(title => {
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

}
