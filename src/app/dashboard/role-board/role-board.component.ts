import { LocalizationService } from '@abp/ng.core';
import { IdentityRoleDto, IdentityRoleService } from '@abp/ng.identity/proxy';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoleBoardTaskDto, MinorStoppagesByShiftDto, MinorStoppagesByDayDto} from '@apis/ticket/dtos';
import { RoleBoardTaskService } from '@apis/ticket/role-board';
import { LoaderBarService } from 'src/app/shared/services/loaderbar.service';

interface EnhancedMinorStoppagesByShiftDto extends MinorStoppagesByShiftDto {
  areaName?: string;
  cellName?: string;
}

interface EnhancedMinorStoppagesByDayDto extends MinorStoppagesByDayDto {
  areaName?: string;
  cellName?: string;
}
@Component({
  selector: 'app-role-board',
  templateUrl: './role-board.component.html',
  styleUrl: './role-board.component.scss'
})
export class RoleBoardComponent implements OnInit, OnDestroy {
  incomingTasks: RoleBoardTaskDto[] = [];
  urgentTasks: RoleBoardTaskDto[] = [];
  roles: IdentityRoleDto[] = [];
  haveAccessTreeNode: any[] = [];
  selectedDataTier: any;
  expandItem: string;
  minorStoppageData = {
    options: {
      plugins: {
        title: {
          display: true,
          text: ''
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          type: 'category',
          display: true,
          // title: {
          //   display: true,
          //   text: ''
          // },
          ticks: {
            autoSkip: false,
            maxTicksLimit: 1000,
            maxRotation: 45,
            minRotation: 0,
            font: { size: 13 },
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            stepSize: 1
          },
          title: {
            display: true,
            text: ''
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: ''
          },
          ticks: {
            callback: function (value, index, values) {
              return value * 100 + '%'; // convert to percentage
            }
          },
          grid: {
            drawOnChartArea: false,
          },
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
          backgroundColor: ["#ff7675"],
          yAxisId: 'y'
        },
        {
          type: 'line',
          label: 'data',
          data: [],
          borderColor: "#0984e3",
          yAxisId: 'y1'
        }
      ],
    }
  };
  minorStoppageTrendsData = {
    options: {
      plugins: {
        title: {
          display: true,
          text: ''
        },
        legend: {
          onClick: function (e, legendItem, legend) {
            const index = legendItem.datasetIndex;
            const ci = legend.chart;
            if (ci.isDatasetVisible(index)) {
                ci.hide(index);
                legendItem.hidden = true;
            } else {
                ci.show(index);
                legendItem.hidden = false;
            }
          },
          labels: {
            // usePointStyle: true,
            // pointStyle: 'react',
            generateLabels: function(chart) {
              const datasets = chart.data.datasets;
              return datasets.map((dataset, i) => ({
                  text: dataset.label,
                  fillStyle: dataset.borderColor,
                  strokeStyle: dataset.borderColor,
                  hidden: !chart.isDatasetVisible(i),
                  datasetIndex: i
              }));
            },
          }
        }
      },
      scales: {
        x: {
          type: 'category',
          display: true,
          // title: {
          //   display: true,
          //   text: ''
          // },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            stepSize: 1
          },
          title: {
            display: true,
            text: ''
          },
        },
      }
    },
    data: {
      labels: [],
      datasets: [],
    }
  };
  last7DaysString: string[] = [];
  lineColors: string[] = ['#ff7675', '#fdcb6e', '#0984e3'];
  timer: any;
  refreshInterval = 60000;

  constructor(private roleBoardTaskService: RoleBoardTaskService,
    private roleService: IdentityRoleService, private localizationService: LocalizationService,
    private loadarBarService: LoaderBarService
  ) {
    this.getLast7Days();
  }

  ngOnInit(): void {
    this.setupChartConfig();
    this.getIntervalStoppageData();
    this.getRoles();
    this.setLocallizationInfo();
    this.loadarBarService.hide();
  }

  setLocallizationInfo() {
    this.minorStoppageData.options.plugins.title.text = this.localizationService.instant('::LABEL_ParetoChartTitle');
    this.minorStoppageData.options.scales.y.title.text = this.localizationService.instant('::LABEL_ParetoChartNumAxis');
    this.minorStoppageData.options.scales.y1.title.text = this.localizationService.instant('::LABEL_ParetoChartPerAxis');
    this.minorStoppageTrendsData.options.plugins.title.text = this.localizationService.instant('::LABEL_TrendsChartTitle');
    this.minorStoppageTrendsData.options.scales.y.title.text = this.localizationService.instant('::LABEL_ParetoChartNumAxis');
  }

  getLast7Days() {
    const today = new Date();
    this.last7DaysString = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      this.last7DaysString.push(date.toLocaleDateString());
    }
  }

  getIntervalStoppageData() {
  const areaIds = this.selectedDataTier?.areas?.map(area => area.id) ||
                 (this.selectedDataTier?.area?.id ? [this.selectedDataTier.area.id] : []);

  const cellIds = this.selectedDataTier?.cells?.map(cell => cell.id) ||
                 (this.selectedDataTier?.cell?.id ? [this.selectedDataTier.cell.id] : []);

  const workCenterIds = this.selectedDataTier?.workCenters?.map(wc => wc.id) ||
                       (this.selectedDataTier?.workCenter?.id ? [this.selectedDataTier.workCenter.id] : []);

                       // 如果没有选择任何数据层级，清空图表
  if (workCenterIds.length === 0 && cellIds.length === 0 && areaIds.length === 0) {
    // 清空帕累托图
    this.minorStoppageData = {
      ...this.minorStoppageData,
      data: {
        labels: [],
        datasets: [
          {
            ...this.minorStoppageData.data.datasets[0],
            data: []
          },
          {
            ...this.minorStoppageData.data.datasets[1],
            data: []
          }
        ]
      }
    };

    // 清空趋势图
    this.minorStoppageTrendsData = {
      ...this.minorStoppageTrendsData,
      data: {
        labels: this.last7DaysString,
        datasets: []
      }
    };

    // 清除定时器
    clearInterval(this.timer);
    return;
  }
  // 按层级决定使用哪个ID数组，只传最低级别
  if (workCenterIds.length > 0 || cellIds.length > 0 || areaIds.length > 0) {
    // 清除现有定时器
    clearInterval(this.timer);

    // 调用API获取数据
    this.getMinorStoppageData(areaIds, cellIds, workCenterIds);

    // 设置定时刷新
    this.timer = setInterval(() => {
      this.getMinorStoppageData(areaIds, cellIds, workCenterIds);
    }, this.refreshInterval);
  }
  }

  // 修改后的getMinorStoppageData方法
getMinorStoppageData(areaIds: string[], cellIds: string[], workCenterIds: string[]) {
  let finalAreaIds = null;
  let finalCellIds = null;
  let finalWorkCenterIds = null;

  // 只传递最低级别的ID
  if (workCenterIds?.length > 0) {
    finalWorkCenterIds = workCenterIds;
  } else if (cellIds?.length > 0) {
    finalCellIds = cellIds;
  } else if (areaIds?.length > 0) {
    finalAreaIds = areaIds;
  }

  // 调用API获取数据
  if (finalAreaIds?.length || finalCellIds?.length || finalWorkCenterIds?.length) {
    this.roleBoardTaskService.getTopThreeWorkcenterFailuresByAreaIdsAndCellIdsAndWorkCenterIds(finalAreaIds, finalCellIds, finalWorkCenterIds)
      .subscribe(res => {
        // 处理Pareto图表数据
        if (res.minorStoppagesByShift) {
          let cumulativeSum = 0;
              const enhancedLabels = res.minorStoppagesByShift.map(item => {
              const enhancedItem = item as EnhancedMinorStoppagesByShiftDto;
              // 根据层级决定第二行内容，并用括号包起来
              let second = '';
              if (finalAreaIds?.length > 1 && enhancedItem.areaName) {
                second = `(${enhancedItem.areaName})`;
              } else if (finalCellIds?.length > 1 && enhancedItem.cellName) {
                second = `(${enhancedItem.cellName})`;
              }
              // 保留第二行占位，避免不同标签高度不一致
              return [enhancedItem.workCenterName || '', second];
            });

          this.minorStoppageData = {
          ...this.minorStoppageData,
          data: {
            labels: enhancedLabels,
            datasets: [
              {
                ...this.minorStoppageData.data.datasets[0],
                data: res.minorStoppagesByShift.map(item => item.noOfStoppages)
              },
              {
              ...this.minorStoppageData.data.datasets[1],
              data: res.minorStoppagesByShift.map(item => {
                cumulativeSum += item.noOfStoppages;
              return cumulativeSum;
              })
            }
          ]
        }
        };
      }

        // 处理趋势图数据
        if (res.minorStoppagesByDay) {
          const groupedData = res.minorStoppagesByDay.reduce((acc, item) => {
            const enhancedItem = item as EnhancedMinorStoppagesByDayDto;
            const key = enhancedItem.workCenterName;
            if (!acc[key]) {
              acc[key] = {
                data: [],
                areaName: enhancedItem.areaName,
                cellName: enhancedItem.cellName
              };
            }
            acc[key].data.push(enhancedItem);
            return acc;
          }, {});

          const datasets = Object.keys(groupedData).map((workCenterName, index) => {
            const info = groupedData[workCenterName];

            let enhancedLabel = workCenterName;
                if (finalAreaIds?.length > 1) {
                  enhancedLabel = `${workCenterName}  (${info.areaName})`;
                } else if (finalCellIds?.length > 1) {
                  enhancedLabel = `${workCenterName}  (${info.cellName})`;
                }

            return {
              label: enhancedLabel,
              data: this.last7DaysString.map(date => {
                const entry = info.data.find(item =>
                  new Date(item.date).toLocaleDateString() === date
                );
                return entry ? entry.noOfStoppages : 0;
              }),
              borderColor: this.lineColors[index % this.lineColors.length]
            };
          });

          this.minorStoppageTrendsData = {
            ...this.minorStoppageTrendsData,
            data: {
              labels: this.last7DaysString,
              datasets: datasets
            }
          };
        }
      });
  }
}
  getRoles() {
    this.roleService.getList({ maxResultCount: 100 }).subscribe(roles => {
      this.roles = roles.items;
    })
  }

  expandChange(e) {
    this.expandItem = e;
  }

  expand(item) {
    if (this.expandItem && this.expandItem === item) {
      this.expandItem = '';
    } else {
      this.expandItem = item;
    }
  }

  getExpandClass(item) {
    return this.expandItem ? (this.expandItem === item ? 'expand' : 'collapsed') : ''
  }



  dataTierChange(e) {
    this.selectedDataTier = e;
    this.getIntervalStoppageData();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.loadarBarService.show();
  }

  setupChartConfig() {

    this.minorStoppageData.options.plugins['datalabels'] = {
      display: function(context) {
        return context.datasetIndex === 0; // 只为柱状图显示
      },
      formatter: function(value) {
        return Math.round(value); // 确保显示整数
      },
      color: '#000',
      anchor: 'end',
      align: 'top'
    };

     this.minorStoppageData.options['maintainAspectRatio'] = false;
    // 增加底部 padding，避免标签被裁剪
    // this.minorStoppageData.options['layout'] = { padding: { bottom: 20 } };
  }
}
