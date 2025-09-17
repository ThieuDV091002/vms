import { LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { ChartComponent } from '@abp/ng.components/chart.js';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CellHuddleDailySummaryDataService } from '@apis/general';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cell-huddle-chart-widget',
  templateUrl: './cell-huddle-chart-widget.component.html',
  styleUrl: './cell-huddle-chart-widget.component.scss',
  providers: [DecimalPipe]

})
export class CellHuddleChartWidgetComponent implements OnInit, OnChanges {
  @Input() selected: any = { title: '', url: '', hideTitle: false };
  @Input() index = -1;
  @Input() type: string;
  @Input() selectedDataTier;
  @Input() dataTierTreeNode;
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() queryId;
  @Input() expandChart = false;
  @Input() isFPY: any;
  @Input() isUPPH: any;
  @ViewChild('cellHuddleChart') chart: ChartComponent;

  widget: string;
  isSettingsModalVisible = false;

  chartOptions = {
    options: {
      layout: {
        padding: {
          top: 10,
          left: 0,
          right: 0,
          bottom: 0
        }
      },
      plugins: {
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          usePointStyle: true,
          callbacks: {
            label: (context) => {
              const value = context.raw;
              if (this.type === 'Availability' || (this.type === 'Performance' && !this.isUPPH)  || (this.type === 'Quality' && this.isFPY)) {
                if (context.datasetIndex === 0) {
                  return `Daily Value: ${this.decimalPipe.transform(value * 100, '1.0-1')}%`;
                } else if (context.datasetIndex === 1) {
                  return `Target Value: ${this.decimalPipe.transform(value * 100, '1.0-1')}%`;
                }
              } else {
                if (context.datasetIndex === 0) {
                  return `Daily Value: ${this.decimalPipe.transform(value, '1.0-1')}`;
                } else if (context.datasetIndex === 1) {
                  return `Target Value: ${this.decimalPipe.transform(value, '1.0-1')}`;
                }
              }
              return value;
            },
            labelPointStyle: (context) => {
              if (context.datasetIndex === 0) {
                return {
                  pointStyle: 'circle',
                  rotation: 0
                };
              } else if (context.datasetIndex === 1) {
                return {
                  pointStyle: 'line',
                  rotation: 0
                };
              }
              return {
                pointStyle: 'rect',
                rotation: 0
              };
            },
            title: (context) => {
              return `Date: ${context[0].label}`;
            }
          },
          borderWidth: 1
        },
        title: {
          display: false,
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
        legend: {
          display: true,
          onClick: null,
          labels: {
            usePointStyle: true,
            padding: 0,
            pointStyleWidth: 20,
            pointStyle: 'line',
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
            drawBorder: true
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            callback: (value) => {
              return value;
            },
            padding: 0,
            backdropPadding: 0,
            color: this.themeService.isDarkTheme() ? '#9ca5b4' : '#325168'
          },
          grid: {
            display: false,
            drawBorder: true
          }
        },
      },
    },
    data: {
      labels: [],
      datasets: [
        {
          type: 'bar',
          label: '',
          legend: {
            display: false
          },
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: (context) => {
            const isDarkTheme = this.themeService.isDarkTheme();
            if (this.chartData[context.dataIndex]?.KPIResult === 1) {
              return isDarkTheme ? '#c1e18a' : '#e6f3d0';
            } else if (this.chartData[context.dataIndex]?.KPIResult === 3) {
              return isDarkTheme ? '#fd9bb0' : '#fd9bb0';
            }
          },
          yAxisID: 'y',
          order: 2,
          datalabels: {
            display: false
          }
        },
        {
          type: 'line',
          label: 'Target',
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
  chartData = [];
  filterCells = [];
  filterAreas = [];
  dateRange = {
    startDate: '',
    endDate: ''
  };
  subscription: Subscription;

  constructor(private confirmation: ConfirmationService,
    private localizationService: LocalizationService,
    private themeService: ThemeService,
    private datePipe: DatePipe,
    private kpiDataService: CellHuddleDailySummaryDataService,
    private decimalPipe: DecimalPipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isFPY || changes.isUPPH) {
      // only switch target if filterCell is set
      this.switchTarget();
    }

    if (changes.selectedDataTier && changes.selectedDataTier.currentValue) {
      const selectedCells = changes.selectedDataTier.currentValue.cells ? changes.selectedDataTier.currentValue.cells.map(cell => cell.id) : [];
      this.filterAreas = changes.selectedDataTier.currentValue.areas ?
        changes.selectedDataTier.currentValue.areas.map(area => {
          if (selectedCells.length > 0) {
            const areaTreeNode = this.dataTierTreeNode.find(node => node.id === area.id && node.type === 'Area');
            const cellChildren = areaTreeNode ? areaTreeNode.children.map(child => child.id) : [];
            if (!cellChildren.some(childId => selectedCells.includes(childId))) {
              return area.id;
            };
          } else {
            return area.id;
          }
        }).filter(areaId => areaId !== undefined) :
        [];
      this.filterCells = selectedCells;
      // only call api if filterCell is set
      if ((this.filterAreas && this.filterAreas.length) > 0 || (this.filterCells && this.filterCells.length > 0)) {
        if (this.dateRange.startDate === '' || this.dateRange.endDate === '') {
          this.setDateRange();
        }
        let request: any;
        if (this.type === 'Quality') {
          if (this.isFPY) {
            request = this.kpiDataService.getFpyDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
          } else {
            request = this.kpiDataService.sppmDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
          }
        }

        if (this.type === 'Performance') {
          if (this.isUPPH) {
            request = this.kpiDataService.upphDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
          } else {
            request = this.kpiDataService.performanceDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
          }
        }

        if (this.type === 'Availability') {
          request = this.kpiDataService.udtDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
        }
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
        this.subscription = request.subscribe((res) => {
          this.updateChartDataBasedOnType(res);
        });
      }
    }
  }

  ngOnInit(): void {
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widget = data;
    });
    // listen to theme changes
    this.themeService.listenToThemeChanges(this.applyTheme);
  }

  // apply theme to chart
  applyTheme = () => {
    const isDarkTheme = this.themeService.isDarkTheme();
    const dataColor = isDarkTheme ? '#f5f5f5' : '#212529';
    this.chartOptions.options.plugins.title.color = dataColor;
    this.chartOptions.options.plugins.legend.labels.color = dataColor;
    this.chartOptions.data.datasets[0].backgroundColor = this.chartData.map((data) => {
      if (data.KPIResult === 1) {
        return isDarkTheme ? '#506d1c' : '#c1e18a';
      } else if (data.KPIResult === 3) {
        return isDarkTheme ? '#76021b' : '#ea0437';
      }
    });
    const tickColor = isDarkTheme ? '#9ca5b4' : '#325168';
    this.chartOptions.options.scales.x.ticks.color = tickColor;
    this.chartOptions.options.scales.y.ticks.color = tickColor;
    if (this.chart) {
      this.chart.refresh();
    }
  }

  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
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

  updateChartDataBasedOnType(data: any[]) {
    // map data by date
    const dateMap = new Map(data.map(item => [this.datePipe.transform(item.date, 'dd MMM'), item]));
    this.chartData = [];
    // get last 30 days
    for (let i = 30; i >= 1; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = this.datePipe.transform(date, 'dd MMM');
      // if date is not in data, add empty data
      const item = dateMap.get(formattedDate) || { date: formattedDate, dailyValue: null, targetValue: null };
      let dailyValue, targetValue, KPIResult;
      switch (this.type) {
        case 'Quality':
          dailyValue = this.isFPY ? item.dailyFPY || 0 : item.dailySPPM || 0;
          targetValue = this.isFPY ? item.dailyFPYTarget * 0.01 || 0 : item.dailySPPMTarget || 0;
          KPIResult = this.isFPY ? item.dailyFPYKPI || 0 : item.dailySPPMKPI || 0;
          break;
        case 'Performance':
          dailyValue = this.isUPPH ? item.dailyUPPH || 0 : item.dailyPerformance || 0;
          targetValue = this.isUPPH ? item.dailyUPPHTarget || 0 : (item.dailyPerformanceTarget || 0) * 0.01;
          KPIResult = this.isUPPH ? item.dailyUPPHKPI || 0 : item.dailyPerformanceKPI || 0;
          break;
        case 'Availability':
          dailyValue = item.dailyUnplannedDowntime || 0;
          targetValue = (item.dailyUnplannedDowntimeTarget || 0) * 0.01;
          KPIResult = item.dailyUnplannedDowntimeKPI || 0;
          break;
        default:
          dailyValue = 0;
          targetValue = 0;
          KPIResult = 0;
      }

      this.chartData.push({
        day: formattedDate,
        dailyValue,
        targetValue,
        KPIResult
      });
    }

    if (this.type === 'Performance') {
      // if Efficiency target, convert to percentage
      if (!this.isUPPH) {
        this.chartOptions.options.scales.y.ticks.callback = (value) => {
          return Math.round(value * 1000) / 10 + '%'; // convert to percentage
        }
      } else {
        this.chartOptions.options.scales.y.ticks.callback = (value) => {
          return value;
        };
      }
    }

    
    // if Quality and FPY, convert to percentage
    if (this.type === 'Quality' && this.isFPY) {
      this.chartOptions.options.scales.y.ticks.callback = (value) => {
       return Math.round(value * 1000) / 10 + '%'; // convert to percentage
      }
    } else if (this.type === 'Quality' && !this.isFPY) {
      this.chartOptions.options.scales.y.ticks.callback = (value) => {
        return value; // SPPM without percentage
      };
    }

    // if Availability, convert to percentage
    if (this.type === 'Availability') {
      this.chartOptions.options.scales.y.ticks.callback = (value) => {
        return Math.round(value * 1000) / 10 + '%'; // convert to percentage
      }
    }

    this.chartOptions.data.labels = this.chartData.map(d => d.day);
    this.chartOptions.data.datasets[0].data = this.chartData.map(d => d.dailyValue);
    this.chartOptions.data.datasets[1].data = this.chartData.map(d => d.targetValue);
    this.applyTheme();
  }

  switchTarget() {
    // only call api if filterCell is set
    if ((this.filterAreas && this.filterAreas.length) > 0 || (this.filterCells && this.filterCells.length > 0)) {
      let request: any;
      if (this.type === 'Quality') {
        if (this.isFPY) {
          request = this.kpiDataService.getFpyDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
        } else {
          request = this.kpiDataService.sppmDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
        }
      }

      if (this.type === 'Performance') {
        if (this.isUPPH) {
          request = this.kpiDataService.upphDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
        } else {
          request = this.kpiDataService.performanceDataByAreaCellList({ startDate: this.dateRange.startDate, endDate: this.dateRange.endDate, areas: this.filterAreas, cells: this.filterCells }, { skipHandleError: true });
        }
      }

      if (request) {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
        this.subscription = request.subscribe((res) => {
          this.updateChartDataBasedOnType(res);
        });
      }
    }
  }

  // set date range to last 30 days
  setDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    endDate.setDate(endDate.getDate() - 1)
    startDate.setDate(endDate.getDate() - 29);
    this.dateRange = {
      startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd')
    };
  }


}
