import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ChartComponent } from '@abp/ng.components/chart.js';
import { LocalizationService } from '@abp/ng.core';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { AreaHuddleService, AreaHuddleWithSnowflakeService } from '@apis/general';

@Component({
  selector: 'app-area-huddle-chart',
  templateUrl: './area-huddle-chart.component.html',
  styleUrl: './area-huddle-chart.component.scss',
  providers: [DecimalPipe, CurrencyPipe]
})
export class AreaHuddleChartComponent implements OnInit, OnChanges {
  @Input() selected: any = { title: '', url: '', hideTitle: false };
  @Input() index = -1;
  @Input() type: string;
  @Input() selectedDataTier;
  @Input() dataTierTreeNode;
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() queryId;
  @Input() expandChart = false;
  @ViewChild('areaHuddleChart') chart: ChartComponent;
  widget: string;
  filterAreas = [];
  filterCells = [];

  dateRange = {
    startDate: '',
    endDate: ''
  };
  chartData = [];
  copqChartTitle = '';

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
              if (this.type === 'POEE') {
                if (context.datasetIndex === 0) {
                  return `Daily Value: ${this.decimalPipe.transform(value * 100, '1.0-1')}%`;
                } else if (context.datasetIndex === 1) {
                  return `Target Value: ${this.decimalPipe.transform(value * 100, '1.0-1')}%`;
                }
              } else {
                if (context.datasetIndex === 0) {
                  return `Daily Value: ${this.currencyPipe.transform(value, 'USD', 'symbol', '1.0-1')}`;
                } else if (context.datasetIndex === 1) {
                  return `Target Value: ${this.currencyPipe.transform(value, 'USD', 'symbol', '1.0-1')}`;
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
            autoSkip: true,
            maxRotation: 45,
            minRotation: 0,
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
            const value = context.raw;

            if (value > this.chartData[context.dataIndex]?.targetValue) {
              if (this.type === 'POEE') {
                return isDarkTheme ? '#c1e18a' : '#e6f3d0';
              } else if (this.type === 'COPQ') {
                return isDarkTheme ? '#fd9bb0' : '#fd9bb0';
              }
            } else {
              if (this.type === 'POEE') {
                return isDarkTheme ? '#fd9bb0' : '#fd9bb0';
              } else if (this.type === 'COPQ') {
                return isDarkTheme ? '#c1e18a' : '#e6f3d0';
              }
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

  constructor(private localizationService: LocalizationService,
    private themeService: ThemeService,
    private confirmation: ConfirmationService,
    private datePipe: DatePipe,
    private areaHuddleWithSnowflakeService: AreaHuddleWithSnowflakeService,
    private areaHuddleService: AreaHuddleService,
    private decimalPipe: DecimalPipe,
    private currencyPipe: CurrencyPipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDataTier && changes.selectedDataTier.currentValue && this.dataTierTreeNode) {
      const selectedCells = changes.selectedDataTier.currentValue.cells ? changes.selectedDataTier.currentValue.cells.map(cell => cell.id) : [];
      if (this.type === 'COPQ') {
        this.filterAreas = changes.selectedDataTier.currentValue.areas ? changes.selectedDataTier.currentValue.areas.map(area => area.id) : [];
      } else {
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
      }

      this.filterCells = selectedCells;

      if ((this.filterAreas && this.filterAreas.length > 0) || (this.filterCells && this.filterCells.length > 0)) {
        if (this.dateRange.startDate === '' || this.dateRange.endDate === '') {
          this.setDateRange();
        }

        let request: any;
        if (this.type === 'COPQ') {
          request = this.areaHuddleWithSnowflakeService.getCopqDataByAreaListByInput({
            areas: this.filterAreas,
            cells: [],
            startDate: this.dateRange.startDate,
            endDate: this.dateRange.endDate
          });
        } else if (this.type === 'POEE') {
          request = this.areaHuddleService.getPoeeDataByAreaCellListByInput({
            areas: this.filterAreas,
            cells: this.filterCells,
            startDate: this.dateRange.startDate,
            endDate: this.dateRange.endDate,
            isByCell: false
          });
        }
        if (request) {
          request.subscribe(data => {
            this.updateChartDataBasedOnType(data);
          });
        }
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

  applyTheme = () => {
    const isDarkTheme = this.themeService.isDarkTheme();
    const dataColor = isDarkTheme ? '#f5f5f5' : '#212529';
    this.chartOptions.options.plugins.title.color = dataColor;
    this.chartOptions.options.plugins.legend.labels.color = dataColor;
    this.chartOptions.data.datasets[0].backgroundColor = this.chartData.map((data) => {
      if (data.dailyValue > data.targetValue) {
        if (this.type === 'COPQ') {
          return isDarkTheme ? '#76021b' : '#ea0437';
        } else if (this.type === 'POEE') {
          return isDarkTheme ? '#506d1c' : '#c1e18a';
        }
      } else {
        if (this.type === 'COPQ') {
          return isDarkTheme ? '#506d1c' : '#c1e18a';
        } else if (this.type === 'POEE') {
          return isDarkTheme ? '#76021b' : '#ea0437';
        }
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

  // set date range to last 30 days
  setDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    endDate.setDate(endDate.getDate() - 1);
    startDate.setDate(endDate.getDate() - 29);
    this.dateRange = {
      startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd')
    };
  }

  updateChartDataBasedOnType(data: any[]) {
    if (this.type === 'COPQ') {
      // remove items with null or empty kpiReviewType
      const kpiTypes = data
        .map(item => item.kpiReviewType)
        .filter(type => type && type.trim() !== '');

      const uniqueTypes = Array.from(new Set(kpiTypes));
      if (uniqueTypes.length === 1 && uniqueTypes[0] === 'MachineFocus') {
        this.copqChartTitle = '::LABEL_COPQMachineFocus';
      } else if (uniqueTypes.length === 1 && uniqueTypes[0] === 'LaborFocus') {
        this.copqChartTitle = '::LABEL_COPQLaborFocus';
      } else {
        this.copqChartTitle = '::LABEL_COPQMachineAndLaborFocus';
      }
    }
    // map data by date
    const dateMap = new Map(data.map(item => [this.datePipe.transform(item.date, 'dd-MMM'), item]));
    this.chartData = [];
    // get last 30 days
    for (let i = 30; i >= 1; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = this.datePipe.transform(date, 'dd-MMM');
      // if date is not in data, add empty data
      const item = dateMap.get(formattedDate) || { date: formattedDate, dailyValue: null, targetValue: null };
      let dailyValue, targetValue;
      switch (this.type) {
        case 'COPQ':
          dailyValue = item.dailyCOPQPerHour === -1 ? 0 : item.dailyCOPQPerHour || 0;
          targetValue = item.dailyCOPQTarget || 0;
          break;
        case 'POEE':
          dailyValue = item.dailyPOEE || 0;
          targetValue = (item.dailyPOEETarget || 0) * 0.01 || 0;
          break;
        default:
          dailyValue = 0;
          targetValue = 0;
      }

      this.chartData.push({
        day: formattedDate,
        dailyValue,
        targetValue
      });
    }

    // if Availability, convert to percentage
    if (this.type === 'POEE') {
      this.chartOptions.options.scales.y.ticks.callback = (value) => {
        return Math.round(value * 1000) / 10 + '%'; // convert to percentage
      }
    } else if (this.type === 'COPQ') {
      this.chartOptions.options.scales.y.ticks.callback = (value) => {
        return this.currencyPipe.transform(value, 'USD', 'symbol', '1.0-1');
      }
    }

    this.chartOptions.data.labels = this.chartData.map(d => d.day);
    this.chartOptions.data.datasets[0].data = this.chartData.map(d => d.dailyValue);
    this.chartOptions.data.datasets[1].data = this.chartData.map(d => d.targetValue);
    this.applyTheme();
  }

}
