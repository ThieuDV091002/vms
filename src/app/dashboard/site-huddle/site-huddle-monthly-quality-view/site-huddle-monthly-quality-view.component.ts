import { ChartComponent } from '@abp/ng.components/chart.js';
import { ConfigStateService, LocalizationService } from '@abp/ng.core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SiteHuddleWithSnowflakeService } from '@apis/general';
import { SiteHuddleCardStatisticsDto } from '@apis/ticket/dtos';
import { SiteHuddleService } from '@apis/ticket/services';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { DashboardUtils } from '../../utils';
import { GetCOPQByReasonsOutput, SiteCOPQMonthlyDto, SiteCOPQMonthlyItemDto, SiteQNMonthlyDto, SiteQNMonthlyItemDto } from '@apis/general/dtos/site-huddle';

@Component({
  selector: 'app-site-huddle-monthly-quality-view',
  templateUrl: './site-huddle-monthly-quality-view.component.html',
  styleUrl: './site-huddle-monthly-quality-view.component.scss',
  providers: [CurrencyPipe, DecimalPipe]
})
export class SiteHuddleMonthlyQualityViewComponent implements OnInit, OnChanges {

  @ViewChild('siteHuddleMonthlyExternalChart') externalChart: ChartComponent;
  @ViewChild('siteHuddleMonthlyInternalChart') internalChart: ChartComponent;
  @ViewChild('siteHuddleMonthlyCOPQChart') COPQChart: ChartComponent;
  @ViewChild('siteHuddleMonthlyCOPQByReasonChart') COPQByReasonChart: ChartComponent;

  @Input() areas: any[] = [];
  @Input() cells: any[] = [];

  externalChartOptions: any = {};
  internalChartOptions: any = {};
  COPQChartOptions: any = {};
  COPQByReasonChartOptions: any = {
    layout: {
      padding: {
        top: 0,
        left: 10,
        right: 0,
        bottom: 0
      }
    },
    plugins: {
      legend: {
        display: true,
        onClick: null,
        position: 'bottom',
        labels: {
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return datasets.map((dataset, i) => {
              return {
                text: dataset.label,
                fillStyle: dataset.type === 'bar' ? dataset.backgroundColor : dataset.borderColor,
                strokeStyle: dataset.borderColor,
                lineWidth: 0,
                fontColor: this.themeService.isDarkTheme() ? '#bbbbbb' : '#424242',
                hidden: !chart.isDatasetVisible(i),
                datasetIndex: i
              };
            });
          }
        }
      },
      title: {
        display: true,
        text: this.localizationService.instant('::LABEL_COPQByReasonChartTitle'),
        color: this.themeService.isDarkTheme() ? '#f5f5f5' : '#212529',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (tooltipItem) => {
            const isLine = tooltipItem.dataset.type === 'line';
            const dataset = tooltipItem.dataset;
            const value = tooltipItem.raw;
            return isLine ? `${dataset.label}: ${this.decimalPipe.transform(value, '1.0-1')} %` : `${dataset.label}: ${this.currencyPipe.transform(value, 'USD', 'symbol', '1.0-1')}`;
          },
          labelColor: (tooltipItem) => {
            const dataset = tooltipItem.dataset;
            return {
              backgroundColor: dataset.type === 'line' ? dataset.borderColor : dataset.backgroundColor,
              borderColor: dataset.type === 'line' ? dataset.borderColor : dataset.backgroundColor,
              borderWidth: 0
            };
          }
        }
      }
    },
    responsive: true,
    scales: {
      x: {
        type: 'category',
        display: true,
        barPercentage: 0.5,
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
          padding: 0,
          backdropPadding: 0,
          color: this.themeService.isDarkTheme() ? '#bbbbbb' : '#424242'
        },
        grid: {
          display: false,
          drawBorder: true
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        max: null,
        ticks: {
          callback: (value) => {
            return Number.isInteger(value) ? this.currencyPipe.transform(value, 'USD', 'symbol', '1.0-1') : '';
          },
          padding: 0,
          backdropPadding: 0,
          color: this.themeService.isDarkTheme() ? '#bbbbbb' : '#424242'
        },
        grid: {
          display: true,
          drawBorder: true
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        max: null,
        min: 0,
        ticks: {
          callback: (value) => {
            return Number.isInteger(value * 100) ? value + '%' : '';
          },
          padding: 0,
          backdropPadding: 0,
          color: this.themeService.isDarkTheme() ? '#bbbbbb' : '#424242'
        },
        grid: {
          display: true,
          drawBorder: true
        }
      }
    },
    data: {
      labels: [],
      datasets: [
        {
          type: 'bar',
          label: this.localizationService.instant('::LABEL_COPQChartTitle'),
          data: [],
          backgroundColor: '#0a587c',
          yAxisID: 'y',
          order: 2,
          datalabels: {
            display: false
          }
        },
        {
          type: 'line',
          label: this.localizationService.instant('::LABEL_PercentageByReason'),
          data: [],
          borderColor: "#0099d8",
          borderWidth: 3,
          fill: false,
          yAxisID: 'y1',
          order: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
          datalabels: {
            display: false
          }
        }
      ],
    }
  };

  siteId: string;
  actionCardsSubscription: Subscription;
  COPQDataSubscription: Subscription;
  COPQByReasonDataSubscription: Subscription;

  cardType = 'Quality';
  actionCardsData: SiteHuddleCardStatisticsDto = {} as SiteHuddleCardStatisticsDto;
  dateRange = {
    startDate: '',
    endDate: ''
  }
  last30DaysDateRange = {
    startDate: '',
    endDate: ''
  }

  previousTwevelMonthsLabel = [];
  exteranlData: SiteQNMonthlyDto;
  internalData: SiteQNMonthlyDto;
  COPQData: SiteCOPQMonthlyDto;
  COPQByReasonData: GetCOPQByReasonsOutput;

  constructor(private siteHuddleService: SiteHuddleService,
    private siteHuddleWithSnowflakeService: SiteHuddleWithSnowflakeService,
    private localizationService: LocalizationService,
    private configService: ConfigStateService,
    private datePipe: DatePipe,
    private themeService: ThemeService,
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe
  ) {
    const tenantInfo: any = this.configService.getOne('extraProperties');
    if (tenantInfo?.DataTierType === 'Site' && tenantInfo?.DataTierId) {
      this.siteId = tenantInfo.DataTierId;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getDateRangeAndLabels();
    this.getLast30Days();
    this.getActionCardsData();
    if (changes.areas) {
      this.getMonthlyCOPQData();
      this.getMonthlyCOPQByReasonData();
    }
  }

  ngOnInit(): void {
    this.externalChartOptions = this.getChartOptions('External');
    this.internalChartOptions = this.getChartOptions('Internal');
    this.COPQChartOptions = this.getChartOptions('COPQ');
    this.themeService.listenToThemeChanges(this.applyTheme);
    this.getActionCardsData();
    this.getMonthlyExternalData();
    this.getMonthlyInternalData();
  }

  getChartOptions(type: 'External' | 'Internal' | 'COPQ') {
    let titleText = '';
    let barLabel = '';
    switch (type) {
      case 'External':
        titleText = this.localizationService.instant('::LABEL_ExternalQNs');
        barLabel = this.localizationService.instant('::LABEL_ExternalQNs');
        break;
      case 'Internal':
        titleText = this.localizationService.instant('::LABEL_InternalQNs');
        barLabel = this.localizationService.instant('::LABEL_InternalQNs');
        break;
      case 'COPQ':
        titleText = this.localizationService.instant('::LABEL_COPQChartTitle');
        barLabel = this.localizationService.instant('::LABEL_COPQChartTitle');
        break;
    }

    return {
      layout: {
        padding: {
          top: 0,
          left: 10,
          right: 0,
          bottom: 0
        }
      },
      plugins: {
        legend: {
          display: true,
          onClick: null,
          position: 'bottom',
          labels: {
            generateLabels: (chart) => {
              const datasets = chart.data.datasets;
              return datasets.map((dataset, i) => {
                return {
                  text: dataset.label,
                  fillStyle: dataset.type === 'bar' ? dataset.backgroundColor : dataset.borderColor,
                  strokeStyle: dataset.borderColor,
                  lineWidth: 0,
                  fontColor: this.themeService.isDarkTheme() ? '#bbbbbb' : '#424242',
                  hidden: !chart.isDatasetVisible(i),
                  datasetIndex: i
                };
              });
            }
          }
        },
        title: {
          display: true,
          text: titleText,
          color: this.themeService.isDarkTheme() ? '#f5f5f5' : '#212529',
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (tooltipItem) => {
              const dataset = tooltipItem.dataset;
              const value = tooltipItem.raw;
              return `${dataset.label}: ${value}`;
            },
            labelColor: (tooltipItem) => {
              const dataset = tooltipItem.dataset;
              return {
                backgroundColor: dataset.type === 'line' ? dataset.borderColor : dataset.backgroundColor,
                borderColor: dataset.type === 'line' ? dataset.borderColor : dataset.backgroundColor,
                borderWidth: 0
              };
            }
          }
        }
      },
      responsive: true,
      scales: {
        x: {
          type: 'category',
          display: true,
          barPercentage: 0.5,
          ticks: {
            autoSkip: true,
            maxRotation: 45,
            minRotation: 0,
            padding: 0,
            backdropPadding: 0,
            color: this.themeService.isDarkTheme() ? '#bbbbbb' : '#424242'
          },
          grid: {
            display: false,
            drawBorder: true
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          max: null,
          min: 0,
          ticks: {
            callback: (value) => {
              return Number.isInteger(value) ? value : '';
            },
            padding: 0,
            backdropPadding: 0,
            color: this.themeService.isDarkTheme() ? '#bbbbbb' : '#424242'
          },
          grid: {
            display: true,
            drawBorder: true
          }
        },
      },
      data: {
        labels: [],
        datasets: [
          {
            type: 'bar',
            label: barLabel,
            data: [],
            backgroundColor: '#0a587c',
            yAxisID: 'y',
            order: 2,
            datalabels: {
              display: false
            }
          },
          {
            type: 'line',
            label: this.localizationService.instant('::LABEL_Target'),
            data: [],
            borderColor: "#0099d8",
            borderWidth: 3,
            fill: false,
            yAxisID: 'y',
            order: 1,
            pointRadius: 0,
            pointHoverRadius: 0,
            datalabels: {
              display: false
            }
          }
        ],
      }
    };
  }

  getDateRangeAndLabels() {
    if (!this.dateRange.startDate || !this.dateRange.endDate) {
      const dateRangeAndLabels = DashboardUtils.calculateDateRangeAndLabelsByCurrentDate();
      this.dateRange = {
        startDate: this.datePipe.transform(dateRangeAndLabels.dateRange.startDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(dateRangeAndLabels.dateRange.endDate, 'yyyy-MM-dd'),
      }
      this.previousTwevelMonthsLabel = dateRangeAndLabels.labels;
    }
  }

  getMonthlyExternalData() {
    this.siteHuddleWithSnowflakeService.getQNMonthlyBySiteByInput({ siteId: this.siteId, startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, type: 'External' }).subscribe((res) => {
      this.exteranlData = res;
      this.editChartData('External')
    })
  }

  getMonthlyInternalData() {
    this.siteHuddleWithSnowflakeService.getQNMonthlyBySiteByInput({ siteId: this.siteId, startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, type: 'Internal' }).subscribe((res) => {
      this.internalData = res;
      this.editChartData('Internal')
    })
  }

  getMonthlyCOPQData() {
    if (this.COPQDataSubscription) {
      this.COPQDataSubscription.unsubscribe();
    }
    this.COPQDataSubscription = this.siteHuddleWithSnowflakeService.getCOPQMonthlyBySiteByInput({ siteId: this.siteId, startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areaIds: this.areas ? this.areas.map(area => area?.id) : [] }).subscribe((res) => {
      this.COPQData = res;
      this.editChartData('COPQ')
    })
  }

  getMonthlyCOPQByReasonData() {
    if (this.COPQByReasonDataSubscription) {
      this.COPQByReasonDataSubscription.unsubscribe();
    }
    this.COPQByReasonDataSubscription = this.siteHuddleWithSnowflakeService.getCOPQByReasonsByInput({ siteId: this.siteId, startDate: this.last30DaysDateRange.startDate, endDate: this.last30DaysDateRange.endDate, areaIds: this.areas ? this.areas.map(area => area?.id) : [] }).subscribe((res) => {
      this.COPQByReasonData = res;
      this.editChartDataByReason();
    })
  }

  editChartDataByReason() {
    if (!this.COPQByReasonData || !Array.isArray(this.COPQByReasonData.copqList)) {
      return;
    }

    if (this.COPQByReasonData.copqList.length === 0) {
      this.sethartEmpty(this.COPQByReasonChartOptions, this.COPQByReasonChart);
      return;
    }

    const total = this.COPQByReasonData.copqList.reduce((sum, item) => {
      const copq = item.copq || 0;
      // filter out negative values
      return copq >= 0 ? sum + copq : sum;
    }, 0);

    if (total === 0) {
      // if total is 0, clear the chart data
      this.sethartEmpty(this.COPQByReasonChartOptions, this.COPQByReasonChart);
      return;
    }

    let cumulativeSum = 0;
    // calculate percentage for each item
    const dataWithPercentage = this.COPQByReasonData.copqList.map(item => {
      if (item.copq < 0) {
        cumulativeSum += item.copq;
      } else {
        cumulativeSum += item.copq;
      }

      return {
        ...item,
        percentage: cumulativeSum / total
      };
    });

    // sort by percentage
    const top10Data = dataWithPercentage.sort((a, b) => b.copq - a.copq).slice(0, 10);

    const barData = top10Data.map(item => item.copq || 0);
    const lineData = top10Data.map(item => Number((item.percentage * 100).toFixed(2)));

    // update chart data
    this.COPQByReasonChartOptions.data.labels = top10Data.map(item => item.reason || 'Unknown');
    this.COPQByReasonChartOptions.data.datasets[0].data = barData;
    this.COPQByReasonChartOptions.data.datasets[1].data = lineData;

    const maxBarValue = Math.max(...barData);
    const maxLineValue = Math.max(...lineData);

    this.COPQByReasonChartOptions.scales.y.max = maxBarValue === 0 ? 1 : Math.ceil(maxBarValue * 1.1);
    this.COPQByReasonChartOptions.scales.y1.max = maxLineValue === 0 ? 1 : Math.ceil(maxLineValue * 1.1);

    this.applyTheme('COPQByReason');
  }

  editChartData(type: 'External' | 'Internal' | 'COPQ') {
    let chartOptions;
    let data;

    if (type === 'External') {
      chartOptions = this.externalChartOptions;
      data = this.exteranlData.dailyList;
    } else if (type === 'Internal') {
      chartOptions = this.internalChartOptions;
      data = this.internalData.dailyList;
    } else if (type === 'COPQ') {
      chartOptions = this.COPQChartOptions;
      data = this.COPQData.copqList;
    }

    // update labels
    chartOptions.data.labels = this.previousTwevelMonthsLabel.map(date => {
      return this.datePipe.transform(`${date.year}-${date.month}-${date.day}`, 'MMM yy');
    });

    let { barData, lineData, labels } = this.processChartData(data, type);

    const maxValue = Math.max(Math.max(...barData), Math.max(...lineData));
    chartOptions.scales.y.max = maxValue === 0 || maxValue < 1 ? 1 : Math.ceil(maxValue * 1.1);
    const maxY = chartOptions.scales.y.max;

    if (type === 'COPQ') {
      chartOptions.data.labels = labels;
      chartOptions.scales.y.min = null;
      if (this.areas && this.areas.length > 0) {
        chartOptions.plugins.title.text = this.localizationService.instant('::LABEL_COPQChartTitle');
        chartOptions.data.datasets[0].label = this.localizationService.instant('::LABEL_COPQChartTitle');
        chartOptions.scales.y.ticks.callback = (value) => `${this.currencyPipe.transform(value, 'USD', 'symbol', '1.0-1')}`
      } else {
        chartOptions.scales.y.ticks.callback = (value) => `${Number.isInteger(value) ? value + '%' : ''}`;
        chartOptions.plugins.title.text = this.localizationService.instant('::LABEL_COPQPerCOGS');
        chartOptions.data.datasets[0].label = this.localizationService.instant('::LABEL_COPQPerCOGS');
      }
    }

    if (type === 'External' || type === 'Internal') {
      barData = barData.map(item => {
        if (item === 0) {
          item = Math.min(maxY / 100, 0.5);
        }
        return item;
      });
    }

    chartOptions.data.datasets[0].data = barData;
    chartOptions.data.datasets[1].data = lineData;

    chartOptions.plugins.tooltip.callbacks.label = (tooltipItem) => {
      const dataset = tooltipItem.dataset;
      const value = tooltipItem.raw;
      if (type === 'COPQ') {
        if (!this.areas || this.areas?.length === 0) {
          return `${dataset.label}: ${this.decimalPipe.transform(value, '1.0-1') + '%'}`;
        } else {
          return `${dataset.label}: ${this.currencyPipe.transform(value, 'USD', 'symbol', '1.0-1')}`;
        }
      } else {
        return `${dataset.label}: ${parseInt(value, 10)}`;
      }
    };

    this.applyTheme(type);
  }

  sethartEmpty(chartOptions: any, chart: ChartComponent) {
    chartOptions.data.labels = [];
    chartOptions.data.datasets[0].data = [];
    chartOptions.data.datasets[1].data = [];
    if (chart) {
      chart.refresh();
    }
  }

  processChartData(
    data: SiteQNMonthlyItemDto[] | SiteCOPQMonthlyItemDto[],
    type: 'External' | 'Internal' | 'COPQ'
  ): { barData: number[]; lineData: number[]; labels: string[] } {
    const barData = [];
    const lineData = [];
    const labels = [];
    const dailyListMap = new Map();

    data.forEach(item => {
      const key = `${item.year}-${item.month}`;
      dailyListMap.set(key, item);
    });

    this.previousTwevelMonthsLabel.forEach(date => {
      const key = `${date.year}-${date.month}`;
      if (dailyListMap.has(key)) {
        const item = dailyListMap.get(key);
        if (type === 'COPQ') {
          if (this.areas && this.areas.length > 0) {
            const value = item.monthlyCOPQ || 0;
            barData.push(value);
            lineData.push(item.monthlyTarget || 0);
          } else {
            const value = item.monthlyCOPQPerCOGS || 0;
            barData.push(value);
            lineData.push(item.monthlyCOPQPerCOGSTarget || 0);
          }
        } else {
          const value = item.monthlyQN || 0;
          barData.push(value);
          lineData.push(item.monthlyTarget || 0);
        }
        labels.push(this.datePipe.transform(`${date.year}-${date.month}-01`, 'MMM yy'))
      } else {
        if (type !== 'COPQ') {
          barData.push(0);
          lineData.push(0);
        }
      }
    });

    return { barData, lineData, labels };
  }

  applyTheme = (type?: 'External' | 'Internal' | 'COPQ' | 'COPQByReason') => {
    const isDarkTheme = this.themeService.isDarkTheme();
    const dataColor = isDarkTheme ? '#f5f5f5' : '#212529';
    const tickColor = isDarkTheme ? '#bbbbbb' : '#424242';

    const updateChartOptions = (chartOptions) => {
      chartOptions.plugins.title.color = dataColor;
      chartOptions.scales.x.ticks.color = tickColor;
      chartOptions.scales.y.ticks.color = tickColor;
    };

    if (!type || type === 'External') {
      updateChartOptions(this.externalChartOptions);
      if (this.externalChart) {
        this.externalChart.refresh();
      }
    }

    if (!type || type === 'Internal') {
      updateChartOptions(this.internalChartOptions);
      if (this.internalChart) {
        this.internalChart.refresh();
      }
    }

    if (!type || type === 'COPQ') {
      updateChartOptions(this.COPQChartOptions);
      if (this.COPQChart) {
        this.COPQChart.refresh();
      }
    }
    if (!type || type === 'COPQByReason') {
      updateChartOptions(this.COPQByReasonChartOptions);
      if (this.COPQByReasonChart) {
        this.COPQByReasonChart.refresh();
      }
    }
  };

  getActionCardsData() {
    if (this.actionCardsSubscription) {
      this.actionCardsSubscription.unsubscribe();
    }
    this.actionCardsSubscription = this.siteHuddleService.getActivityCardInfoByKPIIndicatorByInput({
      siteId: this.siteId,
      areaIds: this.areas?.map(area => area?.id),
      cellIds: this.cells?.map(cell => cell?.id),
      siteKPIIndicator: this.cardType,
    }).subscribe((res) => {
      this.actionCardsData = res;
    })
  }

  getLast30Days() {
    if (this.last30DaysDateRange.startDate && this.last30DaysDateRange.endDate) {
      return;
    }
    const endDate = new Date();
    const startDate = new Date();
    endDate.setDate(endDate.getDate() - 1);
    startDate.setDate(endDate.getDate() - 29);
    this.last30DaysDateRange = {
      startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd')
    };
  }
}
