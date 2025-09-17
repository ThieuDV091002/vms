import { ChartComponent } from '@abp/ng.components/chart.js';
import { ConfigStateService, LocalizationService } from '@abp/ng.core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SiteHuddleWithSnowflakeService } from '@apis/general';
import { SiteHuddleCardStatisticsDto } from '@apis/ticket/dtos';
import { SiteHuddleService } from '@apis/ticket/services';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { DashboardUtils } from '../../utils';
import { SiteAssetProdMonthlyDto, SiteAssetProdMonthlyItemDto, SiteOEEMonthlyDto, SiteOEEMonthlyItemDto, SitePeopleProdMonthlyDto, SitePeopleProdMonthlyItemDto, SitePOEEMonthlyDto, SitePOEEMonthlyItemDto } from '@apis/general/dtos/site-huddle';

@Component({
  selector: 'app-site-huddle-monthly-productivity-view',
  templateUrl: './site-huddle-monthly-productivity-view.component.html',
  styleUrl: './site-huddle-monthly-productivity-view.component.scss',
  providers: [DecimalPipe]
})
export class SiteHuddleMonthlyProductivityViewComponent implements OnInit, OnChanges {

  @ViewChild('siteHuddleMonthlyPeopleProductivityChart') peopleProductivityChart: ChartComponent;
  @ViewChild('siteHuddleMonthlyOEEChart') OEEChart: ChartComponent;
  @ViewChild('siteHuddleMonthlyPOEEChart') POEEChart: ChartComponent;
  @ViewChild('siteHuddleMonthlyAssetProductivityChart') assetProductivityCOPQChart: ChartComponent;
  @Input() areas: any[] = [];
  @Input() cells: any[] = [];

  peopleProductivityData: SitePeopleProdMonthlyDto;
  OEEData: SiteOEEMonthlyDto;
  POEEData: SitePOEEMonthlyDto;
  assetProductivityData: SiteAssetProdMonthlyDto;

  peopleProductivityChartOptions: any = {};
  OEEChartOptions: any = {};
  POEEChartOptions: any = {};
  assetProductivityChartOptions: any = {};

  siteId: string;
  cardType = 'Performance';
  actionCardsData: SiteHuddleCardStatisticsDto = {} as SiteHuddleCardStatisticsDto;
  dateRange = {
    startDate: '',
    endDate: ''
  }
  previousTwevelMonthsLabel = [];
  actionCardsSubscription: Subscription;

  constructor(
    private siteHuddleService: SiteHuddleService,
    private siteHuddleWithSnowflakeService: SiteHuddleWithSnowflakeService,
    private localizationService: LocalizationService,
    private configService: ConfigStateService,
    private datePipe: DatePipe,
    private themeService: ThemeService,
    private decimalPipe: DecimalPipe
  ) {
    const tenantInfo: any = this.configService.getOne('extraProperties');
    if (tenantInfo?.DataTierType === 'Site' && tenantInfo?.DataTierId) {
      this.siteId = tenantInfo.DataTierId;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getActionCardsData();
  }

  ngOnInit(): void {
    this.themeService.listenToThemeChanges(this.applyTheme);
    this.peopleProductivityChartOptions = this.getChartOptions('peopleProductivity');
    this.assetProductivityChartOptions = this.getChartOptions('assetProductivity');
    this.OEEChartOptions = this.getChartOptions('OEE');
    this.POEEChartOptions = this.getChartOptions('POEE');
    this.getDateRangeAndLabels();
    this.getPeopleProductivityData();
    this.getOEEData();
    this.getPOEEData();
    this.getAssetProductivityData();
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

  getChartOptions(type: 'peopleProductivity' | 'assetProductivity' | 'POEE' | 'OEE') {
    let titleText = '';
    let barLabel = '';

    switch (type) {
      case 'peopleProductivity':
        titleText = this.localizationService.instant('::LABEL_PeopleProductivity');
        barLabel = this.localizationService.instant('::LABEL_PeopleProductivity');
        break;
      case 'assetProductivity':
        titleText = this.localizationService.instant('::LABEL_AssetProductivity');
        barLabel = this.localizationService.instant('::LABEL_AssetProductivity');
        break;
      case 'POEE':
        titleText = this.localizationService.instant('::LABEL_POEEPercentage');
        barLabel = this.localizationService.instant('::LABEL_POEEPercentage');
        break;
      case 'OEE':
        titleText = this.localizationService.instant('::LABEL_OEEPercentage');
        barLabel = this.localizationService.instant('::LABEL_OEEPercentage');
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

  getPeopleProductivityData() {
    this.siteHuddleWithSnowflakeService.getPeopleProdMonthlyBySiteByInput({
      siteId: this.siteId,
      startDate: this.dateRange.startDate,
      endDate: this.dateRange.endDate,
    }).subscribe((res) => {
      this.peopleProductivityData = res;
      this.editChartData('peopleProductivity');
    });
  }

  getOEEData() {
    this.siteHuddleWithSnowflakeService.getOEEMonthlyBySiteByInput({
      siteId: this.siteId,
      startDate: this.dateRange.startDate,
      endDate: this.dateRange.endDate,
    }).subscribe((res) => {
      this.OEEData = res;
      this.editChartData('OEE');
    });
  }

  getPOEEData() {
    this.siteHuddleWithSnowflakeService.getPOEEMonthlyBySiteByInput({
      siteId: this.siteId,
      startDate: this.dateRange.startDate,
      endDate: this.dateRange.endDate,
    }).subscribe((res) => {
      this.POEEData = res;
      this.editChartData('POEE');
    });
  }

  getAssetProductivityData() {
    this.siteHuddleWithSnowflakeService.getAssetProdMonthlyBySiteByInput({
      siteId: this.siteId,
      startDate: this.dateRange.startDate,
      endDate: this.dateRange.endDate,
    }).subscribe((res) => {
      this.assetProductivityData = res;
      this.editChartData('assetProductivity');
    });
  }

  editChartData(type: 'peopleProductivity' | 'assetProductivity' | 'POEE' | 'OEE') {
    const isPercentage = type === 'POEE' || type === 'OEE';
    const chartOptions = type === 'peopleProductivity' ? this.peopleProductivityChartOptions : type === 'assetProductivity' ? this.assetProductivityChartOptions : type === 'POEE' ? this.POEEChartOptions : this.OEEChartOptions;
    const data = this.getDataByType(type);

    let { barData, lineData, labels } = this.processChartData(data, type);

    chartOptions.data.labels = labels;
    chartOptions.data.datasets[0].data = barData;
    chartOptions.data.datasets[1].data = lineData;

    const maxValue = Math.max(Math.max(...barData), Math.max(...lineData));
    chartOptions.scales.y.max = maxValue === 0 || maxValue < 1 ? 1 : Math.ceil(maxValue * 1.1);

    chartOptions.data.datasets[0].data = barData;
    chartOptions.data.datasets[1].data = lineData;

    chartOptions.plugins.tooltip.callbacks.label = (tooltipItem) => {
      const dataset = tooltipItem.dataset;
      const value = tooltipItem.raw;
      return `${dataset.label}: ${isPercentage ? this.decimalPipe.transform(value, '1.0-1') + '%' : this.decimalPipe.transform(value, '1.0-1')}`;
    };

    this.applyTheme(type);
  }

  applyTheme = (type?: 'peopleProductivity' | 'assetProductivity' | 'POEE' | 'OEE') => {
    const isDarkTheme = this.themeService.isDarkTheme();
    const dataColor = isDarkTheme ? '#f5f5f5' : '#212529';
    const tickColor = isDarkTheme ? '#bbbbbb' : '#424242';

    const updateChartOptions = (chartOptions) => {
      chartOptions.plugins.title.color = dataColor;
      chartOptions.scales.x.ticks.color = tickColor;
      chartOptions.scales.y.ticks.color = tickColor;
    };

    if (!type || type === 'peopleProductivity') {
      updateChartOptions(this.peopleProductivityChartOptions);
      if (this.peopleProductivityChart) {
        this.peopleProductivityChart.refresh();
      }
    }

    if (!type || type === 'assetProductivity') {
      updateChartOptions(this.assetProductivityChartOptions);
      if (this.assetProductivityCOPQChart) {
        this.assetProductivityCOPQChart.refresh();
      }
    }

    if (!type || type === 'POEE') {
      updateChartOptions(this.POEEChartOptions);
      if (this.POEEChart) {
        this.POEEChart.refresh();
      }
    }

    if (!type || type === 'OEE') {
      updateChartOptions(this.OEEChartOptions);
      if (this.OEEChart) {
        this.OEEChart.refresh();
      }
    }
  };

  processChartData(
    data: SitePeopleProdMonthlyItemDto[] | SiteAssetProdMonthlyItemDto[] | SitePOEEMonthlyItemDto[] | SiteOEEMonthlyItemDto[],
    type: string
  ): { barData: number[]; lineData: number[]; labels: string[] } {
    const barData = [];
    const lineData = [];
    const labels = [];
    const dailyListMap = new Map();

    data.forEach(item => {
      const key = type === 'assetProductivity' || type === 'POEE' ? this.datePipe.transform(item.date, 'YYYY-MM') : `${item.year}-${item.month}`;
      dailyListMap.set(key, item);
    });

    this.previousTwevelMonthsLabel.forEach(date => {
      const key = type === 'assetProductivity' || type === 'POEE' ? this.datePipe.transform(`${date.year}-${date.month}`, 'YYYY-MM') : `${date.year}-${date.month}`;
      if (dailyListMap.has(key)) {
        const item = dailyListMap.get(key);
        let value = 0;

        switch (type) {
          case 'peopleProductivity':
            value = item.monthlyPeopleProd || 0;
            break;
          case 'assetProductivity':
            value = item.monthlyAssetProd || 0;
            break;
          case 'POEE':
            value = item.monthlyPOEE || 0;
            break;
          case 'OEE':
            value = item.monthlyOEE || 0;
            break;
        }
        barData.push(value);
        lineData.push(item.monthlyTarget || 0);
        labels.push(this.datePipe.transform(`${date.year}-${date.month}-01`, 'MMM yy'))
      }
    });

    return { barData, lineData, labels };
  }

  getDataByType(type: 'peopleProductivity' | 'assetProductivity' | 'POEE' | 'OEE') {
    switch (type) {
      case 'peopleProductivity':
        return this.peopleProductivityData.peopleProdList;
      case 'assetProductivity':
        return this.assetProductivityData.assetProdList;
      case 'POEE':
        return this.POEEData.poeeList;
      case 'OEE':
        return this.OEEData.oeeList;
      default:
        return null;
    }
  }

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
}
