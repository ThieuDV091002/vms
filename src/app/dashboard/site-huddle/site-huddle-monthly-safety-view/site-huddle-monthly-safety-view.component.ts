import { ConfigStateService, LocalizationService } from '@abp/ng.core';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AreaHuddleWithSnowflakeService, SiteHuddleWithSnowflakeService } from '@apis/general';
import { SafetyIncidentMonthlyItemDto, SiteMonthlyTargetDto, SiteSafetyIncidenMonthlytDto } from '@apis/general/dtos/site-huddle';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { ChartComponent } from '@abp/ng.components/chart.js';
import { DashboardUtils } from '../../utils';
import { DatePipe } from '@angular/common';
import { MonthlyNearMissesDto, NearMissesMonthlyDto, SiteHuddleCardStatisticsDto } from '@apis/ticket/dtos';
import { forkJoin, Subscription } from 'rxjs';
import { SiteHuddleService } from '@apis/ticket/services';
import { SafetyIncidentDto } from '@apis/general/dtos/area-huddle';

@Component({
  selector: 'app-site-huddle-monthly-safety-view',
  templateUrl: './site-huddle-monthly-safety-view.component.html',
  styleUrl: './site-huddle-monthly-safety-view.component.scss'
})
export class SiteHuddleMonthlySafetyViewComponent implements OnInit, OnChanges {
  @ViewChild('siteHuddleMonthlySafetyIncidentsChart') safetyIncidentsChart: ChartComponent;
  @ViewChild('siteHuddleMonthlyNearMissesChartChart') nearMissesChart: ChartComponent;

  @Input() selectedDataTier: any;
  @Output() broadcastMsgListChange: EventEmitter<void> = new EventEmitter<void>();
  @Input() queryId: any;
  @Input() assignedAndDefaultDataTiers: any;
  @Input() areas: any[] = [];
  @Input() cells: any[] = [];

  safetyChartOptions: any = {};
  nearMissesChartOptions: any = {};

  siteId: string;
  safetyIncidentsData: SiteSafetyIncidenMonthlytDto;
  nearMissesData: NearMissesMonthlyDto;
  nearMissesTargetData: SiteMonthlyTargetDto;
  dateRange = {
    startDate: '',
    endDate: ''
  }
  previousTwevelMonthsLabel = [];
  safetyInfo: SafetyIncidentDto;
  actionCardsData: SiteHuddleCardStatisticsDto = {} as SiteHuddleCardStatisticsDto;
  actionCardsSubscription: Subscription;
  nearMissesSubscription: Subscription;

  cardType = 'Safety';

  constructor(
    private siteHuddleWithSnowflakeService: SiteHuddleWithSnowflakeService,
    private areaHuddleWithSnowflakeService: AreaHuddleWithSnowflakeService,
    private localizationService: LocalizationService,
    private themeService: ThemeService,
    private configService: ConfigStateService,
    private datePipe: DatePipe,
    private siteHuddleService: SiteHuddleService
  ) {
    const tenantInfo: any = this.configService.getOne('extraProperties');
    if (tenantInfo?.DataTierType === 'Site' && tenantInfo?.DataTierId) {
      this.siteId = tenantInfo.DataTierId;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getDateRangeAndLabels();
    this.getActionCardsData();
    if (changes.areas || changes.cells) {
      this.getNearMissesData();
    }
  }

  ngOnInit(): void {
    this.themeService.listenToThemeChanges(this.applyTheme);
    this.safetyChartOptions = this.getChartOptions('safety');
    this.nearMissesChartOptions = this.getChartOptions('nearMisses');
    this.getSafetyIncidentData();
    this.getActionCardsData();
    this.getSafetyInfo();
  }

  getChartOptions(type: 'safety' | 'nearMisses') {
    const isSafety = type === 'safety';
    const titleText = isSafety
      ? this.localizationService.instant('::LABEL_SafetyIncidents')
      : this.localizationService.instant('::LABEL_NearMisses');
    const barLabel = isSafety
      ? this.localizationService.instant('::LABEL_SafetyIncidents')
      : this.localizationService.instant('::LABEL_NearMisses');

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

  getSafetyInfo() {
    this.areaHuddleWithSnowflakeService.getSafetyIncidentBySiteId(this.siteId).subscribe(data => {
      this.safetyInfo = data;
    })
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

  applyTheme = (type?: 'safety' | 'nearMisses') => {
    const isDarkTheme = this.themeService.isDarkTheme();
    const dataColor = isDarkTheme ? '#f5f5f5' : '#212529';
    const tickColor = isDarkTheme ? '#bbbbbb' : '#424242';

    const updateChartOptions = (chartOptions) => {
      chartOptions.plugins.title.color = dataColor;
      chartOptions.scales.x.ticks.color = tickColor;
      chartOptions.scales.y.ticks.color = tickColor;
    };

    if (!type || type === 'safety') {
      updateChartOptions(this.safetyChartOptions);
      if (this.safetyIncidentsChart) {
        this.safetyIncidentsChart.refresh();
      }
    }

    if (!type || type === 'nearMisses') {
      updateChartOptions(this.nearMissesChartOptions);
      if (this.nearMissesChart) {
        this.nearMissesChart.refresh();
      }
    }
  };

  getSafetyIncidentData() {
    this.siteHuddleWithSnowflakeService.getSafetyIncidentMonthlyByInput({ siteId: this.siteId, startDate: this.dateRange.startDate, endDate: this.dateRange.endDate }).subscribe(res => {
      this.safetyIncidentsData = res;
      this.editChartData('safety');
    })
  }

  getNearMissesData() {
    if (this.nearMissesSubscription) {
      this.nearMissesSubscription.unsubscribe();
    }
    if (this.nearMissesTargetData) {
      this.nearMissesSubscription = this.siteHuddleService.getNearMissesMonthlyByInput({
        siteId: this.siteId,
        areaIds: this.areas ? this.areas?.map(area => area?.id) : [],
        cellIds: this.cells ? this.cells?.map(cell => cell?.id) : [],
        startDate: this.dateRange.startDate,
        endDate: this.dateRange.endDate
      }).subscribe(res => {
        this.nearMissesData = res;
        this.editChartData('nearMisses');
      });
    } else {
      const request = forkJoin({
        NearMissesMonthly: this.siteHuddleService.getNearMissesMonthlyByInput({
          siteId: this.siteId,
          areaIds: this.areas ? this.areas?.map(area => area?.id) : [],
          cellIds: this.cells ? this.cells?.map(cell => cell?.id) : [],
          startDate: this.dateRange.startDate,
          endDate: this.dateRange.endDate
        }),
        NearMissesTarget: this.siteHuddleWithSnowflakeService.getSiteMonthlyTargetByInput({
          siteId: this.siteId,
          targetType: 'NearMisses',
          startDate: this.dateRange.startDate,
          endDate: this.dateRange.endDate
        })
      });
      this.nearMissesSubscription = request.subscribe(res => {
        this.nearMissesData = res.NearMissesMonthly;
        this.nearMissesTargetData = res.NearMissesTarget;
        this.editChartData('nearMisses');
      })
    }
  }
  editNearMissesResponseData() {
    this.nearMissesData.nearMissesList.forEach(item => {

    });
    this.nearMissesData['ytdTarget'] = this.nearMissesTargetData.ytdTarget
  }

  editChartData(type: 'safety' | 'nearMisses') {
    const isSafety = type === 'safety';
    const chartOptions = isSafety ? this.safetyChartOptions : this.nearMissesChartOptions;
    const data = isSafety ? this.safetyIncidentsData.dailyList : this.nearMissesData.nearMissesList;

    // update labels
    chartOptions.data.labels = this.previousTwevelMonthsLabel.map(date => {
      return this.datePipe.transform(`${date.year}-${date.month}-${date.day}`, 'MMM yy');
    });

    let { barData, lineData } = this.processChartData(data, type);

    const maxValue = Math.max(Math.max(...barData), Math.max(...lineData));
    chartOptions.scales.y.max = maxValue === 0 || maxValue < 1 ? 1 : Math.ceil(maxValue * 1.1);
    const maxY = chartOptions.scales.y.max;

    barData = barData.map(item => {
      if (item === 0) {
        item = Math.min(maxY / 100, 0.5);
      }
      return item;
    })

    chartOptions.data.datasets[0].data = barData;
    chartOptions.data.datasets[1].data = lineData;

    chartOptions.plugins.tooltip.callbacks.label = (tooltipItem) => {
      const dataset = tooltipItem.dataset;
      return `${dataset.label}: ${parseInt(tooltipItem.raw, 10)}`;
    };

    this.applyTheme(type);
  }

  processChartData(data: SafetyIncidentMonthlyItemDto[] | MonthlyNearMissesDto[], type: 'safety' | 'nearMisses'): { barData: number[]; lineData: number[]; } {
    const barData = [];
    const lineData = [];
    const dailyListMap = new Map();

    data.forEach(item => {
      const key = `${item.year}-${item.month}`;
      if (type === 'nearMisses') {
        const monthlyTarget = this.nearMissesTargetData.targetList.find(target => item.year === target.year && item.month === target.month);
        if (monthlyTarget) {
          item['monthlyTarget'] = monthlyTarget.monthlyTarget ? monthlyTarget.monthlyTarget : 0;
        } else {
          item['monthlyTarget'] = 0;
        }
      }
      dailyListMap.set(key, item);
    });

    this.previousTwevelMonthsLabel.forEach(date => {
      const key = `${date.year}-${date.month}`;
      if (dailyListMap.has(key)) {
        const item = dailyListMap.get(key);
        barData.push(type === 'safety' ? item.monthlyIncidents : item.monthlyNearMisses || 0);
        lineData.push(item.monthlyTarget || 0);
      } else {
        barData.push(0);
        if (type === 'nearMisses') {
          const monthlyTarget = this.nearMissesTargetData.targetList.find(target => date.year === target.year && date.month === target.month);
          lineData.push(monthlyTarget ? monthlyTarget.monthlyTarget === -1 ? 0 : monthlyTarget.monthlyTarget : 0);
        } else {
          lineData.push(0);
        }
      }
    });

    return { barData, lineData };
  }


}
